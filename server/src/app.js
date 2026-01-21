//Configuration
const express = require("express");
const cors = require("cors");
const authRoutes = require("./features/auth/authApi");
const lendToolsApi = require("./features/lendTools/lendToolsApi");
const authenticateToken = require(
  "./shared/middleware/authenticateToken"
);
const borrowToolRoutes = require("./features/borrowTools/borrowToolsApi");
const toolBorrowerRoutes = require("./features/toolBorrower/toolBorrowerApi");

const lenderBorrowsApi = require("./features/lenderBorrows/lenderBorrowsApi");
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use("/api/lender",authenticateToken, lendToolsApi);
app.use('/api/tools',borrowToolRoutes);
app.use('/api/borrows',authenticateToken, toolBorrowerRoutes);
app.use("/api/lender", authenticateToken, lenderBorrowsApi);

module.exports = app;