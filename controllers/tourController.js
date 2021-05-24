const Tour = require("./../models/tourModels");

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const execludedFields = ["page", "sort", "limit", "fields"];
    execludedFields.forEach((el) => delete queryObj[el]);

    //FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    //SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      //default sorting
      query = query.sort("-createdAt");
    }

    //field limiting

    if (req.query.fields) {
      const feilds = req.query.fields.split(",").join(" ");
      query = query.select(feilds);
    } else {
      query = query.select("-__v");
    }

    const tours = await query;

    res.status(200).json({
      status: "SUCCESS",
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "FAIL",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "SUCCESS",
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: "FAIL",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id:req.params.id})
    res.status(200).json({
      status: "SUCCESS",
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "FAIL",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "SUCCESS",
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "FAIL",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "SUCCESS",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "FAIL",
      message: err,
    });
  }
};
