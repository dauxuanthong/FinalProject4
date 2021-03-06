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
          buyItNow: req.body.buyItNow,
          auctionDatetime: req.body.auctionDatetime,
          updateAt: new Date(),
          auctionRooms: {
            create: {
              currentPrice: req.body.firstPrice,
              members: [userId],
            },
          },
        },
        // include: { user: true },
      });
      return res.json({ successMessage: "Post successfully" });
    } catch (error) {
      return next(error);
    }
  };

  getMyPost = async (req, res, next) => {
    const userId = req.session.userId;
    try {
      //get normal post
      const myNormalPost = await prisma.post.findMany({
        where: { userId: userId },
        select: {
          id: true,
          productName: true,
          createAt: true,
          imageUrl: true,
        },
      });

      const myNormalPostArr = [];
      myNormalPost.map((item) => {
        myNormalPostArr.push({
          postId: item.id,
          productName: item.productName,
          postType: "Post",
          status: "Active",
          imageUrl: item.imageUrl[0],
          uploadAt: item.createAt,
        });
      });

      //get auction post
      const myAuctionPost = await prisma.auctionPost.findMany({
        where: { userId: userId },
        select: {
          id: true,
          productName: true,
          createAt: true,
          auctionDatetime: true,
          imageUrl: true,
        },
      });

      const myAuctionPostArr = [];
      myAuctionPost.map((item) => {
        myAuctionPostArr.push({
          postId: item.id,
          productName: item.productName,
          postType: "Auction post",
          imageUrl: item.imageUrl[0],
          status: item.auctionDatetime > Date.now() ? "Active" : "Expired",
          uploadAt: item.createAt,
        });
      });

      //Sum all post
      let allPost = myNormalPostArr.concat(myAuctionPostArr);
      const allMyPost = allPost.sort((a, b) => {
        return new Date(b.uploadAt) - new Date(a.uploadAt);
      });

      //Statistic
      const sumPost = allMyPost.length;
      const expiredPost = allMyPost.filter((item) => {
        return item.status === "Expired";
      }).length;
      const statistic = {
        posts: sumPost,
        expired: expiredPost,
      };
      return res.json({ allMyPost, statistic });
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      //get file
      let files = [];
      const fileList = await prisma.post.findUnique({
        where: { id: req.body.postId },
        select: { imageUrl: true },
      });
      files = fileList.imageUrl;
      //delete file
      files.map((item) => {
        const fileName = __basedir + "/public" + item.slice(baseUrl.length);
        fs.unlinkSync(fileName);
      });
      //delete post
      await prisma.post.delete({
        where: { id: req.body.postId },
      });
      return res.json({ message: "OK" });
    } catch (error) {
      res.json({ message: "ERROR" });
      return next(error);
    }
  };

  getAllPost = async (req, res, next) => {
    try {
      //Normal post
      const allNormalPost = await prisma.post.findMany({
        take: 10,
        select: {
          id: true,
          productName: true,
          price: true,
          imageUrl: true,
        },
        orderBy: { createAt: "desc" },
      });
      //Auction post
      const allAuctionPost = await prisma.auctionPost.findMany({
        take: 10,
        select: {
          id: true,
          productName: true,
          firstPrice: true,
          auctionDatetime: true,
          imageUrl: true,
          auctionRooms: true,
        },
        orderBy: { createAt: "desc" },
      });
      return res.json({ allNormalPost, allAuctionPost });
    } catch (error) {
      return next(error);
    }
  };
  normalPostDetail = async (req, res, next) => {
    try {
      const normalPostDetail = await prisma.post.findUnique({
        where: { id: parseInt(req.params.postId) },
      });
      //get Type
      const typeArr = await prisma.productType.findMany();
      const typeDetail = normalPostDetail.typeId.reduce((array, item) => {
        const type = typeArr.find((filItem) => item == filItem.id);
        array.push(type.type);
        return array;
      }, []);
      const normalPostDetailDestructuring = {
        id: normalPostDetail.id,
        productName: normalPostDetail.productName,
        quantity: normalPostDetail.quantity,
        price: normalPostDetail.price,
        type: typeDetail,
        description: normalPostDetail.description,
        imageUrl: normalPostDetail.imageUrl,
      };
      return res.json(normalPostDetailDestructuring);
    } catch (error) {
      return next(error);
    }
  };

  auctionPostDetail = async (req, res, next) => {
    try {
      const auctionPostDetail = await prisma.auctionPost.findUnique({
        where: { id: parseInt(req.params.postId) },
        include: { auctionRooms: true },
      });
      const typeArr = await prisma.productType.findMany();
      //Type detail
      const typeDetail = auctionPostDetail.typeId.reduce((array, item) => {
        const type = typeArr.find((filItem) => item == filItem.id);
        array.push(type.type);
        return array;
      }, []);
      const auctionDetailDestructuring = {
        id: auctionPostDetail.id,
        imageList: auctionPostDetail.imageUrl,
        productName: auctionPostDetail.productName,
        type: typeDetail,
        quantity: auctionPostDetail.quantity,
        description: auctionPostDetail.description,
        firstPrice: auctionPostDetail.firstPrice,
        stepPrice: auctionPostDetail.stepPrice,
        buyItNow: auctionPostDetail.buyItNow,
        endAt: auctionPostDetail.auctionDatetime,
        auctionRoomsId: auctionPostDetail.auctionRooms.id,
      };
      return res.json(auctionDetailDestructuring);
    } catch (error) {
      return next(error);
    }
  };

  auctionRoomPostDetail = async (req, res, next) => {
    try {
      const auctionRoomPostDetail = await prisma.auctionRooms.findUnique({
        where: { id: parseInt(req.params.roomId) },
        include: { auctionPost: true },
      });
      const typeArr = await prisma.productType.findMany();
      //Type detail
      const typeDetail = auctionRoomPostDetail.auctionPost.typeId.reduce((array, item) => {
        const type = typeArr.find((filItem) => item == filItem.id);
        array.push(type.type);
        return array;
      }, []);
      const auctionDetailDestructuring = {
        postId: auctionRoomPostDetail.auctionPost.id,
        imageList: auctionRoomPostDetail.auctionPost.imageUrl,
        productName: auctionRoomPostDetail.auctionPost.productName,
        type: typeDetail,
        quantity: auctionRoomPostDetail.auctionPost.quantity,
        description: auctionRoomPostDetail.auctionPost.description,
      };
      return res.json(auctionDetailDestructuring);
    } catch (error) {
      return next(error);
    }
  };

  manageMyPost = async (req, res, next) => {
    const userId = req.session.userId;
    try {
      //get list of post
      const listOfPost = await prisma.post.findMany({
        where: { userId: userId },
      });
      const numOfPost = listOfPost.length;
      //get list of auction post
      const listOfAuctionPost = await prisma.auctionPost.findMany({
        where: { userId: userId },
        include: { auctionRooms: true },
      });
      //get recent auction
      const recentAuction = await prisma.auctionPost.findMany({
        where: { auctionRooms: { members: { hasEvery: [userId] } } },
        include: { auctionRooms: true },
      });
      const numOfAuctionPost = listOfAuctionPost.length;
      const numOfExpireAuctionPost = listOfAuctionPost.reduce((num, item) => {
        if (item.auctionDatetime < Date.now()) {
          num += 1;
          return num;
        }
        return num;
      }, 0);
      const numOfRecentAuction = recentAuction.length;
      const dataDestructuring = {
        postList: listOfPost,
        auctionPostList: listOfAuctionPost,
        postNum: numOfPost,
        recentAuctionNum: numOfRecentAuction,
        auctionPostNum: numOfAuctionPost,
        expired: numOfExpireAuctionPost,
        recentAuction: recentAuction,
      };
      return res.json(dataDestructuring);
    } catch (error) {
      res.json({ message: "ERROR" });
      return next(error);
    }
  };

  normalPostDetailEdit = async (req, res, next) => {
    try {
      const normalPostDetail = await prisma.post.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      return res.json(normalPostDetail);
    } catch (error) {
      return next(error);
    }
  };

  edit = async (req, res, next) => {
    try {
      const postUpdate = await prisma.post.update({
        where: { id: req.body.postId },
        data: {
          quantity: req.body.quantity,
          price: req.body.price,
        },
      });
      return res.json(postUpdate);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new PostController();
