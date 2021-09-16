const express = require("express");
const router = express.Router();
const postController = require("../Controllers/PostController");
const authenticationController = require("../Controllers/AuthenticateController");

//post/getType
router.get("/getType", authenticationController.identifyUser, postController.getType);

// /post/normalUploadImg
router.post(
  "/normalUploadImg",
  authenticationController.identifyUser,
  postController.normalUploadImg
);

// /post/normalUploadInfo
router.post(
  "/normalUploadInfo",
  authenticationController.identifyUser,
  postController.normalUploadInfo
);

// /post/auctionUploadInfo
router.post(
  "/auctionUploadInfo",
  authenticationController.identifyUser,
  postController.auctionUploadInfo
);

// /post/myPost
router.get("/myPost", authenticationController.identifyUser, postController.getMyPost);

// /post/delete
router.delete("/delete", authenticationController.identifyUser, postController.delete);
module.exports = router;
