//Configuration
const express = require("express");
const cors = require("cors");
const authRoutes = require("./features/auth/authApi");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);

module.exports = app;