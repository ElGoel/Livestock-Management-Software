import {
  DataTypes,
  type Sequelize,
  type Model,
  type ModelStatic,
} from 'sequelize';
import logger from '../../utils/logger';
import { type ICattle } from '../../interfaces/cattle.interface';
import { breedEntity } from './Breed.entity';
import { lotsEntity } from './Lots.entity';

export /**
 * Sequelize Model interface of the Table "Cattle"
 * ? This Method is defined a Sequelize Model in the 'Cattle' Table and synchronized with the db
 * @param sequelize // ? the connection to the database
 * @return {Promise<ModelStatic<Model<ICattle>>>}
 */
const cattleEntity = async (
  sequelize?: Sequelize
): Promise<ModelStatic<Model<ICattle>> | undefined> => {
  const Cattle = sequelize?.define<Model<ICattle>>(
    'Cattle',
    {
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
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
    },
    { timestamps: false }
  );

  const breedModel = await breedEntity(sequelize);
  const lotsModel = await lotsEntity(sequelize);

  if (Cattle !== undefined && breedModel !== undefined) {
    breedModel.hasMany(Cattle);
    Cattle.belongsTo(breedModel);
  } else {
    logger('the relation of the breed entity was not found', 'error', 'db');
  }

  if (lotsModel !== undefined && Cattle !== undefined) {
    lotsModel?.hasMany(Cattle);
    Cattle.belongsTo(lotsModel);
  } else {
    logger('the relation of the lots entity was not found', 'error', 'db');
  }

  // TODO: relation and sync the production table, one cow has many products

  Cattle?.afterCreate(async (cattle, options) => {
    const lotId = cattle.dataValues.LotId;
    const totalCattle = await Cattle.count({ where: { LotId: lotId } });
    await lotsModel?.update({ totalCattle }, { where: { id: lotId } });
  });

  await Cattle?.sync({ alter: true })
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
