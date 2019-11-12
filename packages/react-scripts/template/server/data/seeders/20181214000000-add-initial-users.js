'use strict';

const USERS = [
  {},
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User', USERS, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null, {});
  },
};
