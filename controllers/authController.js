const my_db = require("../database");
const { User, Role } = my_db.models;

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  console.log(">>>DEBUG: authController: req.body", req.body);
  const { email, pwd } = req.body;
  if (!email || !pwd)
    return res.status(400).json({
      message: "Email and password are required.",
    });

  const foundUser = await User.findOne({
    where: { userEmail: email },
    include: {
      model: Role,
    },
  });

  if (!foundUser) return res.sendStatus(401); //unauthorized

  const userId = foundUser.dataValues.id;

  //evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    //Note: upon registration user is assigned User role, but could also have other roles like admin
    //Note: registerController: await roleController.addUser(2001, new_user_id);
    //Note: Roles: admin:5150, editor, user: 2001
    const roles = foundUser.roles
      .map((userObj) => {
        return userObj.role_id;
      })
      .filter(Boolean);

    //create JWT
    const accessToken = jwt.sign(
      {
        UserInfo: { email: foundUser.userEmail, roles: roles },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { email: foundUser.userEmail },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    //save refresh token of current user in db; will alow us to create logout route
    foundUser.refreshToken = refreshToken;

    //update user with refreshToken
    const result = await User.update(
      { refreshToken: foundUser.refreshToken },
      {
        where: { userEmail: foundUser.userEmail },
      }
    );

    //Note: send refresh token as an http only cookie
    //Note: if testing refresh endpoint with postman... comment out secure: true

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      // TODO: uncomment for production if using https
      //secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    //Note: send authorization roles and access token to user and userID
    //Note: frontend needs to store (roles, accessToken, userId) in app state with useContext
    res.json({ roles, accessToken, userId });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
