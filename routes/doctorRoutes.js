const express = require("express");
const authMiddlewares = require("../middlewares/authMiddlewares");
const {
  getDoctorInfoCtrl,
  updateProfileCtrl,
  getDoctorByIdCtrl,
  doctorAppointmentCtrl,
  updateStatusCtrl,
} = require("../controllers/doctorCtrl");

const router = express.Router();

router.post("/getDoctorInfo", authMiddlewares, getDoctorInfoCtrl);

router.post("/updateProfile", authMiddlewares, updateProfileCtrl);

router.post("/getDoctorById", authMiddlewares, getDoctorByIdCtrl);

router.get("/doctor-appointments", authMiddlewares, doctorAppointmentCtrl);

router.post("/update-status", authMiddlewares, updateStatusCtrl);
module.exports = router;
