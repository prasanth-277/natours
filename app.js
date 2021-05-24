const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routers/tourRoutes");
const userRouter = require("./routers/userRoutes");

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

app.use('/api/v1/users',userRouter);

app.use("/api/v1/tours", tourRouter);

module.exports = app;