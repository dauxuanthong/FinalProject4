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

// /post/allPost
router.get("/allPost", postController.getAllPost);

// /post/delete
router.delete("/delete", authenticationController.identifyUser, postController.delete);
// /post/normalPostDetail/:postId
router.get(
  "/normalPostDetail/:postId",
  authenticationController.identifyUser,
  postController.normalPostDetail
);
// /post/auctionPostDetail/:postId
router.get(
  "/auctionPostDetail/:postId",
  authenticationController.identifyUser,
  postController.auctionPostDetail
);

// /post/auctionRoomPostDetail/:postId
router.get(
  "/auctionRoomPostDetail/:roomId",
  authenticationController.identifyUser,
  postController.auctionRoomPostDetail
);

// /post/manageMyPost
router.get("/manageMyPost", authenticationController.identifyUser, postController.manageMyPost);

// /post/normalPostDetailEdit/:id
router.get(
  "/normalPostDetailEdit/:id",
  authenticationController.identifyUser,
  postController.normalPostDetailEdit
);
// /post/edit
router.patch("/edit", authenticationController.identifyUser, postController.edit);

module.exports = router;
