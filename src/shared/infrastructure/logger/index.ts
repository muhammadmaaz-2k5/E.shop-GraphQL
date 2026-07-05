import pino from 'pino';
import { config } from '../../../config/index.js';

const transport = config.logging.pretty
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    }
  : undefined;

export const logger = pino.pino({
  level: config.logging.level,
  transport,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
});

export const createLogger = (context: string) => logger.child({ context });

export type Logger = typeof logger;
