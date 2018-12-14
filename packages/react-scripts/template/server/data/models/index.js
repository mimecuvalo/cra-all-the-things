import Sequelize from 'sequelize';
import user from './user';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  operatorsAliases: false,
});

export const User = user(sequelize, Sequelize.DataTypes);
