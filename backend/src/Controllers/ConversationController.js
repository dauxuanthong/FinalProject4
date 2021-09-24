const prisma = require("../database/prisma/prisma");

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
      // Data restructuring
      getMyConversations.reduce(async (array, item) => {
        //get partner ID
        const partnerId = item.users.filter((item) => item != currentUserId)[0];
        await prisma.user
          .findUnique({
            where: { id: partnerId },
            select: {
              userName: true,
              avatar: true,
            },
          })
          .then((data) => {
            array.push({
              conversationId: item.id,
              partnerName: data.userName,
              partnerAvatar: data.avatar,
              sender:
                item.conversationDetails.length > 0
                  ? item.conversationDetails[0].senderId == currentUserId
                    ? "you"
                    : null
                  : null,
              lastMessage:
                item.conversationDetails.length > 0 ? item.conversationDetails[0].message : null,
              sendAt:
                item.conversationDetails.length > 0 ? item.conversationDetails[0].createAt : null,
            });
            if (getMyConversations.length === array.length) {
              return res.json(array);
            }
          })
          .catch((error) => {
            return next(error);
          });
      }, []);
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
        return new Date(a.createAt) - new Date(b.createAt);
      });

      return res.json({ partnerInfo, conversationDetail });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new ConversationController();
