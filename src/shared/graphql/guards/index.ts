import { GraphQLContext, AuthUser } from '../context.js';
import { ForbiddenError, AuthenticationError } from '../errors/index.js';

export type GuardFn = (context: GraphQLContext, args: Record<string, unknown>) => AuthUser | void;

export function isAuthenticated(): GuardFn {
  return (context: GraphQLContext) => {
    if (!context.user) {
      throw new AuthenticationError();
    }
    return context.user;
  };
}

export function hasRole(roles: string | string[]): GuardFn {
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  return (context: GraphQLContext) => {
    if (!context.user) {
      throw new AuthenticationError('You must be logged in');
    }
    if (!requiredRoles.includes(context.user.role)) {
      throw new ForbiddenError(`Role '${context.user.role}' not allowed. Required: ${requiredRoles.join(', ')}`);
    }
    return context.user;
  };
}

export function hasPermission(permissions: string | string[]): GuardFn {
  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
  return (context: GraphQLContext) => {
    if (!context.user) {
      throw new AuthenticationError('You must be logged in');
    }
    const userPermissions = new Set(context.user.permissions);
    const hasAll = requiredPermissions.every(p => userPermissions.has(p));
    if (!hasAll && context.user.role !== 'admin') {
      throw new ForbiddenError(`Missing permissions. Required: ${requiredPermissions.join(', ')}`);
    }
    return context.user;
  };
}

export function isResourceOwner(getResourceId: <T>(args: T) => string): GuardFn {
  return (context: GraphQLContext, args: Record<string, unknown>) => {
    if (!context.user) {
      throw new AuthenticationError('You must be logged in');
    }
    const resourceOwnerId = getResourceId(args);
    if (context.user.id !== resourceOwnerId && context.user.role !== 'admin') {
      throw new ForbiddenError('You can only access your own resources');
    }
    return context.user;
  };
}

export function orGuard(...guards: GuardFn[]): GuardFn {
  const errors: Error[] = [];
  return (context: GraphQLContext, args: Record<string, unknown>) => {
    for (const guard of guards) {
      try {
        return guard(context, args);
      } catch (e) {
        const error = e as Error;
        errors.push(error);
      }
    }
    throw new ForbiddenError('No guard passed', { errors: errors.map(e => e.message) });
  };
}
