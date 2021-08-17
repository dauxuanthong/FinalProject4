const prisma = require("../database/prisma/prisma");
const bcrypt = require("bcrypt");
const bcryptNum = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/../.env" });
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const multer = require("multer");
// const maxSize = 2 * 1024 * 1024;
const fs = require("fs");
const util = require("util");
const baseUrl = "http://localhost:3001/";
const { v4: uuidv4 } = require("uuid");
const { user } = require("../database/prisma/prisma");
const maxSize = 2 * 1024 * 1024;

class UserController {
  register = async (req, res) => {
    let errMessage = [];
    try {
      //check user name
      const checkUserName = await prisma.user.findUnique({
        where: { userName: req.body.userName },
      });
      checkUserName && errMessage.push("User name '" + req.body.userName + "' is already exists");
      //check email
      const checkUserEmail = await prisma.user.findUnique({
        where: { email: req.body.email },
      });
      checkUserEmail && errMessage.push("Email '" + req.body.email + "' is already exists");
      //return error
      if (checkUserName || checkUserEmail) {
        return res.json({ errMessage });
      } else {
        //return data
        const user = await prisma.user.create({
          data: {
            email: req.body.email,
            userName: req.body.userName,
            password: await bcrypt.hash(req.body.password, bcryptNum),
          },
        });
        return res.json(user);
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  };

  login = async (req, res) => {
    try {
      //Check usernames
      const user = await prisma.user.findUnique({
        where: { userName: req.body.userName },
      });
      if (!user)
        return res.json({ errMessage: "Username or Password is incorrect, Please try again" });
      //check password
      const checkPass = await bcrypt.compareSync(req.body.password, user.password);
      if (checkPass === false)
        return res.json({ errMessage: "Username or Password is incorrect, Please try again" });
      //Create JWT
      // ***access token
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, {
        expiresIn: "15m", //15 minutes
      });
      // ***refresh token
      const refreshToken = jwt.sign({ id: user.id }, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: "1d", //1 day
      });
      // save in database
      const userToken = await prisma.token.findFirst({
        where: { userId: user.id },
      });
      if (userToken) {
        await prisma.token.updateMany({
          where: { userId: user.id },
          data: { refreshToken: refreshToken },
        });
      } else {
        await prisma.token.create({
          data: {
            userId: user.id,
            refreshToken: refreshToken,
          },
        });
      }
      res.cookie("refreshToken", refreshToken, { signed: true });
      return res.json({ accessToken });
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  };

  googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
      });
      const { name, email } = ticket.getPayload();
      let user = await prisma.user.findFirst({
        where: {
          email: email,
          userName: name,
        },
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: email,
            userName: name,
            password: null,
          },
        });
      }
      //Create JWT
      // ***access token
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, {
        expiresIn: "15m", //15 minutes
      });
      // ***refresh token
      const refreshToken = jwt.sign({ id: user.id }, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: "1d", //1 day
      });
      // save in database
      const userToken = await prisma.token.findFirst({
        where: { userId: user.id },
      });
      if (userToken) {
        await prisma.token.updateMany({
          where: { userId: user.id },
          data: { refreshToken: refreshToken },
        });
      } else {
        await prisma.token.create({
          data: {
            userId: user.id,
            refreshToken: refreshToken,
          },
        });
      }
      res.cookie("refreshToken", refreshToken, { signed: true });
      return res.json({ accessToken });
    } catch (error) {
      console.log(error);
      return res.sendStatus(404);
    }
  };

  navInfo = async (req, res) => {
    const userId = req.session.userId;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return res.json({ userName: user.userName, avatar: user.avatar });
    } catch (error) {
      console.log(error);
      return res.sendStatus(404);
    }
  };

  logout = async (req, res) => {
    const userId = req.session.userId;
    // remove refresh token in db
    try {
      await prisma.token.updateMany({
        where: {
          userId: {
            equals: userId,
          },
        },
        data: { refreshToken: "" },
      });
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(404);
    }
  };

  changeAccount = async (req, res) => {
    const userId = req.session.userId;
    try {
      //find user
      const userPassword = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });
      //check old password
      console.log(userPassword);
      console.log(req.body.oldPassword);
      const checkPass = await bcrypt.compareSync(req.body.oldPassword, userPassword.password);
      if (checkPass === false)
        return res.json({ errMessage: "Old password is not correct. Please try again!" });
      //update new password
      await prisma.user.update({
        where: { id: userId },
        data: { password: await bcrypt.hash(req.body.newPassword, bcryptNum) },
      });
      return res.json({ successMessage: "Change password successfully!" });
    } catch (error) {
      console.log(error);
      return res.sendStatus(404);
    }
  };

  uploadAvatar = async (req, res) => {
    const userId = req.session.userId;
    try {
      const dir = __basedir + `/public/${userId}`;
      //Check folder is existed and create
      !fs.existsSync(dir) && fs.mkdirSync(dir);
      //set up diskStorage
      let fileName = "";
      let storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const unitKey = uuidv4();
          const fileType = file.mimetype;
          const fileTail = fileType.split("/")[fileType.split("/").length - 1];
          fileName = unitKey + "." + fileTail;
          cb(null, unitKey + "." + fileTail);
        },
      });
      // upload avatar
      let uploadFile = multer({
        storage: storage
      }).single("file");
      let uploadFileMiddleware = util.promisify(uploadFile);
      await uploadFileMiddleware(req, res);
      const avatarUrl = baseUrl + `/${userId}/` + fileName;
      //remove old avatar file
      const oldAvatar = await prisma.user.findUnique({
        where: { id: userId },
        select: {avatar: true},
      });
      if(oldAvatar.avatar){
        const oldAvatarUrl = __basedir + "/public/" + oldAvatar.avatar.slice(baseUrl.length,oldAvatar.avatar.length);
        fs.unlinkSync(oldAvatarUrl);
      }

      //Update new information data base
      await prisma.user.update({
        where: {id: userId},
        data: {
          avatar: avatarUrl,
        }
      });
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(404);
    }
  };

  updateInfo = async (req, res) => {
    const userId = req.session.userId;
    try {
      await prisma.user.update({
        where: {id: userId},
        data: {
          realName: req.body.realName,
          address: req.body.address,
          phoneNumber: req.body.phoneNumber,
        }
      });
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(404)
    }
  }
}

module.exports = new UserController();
