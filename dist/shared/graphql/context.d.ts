import { Sequelize } from 'sequelize';
import DataLoader from 'dataloader';
import { Cache } from '../infrastructure/cache/index.js';
import { Logger } from '../infrastructure/logger/index.js';
export interface AuthUser {
    id: string;
    email: string;
    role: 'admin' | 'manager' | 'customer';
    permissions: string[];
}
export interface GraphQLContext {
    user: AuthUser | null;
    db: Sequelize;
    cache: Cache;
    logger: Logger;
    requestId: string;
    loaders: DataLoaders;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isManager: boolean;
}
export interface DataLoaders {
    userById: DataLoader<string, any>;
    productById: DataLoader<string, any>;
    categoryById: DataLoader<string, any>;
    brandById: DataLoader<string, any>;
    orderByUserId: DataLoader<string, any[]>;
    reviewsByProductId: DataLoader<string, any[]>;
}
export declare function createContext({ req }: {
    req: {
        headers: Record<string, string | undefined>;
    };
}): Promise<GraphQLContext>;
export declare function requireAuth(context: GraphQLContext): AuthUser;
export declare function requireRole(context: GraphQLContext, roles: string[]): AuthUser;
export declare function requirePermission(context: GraphQLContext, permission: string): AuthUser;
//# sourceMappingURL=context.d.ts.map