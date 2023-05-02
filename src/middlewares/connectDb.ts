import { type Sequelize } from 'sequelize';
import logger from '../utils/logger';
import newSequelize from './db';

/**
 * Method to connected to the database
 * @return {Promise<Sequelize>}
 */
const connectDb = async (): Promise<Sequelize | undefined> => {
  try {
    const sequelize: Sequelize | undefined = newSequelize();
    await sequelize?.authenticate();
    logger(
      'Connection to database has been established successfully.',
      'info',
      'db'
    );
    return sequelize;
  } catch (error: unknown) {
    if (error instanceof Error && error !== undefined) {
      logger(
        `[Base Error]: Unable to connect to the database:${JSON.stringify(
          error.message
        )}`,
        'error',
        'db'
      );
    }
  }
};

export default connectDb;
