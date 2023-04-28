import dotenv from 'dotenv';
import logger from '../../utils/logger';
import { type ICattle } from '../../interfaces/cattle.interface';
import { cattleEntity } from '../entities/Cattle.entity';
import { type Model } from 'sequelize';
import { type BasicResponse } from '../../interfaces';

dotenv.config();

export /**
 * * ORM Method
 * ? Method who receives a param [cattle] entity and use the CattleModel to create a new entity
 * @param {ICattle} [cattle]
 * @return {Promise<Model<ICattle> | Promise<BasicResponse> | undefined>}
 */
const createCattle = async (
  cattle: ICattle
): Promise<Model<ICattle> | Promise<BasicResponse> | undefined> => {
  try {
    let response: BasicResponse | Model<ICattle>;
    const cattleModel = await cattleEntity();
    const cattleExist = await cattleModel.findOne({
      where: {
        number: cattle?.number,
      },
    });
    if (cattleExist !== null) {
      response = { message: 'Cattle already exists' };
    }
    await cattleModel.create(cattle);
    response = {
      message: `${cattle.register} Just register a Cattle with the number of ${cattle.number}, successfully`,
    };
    return response;
  } catch (error) {
    if (error instanceof Error) {
      logger(`[ORM ERROR] Creating Cattle:${error.message}`, 'error', 'db');
    }
  }
};
