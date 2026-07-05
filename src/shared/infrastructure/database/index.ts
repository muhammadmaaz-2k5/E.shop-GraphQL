import { Sequelize } from 'sequelize';
import { config } from '../../../config/index.js';
import { createLogger } from '../logger/index.js';
import { initModels } from './models.js';

export * from './models.js';

const log = createLogger('database');

let sequelizeInstance: Sequelize | null = null;

export function getSequelize(): Sequelize {
  if (!sequelizeInstance) {
    const { host, port, database, user, password } = config.postgres;
    sequelizeInstance = new Sequelize(database, user, password, {
      host,
      port,
      dialect: 'postgres',
      logging: (msg) => log.debug(msg),
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
    
    // Initialize models
    initModels(sequelizeInstance);
    log.info('Sequelize database client initialized');
  }
  return sequelizeInstance;
}

export async function connectDatabase(): Promise<void> {
  const sequelize = getSequelize();
  try {
    await sequelize.authenticate();
    log.info('Successfully connected to the PostgreSQL database.');
  } catch (error) {
    log.error(error, 'Unable to connect to the PostgreSQL database:');
    throw error;
  }
}
