const express = require("express");
const router = express.Router();
const auctionRoomController = require("../Controllers/AuctionRoomController");
const authenticationController = require("../Controllers/AuthenticateController");

// /auctionRoom/join
router.post("/join", authenticationController.identifyUser, auctionRoomController.joinRoom);
// /auctionRoom/functionData/:roomId
router.get(
  "/functionData/:roomId",
  authenticationController.identifyUser,
  auctionRoomController.functionData
);
// /auctionRoom/bid
router.post("/bid", authenticationController.identifyUser, auctionRoomController.bid);
// /auctionRoom/upPrice
router.post("/upPrice", authenticationController.identifyUser, auctionRoomController.upPrice);
// /auctionRoom/history/:roomId
router.get(
  "/history/:roomId",
  authenticationController.identifyUser,
  auctionRoomController.history
);
// /auctionRoom/autoBid
router.post(
  "/applyAutoBid",
  authenticationController.identifyUser,
  auctionRoomController.applyAutoBid
);

module.exports = router;
