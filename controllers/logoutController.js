const my_db = require("../database");
const { User, Role } = my_db.models;

const handleLogout = async (req, res) => {
  console.log(">>>DEBUG logoutController: req.cookies", req.cookies);

  const cookies = req.cookies;
  //optional chaining ... if we have cookies ... and they have jwt property
  if (!cookies?.jwt) return res.sendStatus(204); //no cookie to erase ... successful ... no content

  const refreshToken = cookies.jwt;

  // is refresh token in database ... user with such a token
  const foundUser = await User.findOne({
    where: { refreshToken: refreshToken },
    include: {
      model: Role,
    },
  });

  //no user with cookie, but suck a cookie exists
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
    });
    res.sendStatus(204); //successful but no content
  }

  const foundUserId = foundUser.dataValues.id;

  //TODO: should be oundUser.dataValues.refreshToken
  foundUser.refreshToken = "";

  console.log(">>> DEBUG: lougoutController: foundUser: ", foundUser);

  // MONGO: const result = await foundUser.save();
  const result = await User.update(
    { refreshToken: foundUser.refreshToken },
    {
      where: { id: foundUserId },
    }
  );
  console.log(">>> DEBUG: lougoutController: result: ", result);

  //Note: when deleteing cookie specify same properties it was initialized with except maxAge: 24 * 60 * 60 * 1000
  //Note: secure: true - only serves on https
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    // secure: true,
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };
