const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    phone: {
      type: String,
      required: [true, "phone no is required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    specialization: {
      type: String,
      required: [true, "specialization is required"],
    },
    experience: {
      type: String,
      required: [true, "experience is reqired"],
    },
    status: {
      type: String,
      default: "pandings",
    },
    feePerCunsaltation: {
      type: String,
      required: [true, "it is required"],
    },
    timing: {
      type: Object,
      required: [true, "timing  is required"],
    },
  },
  { timestams: true }
);

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;
