import {
  DataTypes,
  type Sequelize,
  type Model,
  type ModelStatic,
} from 'sequelize';
import logger from '../../utils/logger';
import { type IBreed } from '../../interfaces/cattle.interface';

export /**
 * Sequelize Model interface of the Table "Breed"
 * ? This Method is defined a Sequelize Model in the 'Breed' Table and synchronized with the db
 * @param sequelize // ? the connection to the database
 * @return {Promise<ModelStatic<Model<IBreed>>>}
 */
const BreedEntity = async (
  sequelize?: Sequelize
): Promise<ModelStatic<Model<IBreed, IBreed>> | undefined> => {
  const Breed = sequelize?.define<Model<IBreed>>('Breed', {
    origin: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(225),
      allowNull: false,
      unique: true,
    },
    production: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },
  });

  await Breed?.sync()
    .then(() => {
      logger('Table and model of Breed synced successfully');
    })
    .catch(error => {
      if (error instanceof Error) {
        logger(
          `Error syncing the "Breed" table and model:${error.message}`,
          'error',
          'db'
        );
      }
    });

  return Breed;
};
