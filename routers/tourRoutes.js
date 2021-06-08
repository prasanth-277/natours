const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

//it creates a mini app for tours
const router = express.Router();

// router.param("id", tourController.checkBody);

router
  .route("/topTours")
  .get(tourController.getTopTours, tourController.getAllTours);

router
  .route("/:id")
  .get(authController.protect, tourController.getTour)
  .put(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictedTo("admin"),
    tourController.deleteTour
  );

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

module.exports = router;
