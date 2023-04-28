import logger from '../utils/logger';
import { Sequelize } from 'sequelize';

// ? Sequelize Instance
const sequelize = new Sequelize('postgres', 'postgres', 'angelopass', {
  host: 'localhost',
  dialect: 'postgres',
});

/**
 * Method to connected to the database
 * @return {Promise<Sequelize>}
 */
const connectDb = async (): Promise<Sequelize> => {
  try {
    await sequelize.authenticate();
    logger(
      'Connection to database has been established successfully.',
      'info',
      'db'
    );
  } catch (error: any) {
    logger(
      `[Base Error]: Unable to connect to the database:${JSON.stringify(
        error.message
      )}`,
      'error',
      'db'
    );
  }

  return sequelize;
};

/**
 * Method to disconnect from the database
 * @return {Promise<void>}
 */
const disconnectDb = async (): Promise<void> => {
  try {
    await sequelize.close();
    logger(
      'Disconnection to database has been established successfully.',
      'warn',
      'db'
    );
  } catch (error: any) {
    logger(
      `[Base Error]: Unable to disconnect to the database:${JSON.stringify(
        error.message
      )}`,
      'error',
      'db'
    );
  }
};

export { disconnectDb, connectDb };
