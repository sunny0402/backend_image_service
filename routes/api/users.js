const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const verifyJWT = require("../../middleware/verifyJWT");

//Note: verifyJWT middleware applied in server.js
router
  .route("/:id")
  //TODO: test applyig verifyJWT in server file
  .get(verifyJWT, verifyRoles(ROLES_LIST.User), usersController.getUser);
// .get(verifyRoles(ROLES_LIST.User), usersController.getUser);

module.exports = router;
