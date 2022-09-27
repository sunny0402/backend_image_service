const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("verifyRoles: req.roles:  ", req.roles);
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];

    //debug
    console.log("verifyRoles: rolesArray: which roles required:  ", rolesArray);
    console.log(
      "verifyRoles: req.roles: which roles does user have: ",
      req.roles
    );

    //Note:
    //verifyJWT.js:  req.roles = decoded.UserInfo.roles;
    //includes within map will create an array of true/false
    //need one true to verify that the role can access the route we are verifying

    ///routes/user:
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User),

    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);

    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
