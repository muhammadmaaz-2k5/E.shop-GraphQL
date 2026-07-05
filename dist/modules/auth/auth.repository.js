import { User as UserModel } from '../../shared/infrastructure/database/index.js';
import { createLogger } from '../../shared/infrastructure/logger/index.js';
import { NotFoundError, DatabaseError } from '../../shared/graphql/errors/index.js';
const log = createLogger('user-repository');
export class UserRepository {
    constructor(_db) { }
    async findById(id) {
        try {
            const user = await UserModel.findByPk(id);
            return user ? this.mapUser(user) : null;
        }
        catch (error) {
            log.error({ error, id }, 'Failed to fetch user');
            throw new DatabaseError('Failed to fetch user');
        }
    }
    async findByEmail(email) {
        try {
            const user = await UserModel.findOne({ where: { email: email.toLowerCase() } });
            return user ? this.mapUser(user) : null;
        }
        catch (error) {
            log.error({ error, email }, 'Failed to fetch user');
            throw new DatabaseError('Failed to fetch user');
        }
    }
    async update(id, input) {
        try {
            const user = await UserModel.findByPk(id);
            if (!user) {
                throw new NotFoundError('User', id);
            }
            const updateData = {};
            if (input.firstName !== undefined)
                updateData.firstName = input.firstName;
            if (input.lastName !== undefined)
                updateData.lastName = input.lastName;
            if (input.phone !== undefined)
                updateData.phone = input.phone;
            if (input.avatarUrl !== undefined)
                updateData.avatarUrl = input.avatarUrl;
            await user.update(updateData);
            log.info({ userId: id }, 'User updated');
            return this.mapUser(user);
        }
        catch (error) {
            if (error instanceof NotFoundError)
                throw error;
            log.error({ error, id }, 'Failed to update user');
            throw new DatabaseError('Failed to update user');
        }
    }
    mapUser(data) {
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
}
//# sourceMappingURL=auth.repository.js.map