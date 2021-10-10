const prisma = require("../database/prisma/prisma");
const baseUrl = "http://localhost:3001/";
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");
const util = require("util");

class ConversationController {
  contact = async (req, res, next) => {
    const currentUserId = req.session.userId;
    const postId = req.body.postId;
    const postType = req.body.postType;
    let postOwnerId = null;
    try {
      //Find postOwnerId
      if (postType === "Post") {
        const post = await prisma.post.findUnique({
          where: { id: postId },
          select: { userId: true },
        });
        postOwnerId = post.userId;
      } else {
        const post = await prisma.auctionPost.findUnique({
          where: { id: postId },
          select: { userId: true },
        });
        postOwnerId = post.userId;
      }
      //Check currentUserId === postOwnerId?
      if (currentUserId === postOwnerId) {
        return res.json({ message: "duplicated userId" });
      }
      //Check Conversation is existed
      const checkConversation = await prisma.conversations.findMany({
        where: { users: { hasEvery: [currentUserId, postOwnerId] } },
      });
      if (Object.keys(checkConversation).length === 0) {
        const conversation = await prisma.conversations.create({
          data: {
            users: [currentUserId, postOwnerId],
          },
        });
        return res.json({ conversationId: conversation.id });
      }
      return res.json({ conversationId: checkConversation[0].id });
    } catch (error) {
      return next(error);
    }
  };

  myConversationList = async (req, res, next) => {
    const currentUserId = req.session.userId;
    //get all conversations
    try {
      const getMyConversations = await prisma.conversations.findMany({
        where: {
          users: {
            has: currentUserId,
          },
        },
        include: {
          conversationDetails: {
            take: 1,
            orderBy: {
              createAt: "desc",
            },
          },
        },
      });

      return res.json({ conversationList: getMyConversations, currentUserId: currentUserId });
    } catch (error) {
      return next(error);
    }
  };

  getPartnerInfo = async (req, res, next) => {
    try {
      const partnerInfo = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          userName: true,
          avatar: true,
        },
      });
      return res.json(partnerInfo);
    } catch (error) {
      return next(error);
    }
  };

  getConversationDetail = async (req, res, next) => {
    const currentUserId = req.session.userId;
    try {
      const partner = await prisma.conversations.findUnique({
        where: { id: parseInt(req.params.conversationId) },
        select: {
          users: true,
        },
      });
      const partnerId = partner.users.filter((item) => item != currentUserId)[0];
      //get partner info
      const partnerInfo = await prisma.user.findUnique({
        where: { id: partnerId },
        select: {
          id: true,
          userName: true,
          avatar: true,
        },
      });
      //get conversation detail
      const conversationDetailData = await prisma.conversationDetails.findMany({
        where: { conversationId: parseInt(req.params.conversationId) },
        take: 20,
        orderBy: {
          createAt: "desc",
        },
      });
      const conversationDetail = conversationDetailData.sort((a, b) => {
        return conversationDetailData.length
          ? new Date(a.createAt) - new Date(b.createAt)
          : conversationDetailData;
      });

      return res.json({ partnerInfo, conversationDetail });
    } catch (error) {
      return next(error);
    }
  };

  sendMessage = async (req, res, next) => {
    try {
      const currentUserId = req.session.userId;
      const newMessage = await prisma.conversationDetails.create({
        data: {
          conversationId: parseInt(req.body.conversationId),
          senderId: currentUserId,
          type: "text",
          message: req.body.newMessage,
        },
      });
      return res.json(newMessage);
    } catch (error) {
      return next(error);
    }
  };

  sendImgMessage = async (req, res, next) => {
    const userId = req.session.userId;
    const conversationId = req.params.conversationId;
    try {
      const dir = __basedir + `/public/${conversationId}`;
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
      // upload file
      let uploadFile = multer({
        storage: storage,
      }).single("imageFile");
      let uploadFileMiddleware = util.promisify(uploadFile);
      await uploadFileMiddleware(req, res);
      // Create file url
      const fileUrl = baseUrl + `/${conversationId}/` + fileName;
      //storage image message
      const imageMessage = await prisma.conversationDetails.create({
        data: {
          conversationId: parseInt(conversationId),
          senderId: userId,
          type: "image",
          message: fileUrl,
        },
      });
      return res.json(imageMessage);
    } catch (error) {
      return next(error);
    }
  };

  getImageListMedia = async (req, res, next) => {
    const conversationId = parseInt(req.params.conversationId);
    try {
      const imageList = await prisma.conversationDetails.findMany({
        where: { AND: [{ conversationId: conversationId }, { type: "image" }] },
        select: {
          id: true,
          message: true,
        },
      });
      return res.json(imageList);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new ConversationController();
