import { Sequelize } from 'sequelize';
import DataLoader from 'dataloader';
import { User, Product, Category, Brand, Order, Review, getSequelize } from '../infrastructure/database/index.js';
import { getCache, Cache } from '../infrastructure/cache/index.js';
import { Logger, createLogger } from '../infrastructure/logger/index.js';
import { AppError, ErrorCode } from '../graphql/errors/index.js';
import { verifyToken } from '../../modules/auth/auth.service.js';

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

function createLoaders(): DataLoaders {
  return {
    userById: new DataLoader(async (ids: readonly string[]) => {
      const users = await User.findAll({ where: { id: ids } });
      const userMap = new Map(users.map(u => [u.id, u.toJSON()]));
      return ids.map(id => userMap.get(id) ?? null);
    }),

    productById: new DataLoader(async (ids: readonly string[]) => {
      const products = await Product.findAll({ where: { id: ids } });
      const productMap = new Map(products.map(p => [p.id, p.toJSON()]));
      return ids.map(id => productMap.get(id) ?? null);
    }),

    categoryById: new DataLoader(async (ids: readonly string[]) => {
      const categories = await Category.findAll({ where: { id: ids } });
      const categoryMap = new Map(categories.map(c => [c.id, c.toJSON()]));
      return ids.map(id => categoryMap.get(id) ?? null);
    }),

    brandById: new DataLoader(async (ids: readonly string[]) => {
      const brands = await Brand.findAll({ where: { id: ids } });
      const brandMap = new Map(brands.map(b => [b.id, b.toJSON()]));
      return ids.map(id => brandMap.get(id) ?? null);
    }),

    orderByUserId: new DataLoader(async (userIds: readonly string[]) => {
      const orders = await Order.findAll({ where: { userId: userIds } });
      const ordersByUser = new Map<string, any[]>();
      for (const order of orders) {
        const orderJson = order.toJSON();
        const existing = ordersByUser.get(orderJson.userId) ?? [];
        ordersByUser.set(orderJson.userId, [...existing, orderJson]);
      }
      return userIds.map(id => ordersByUser.get(id) ?? []);
    }),

    reviewsByProductId: new DataLoader(async (productIds: readonly string[]) => {
      const reviews = await Review.findAll({ where: { productId: productIds } });
      const reviewsByProduct = new Map<string, any[]>();
      for (const review of reviews) {
        const reviewJson = review.toJSON();
        const existing = reviewsByProduct.get(reviewJson.productId) ?? [];
        reviewsByProduct.set(reviewJson.productId, [...existing, reviewJson]);
      }
      return productIds.map(id => reviewsByProduct.get(id) ?? []);
    }),
  };
}

async function extractUser(authHeader: string | undefined): Promise<AuthUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = await verifyToken(token);
    if (!decoded) return null;

    const user = await User.findByPk(decoded.userId);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions ?? [],
    };
  } catch {
    return null;
  }
}

export async function createContext({ req }: { req: { headers: Record<string, string | undefined> } }): Promise<GraphQLContext> {
  const requestId = crypto.randomUUID();
  const logger = createLogger('graphql').child({ requestId });
  const db = getSequelize();
  const cache = getCache();

  const user = await extractUser(req.headers.authorization);

  return {
    user,
    db,
    cache,
    logger,
    requestId,
    loaders: createLoaders(),
    isAuthenticated: user !== null,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager' || user?.role === 'admin',
  };
}

export function requireAuth(context: GraphQLContext): AuthUser {
  if (!context.isAuthenticated || !context.user) {
    throw new AppError('Authentication required', ErrorCode.UNAUTHENTICATED, 401);
  }
  return context.user;
}

export function requireRole(context: GraphQLContext, roles: string[]): AuthUser {
  const user = requireAuth(context);
  if (!roles.includes(user.role)) {
    throw new AppError('Insufficient permissions', ErrorCode.FORBIDDEN, 403, { required: roles, actual: user.role });
  }
  return user;
}

export function requirePermission(context: GraphQLContext, permission: string): AuthUser {
  const user = requireAuth(context);
  if (!user.permissions.includes(permission) && user.role !== 'admin') {
    throw new AppError('Missing required permission', ErrorCode.INSUFFICIENT_PERMISSIONS, 403, { required: permission });
  }
  return user;
}
