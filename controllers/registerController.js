require("dotenv").config();
//for database
const my_db = require("../database");
const { User } = my_db.models;
const roleController = require("./rolesController");
const userController = require("./usersController");
const bcrypt = require("bcrypt");
// //for images and s3
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid").v4;
const path = require("path");

aws.config.update({
  // credentials: {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  // },
});

const s3 = new aws.S3({
  apiVersion: "2006-03-01",
});

const imageUpload = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "user-images-s3-storage",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuid()}${ext}`);
    },
  }),
  //TODO: need to return error message to frontend.
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      //TODO: create custom error classes: ApplicationError, DatabaseError, UserFacingError
      // return cb(new UserFacingError("Custom Message"));

      const imageError = new Error();
      imageError.message = "Only .png, .jpg and .jpeg format allowed!";
      imageError.status = 501;

      return cb(imageError);
    }
  },
});

const handleNewUser = async (req, res) => {
  console.log(">>>DEBUG registerController: req.body: ", req.body);
  console.log(">>>DEBUG registerController: req.file: ", req.file);

  const image = req.file;
  const { email, pwd } = req.body;

  if (!email || !pwd || !image) {
    return res
      .status(400)
      .json({ message: "Email, password, and image are required." });
  }

  const imageData = {
    imageTitle: image.key, //image.originalname,
    s3URL: image.location,
  };

  //Note: check for duplicate email in db
  const duplicate = await User.findOne({ where: { userEmail: email } });

  if (duplicate) {
    return res.sendStatus(409); //conflict ... user already exists
  }

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store new user
    const new_user = await User.create({
      userEmail: email,
      password: hashedPwd,
      s3URL: imageData.s3URL,
      imageTitle: imageData.imageTitle,
    });

    const new_user_id = new_user.dataValues.id;
    const default_role = await roleController.addUser(2001, new_user_id);

    const result = await userController.findById(new_user_id);

    res.status(201).json({
      success: `New user: id:${result.id} email:${result.userEmail}. Created!`,
    });
  } catch (err) {
    // if (err.status === 501) {
    //   res.status(501).json({ message: err.message });
    // }
    res.status(500).json({ message: err.message });
  }
};

module.exports = { imageUpload, handleNewUser };
