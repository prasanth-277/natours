const mongoose = require("mongoose");
const slugify = require("slugify");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: { values: ["easy", "medium", "difficult"], message: "error" },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Minimum rating should be greater that 0"],
      max: [5, "maximum rating should not exceed 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: Number,
    summary: String,
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    images: [String],
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//schema options
tourSchema.virtual("durationInWeeks").get(function () {
  return this.duration / 7;
});

//runs before save() and create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

//QUERY MIDDLEWARE
tourSchema.pre("find", function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
