const { Sequelize, DataTypes } = require("sequelize");

function userModelFunction(sqlize_connection_instance) {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "email cannot be null.",
          },
          notEmpty: {
            msg: "Please provide a value for email.",
          },
          isEmail: {
            msg: "Please provide a valid email.",
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "password cannot be null.",
          },
          notEmpty: {
            msg: "Please provide a value for password.",
          },
        },
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      },
      imageTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "imageTitle cannot be null.",
          },
          notEmpty: {
            msg: "Please provide a value for imageTitle.",
          },
        },
      },
      s3URL: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Alex",
        validate: {
          notNull: {
            msg: "s3URL cannot be null.",
          },
          notEmpty: {
            msg: "Please provide a value for author.",
          },
          isUrl: {
            msg: "Please provide a valid s3 URL.",
          },
        },
      },
    },
    {
      modelName: "users",
      paranoid: "true",
      sequelize: sqlize_connection_instance,
    }
  );
  return User;
}

module.exports = userModelFunction;
