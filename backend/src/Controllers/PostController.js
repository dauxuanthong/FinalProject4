const baseUrl = "http://localhost:3001/";
const { v4: uuidv4 } = require("uuid");
const prisma = require("../database/prisma/prisma");
const multer = require("multer");
const fs = require("fs");
const util = require("util");
class PostController {
  getType = async (req, res) => {
    try {
      const type = await prisma.productType.findMany();
      return res.json(type);
    } catch (error) {
      console.log(error);
    }
  };

  normalUploadImg = async (req, res) => {
    const userId = req.session.userId;
    try {
      console.log("pass 1");
      const dir = __basedir + `/public/${userId}`;
      //Check folder is existed and create
      !fs.existsSync(dir) && fs.mkdirSync(dir);
      //set up diskStorage
      let fileName = [];
      let storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const unitKey = uuidv4();
          const fileType = file.mimetype;
          const fileTail = fileType.split("/")[fileType.split("/").length - 1];
          fileName.push(unitKey + "." + fileTail);
          cb(null, unitKey + "." + fileTail);
        },
      });
      // upload file
      let uploadFile = multer({
        storage: storage,
      }).array("listFile");
      let uploadFileMiddleware = util.promisify(uploadFile);
      await uploadFileMiddleware(req, res);
      // res file url
      let fileUrl = [];
      fileName.map((item) => {
        fileUrl.push(baseUrl + `/${userId}/` + item);
      });
      return res.json(fileUrl);
    } catch (error) {
      console.log(error);
    }
  };

  normalUploadInfo = async (req, res) => {
    const userId = req.session.userId;
    // uploadInfo
    try {
      await prisma.post.create({
        data: {
          userId: userId,
          productName: req.body.productName,
          typeId: req.body.productType,
          typeDetail: req.body.typeDetail,
          quantity: req.body.productQuantity,
          price: req.body.productPrice,
          imageUrl: req.body.imgListFile,
          description: req.body.description,
        },
      });
      return res.json({ successMessage: "Post successfully" });
    } catch (error) {
      console.log(error);
    }
  };

  auctionUploadInfo = async (req, res, next) => {
    const userId = req.session.userId;
    // uploadInfo
    try {
      await prisma.auctionPost.create({
        data: {
          userId: userId,
          productName: req.body.productName,
          typeId: req.body.productType,
          typeDetail: req.body.typeDetail,
          quantity: req.body.productQuantity,
          firstPrice: req.body.firstPrice,
          imageUrl: req.body.imgListFile,
          description: req.body.description,
          stepPrice: req.body.stepPrice,
          auctionDatetime: req.body.auctionDatetime,
        },
      });
      return res.json({ successMessage: "Post successfully" });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new PostController();
