const Tour = require("./../models/tourModels");

const APIFeatures = require("../utils/apiFeatures");

const AppError = require("../utils/appError");

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

//Aliasing the filters with routes
exports.getTopTours = (req, res, next) => {
  console.log("called", req.query);
  req.query.sort = "duration";
  console.log("called", req.query);

  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const feature = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const tours = await feature.query; //return actual data from query

  res.status(200).json({
    status: "SUCCESS",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "SUCCESS",
    data: newTour,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({_id:req.params.id})

  if (!tour) {
    return next(new AppError("No tour find with that ID", 404));
  }

  res.status(200).json({
    status: "SUCCESS",
    data: {
      tour: tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError("No tour find with that ID", 404));
  }

  res.status(200).json({
    status: "SUCCESS",
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError("No tour find with that ID", 404));
  }

  res.status(204).json({
    status: "SUCCESS",
  });
});
