import {
  DataTypes,
  type Sequelize,
  type Model,
  type ModelStatic,
} from 'sequelize';
import logger from '../../utils/logger';
import { type ICattle } from '../../interfaces/cattle.interface';

export /**
 * Sequelize Model interface of the Table "Cattle"
 * ? This Method is defined a Sequelize Model in the 'Cattle' Table and synchronized with the db
 * @param sequelize // ? the connection to the database
 * @return {Promise<ModelStatic<Model<ICattle>>>}
 */
const cattleEntity = async (
  sequelize?: Sequelize
): Promise<ModelStatic<Model<ICattle>> | undefined> => {
  const Cattle = sequelize?.define('Cattle', {
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    race: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    initWeight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quarterlyWeight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    registerDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
      },
    },
    register: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });

  await Cattle?.sync()
    .then(() => {
      logger('Table and model synced successfully');
    })
    .catch(error => {
      if (error instanceof Error) {
        logger(
          `Error syncing the table and model:${error.message}`,
          'error',
          'db'
        );
      }
    });

  return Cattle;
};
