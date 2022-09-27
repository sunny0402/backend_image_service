require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
const path = require("path");

//auth middleware
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");

//to create admin user ...
const bcrypt = require("bcrypt");
//for startup database operations
const roleController = require("./controllers/rolesController");

//database
let my_db = require("./database");
const { User, Role } = my_db.models;

// const port = process.env.PORT || 5000;
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 5000;

async function database_start() {
  try {
    //Note: for production remove force:true
    //      simply await my_db.my_db_connection_instance.sync();
    //Note: uploaded sql file to EC2 instance to initialize database
    //Note: For production sqp file already uploaded to server.
    //Note: Username, password are located in .env file in backend. Makre sure is is there!

    await my_db.my_db_connection_instance.authenticate();
    await my_db.my_db_connection_instance.sync();
    console.log("Connection to the database successful!");

    // const userRole = await Role.create({
    //   role_name: "User",
    //   role_id: 2001,
    // });

    // const adminRole = await Role.create({
    //   role_name: "Admin",
    //   role_id: 5150,
    // });

    //create Alex2 with roles of User and Admin
    const hashedPwdAlex2 = await bcrypt.hash("12345", 10);
    const alex2 = await User.create({
      userEmail: "alex2@gmail.com",
      password: hashedPwdAlex2,
      imageTitle: "178722cf-6368-4e12-9edd-81904b7259c4.jpg",
      s3URL:
        "https://user-images-s3-storage.s3.us-east-2.amazonaws.com/178722cf-6368-4e12-9edd-81904b7259c4.jpg",
    });

    const alex2Id = alex2.dataValues.id;
    const userRoleAlex1 = await roleController.addUser(2001, alex2Id);
    const adminRoleAlex1 = await roleController.addUser(5150, alex2Id);

    console.log("Test user alex2 created: ", alex2.dataValues);
    console.log("Database startup complete!");
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      const errors = err.errors.map((an_err) => an_err.message);
      console.error("Validation errors: ", errors);
    } else {
      console.error(err);
    }
  }
}

database_start();

app.use(credentials);
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Note: if deployed serve static files from build folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "/frontend/build")));
} else {
  app.use(express.static(path.join(__dirname, "..", "/frontend/public")));
}

// AUTH ROUTES
app.use("/api/register", require("./routes/register"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/refresh", require("./routes/refresh"));
app.use("/api/logout", require("./routes/logout"));

// Note: Require JWT only after register or login. Every route after will use verifyJWT.
//Note: Applied verifyJWT directly in routes/api/users.js
// app.use(verifyJWT);

app.use("/api/users", require("./routes/api/users"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    //TODO: For production:
    res.sendFile(path.join(__dirname + "../frontends/build/index.html"));
    //For dev:
    // res.sendFile(path.join(__dirname + "/views/404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

try {
  app.listen(port);
  console.log("App is listening on port " + port);
} catch (error) {
  throw error;
}
