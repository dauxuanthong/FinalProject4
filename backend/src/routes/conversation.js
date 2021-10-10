const express = require("express");
const router = express.Router();
const conversationController = require("../Controllers/ConversationController");
const authenticationController = require("../Controllers/AuthenticateController");

//conversation/contact
router.post("/contact", authenticationController.identifyUser, conversationController.contact);

//conversation/myConversationList
router.get(
  "/myConversationList",
  authenticationController.identifyUser,
  conversationController.myConversationList
);
///conversation/partnerInfo/:id
router.get(
  "/partnerInfo/:id",
  authenticationController.identifyUser,
  conversationController.getPartnerInfo
);

//conversation/getConversationDetail/:conversationId`
router.get(
  "/getConversationDetail/:conversationId",
  authenticationController.identifyUser,
  conversationController.getConversationDetail
);
//conversation/sendMessage
router.post(
  "/sendMessage",
  authenticationController.identifyUser,
  conversationController.sendMessage
);
// /conversation/sendImgMessage/:conversationId
router.post(
  "/sendImgMessage/:conversationId",
  authenticationController.identifyUser,
  conversationController.sendImgMessage
);
// /conversation/getImageListMedia/:conversationId
router.get(
  "/getImageListMedia/:conversationId",
  authenticationController.identifyUser,
  conversationController.getImageListMedia
);
module.exports = router;
