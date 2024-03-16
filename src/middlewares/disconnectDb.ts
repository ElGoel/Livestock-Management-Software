import logger from '../utils/logger';
import { type Sequelize } from 'sequelize';

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

export default disconnectDb;
