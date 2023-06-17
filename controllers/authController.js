
const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const { hashPassword, comparePassword } = require("../helpers/userHelper.js");

const JWT = require("jsonwebtoken");
const appointmentModel = require("../models/appointmentModel");

const moment = require("moment");

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.send({
        message: "enter the name",
      });
    }
    if (!email) {
      return res.send({
        message: "enter the email",
      });
    }
    if (!password) {
      return res.send({
        message: "enter the password",
      });
    }

    const exuser = await userModel.findOne({ email });

    if (exuser) {
      return res.status(200).send({
        success: true,
        message: "already have an acount please login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    return res.status(200).send({
      success: true,
      message: "user register successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "enter email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "enter valid password",
      });
    }
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    return res.status(200).send({
      success: true,
      message: "logged in successfully",
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error ",
      error,
    });
  }
};

const authCtrl = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "autharization error",
      error,
    });
  }
};

const applyDoctorController = async (req, res) => {
  try {
    const doctor = await doctorModel({ ...req.body, status: "panding" });
    await doctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${doctor.firstName} ${doctor.lastName} has applied for doctor`,
      data: {
        doctorId: doctor._id,
        name: doctor.firstName + " " + doctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "doctor applied successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const notification = user.notification;
    const seennotification = user.seennotification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(201).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "notification successfully deleted",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error occured in server req",
      error,
    });
  }
};

const getAllDoctorsCtrl = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "Approved" });
    res.status(201).send({
      success: true,
      message: "doctors info fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in fetching doctors info",
      error,
    });
  }
};

const bookAppointmentCtrl = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const appointment = new appointmentModel(req.body);
    // appointment = req.body;
    await appointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "new appointment request",
      message: `appointment booking request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "appointment book successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in booking appointment",
      error,
    });
  }
};

const bookingAvailabilityCtrl = async (req, res) => {
  try {
    const date = moment(req.body.data, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "appointment not available at this time",
        success: true,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "appointment available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "booking availability error",
      error,
    });
  }
};

const userAppointmentCtrl = async (req, res) => {
  try {
    const appointment = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "user appointment fetch successfully",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in user appinment",
      error,
    });
  }
};
module.exports = {
  loginController,
  registerController,
  authCtrl,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsCtrl,
  bookAppointmentCtrl,
  bookingAvailabilityCtrl,
  userAppointmentCtrl,
};
