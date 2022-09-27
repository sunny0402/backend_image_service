const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  console.log(">>> DEBUBG verifyJWT.js: authHeader: ", authHeader);

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401); //unauthorized

  const token = authHeader.split(" ")[1];
  // debug
  console.log(">>> DEBUBG verifyJWT.js: token: ", token);

  //Note:
  //authController creates and  sends accessToken in response
  // const accessToken = jwt.sign(
  //   {
  //     UserInfo: { email: foundUser.userEmail, roles: roles },
  //   },
  //   process.env.ACCESS_TOKEN_SECRET,
  //   { expiresIn: "30s" }
  // );
  // ...
  //res.json({ roles, accessToken, userId }); //frontend needs to store access token in memory

  //TODO: update
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token... received token but it is not correct
    //Note: req.user and req.roles now attached to any request that comes after this middleware in server
    console.log("verifyJWT: decoded: ", decoded);
    req.user = decoded.UserInfo.email;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
