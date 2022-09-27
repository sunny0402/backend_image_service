const allowedOrigins = require("../config/allowedOrigins");

//If origin that is sending request is in our allowedOrigins list.
//Then set response header: Access-Control-Allow-Credentials
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
