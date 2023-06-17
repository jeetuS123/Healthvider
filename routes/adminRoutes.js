const express = require("express");
const router = express.Router();
const {
  registerController,
  loginController,
  authCtrl,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsCtrl,
  bookAppointmentCtrl,
  bookingAvailabilityCtrl,
  userAppointmentCtrl,
} = require("../controllers/authController.js");
const authMiddlewares = require("../middlewares/authMiddlewares.js");

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/getUserData", authMiddlewares, authCtrl);

router.post("/apply-doctor", authMiddlewares, applyDoctorController);

router.post(
  "/get-all-notification",
  authMiddlewares,
  getAllNotificationController
);

router.post(
  "/delete-all-notification",
  authMiddlewares,
  deleteAllNotificationController
);

router.get("/getAllDoctors", authMiddlewares, getAllDoctorsCtrl);

router.post("/book-appointment", authMiddlewares, bookAppointmentCtrl);

router.post("/check-availability", authMiddlewares, bookingAvailabilityCtrl);

router.get("/user-appointment", authMiddlewares, userAppointmentCtrl);
module.exports = router;
