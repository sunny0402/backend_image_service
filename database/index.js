require("dotenv").config();
const Sequelize = require("sequelize");

// Connecting to database:
// Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
// });

const my_db_connection_instance = new Sequelize(
  // For Deployment:
  process.env.DB_NAME,
  process.env.USERNAME,
  process.env.PASSWORD,

  //For local development:
  // "test_auth_images_local_db",
  // "root",
  // "",
  {
    // For deployment: host: process.env.HOST,
    //For local development: host: "localhost"
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // can set global options here
    // define: {
    //   freezeTableName: true,
    //   timestamps: false,
    // },
  }
);

const db_to_export = {
  my_db_connection_instance,
  Sequelize,
  models: {},
};

db_to_export.models.User = require("./models/user")(my_db_connection_instance);

db_to_export.models.Role = require("./models/role")(my_db_connection_instance);

// Many-to-Many Relationship:
// One User can have multiple Roles.
// One Role can be taken on by many Users.

//Note: creates a join table with roleId and userID
db_to_export.models.Role.belongsToMany(db_to_export.models.User, {
  through: "user_roles",
  foreignKey: "role_id",
});

db_to_export.models.User.belongsToMany(db_to_export.models.Role, {
  through: "user_roles",
  foreignKey: "user_id",
});

// db_to_export.ROLES = ["user", "admin", "editor"];

module.exports = db_to_export;
