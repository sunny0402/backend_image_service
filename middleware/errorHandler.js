const { logEvents } = require("./logEvents");

const errorHandler = (err, req, res, next) => {
  console.log(">>> DEBUG errorHanler.js: err", err);
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.error(err.stack);
  if (err.status !== 500) {
    res.status(err.status).send(err);
  }
  res.status(500).send(err.message);
};

module.exports = errorHandler;
