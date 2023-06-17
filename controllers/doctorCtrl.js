const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");
const getDoctorInfoCtrl = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "data fetch successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error on server side",
      error,
    });
  }
};

const updateProfileCtrl = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).senc({
      success: false,
      message: "error in updating profile",
      error,
    });
  }
};

const getDoctorByIdCtrl = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "data successfully fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in fetching doctor",
      error,
    });
  }
};

const doctorAppointmentCtrl = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({ doctorId: doctor._id });
    res.status(200).send({
      success: true,
      message: "appintments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in fetching doctor appointments",
      error,
    });
  }
};

const updateStatusCtrl = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });
    user.notification.push({
      type: "status-updated",
      message: `your appointmment has been updated ${status}`,
      onClickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      succes: true,
      message: "status updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in updating status",
      error,
    });
  }
};

module.exports = {
  getDoctorInfoCtrl,
  updateProfileCtrl,
  getDoctorByIdCtrl,
  doctorAppointmentCtrl,
  updateStatusCtrl,
};
