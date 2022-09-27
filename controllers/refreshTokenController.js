const my_db = require("../database");
const { User, Role } = my_db.models;

const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  //Note: authController sends refreshToken in res.cookie
  const cookies = req.cookies;
  console.log(
    "refreshTokenController: JSON.stringify(req.cookies): ",
    JSON.stringify(req.cookies)
  );
  console.log("refreshTokenController: cookies.jwt: ", cookies.jwt);

  //optional chaining ... if we have cookies ... and they have jwt property
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({
    where: { refreshToken: refreshToken },
    include: {
      model: Role,
    },
  });

  if (!foundUser) return res.sendStatus(403); //forbidden

  //Note: evaluate jwt : jwt.verify(token, secretOrPublicKey, [options, callback])
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.userEmail !== decoded.email) {
      return res.sendStatus(403);
    }

    const roles = foundUser.roles
      .map((userObj) => {
        return userObj.role_id;
      })
      .filter(Boolean);

    console.log("refreshTokenController: roles: ", roles);

    //now send access token as refresh token was verified
    const accessToken = jwt.sign(
      {
        UserInfo: { email: decoded.userEmail, roles: roles },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" } //short duration for demonstration
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
