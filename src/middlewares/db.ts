import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
// dotenv.config();

// import config from 'config';

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

// ? Sequelize Instance
const newSequelize = (): Sequelize | undefined => {
  if (
    DB_HOST !== undefined &&
    DB_NAME !== undefined &&
    DB_USER !== undefined &&
    DB_PASSWORD !== undefined
  )
    return new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      dialect: 'postgres',
    });
};

export default newSequelize;
