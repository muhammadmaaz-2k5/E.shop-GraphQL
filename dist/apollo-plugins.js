import { GraphQLError } from 'graphql';
import { config } from './config/index.js';
import { createLogger } from './shared/infrastructure/logger/index.js';
import { QueryDepthError, RateLimitError } from './shared/graphql/errors/index.js';
const log = createLogger('apollo-plugins');
// Rate limiting (in-memory, should use Redis in production)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 100;
// Complexity tracking
function calculateDepth(selections, currentDepth = 0) {
    let maxDepth = currentDepth;
    for (const sel of selections) {
        if (sel?.selectionSet?.selections) {
            const childDepth = calculateDepth(sel.selectionSet.selections, currentDepth + 1);
            maxDepth = Math.max(maxDepth, childDepth);
        }
    }
    return maxDepth;
}
export function depthLimitPlugin() {
    return {
        async requestDidStart() {
            return {
                async parsingDidStart({ request }) {
                    return async (err) => {
                        if (err)
                            return;
                        if (request.query) {
                            try {
                                const { parse } = await import('graphql');
                                const document = parse(request.query);
                                const depth = calculateDepth(document.definitions);
                                if (depth > config.graphql.depthLimit) {
                                    throw new QueryDepthError(depth, config.graphql.depthLimit);
                                }
                            }
                            catch (e) {
                                if (e instanceof QueryDepthError)
                                    throw e;
                            }
                        }
                    };
                },
            };
        },
    };
}
export function rateLimitPlugin() {
    return {
        async requestDidStart({ contextValue }) {
            const ctx = contextValue;
            const key = ctx?.user?.id || 'anonymous';
            const now = Date.now();
            const record = rateLimitStore.get(key);
            if (record) {
                if (now > record.resetTime) {
                    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
                }
                else if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
                    log.warn({ key }, 'Rate limit exceeded');
                    throw new RateLimitError(Math.ceil((record.resetTime - now) / 1000));
                }
                else {
                    rateLimitStore.set(key, { count: record.count + 1, resetTime: record.resetTime });
                }
            }
            else {
                rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
            }
        },
    };
}
export function loggingPlugin() {
    return {
        async requestDidStart({ contextValue, request }) {
            const ctx = contextValue;
            const startTime = Date.now();
            ctx?.logger?.info({ operationName: request.operationName }, 'GraphQL request started');
            return {
                async willSendResponse({ response }) {
                    const duration = Date.now() - startTime;
                    const body = response.body;
                    const hasErrors = body?.kind === 'single' && body.errors?.length > 0;
                    ctx?.logger?.info({ operationName: request.operationName, duration, hasErrors }, 'GraphQL request completed');
                },
                async didEncounterErrors({ errors }) {
                    for (const err of errors) {
                        ctx?.logger?.error({ error: err.message, path: err.path }, 'GraphQL error encountered');
                    }
                },
            };
        },
    };
}
export function errorFormattingPlugin() {
    return {
        async requestDidStart() {
            return {
                async willSendResponse({ response }) {
                    const body = response.body;
                    if (body?.kind === 'single' && body.errors) {
                        body.errors = body.errors.map((error) => {
                            if (config.nodeEnv === 'production') {
                                const isClientError = error.extensions?.code !== 'INTERNAL_SERVER_ERROR';
                                if (!isClientError) {
                                    return new GraphQLError('Internal server error', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
                                }
                            }
                            return error;
                        });
                    }
                },
            };
        },
    };
}
export function securityHeadersPlugin() {
    return {
        async serverWillStart() {
            return {
                async renderLandingPage() {
                    return {
                        html: `<!DOCTYPE html><html><head><title>GraphQL API</title></head><body><h1>GraphQL API</h1><p>Use a GraphQL client to interact with this API.</p></body></html>`,
                    };
                },
            };
        },
    };
}
//# sourceMappingURL=apollo-plugins.js.map