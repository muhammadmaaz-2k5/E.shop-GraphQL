import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer as WsServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import { buildGraphQLSchema } from './schema.js';
import { createContext } from './shared/graphql/context.js';
import { config } from './config/index.js';
import { createLogger } from './shared/infrastructure/logger/index.js';
import { AppError } from './shared/graphql/errors/index.js';
import { depthLimitPlugin, rateLimitPlugin, loggingPlugin, errorFormattingPlugin, securityHeadersPlugin, } from './apollo-plugins.js';
import { connectDatabase } from './shared/infrastructure/database/index.js';
const log = createLogger('server');
// Global PubSub for subscriptions
export const pubsub = new PubSub();
async function startServer() {
    // Connect database
    await connectDatabase();
    const app = express();
    const httpServer = createServer(app);
    // Build schema
    const schema = await buildGraphQLSchema();
    // WebSocket server for subscriptions
    const wsServer = new WsServer({
        server: httpServer,
        path: '/graphql',
    });
    const serverCleanup = useServer({
        schema,
        context: async (ctx) => {
            const token = ctx.connectionParams?.authorization;
            return createContext({
                req: { headers: { authorization: token } },
            });
        },
    }, wsServer);
    // Create Apollo Server
    const server = new ApolloServer({
        schema,
        introspection: config.graphql.introspectionEnabled,
        formatError: (formattedError, error) => {
            if (error instanceof AppError) {
                return {
                    message: error.message,
                    extensions: {
                        code: error.code,
                        ...error.details,
                    },
                };
            }
            return formattedError;
        },
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            depthLimitPlugin(),
            rateLimitPlugin(),
            loggingPlugin(),
            errorFormattingPlugin(),
            securityHeadersPlugin(),
        ],
    });
    await server.start();
    // Middleware
    app.use('/graphql', cors({
        origin: true,
        credentials: true,
    }), express.json(), expressMiddleware(server, {
        context: async ({ req }) => createContext({ req: { headers: req.headers } }),
    }));
    // Health check
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // Start listening
    await new Promise((resolve) => httpServer.listen({ port: config.port }, resolve));
    log.info(`Server ready at http://localhost:${config.port}/graphql`);
    log.info(`Health check at http://localhost:${config.port}/health`);
    log.info(`Subscriptions at ws://localhost:${config.port}/graphql`);
    // Graceful shutdown
    const shutdown = async () => {
        log.info('Shutting down...');
        await serverCleanup.dispose();
        await server.stop();
        httpServer.close();
        process.exit(0);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}
startServer().catch((err) => {
    log.error(err, 'Failed to start server');
    process.exit(1);
});
//# sourceMappingURL=index.js.map