import { Redis } from 'ioredis';
import { config } from '../../../config/index.js';
import { createLogger } from '../logger/index.js';
const log = createLogger('cache');
let redis = null;
class RedisCache {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async get(key) {
        try {
            const value = await this.redis.get(key);
            if (!value)
                return null;
            return JSON.parse(value);
        }
        catch (error) {
            log.error({ error, key }, 'Cache get error');
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        try {
            const serialized = JSON.stringify(value);
            if (ttlSeconds) {
                await this.redis.setex(key, ttlSeconds, serialized);
            }
            else {
                await this.redis.set(key, serialized);
            }
        }
        catch (error) {
            log.error({ error, key }, 'Cache set error');
        }
    }
    async delete(key) {
        try {
            await this.redis.del(key);
        }
        catch (error) {
            log.error({ error, key }, 'Cache delete error');
        }
    }
    async deletePattern(pattern) {
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        }
        catch (error) {
            log.error({ error, pattern }, 'Cache delete pattern error');
        }
    }
    async getOrSet(key, fn, ttlSeconds) {
        const cached = await this.get(key);
        if (cached !== null) {
            return cached;
        }
        const value = await fn();
        await this.set(key, value, ttlSeconds);
        return value;
    }
}
export function getCache() {
    if (!redis) {
        const newRedis = new Redis(config.redis.url);
        newRedis.on('connect', () => log.info('Redis connected'));
        newRedis.on('error', (error) => log.error({ error }, 'Redis error'));
        redis = newRedis;
    }
    return new RedisCache(redis);
}
//# sourceMappingURL=index.js.map