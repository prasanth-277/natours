const express = require("express");
const tourController = require("../controllers/tourController");

//it creates a mini app for tours 
const router = express.Router();

// router.param("id", tourController.checkBody);

router
  .route("/:id")
  .get(tourController.getTour)
  .put(tourController.updateTour)
  .delete(tourController.deleteTour);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

module.exports = router;
