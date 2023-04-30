// import { type NextFunction, type Request, type Response } from 'express';
import logger from '../utils/logger';
import { Sequelize } from 'sequelize';

// ? Sequelize Instance
const newSequelize = (): Sequelize => {
  return new Sequelize('postgres', 'postgres', 'angelopass', {
    host: 'localhost',
    dialect: 'postgres',
  });
};

/**
 * Method to connected to the database
 * @return {Promise<Sequelize>}
 */
const connectDb = async (): Promise<Sequelize | undefined> => {
  try {
    const sequelize: Sequelize = newSequelize();
    await sequelize.authenticate();
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

/**
 * Method to disconnect from the database
 * @return {Promise<void>}
 */
const disconnectDb = async (sequelize?: Sequelize): Promise<void> => {
  try {
    if (sequelize !== undefined) {
      await sequelize.close();
    } else {
      throw new Error('sequelize is undefined');
    }
    logger(
      'Disconnection to database has been established successfully.',
      'warn',
      'db'
    );
  } catch (error: unknown) {
    if (error instanceof Error && error !== undefined) {
      logger(
        `[Base Error]: Unable to disconnect to the database:${JSON.stringify(
          error.message
        )}`,
        'error',
        'db'
      );
    }
  }
};

export { disconnectDb, connectDb, newSequelize };
