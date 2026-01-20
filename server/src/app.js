//Configuration
const express = require("express");
const cors = require("cors");
const authRoutes = require("../src/features/auth/authApi");
const userRoutes = require("../src/features/user/userApi");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);

module.exports = app;