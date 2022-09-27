const db = require("../database");
const User = db.models.User;
const Role = db.models.Role;

const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required" });
  let id = req.body.id;

  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["role_name", "role_id"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: `User ID ${req.params.id} not found` });
    }
    const data = {
      email: user.dataValues.userEmail,
      imageUrl: user.dataValues.s3URL,
    };
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const findById = async (id) => {
  return User.findByPk(id, {
    include: [
      {
        model: Role,
        as: "roles",
        attributes: ["role_id", "role_name"],
        through: {
          attributes: [], //["role_id", "user_id"]
        },
      },
    ],
  })
    .then((found_user) => {
      return found_user;
    })
    .catch((err) => {
      console.log(">> Error while finding User: ", err);
    });
};

module.exports = {
  getUser,
  findById,
};
