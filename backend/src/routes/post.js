const express = require("express");
const router = express.Router();
const userController = require("../Controllers/PostController");
const authenticationController = require("../Controllers/AuthenticateController");

// /post/normalUploadImg
router.post(
  "/normalUploadImg",
  authenticationController.identifyUser,
  userController.normalUploadImg
);

// /post/normalUploadInfo
router.post("/normalUploadInfo", authenticationController.identifyUser, userController.logout);

module.exports = router;
