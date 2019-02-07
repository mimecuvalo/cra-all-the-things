// Keep in sync with both graphql/schema/user.js and migrations/[date]-create-user.js
export default (sequelize, Sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(191),
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 191],
        },
      },
      email: {
        type: Sequelize.STRING(191),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true,
          len: [3, 191],
        },
      },
    },
    {
      freezeTableName: true,
    }
  );

  return User;
};
