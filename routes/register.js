const express = require("express");
const router = express.Router();
const {
  imageUpload,
  handleNewUser,
} = require("../controllers/registerController");

router.post("/", imageUpload.single("user-image"), handleNewUser);

module.exports = router;
