import { z } from 'zod';
declare const configSchema: z.ZodObject<{
    nodeEnv: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    port: z.ZodDefault<z.ZodNumber>;
    supabase: z.ZodObject<{
        url: z.ZodDefault<z.ZodString>;
        anonKey: z.ZodDefault<z.ZodString>;
        serviceRoleKey: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        anonKey: string;
        serviceRoleKey: string;
    }, {
        url?: string | undefined;
        anonKey?: string | undefined;
        serviceRoleKey?: string | undefined;
    }>;
    postgres: z.ZodObject<{
        host: z.ZodDefault<z.ZodString>;
        port: z.ZodDefault<z.ZodNumber>;
        database: z.ZodDefault<z.ZodString>;
        user: z.ZodDefault<z.ZodString>;
        password: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        port: number;
        host: string;
        database: string;
        user: string;
        password: string;
    }, {
        port?: number | undefined;
        host?: string | undefined;
        database?: string | undefined;
        user?: string | undefined;
        password?: string | undefined;
    }>;
    jwt: z.ZodObject<{
        secret: z.ZodDefault<z.ZodString>;
        expiresIn: z.ZodDefault<z.ZodString>;
        refreshExpiresIn: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    }, {
        secret?: string | undefined;
        expiresIn?: string | undefined;
        refreshExpiresIn?: string | undefined;
    }>;
    redis: z.ZodObject<{
        url: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
    }, {
        url?: string | undefined;
    }>;
    logging: z.ZodObject<{
        level: z.ZodDefault<z.ZodString>;
        pretty: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        level: string;
        pretty: boolean;
    }, {
        level?: string | undefined;
        pretty?: boolean | undefined;
    }>;
    graphql: z.ZodObject<{
        depthLimit: z.ZodDefault<z.ZodNumber>;
        complexityLimit: z.ZodDefault<z.ZodNumber>;
        introspectionEnabled: z.ZodDefault<z.ZodBoolean>;
        playgroundEnabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        depthLimit: number;
        complexityLimit: number;
        introspectionEnabled: boolean;
        playgroundEnabled: boolean;
    }, {
        depthLimit?: number | undefined;
        complexityLimit?: number | undefined;
        introspectionEnabled?: boolean | undefined;
        playgroundEnabled?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    nodeEnv: "development" | "production" | "test";
    port: number;
    supabase: {
        url: string;
        anonKey: string;
        serviceRoleKey: string;
    };
    postgres: {
        port: number;
        host: string;
        database: string;
        user: string;
        password: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    redis: {
        url: string;
    };
    logging: {
        level: string;
        pretty: boolean;
    };
    graphql: {
        depthLimit: number;
        complexityLimit: number;
        introspectionEnabled: boolean;
        playgroundEnabled: boolean;
    };
}, {
    supabase: {
        url?: string | undefined;
        anonKey?: string | undefined;
        serviceRoleKey?: string | undefined;
    };
    postgres: {
        port?: number | undefined;
        host?: string | undefined;
        database?: string | undefined;
        user?: string | undefined;
        password?: string | undefined;
    };
    jwt: {
        secret?: string | undefined;
        expiresIn?: string | undefined;
        refreshExpiresIn?: string | undefined;
    };
    redis: {
        url?: string | undefined;
    };
    logging: {
        level?: string | undefined;
        pretty?: boolean | undefined;
    };
    graphql: {
        depthLimit?: number | undefined;
        complexityLimit?: number | undefined;
        introspectionEnabled?: boolean | undefined;
        playgroundEnabled?: boolean | undefined;
    };
    nodeEnv?: "development" | "production" | "test" | undefined;
    port?: number | undefined;
}>;
export type Config = z.infer<typeof configSchema>;
export declare const config: {
    nodeEnv: "development" | "production" | "test";
    port: number;
    supabase: {
        url: string;
        anonKey: string;
        serviceRoleKey: string;
    };
    postgres: {
        port: number;
        host: string;
        database: string;
        user: string;
        password: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    redis: {
        url: string;
    };
    logging: {
        level: string;
        pretty: boolean;
    };
    graphql: {
        depthLimit: number;
        complexityLimit: number;
        introspectionEnabled: boolean;
        playgroundEnabled: boolean;
    };
};
export {};
//# sourceMappingURL=index.d.ts.map