const { Sequelize, DataTypes } = require("sequelize");

function roleModelFunction(sqlize_connection_instance) {
  class Role extends Sequelize.Model {}
  Role.init(
    {
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        validate: {
          notNull: {
            msg: "role_id cannot be null.",
          },
          notEmpty: {
            msg: "Please provide a value for role_id.",
          },
        },
      },
      role_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Role name cannot be null.",
          },
          notEmpty: {
            msg: "Please provide a value for role name.",
          },
        },
      },
    },
    {
      modelName: "roles",
      paranoid: "true",
      sequelize: sqlize_connection_instance,
    }
  );
  return Role;
}

module.exports = roleModelFunction;
