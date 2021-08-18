const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");
const authenticationController = require("../Controllers/AuthenticateController")

// /user/register
router.post("/register", userController.register);

// /user/login
router.post("/login", userController.login);

// /user/refreshTk
router.get("/refreshTk", authenticationController.refreshToken);

// /user/google
router.post("/google", userController.googleLogin);

// /user/navInfo
router.get("/navInfo",authenticationController.identifyUser, userController.navInfo);

// /user/logout
router.post("/logout",authenticationController.identifyUser, userController.logout);

// /user/changeAccount
router.patch("/changeAccount", authenticationController.identifyUser,userController.changeAccount);

// /user/uploadAvatar
router.patch("/uploadAvatar", authenticationController.identifyUser, userController.uploadAvatar);

// /user/updateInfo
router.patch("/updateInfo", authenticationController.identifyUser, userController.updateInfo);

// /user/allInfo
router.get("/allInfo", authenticationController.identifyUser, userController.allInfo);

module.exports = router;