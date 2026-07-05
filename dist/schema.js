import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { DateTimeScalar, JSONScalar } from './shared/graphql/scalars/index.js';
import { pubsub } from './index.js';
export async function buildGraphQLSchema() {
    const { ProductResolver, CategoryResolver, BrandResolver } = await import('./modules/product/index.js');
    const { AuthResolver, UserTypeResolver } = await import('./modules/auth/index.js');
    const { CartResolver } = await import('./graphql/cart.resolver.js');
    const { OrderResolver } = await import('./graphql/order.resolver.js');
    const schema = await buildSchema({
        resolvers: [AuthResolver, UserTypeResolver, ProductResolver, CategoryResolver, BrandResolver, CartResolver, OrderResolver],
        scalarsMap: [
            { type: Date, scalar: DateTimeScalar },
            { type: Object, scalar: JSONScalar },
        ],
        validate: true,
        authChecker: ({ context }, roles) => {
            const ctx = context;
            if (!ctx.user)
                return false;
            if (roles.length === 0)
                return true;
            return roles.includes(ctx.user.role) || ctx.user.role === 'admin';
        },
        emitSchemaFile: process.env.NODE_ENV === 'development',
        pubSub: pubsub,
    });
    return schema;
}
//# sourceMappingURL=schema.js.map