const express = require("express");
const router = express.Router();
const userController = require("./userController");

router.get('/me',
    userController.getLoggedInUserInfo);

router.delete('/me',
    userController.deleteMe);

router.patch('/me',
    userController.updateMyPersonalInfo);

router.patch('/me/address/:addressId',
    userController.updateMyAddress);

module.exports = router;