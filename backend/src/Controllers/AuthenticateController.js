const jwt = require("jsonwebtoken");
const prisma = require("../database/prisma/prisma");
require("dotenv").config({ path: __dirname + "/../.env" });

class AuthenticateController {
  identifyUser = (req, res, next) => {
    //get accessToken (Bearer "token")
    const accessToken = req.header("Authorization");
    if(!accessToken) return res.sendStatus(403);
    //remove Bearer string
    const token = accessToken && accessToken.split(" ")[1];
    const decoded = jwt.decode(token);
    if(!decoded) return res.sendStatus(403);
    req.session.userId = decoded.id;
    return next();
  };

  refreshToken = async (req, res) => {
    try {
      const refreshTokenReq = req.signedCookies["refreshToken"];
      const decoded = jwt.decode(refreshTokenReq);
      if(!decoded) return res.sendStatus(403);
      //Create new JWT
      // ***access token
      const accessToken = jwt.sign({id: decoded.id}, process.env.ACCESS_TOKEN, {
        expiresIn: "15m", //15 minutes
      });
      // ***refresh token
      const refreshToken = jwt.sign({id: decoded.id}, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: "1d", //1 day
      });
      //Update refresh accessToken
      await prisma.token.updateMany({
        where: {userId: decoded.id},
        data: {refreshToken: refreshToken}
      });
      return res.cookie("refreshToken", refreshToken, { signed: true }).json({accessToken});
    } catch (error) {
      console.log(error)
      return res.sendStatus(404);
    }
  }
}

module.exports = new AuthenticateController();
