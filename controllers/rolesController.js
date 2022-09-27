const db = require("../database");
const User = db.models.User;
const Role = db.models.Role;

// Create and Save new Role
exports.create = async (a_role) => {
  return Role.create({
    role_name: a_role.name,
    role_id: a_role.role_id,
  })
    .then((new_role) => {
      console.log(">> Created Role: " + JSON.stringify(new_role, null, 2));
      return new_role;
    })
    .catch((err) => {
      console.log(">> Error while creating Role: ", err);
    });
};

// Find all Roles
exports.findAll = async () => {
  return Role.findAll({
    include: [
      {
        model: User,
        as: "users",
        attributes: ["userEmail", "password"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((all_roles) => {
      return all_roles;
    })
    .catch((err) => {
      console.log(">> Error while retrieving Roles: ", err);
    });
};

// Find a Role for a given Role id
// const ROLES_LIST = {Admin: 5150,Editor: 1984,User: 2001};
exports.findById = async (id) => {
  return Role.findByPk(id, {
    include: [
      {
        model: User,
        as: "users",
        attributes: ["userEmail", "password"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((the_role) => {
      return the_role;
    })
    .catch((err) => {
      console.log(">> Error while finding Role: ", err);
    });
};

// Add a User to a Role

exports.addUser = async (roleId, userId) => {
  return Role.findByPk(roleId)
    .then((a_role) => {
      if (!a_role) {
        console.log("Role not found!");
        return null;
      }
      return User.findByPk(userId).then((a_user) => {
        if (!a_user) {
          console.log("User not found!");
          return null;
        }
        a_role.addUser(a_user);
        console.log(
          `>> added User id=${a_user.id} to Role id=${a_role.role_id}`
        );
        return a_role;
      });
    })
    .catch((err) => {
      console.log(">> Error while adding User to Role: ", err);
    });
};
