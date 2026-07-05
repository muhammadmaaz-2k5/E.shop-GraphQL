import { z } from 'zod';
const configSchema = z.object({
    nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
    port: z.coerce.number().default(4000),
    supabase: z.object({
        url: z.string().default('http://localhost:54321'),
        anonKey: z.string().default('dummy'),
        serviceRoleKey: z.string().default('dummy'),
    }),
    postgres: z.object({
        host: z.string().default('localhost'),
        port: z.coerce.number().default(5432),
        database: z.string().default('eshop'),
        user: z.string().default('postgres'),
        password: z.string().default('maaz'),
    }),
    jwt: z.object({
        secret: z.string().min(32).default('a_very_long_dummy_secret_for_development_purposes_only'),
        expiresIn: z.string().default('15m'),
        refreshExpiresIn: z.string().default('7d'),
    }),
    redis: z.object({
        url: z.string().default('redis://localhost:6379'),
    }),
    logging: z.object({
        level: z.string().default('info'),
        pretty: z.boolean().default(false),
    }),
    graphql: z.object({
        depthLimit: z.coerce.number().default(10),
        complexityLimit: z.coerce.number().default(1000),
        introspectionEnabled: z.boolean().default(false),
        playgroundEnabled: z.boolean().default(false),
    }),
});
function loadConfig() {
    return configSchema.parse({
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        supabase: {
            url: process.env.SUPABASE_URL || 'http://localhost:54321',
            anonKey: process.env.SUPABASE_ANON_KEY || 'dummy',
            serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy',
        },
        postgres: {
            host: process.env.PGHOST || 'localhost',
            port: process.env.PGPORT || 5432,
            database: process.env.PGDATABASE || 'eshop',
            user: process.env.PGUSER || 'postgres',
            password: process.env.PGPASSWORD || 'maaz',
        },
        jwt: {
            secret: process.env.JWT_SECRET || 'a_very_long_dummy_secret_for_development_purposes_only',
            expiresIn: process.env.JWT_EXPIRES_IN,
            refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        },
        redis: {
            url: process.env.REDIS_URL,
        },
        logging: {
            level: process.env.LOG_LEVEL,
            pretty: process.env.LOG_PRETTY === 'true',
        },
        graphql: {
            depthLimit: process.env.GRAPHQL_DEPTH_LIMIT,
            complexityLimit: process.env.GRAPHQL_COMPLEXITY_LIMIT,
            introspectionEnabled: process.env.INTROSPECTION_ENABLED === 'true',
            playgroundEnabled: process.env.PLAYGROUND_ENABLED === 'true',
        },
    });
}
export const config = loadConfig();
//# sourceMappingURL=index.js.map