const user = require("./user");
// const auth = require("./auth");
// const post = require("./post");
// const messenger = require("./messenger");

function router(app) {
  // /user
  app.use('/user', user)
}
module.exports = router;
