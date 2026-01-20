const express = require("express");
const router = express.Router();
const authenticate = require("../../shared/middleware/authenticateToken")
const userController = require("./userController");

router.get('/me',
    authenticate,
    userController.getLoggedInUserInfo);

router.delete('/me',
    authenticate,
    userController.deleteMe);

router.patch('/me',
    authenticate,
    userController.updateMyPersonalInfo);

router.patch('/me/address/:addressId',
    authenticate,
    userController.updateMyAddress);

module.exports = router;