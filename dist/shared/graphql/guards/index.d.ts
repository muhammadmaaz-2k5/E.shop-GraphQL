import { GraphQLContext, AuthUser } from '../context.js';
export type GuardFn = (context: GraphQLContext, args: Record<string, unknown>) => AuthUser | void;
export declare function isAuthenticated(): GuardFn;
export declare function hasRole(roles: string | string[]): GuardFn;
export declare function hasPermission(permissions: string | string[]): GuardFn;
export declare function isResourceOwner(getResourceId: <T>(args: T) => string): GuardFn;
export declare function orGuard(...guards: GuardFn[]): GuardFn;
//# sourceMappingURL=index.d.ts.map