require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/cloud-platform")
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log(err));

const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/request");

app.use("/api/auth", authRoutes);
app.use("/api/request", requestRoutes);

app.listen(3000, "0.0.0.0", () => {
  console.log("Backend running on port 3000 🚀");
});
