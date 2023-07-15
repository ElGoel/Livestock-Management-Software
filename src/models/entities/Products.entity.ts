import {
  DataTypes,
  type Sequelize,
  type Model,
  type ModelStatic,
} from 'sequelize';
import logger from '../../utils/logger';
import { type IProducts } from '../../interfaces/cattle.interface';
import { cattleEntity } from './Cattle.entity';

export /**
 * Sequelize Model interface of the Table "Products"
 * ? This Method is defined a Sequelize Model in the 'Products' Table and synchronized with the db
 * @param sequelize // ? the connection to the database
 * @return {Promise<ModelStatic<Model<IProducts>>>}
 */
const productsEntity = async (
  sequelize?: Sequelize
): Promise<ModelStatic<Model<IProducts, IProducts>> | undefined> => {
  const Products = sequelize?.define<Model<IProducts>>('Products', {
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
      },
    },
    totalMilk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isDelete: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  });

  const cattleModel = await cattleEntity(sequelize);
  if (cattleModel !== undefined && Products !== undefined) {
    cattleModel.hasMany(Products);
    Products.belongsTo(cattleModel);
  } else {
    logger('the relation of the products entity was not found', 'error', 'db');
  }

  await Products?.sync({ alter: true })
    .then(() => {
      logger('Table and model of Products synced successfully');
    })
    .catch(error => {
      if (error instanceof Error) {
        logger(
          `Error syncing the "Products" table and model:${error.message}`,
          'error',
          'db'
        );
      }
    });

  return Products;
};
