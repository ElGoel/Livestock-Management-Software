import {
  DataTypes,
  type Sequelize,
  type Model,
  type ModelStatic,
} from 'sequelize';
import logger from '../../utils/logger';
import { type ICattle } from '../../interfaces/cattle.interface';
import { breedEntity } from './Breed.entity';

export /**
 * Sequelize Model interface of the Table "Cattle"
 * ? This Method is defined a Sequelize Model in the 'Cattle' Table and synchronized with the db
 * @param sequelize // ? the connection to the database
 * @return {Promise<ModelStatic<Model<ICattle>>>}
 */
const cattleEntity = async (
  sequelize?: Sequelize
): Promise<ModelStatic<Model<ICattle>> | undefined> => {
  const Cattle = sequelize?.define<Model<ICattle>>('Cattle', {
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    breedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    initWeight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quarterlyWeight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    ageGroup: {
      type: DataTypes.STRING(255),
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
    isDelete: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  });

  const breed = await breedEntity(sequelize);

  if (breed !== undefined) {
    Cattle?.belongsTo(breed, { foreignKey: 'breedId' });
  } else {
    logger('the relation of the breed entity was not found', 'error', 'db');
  }

  await Cattle?.sync()
    .then(() => {
      logger('Table and model "Cattle" as synced successfully');
    })
    .catch(error => {
      if (error instanceof Error) {
        logger(
          `Error syncing the "Cattle" table and model:${error.message}`,
          'error',
          'db'
        );
      }
    });

  return Cattle;
};
