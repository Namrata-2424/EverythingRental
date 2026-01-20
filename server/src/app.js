//Configuration
const express = require("express");
const cors = require("cors");
const authRoutes = require("./features/auth/authApi");
const lendToolsApi = require("./features/lendTools/lendToolsApi");
const authenticateToken = require(
  "./shared/middleware/authenticateToken"
);
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use("/api/lender",authenticateToken, lendToolsApi);

module.exports = app;