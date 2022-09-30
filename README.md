## About

The backend api of the upload image app has the following routes for authentication:

/api/register, /api/auth, /api/refresh, /api/logout

And an authorized route for registered users:
/api/users/:id

# Example Register Request

```

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
let data = new FormData();
data.append(
  "user-image",
  fs.createReadStream("/Users/aUSER/someFolder/imageTitle.png")
);
data.append("email", "alex.test12@gmail.com");
data.append("pwd", "awesomePASS1!");

let config = {
  method: "post",
  url: "http://ec2-44-203-186-236.compute-1.amazonaws.com:5000/api/register",
  headers: {},
  data: data,
};

axios(config)
  .then((response) => {
    console.log(JSON.stringify(response.data)); //{"success":"New user: id:5 email:alex.test12@gmail.com. Created!"}
  })
  .catch((error) => {
    console.log(error);
  });

```
