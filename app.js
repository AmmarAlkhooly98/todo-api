require("dotenv").config();
var createError = require("http-errors");
let express = require("express");
let cors = require("cors");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
const models = require("./models");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  let welcomeHTML = `<h1>Welcome to the todo api</h1> <a target="_blank"  href="https://documenter.getpostman.com/view/7504301/UyxqAhrr#intro">Click here for the API Documentation</a>`;
  res.send(welcomeHTML);
});

app.use("/api/v1", require("./routes/apiRoutesV1.js"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).send({
    success: false,
    message: "server error",
    time: new Date(),
  });
});

app.listen(PORT, () =>
  console.log(
    `----****** TODO API running on http://localhost:${PORT} ******----`
  )
);
