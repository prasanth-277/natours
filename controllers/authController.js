const { promisify } = require("util");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

const jwt = require("jsonwebtoken");

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPRIES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   confirmPassword: req.body.confirmPassword,
  // });
  // const token = signToken(newUser._id);

  res.status(201).json({
    status: "SUCCESS",
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check whether email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  //check if user exists and passwords are correct

  if (!user) {
    return next(new AppError("Incorrect email and password", 401));
  }
  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError("Incorrect email and password", 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "SUCCESS",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //Getting token and check whether token is there or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("token")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check user exists
  console.log("-------------", decoded);
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(new AppError("User belonging to token no longer exist", 401));

  //check password chnged after jwt issue

  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed the password! PLease login again",
        401
      )
    );
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please login.", 401));
  }

  req.user = freshUser;
  next();
});

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You donot have permission to do this action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
});

exports.changePassword = (req, res, next) => {};
