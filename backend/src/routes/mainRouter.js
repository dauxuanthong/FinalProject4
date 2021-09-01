const user = require("./user");
const post = require("./post");
// const auth = require("./auth");
// const post = require("./post");
// const messenger = require("./messenger");

function router(app) {
  // /user
  app.use("/user", user);

  // /post
  app.use("/post", post);
}
module.exports = router;
