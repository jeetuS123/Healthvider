const mongoose = require("mongoose");
const colors = require("colors");
const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.log(`error in mongodb ${error}`.bgRed.white);
  }
};

module.exports = ConnectDB;
