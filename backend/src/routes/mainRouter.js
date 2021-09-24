const user = require("./user");
const post = require("./post");
const conversation = require("./conversation");

function router(app) {
  // /user
  app.use("/user", user);

  // /post
  app.use("/post", post);

  // /conversation
  app.use("/conversation", conversation);
}
module.exports = router;
