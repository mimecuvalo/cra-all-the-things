import Sequelize from 'sequelize';
import user from './user';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  database: process.env.REACT_APP_DB_NAME,
  username: process.env.REACT_APP_DB_USERNAME,
  password: process.env.REACT_APP_DB_PASSWORD,
  host: process.env.REACT_APP_DB_HOST,
  logging: false,
});

export const User = user(sequelize, Sequelize);

export default {
  User,
};
