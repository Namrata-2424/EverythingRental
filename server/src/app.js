//Configuration
const express = require("express");
const cors = require("cors");
const authApi = require("./features/auth/authApi"); 
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authApi);
module.exports = app;