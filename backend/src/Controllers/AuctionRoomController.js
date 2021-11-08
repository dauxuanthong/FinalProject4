const prisma = require("../database/prisma/prisma");

class AuctionRoomController {
  joinRoom = async (req, res, next) => {
    const userId = req.session.userId;
    try {
      //get room
      const auctionRoom = await prisma.auctionRooms.findUnique({
        where: { id: req.body.roomId },
      });
      //Check member
      if (auctionRoom.members.some((item) => item === userId)) {
        return res.json({ message: "OK" });
      }
      //add new member
      await prisma.auctionRooms.update({
        where: { id: req.body.roomId },
        data: {
          members: [...auctionRoom.members, userId],
        },
      });
      return res.json({ message: "OK" });
    } catch (error) {
      res.json({ message: "ERROR" });
      return next(error);
    }
  };

  functionData = async (req, res, next) => {
    try {
      const data = await prisma.auctionRooms.findUnique({
        where: { id: parseInt(req.params.roomId) },
        include: { auctionPost: true },
      });
      const dataDestructuring = {
        currentValue: data.currentPrice,
        endAt: data.auctionPost.auctionDatetime,
      };
      return res.json(dataDestructuring);
    } catch (error) {
      return next(error);
    }
  };

  bid = async (req, res, next) => {
    const userId = req.session.userId;
    try {
      //getRoom
      const room = await prisma.auctionRooms.findUnique({
        where: { id: parseInt(req.body.roomId) },
        include: { auctionPost: true },
      });
      //check last bidder
      const lastHistory = await prisma.auctionRoomHistory.findMany({
        where: {
          auctionRoomId: room.id,
          bidAmount: room.currentPrice,
        },
      });
      const lastBidder = lastHistory[0]?.bidder;
      if (lastBidder === userId) {
        return res.json({ message: "DuplicateOwner" });
      }
      //upPrice
      const upPrice = Number(room.currentPrice) + Number(room.auctionPost.stepPrice);
      //create new history
      const newHistory = await prisma.auctionRoomHistory.create({
        data: {
          auctionRoomId: room.id,
          bidAmount: upPrice.toString(),
          bidder: userId,
        },
      });
      //AUTO BID
      //get highest price
      const AutoBidList = await prisma.autoBid.findMany({
        where: { auctionRoomId: req.body.roomId },
        orderBy: {
          highestPrice: "desc",
        },
      });
      const highestValueList = AutoBidList.filter(
        (item) => item.highestPrice === AutoBidList[0].highestPrice
      );
      const highestValue = highestValueList.sort((a, b) => {
        return highestValueList.length > 1
          ? new Date(b.createAt) - new Date(a.createAt)
          : highestValueList;
      })[0];
      // active autoBid
      if (highestValue.highestPrice >= upPrice + Number(room.auctionPost.stepPrice)) {
        const autoBidHistory = await prisma.auctionRoomHistory.create({
          data: {
            auctionRoomId: room.id,
            bidAmount: (upPrice + Number(room.auctionPost.stepPrice)).toString(),
            bidder: highestValue.bidder,
          },
        });
        //update value current room
        const roomUpdate = await prisma.auctionRooms.update({
          where: { id: req.body.roomId },
          data: {
            currentPrice: (upPrice + Number(room.auctionPost.stepPrice)).toString(),
          },
        });
        const newHistoryArr = [autoBidHistory, newHistory];
        const historyDestructuring = await newHistoryArr.reduce(async (previousPromise, item) => {
          let arr = await previousPromise;
          const user = await prisma.user.findUnique({
            where: { id: item.bidder },
          });
          arr.push({
            id: item.id,
            bidder: user.userName,
            bidAmount: item.bidAmount,
            bidTime: item.bidTime,
          });
          return arr;
        }, Promise.resolve([]));
        return res.json({ data: historyDestructuring });
      }
      //updateCurrentPrice
      const roomUpdate = await prisma.auctionRooms.update({
        where: { id: req.body.roomId },
        data: {
          currentPrice: upPrice.toString(),
        },
      });
      const bidderName = await prisma.user.findUnique({
        where: { id: newHistory.bidder },
        select: { userName: true },
      });
      const newHistoryDestructuring = [
        {
          ...newHistory,
          bidder: bidderName.userName,
        },
      ];
      return res.json({ data: newHistoryDestructuring });
    } catch (error) {
      res.json({ message: "ERROR" });
      return next(error);
    }
  };

  upPrice = async (req, res, next) => {
    const userId = req.session.userId;
    try {
      //getRoom
      const room = await prisma.auctionRooms.findUnique({
        where: { id: parseInt(req.body.roomId) },
        include: { auctionPost: true },
      });
      //check last bidder
      const lastHistory = await prisma.auctionRoomHistory.findMany({
        where: {
          auctionRoomId: room.id,
          bidAmount: room.currentPrice,
        },
      });
      const lastBidder = lastHistory[0]?.bidder;
      if (lastBidder === userId) {
        return res.json({ message: "DuplicateOwner" });
      }
      //upPrice
      const upPrice = Number(room.currentPrice) + Number(room.auctionPost.stepPrice);
      if (Number(req.body.bidAmount) < upPrice) {
        return res.json({ message: "UpPriceInvalid" });
      }
      //create new history
      const newHistory = await prisma.auctionRoomHistory.create({
        data: {
          auctionRoomId: room.id,
          bidAmount: req.body.bidAmount,
          bidder: userId,
        },
      });
      //AUTO BID
      //get highest price
      const AutoBidList = await prisma.autoBid.findMany({
        where: { auctionRoomId: req.body.roomId },
        orderBy: {
          highestPrice: "desc",
        },
      });
      const highestValueList = AutoBidList.filter(
        (item) => item.highestPrice === AutoBidList[0].highestPrice
      );
      const highestValue = highestValueList.sort((a, b) => {
        return highestValueList.length > 1
          ? new Date(b.createAt) - new Date(a.createAt)
          : highestValueList;
      })[0];
      // active autoBid
      if (
        highestValue.highestPrice >=
        Number(req.body.bidAmount) + Number(room.auctionPost.stepPrice)
      ) {
        const autoBidHistory = await prisma.auctionRoomHistory.create({
          data: {
            auctionRoomId: room.id,
            bidAmount: (Number(req.body.bidAmount) + Number(room.auctionPost.stepPrice)).toString(),
            bidder: highestValue.bidder,
          },
        });
        //update value current room
        const roomUpdate = await prisma.auctionRooms.update({
          where: { id: req.body.roomId },
          data: {
            currentPrice: (
              Number(req.body.bidAmount) + Number(room.auctionPost.stepPrice)
            ).toString(),
          },
        });
        const newHistoryArr = [autoBidHistory, newHistory];
        const historyDestructuring = await newHistoryArr.reduce(async (previousPromise, item) => {
          let arr = await previousPromise;
          const user = await prisma.user.findUnique({
            where: { id: item.bidder },
          });
          arr.push({
            id: item.id,
            bidder: user.userName,
            bidAmount: item.bidAmount,
            bidTime: item.bidTime,
          });
          return arr;
        }, Promise.resolve([]));
        return res.json({ data: historyDestructuring });
      }
      //updateCurrentPrice
      await prisma.auctionRooms.update({
        where: { id: req.body.roomId },
        data: {
          currentPrice: req.body.bidAmount,
        },
      });
      const bidderName = await prisma.user.findUnique({
        where: { id: newHistory.bidder },
        select: { userName: true },
      });
      const newHistoryDestructuring = {
        ...newHistory,
        bidder: bidderName.userName,
      };
      return res.json({ data: newHistoryDestructuring });
    } catch (error) {
      res.json({ message: "ERROR" });
      return next(error);
    }
  };

  history = async (req, res, next) => {
    const roomId = Number(req.params.roomId);
    try {
      // get history (5 item)
      const historyList = await prisma.auctionRoomHistory.findMany({
        where: { auctionRoomId: roomId },
        take: 5,
        orderBy: {
          bidTime: "desc",
        },
      });
      const historyDestructuring = await historyList.reduce(async (previousPromise, item) => {
        let arr = await previousPromise;
        const user = await prisma.user.findUnique({
          where: { id: item.bidder },
        });
        arr.push({
          id: item.id,
          bidder: user.userName,
          bidAmount: item.bidAmount,
          bidTime: item.bidTime,
        });
        return arr;
      }, Promise.resolve([]));
      return res.json(historyDestructuring);
    } catch (error) {
      res.json({ message: "ERROR" });
      return next(error);
    }
  };

  applyAutoBid = async (req, res, next) => {
    const userId = req.session.userId;
    try {
      //getRoom
      const room = await prisma.auctionRooms.findUnique({
        where: { id: req.body.roomId },
        include: { auctionPost: true },
      });
      //check
      const upPrice = Number(room.auctionPost.stepPrice) + Number(req.body.currentValue);
      if (Number(req.body.highestPrice) < upPrice) {
        return res.json({ message: "UpPriceInvalid" });
      }
      // find autoBid
      const currentAutoBid = await prisma.autoBid.findMany({
        where: { auctionRoomId: parseInt(req.body.roomId), bidder: userId },
      });
      if (currentAutoBid.length === 0) {
        //create new autoBid
        const newAutoBid = await prisma.autoBid.create({
          data: {
            auctionRoomId: parseInt(req.body.roomId),
            bidder: userId,
            highestPrice: parseInt(req.body.highestPrice),
          },
        });
        return res.json(newAutoBid);
      } else {
        const updateAutoBid = await prisma.autoBid.update({
          where: { id: currentAutoBid[0].id },
          data: {
            highestPrice: parseInt(req.body.highestPrice),
          },
        });
        return res.json(updateAutoBid);
      }
    } catch (error) {
      res.json({ message: "ERROR" });
      return next(error);
    }
  };

  // autoBid = async (req, res, next) => {
  //   const userId = req.session.userId;
  //   try {
  //     //getRoom
  //     const room = await prisma.auctionRooms.findUnique({
  //       where: { id: req.body.roomId },
  //       include: { auctionPost: true },
  //     });
  //     //check
  //     const upPrice = Number(room.auctionPost.stepPrice) + Number(req.body.currentValue);
  //     if (Number(req.body.highestPrice) < upPrice) {
  //       return res.json({ message: "UpPriceInvalid" });
  //     }
  //     //APPLY auto bid
  //     //get best highest
  //     const AutoBidList = await prisma.autoBid.findMany({
  //       where: { auctionRoomId: req.body.roomId },
  //       orderBy: {
  //         highestPrice: "desc",
  //       },
  //     });
  //     // Check First auto bid
  //     if (AutoBidList.length === 0) {
  //       //add auto bid
  //       const currentAutoBidOwner = await prisma.autoBid.upsert({
  //         where: { bidder: userId },
  //         update: { highestPrice: req.body.highestPrice },
  //         create: {
  //           auctionRoomId: req.body.roomId,
  //           bidder: userId,
  //           highestPrice: req.body.highestPrice,
  //         },
  //       });
  //       //update current price
  //       await prisma.auctionRooms.update({
  //         where: { id: req.body.roomId },
  //         data: {
  //           currentPrice: upPrice.toString(),
  //         },
  //       });
  //       //add new history
  //       const newHistory = await prisma.auctionRoomHistory.create({
  //         data: {
  //           auctionRoomId: req.body.roomId,
  //           bidAmount: upPrice.toString(),
  //           bidder: userId,
  //         },
  //       });
  //       //get current name
  //       const bidderName = await prisma.user.findUnique({
  //         where: { id: userId },
  //         select: { userName: true },
  //       });
  //       //destructuring
  //       const newHistoryDestructuring = {
  //         ...newHistory,
  //         bidder: bidderName.userName,
  //         highestPrice: req.body.highestPrice,
  //       };
  //       return res.json(newHistoryDestructuring);
  //     } else {
  //       //get best owner
  //       const highestAutoBidList = AutoBidList.filter((item) => {
  //         item.bidAmount === AutoBidList[0].bidAmount;
  //       });
  //       // check duplicated highest value
  //       const highestOwner = highestAutoBidList.sort((a, b) => {
  //         return highestAutoBidList.length
  //           ? new Date(a.createAt) - new Date(b.createAt)
  //           : conversationDetailData;
  //       })[0];
  //       //add auto bid
  //       const currentAutoBidOwner = await prisma.autoBid.upsert({
  //         where: { auctionRoomId: req.body.roomId, bidder: userId },
  //         update: { highestPrice: req.body.highestPrice },
  //         create: {
  //           auctionRoomId: req.body.roomId,
  //           bidder: userId,
  //           highestPrice: req.body.highestPrice,
  //         },
  //       });

  //       const myPromise = new Promise((resolve, reject) => {
  //         resolve();
  //       });
  //       await myPromise
  //         .then(async () => {
  //           // do-while
  //           let currentPrice = Number(room.currentPrice);
  //           let currentOwner = highestOwner.bidder;
  //           const limitPrice =
  //             currentAutoBidOwner.highestPrice > highestOwner.highestPrice
  //               ? highestOwner.highestPrice
  //               : currentAutoBidOwner.highestPrice;
  //           const stepPrice = Number(room.auctionPost.stepPrice);
  //           do {
  //             if (currentOwner === highestOwner.bidder) {
  //               if (currentAutoBidOwner.highestPrice >= currentPrice + stepPrice) {
  //                 currentPrice = currentPrice + stepPrice;
  //                 currentOwner = currentAutoBidOwner.bidder;
  //                 //add history
  //                 await prisma.auctionRoomHistory.create({
  //                   data: {
  //                     auctionRoomId: req.body.roomId,
  //                     bidAmount: currentPrice.toString(),
  //                     bidder: currentAutoBidOwner.bidder,
  //                   },
  //                 });
  //               } else {
  //                 currentPrice = currentPrice + stepPrice;
  //               }
  //             } else {
  //               if (highestOwner.highestPrice >= currentPrice + stepPrice) {
  //                 currentPrice = currentPrice + stepPrice;
  //                 currentOwner = highestOwner.bidder;
  //                 //add history
  //                 await prisma.auctionRoomHistory.create({
  //                   data: {
  //                     auctionRoomId: req.body.roomId,
  //                     bidAmount: currentPrice.toString(),
  //                     bidder: highestOwner.bidder,
  //                   },
  //                 });
  //               } else {
  //                 currentPrice = currentPrice + stepPrice;
  //               }
  //             }
  //           } while (currentPrice + stepPrice <= limitPrice);
  //           return currentPrice;
  //         })
  //         .then((currentPrice) => {
  //           return json({
  //             currentPrice: currentPrice,
  //             highestPrice: currentAutoBidOwner.highestPrice,
  //           });
  //         })
  //         .catch();
  //     }

  //     // //History
  //     // // get hight value

  //     // if (AutoBidList.length === 0) {
  //     //   //add auto bid
  //     //   await prisma.autoBid.create({
  //     //     data: {
  //     //       auctionRoomId: req.body.roomId,
  //     //       bidder: userId,
  //     //       highestPrice: parseInt(req.body.highestPrice),
  //     //     },
  //     //   });
  //     //   //add new history

  //     //
  //     // } else {

  //     //   //get highest owner
  //     //   const highestBidOwner = highestAutoBidList.sort((a, b) => {
  //     //     return highestAutoBidList.length
  //     //       ? new Date(a.createAt) - new Date(b.createAt)
  //     //       : conversationDetailData;
  //     //   });

  //     // }
  //   } catch (error) {
  //     res.json({ message: "ERROR" });
  //     return next(error);
  //   }
  // };
}

module.exports = new AuctionRoomController();
