import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import { AuthUser as AuthUserModel, User as UserModel, RefreshToken as RefreshTokenModel } from '../../shared/infrastructure/database/index.js';
import { config } from '../../config/index.js';
import { createLogger } from '../../shared/infrastructure/logger/index.js';
import { AuthenticationError, InvalidCredentialsError, TokenExpiredError, TokenInvalidError, ValidationError, NotFoundError } from '../../shared/graphql/errors/index.js';
const log = createLogger('auth-service');
const MAX_PASSWORD_LENGTH = 100;
export async function register(db, input) {
    const normalizedEmail = input.email.toLowerCase().trim();
    // Check if user already exists
    const existing = await UserModel.findOne({ where: { email: normalizedEmail } });
    if (existing) {
        throw new ValidationError('Email already registered', { field: 'email' });
    }
    if (input.password.length > MAX_PASSWORD_LENGTH) {
        throw new ValidationError('Password too long');
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(input.password, salt);
    // We run this in a transaction to ensure both auth and user profile are created
    const transaction = await db.transaction();
    try {
        const authUser = await AuthUserModel.create({
            email: normalizedEmail,
            encryptedPassword: hashedPassword,
        }, { transaction });
        const user = await UserModel.create({
            id: authUser.id,
            email: normalizedEmail,
            firstName: input.firstName,
            lastName: input.lastName,
            role: 'customer',
            permissions: [],
        }, { transaction });
        await transaction.commit();
        log.info({ userId: user.id, email: normalizedEmail }, 'User registered');
        return mapUser(user);
    }
    catch (error) {
        await transaction.rollback();
        log.error({ error }, 'Failed to create user profile');
        throw new ValidationError(error.message || 'Failed to create user profile');
    }
}
export async function login(_db, input) {
    const normalizedEmail = input.email.toLowerCase().trim();
    const authUser = await AuthUserModel.findOne({ where: { email: normalizedEmail } });
    if (!authUser) {
        throw new InvalidCredentialsError('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(input.password, authUser.encryptedPassword);
    if (!isPasswordValid) {
        throw new InvalidCredentialsError('Invalid email or password');
    }
    const profile = await UserModel.findByPk(authUser.id);
    if (!profile) {
        log.error({ userId: authUser.id }, 'Failed to fetch user profile');
        throw new NotFoundError('User profile not found');
    }
    if (!profile.isActive) {
        throw new AuthenticationError('Account is deactivated');
    }
    const user = mapUser(profile);
    const tokens = await createTokens(user);
    await profile.update({ updatedAt: new Date() });
    log.info({ userId: user.id }, 'User logged in');
    return { ...tokens, user };
}
export async function loginWithCredentials(email, password, db) {
    return login(db, { email: email.toLowerCase().trim(), password });
}
export async function refreshToken(_db, token) {
    const tokenHash = hashToken(token);
    const stored = await RefreshTokenModel.findOne({
        where: { tokenHash: tokenHash, revoked: false },
        include: [{ model: UserModel, as: 'user' }]
    });
    if (!stored) {
        throw new TokenInvalidError();
    }
    if (new Date(stored.expiresAt) < new Date()) {
        await stored.update({ revoked: true });
        throw new TokenExpiredError();
    }
    const userModel = stored.user;
    if (!userModel) {
        throw new TokenInvalidError();
    }
    const user = mapUser(userModel);
    await stored.update({ revoked: true });
    return createTokens(user);
}
export async function logout(_db, token) {
    const tokenHash = hashToken(token);
    await RefreshTokenModel.update({ revoked: true }, { where: { tokenHash } });
    log.info('User logged out');
}
export async function verifyToken(token) {
    try {
        return jwt.verify(token, config.jwt.secret);
    }
    catch {
        return null;
    }
}
export async function getUserById(_db, id) {
    const user = await UserModel.findByPk(id);
    return user ? mapUser(user) : null;
}
async function createTokens(user) {
    const expiresInSeconds = parseInt(config.jwt.expiresIn) || 900;
    const refreshExpiresInSeconds = parseInt(config.jwt.refreshExpiresIn) || 604800;
    const accessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role, permissions: user.permissions }, config.jwt.secret, { expiresIn: expiresInSeconds });
    const refreshToken = jwt.sign({ userId: user.id, type: 'refresh' }, config.jwt.secret, {
        expiresIn: refreshExpiresInSeconds,
    });
    const decoded = jwt.decode(accessToken);
    // Store refresh token in database
    const expiresAt = new Date(Date.now() + refreshExpiresInSeconds * 1000);
    try {
        await RefreshTokenModel.create({
            userId: user.id,
            tokenHash: hashToken(refreshToken),
            expiresAt,
            revoked: false
        });
    }
    catch (err) {
        log.error({ err, errors: err.errors, message: err.message }, 'Failed to create refresh token in database');
        throw err;
    }
    return { accessToken, refreshToken, expiresIn: decoded.exp - decoded.iat };
}
function hashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}
function mapUser(data) {
    const json = data.toJSON();
    return {
        id: json.id,
        email: json.email,
        role: json.role,
        permissions: json.permissions ?? [],
        firstName: json.firstName,
        lastName: json.lastName,
        avatarUrl: json.avatarUrl,
        phone: json.phone,
        isActive: json.isActive,
        emailVerified: json.emailVerified,
        createdAt: new Date(json.createdAt),
        updatedAt: new Date(json.updatedAt),
    };
}
//# sourceMappingURL=auth.service.js.map