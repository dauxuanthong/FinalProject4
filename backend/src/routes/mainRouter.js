const user = require("./user");
const post = require("./post");
const conversation = require("./conversation");
const auctionRoom = require("./auctionRoom");

function router(app) {
  // /user
  app.use("/user", user);

  // /post
  app.use("/post", post);

  // /conversation
  app.use("/conversation", conversation);

  // /auctionRoom
  app.use("/auctionRoom", auctionRoom);
}
module.exports = router;
