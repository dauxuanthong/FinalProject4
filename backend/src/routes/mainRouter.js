const user = require("./user");
const post = require("./post");
const conversation = require("./conversation");
const auctionRoom = require("./auctionRoom");
const search = require("./search");

function router(app) {
  // /user
  app.use("/user", user);

  // /post
  app.use("/post", post);

  // /conversation
  app.use("/conversation", conversation);

  // /auctionRoom
  app.use("/auctionRoom", auctionRoom);

  // /search
  app.use("/search", search);
}
module.exports = router;
