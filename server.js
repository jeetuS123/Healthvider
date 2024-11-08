const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const ConnectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes.js");
const path = require("path");

dotenv.config();
ConnectDB();

const app = express();

app.use(express.json());
app.use(morgan("env"));

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
