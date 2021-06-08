const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routers/tourRoutes");
const userRouter = require("./routers/userRoutes");
const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorController")

const app = express();

// Middleswares

app.use(express.static(`${__dirname}/public`));

// morgan is 3rd party middle ware
app.use(morgan("dev"));
app.use(express.json());

//custom middleware
app.use((req, res, next) => {
  console.log("Hello this is custom middleware!!");
  req.requestedAt = new Date().toISOString();
  next();
});

app.use("/api/v1/users", userRouter);

app.use("/api/v1/tours", tourRouter);

//It should be written in the last
//Unhandled routes are handled here
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "FAIL",
  //   message: `Can't find this ${req.originalUrl} on this sever`,
  // });
  next(new AppError(`Can't find this ${req.originalUrl} on this sever`,404))
});

app.use(globalErrorHandler);

module.exports = app;
