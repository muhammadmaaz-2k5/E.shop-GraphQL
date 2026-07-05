import { Redis } from 'ioredis';
import { config } from '../../../config/index.js';
import { createLogger } from '../logger/index.js';

const log = createLogger('cache');

let redis: Redis | null = null;

export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
  getOrSet<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T>;
}

class RedisCache implements Cache {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      log.error({ error, key }, 'Cache get error');
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
    } catch (error) {
      log.error({ error, key }, 'Cache set error');
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      log.error({ error, key }, 'Cache delete error');
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      log.error({ error, pattern }, 'Cache delete pattern error');
    }
  }

  async getOrSet<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fn();
    await this.set(key, value, ttlSeconds);
    return value;
  }
}

export function getCache(): Cache {
  if (!redis) {
    const newRedis = new Redis(config.redis.url);
    newRedis.on('connect', () => log.info('Redis connected'));
    newRedis.on('error', (error: Error) => log.error({ error }, 'Redis error'));
    redis = newRedis;
  }
  return new RedisCache(redis!);
}
