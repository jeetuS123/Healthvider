const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const ConnectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes.js");

dotenv.config();
ConnectDB();

const app = express();

app.use(express.json());
app.use(morgan("env"));

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
