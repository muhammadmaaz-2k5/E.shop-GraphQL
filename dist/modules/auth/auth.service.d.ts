import { Sequelize } from 'sequelize';
import type { AuthTokens, User, LoginInput } from './auth.types.js';
export interface JWTPayloadData {
    userId: string;
    email: string;
    role: string;
    permissions: string[];
    iat: number;
    exp: number;
}
export interface RegisterInput {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}
export declare function register(db: Sequelize, input: RegisterInput): Promise<User>;
export declare function login(_db: Sequelize, input: LoginInput): Promise<AuthTokens & {
    user: User;
}>;
export declare function loginWithCredentials(email: string, password: string, db: Sequelize): Promise<AuthTokens & {
    user: User;
}>;
export declare function refreshToken(_db: Sequelize, token: string): Promise<AuthTokens>;
export declare function logout(_db: Sequelize, token: string): Promise<void>;
export declare function verifyToken(token: string): Promise<JWTPayloadData | null>;
export declare function getUserById(_db: Sequelize, id: string): Promise<User | null>;
//# sourceMappingURL=auth.service.d.ts.map