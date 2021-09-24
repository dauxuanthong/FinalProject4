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

//conversation/getConversationDetail/:conversationId`
router.get(
  "/getConversationDetail/:conversationId",
  authenticationController.identifyUser,
  conversationController.getConversationDetail
);

module.exports = router;
