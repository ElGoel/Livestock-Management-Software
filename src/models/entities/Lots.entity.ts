import {
  DataTypes,
  type Sequelize,
  type Model,
  type ModelStatic,
} from 'sequelize';
import logger from '../../utils/logger';
import { type ILots } from '../../interfaces/cattle.interface';
// import { cattleEntity } from './Cattle.entity';

export /**
 * Sequelize Model interface of the Table "Lots"
 * ? This Method is defined a Sequelize Model in the 'Lots' Table and synchronized with the db
 * @param sequelize // ? the connection to the database
 * @return {Promise<ModelStatic<Model<ILots>>>}
 */
const lotsEntity = async (
  sequelize?: Sequelize
): Promise<ModelStatic<Model<ILots>> | undefined> => {
  const Lots = sequelize?.define<Model<ILots>>('Lots', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    supplier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiveDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalCattle: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    register: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isDelete: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  });

  await Lots?.sync({ alter: true })
    .then(() => {
      logger('Table and model "Lots" as synced successfully');
    })
    .catch(error => {
      if (error instanceof Error) {
        logger(
          `Error syncing the "Lots" table and model:${error.message}`,
          'error',
          'db'
        );
      }
    });

  return Lots;
};
