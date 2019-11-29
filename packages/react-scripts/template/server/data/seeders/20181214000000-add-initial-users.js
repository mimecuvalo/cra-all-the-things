'use strict';

const USERS = [{ username: 'admin', email: 'email@gmail.com' }];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User', USERS, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null, {});
  },
};
