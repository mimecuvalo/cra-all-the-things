const env = process.env.NODE_ENV || 'development';

const config = {};
config[env] = {
  dialect: 'mysql',
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  operatorsAliases: false,
};

module.exports = config;
