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
    const userId = req.session.userId;
    try {
      const data = await prisma.auctionRooms.findUnique({
        where: { id: parseInt(req.params.roomId) },
        include: { auctionPost: true },
      });
      const currentAutoBid = await prisma.autoBid.findMany({
        where: { auctionRoomId: data.id, bidder: userId },
      });
      const dataDestructuring = {
        currentValue: data.currentPrice,
        endAt: data.auctionPost.auctionDatetime,
        highestPrice: currentAutoBid.length
          ? currentAutoBid[0].highestPrice !== 0
            ? currentAutoBid[0].highestPrice.toString()
            : "N/A"
          : "N/A",
      };
      // check owner
      const CheckOwnerAuctionRoom = userId === data.auctionPost.userId ? true : false;
      return res.json({ dataDestructuring, CheckOwnerAuctionRoom });
    } catch (error) {
      return next(error);
    }
  };

  bid = async (req, res, next) => {
    const userId = req.session.userId;
    try {
      //getRoom
      const room = await prisma.auctionRooms.findUnique({
        where: { id: req.body.roomId },
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
      if (AutoBidList.length) {
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
        where: { id: req.body.roomId },
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
      //check auto list already exist
      if (AutoBidList.length) {
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
              bidAmount: (
                Number(req.body.bidAmount) + Number(room.auctionPost.stepPrice)
              ).toString(),
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
        where: { auctionRoomId: req.body.roomId, bidder: userId },
      });
      //create or update autoBid
      if (currentAutoBid.length === 0) {
        //create new autoBid
        await prisma.autoBid.create({
          data: {
            auctionRoomId: req.body.roomId,
            bidder: userId,
            highestPrice: parseInt(req.body.highestPrice),
          },
        });
      } else {
        //update current auto bid
        await prisma.autoBid.update({
          where: { id: currentAutoBid[0].id },
          data: {
            highestPrice: parseInt(req.body.highestPrice),
          },
        });
      }
      //CHECK LAST BIDER
      const lastHistoryArr = await prisma.auctionRoomHistory.findMany({
        where: { auctionRoomId: room.id, bidAmount: room.currentPrice },
      });
      const productOwner = lastHistoryArr[0].bidder;
      //CASE1: CURRENT USER IS PRODUCT OWNER
      if (productOwner === userId) {
        console.log("CASE1");
        return res.json({ message: "OK" });
      }
      // AUTO BID PROCESS
      //current user
      const currentUserAutoBidArr = await prisma.autoBid.findMany({
        where: { auctionRoomId: req.body.roomId, bidder: userId },
      });
      const currentUserAutoBid = currentUserAutoBidArr[0];
      //find highest user
      const autoBidArrSoftPrice = await prisma.autoBid.findMany({
        where: { auctionRoomId: req.body.roomId },
        orderBy: {
          highestPrice: "desc",
        },
      });
      //CASE 2: THIS IS FIRST AUTO BID
      if (autoBidArrSoftPrice.length === 1) {
        console.log("CASE2");
        const newHistory = await prisma.auctionRoomHistory.create({
          data: {
            auctionRoomId: req.body.roomId,
            bidder: userId,
            bidAmount: upPrice.toString(),
          },
        });
        const userName = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            userName: true,
          },
        });
        //update current price
        await prisma.auctionRooms.update({
          where: { id: req.body.roomId },
          data: {
            currentPrice: newHistory.bidAmount,
          },
        });
        const historyDestructuring = [
          {
            ...newHistory,
            bidder: userName.userName,
          },
        ];

        return res.json({ data: historyDestructuring });
      }

      const autoBidArrSoftTime =
        autoBidArrSoftPrice[0].highestPrice === autoBidArrSoftPrice[1].highestPrice
          ? autoBidArrSoftPrice.sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
          : autoBidArrSoftPrice;

      const autoBidFilter = autoBidArrSoftTime.filter((item) => item.highestPrice >= upPrice);
      const highestPriceUser = autoBidFilter[0];
      //CASE3: CURRENT USER IS THE ONLY THE ONLY ONE WITH VALID HIGHEST PRICE
      if (autoBidFilter.length === 1) {
        console.log("CASE 3");
        const newHistory = await prisma.auctionRoomHistory.create({
          data: {
            auctionRoomId: req.body.roomId,
            bidder: userId,
            bidAmount: upPrice.toString(),
          },
        });
        const userName = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            userName: true,
          },
        });
        //update current price
        await prisma.auctionRooms.update({
          where: { id: req.body.roomId },
          data: {
            currentPrice: newHistory.bidAmount,
          },
        });
        const historyDestructuring = [
          {
            ...newHistory,
            bidder: userName.userName,
          },
        ];
        return res.json({ data: historyDestructuring });
      }

      if (currentUserAutoBid.bidder === highestPriceUser.bidder) {
        console.log("CASE:4");
        //CASE 4: CURRENT USER IS HIGHEST PRICE USER
        //switch owner
        const termHistory = await prisma.auctionRoomHistory.create({
          data: {
            auctionRoomId: req.body.roomId,
            bidder: userId,
            bidAmount: upPrice.toString(),
          },
        });
        const secondHighestUser = await prisma.auctionRoomHistory.create({
          data: {
            auctionRoomId: req.body.roomId,
            bidder: autoBidFilter[1].bidder, //
            bidAmount: autoBidFilter[1].highestPrice.toString(), //
          },
        });

        const firstHighestUser = await prisma.auctionRoomHistory.create({
          data: {
            auctionRoomId: req.body.roomId,
            bidder: userId,
            bidAmount: (autoBidFilter[1].highestPrice + Number(room.auctionPost.stepPrice)) //
              .toString(),
          },
        });
        //update current price
        await prisma.auctionRooms.update({
          where: { id: req.body.roomId },
          data: {
            currentPrice: firstHighestUser.bidAmount,
          },
        });
        const newHistoryArr = [firstHighestUser, secondHighestUser, termHistory];
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
      } else {
        //CASE 5: CURRENT USER ISN'T HIGHEST PRICE USER
        console.log("CASE:5");
        const secondHighestUser = await prisma.auctionRoomHistory.create({
          data: {
            auctionRoomId: req.body.roomId,
            bidder: userId,
            bidAmount: currentUserAutoBid.highestPrice.toString(),
          },
        });
        const firstHighestUser = await prisma.auctionRoomHistory.create({
          data: {
            auctionRoomId: req.body.roomId,
            bidder: highestPriceUser.bidder,
            bidAmount: (
              currentUserAutoBid.highestPrice + parseInt(room.auctionPost.stepPrice)
            ).toString(),
          },
        });

        //update current price
        await prisma.auctionRooms.update({
          where: { id: req.body.roomId },
          data: {
            currentPrice: firstHighestUser.bidAmount,
          },
        });
        const newHistoryArr = [firstHighestUser, secondHighestUser];
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
    } catch (error) {
      res.json({ message: "ERROR" });
      return next(error);
    }
  };

  resetAutoBid = async (req, res, next) => {
    const userId = req.session.userId;
    try {
      //check auto bid
      const currentAutoBid = await prisma.autoBid.findMany({
        where: {
          auctionRoomId: req.body.roomId,
          bidder: userId,
        },
      });
      if (currentAutoBid.length === 0) {
        return res.json({ message: "NOT FOUND" });
      }
      const updateCurrentAutoBid = await prisma.autoBid.deleteMany({
        where: {
          auctionRoomId: req.body.roomId,
          bidder: userId,
        },
      });
      return res.json({ message: "SUCCESSFUL" });
    } catch (error) {
      res.json({ message: "ERROR" });
      return next(error);
    }
  };

  //   autoBidProcess = async (req, res, next) => {
  //     const userId = req.session.userId;
  //     try {
  //       const currentRoom = await prisma.auctionRooms.findUnique({
  //         where: { id: req.body.roomId },
  //         include: { auctionPost: true },
  //       });
  //       //check current owner
  //       const lastHistory = await prisma.auctionRoomHistory.findMany({
  //         where: {
  //           auctionRoomId: currentRoom.id,
  //           bidAmount: currentRoom.currentPrice,
  //         },
  //       });
  //       const lastBidder = lastHistory[0]?.bidder;
  //       if (userId === lastBidder) {
  //         return res.json({ message: "OK" });
  //       }

  //       //basic element
  //       let currentPrice = parseInt(currentRoom.currentPrice);
  //       const stepPrice = parseInt(currentRoom.auctionPost.stepPrice);
  //       //get highestPrice list
  //       const highestPriceOwnerArr = await prisma.autoBid.findMany({
  //         where: { auctionRoomId: req.body.roomId },
  //         orderBy: {
  //           highestPrice: "desc",
  //         },
  //       });
  //       //CASE 1: FIRST AUTO BID
  //       if (highestPriceOwnerArr.length === 1) {
  //         //new history
  //         const newHistory = await prisma.auctionRoomHistory.create({
  //           data: {
  //             auctionRoomId: req.body.roomId,
  //             bidAmount: (currentPrice + stepPrice).toString(),
  //             bidder: userId,
  //           },
  //         });
  //         //update current price
  //         await prisma.auctionRooms.update({
  //           where: { id: req.body.roomId },
  //           data: {
  //             currentPrice: newHistory.bidAmount,
  //           },
  //         });
  //         const username = await prisma.user.findUnique({
  //           where: { id: newHistory.bidder },
  //           select: { userName: true },
  //         });
  //         const historyDestructuring = [
  //           {
  //             ...newHistory,
  //             bidder: username.userName,
  //           },
  //         ];
  //         console.log("case1");
  //         return res.json({ message: "CASE1", historyDestructuring: historyDestructuring });
  //       }
  //       //get top 2 highest
  //       const highestPriceByTheTimeArr = highestPriceOwnerArr.sort((a, b) => {
  //         return new Date(b.createAt) - new Date(a.createAt);
  //       });
  //       const top2Highest = [highestPriceByTheTimeArr[0], highestPriceByTheTimeArr[1]];
  //       //CASE 2: Current user not exist in top 2 highest price
  //       if (!top2Highest.some((x) => x.bidder === userId)) {
  //         //current user history
  //         const newHistoryCurrent = await prisma.auctionRoomHistory.create({
  //           data: {
  //             auctionRoomId: req.body.roomId,
  //             bidAmount: (currentPrice + stepPrice).toString(),
  //             bidder: userId,
  //           },
  //         });
  //         //case 2.1 out price range
  //         if (currentPrice + stepPrice * 2 > top2Highest[0].highestPrice) {
  //           //update current price
  //           await prisma.auctionRooms.update({
  //             where: { id: req.body.roomId },
  //             data: {
  //               currentPrice: newHistoryCurrent.bidAmount,
  //             },
  //           });
  //           const username = await prisma.user.findUnique({
  //             where: { id: newHistoryCurrent.bidder },
  //             select: { userName: true },
  //           });
  //           const historyDestructuring = [
  //             {
  //               ...newHistory,
  //               bidder: username.userName,
  //             },
  //           ];
  //           console.log("case2.1");
  //           return res.json({ message: "CASE1", historyDestructuring: historyDestructuring });
  //         }
  //         //case 2.2 auto bid
  //         //new history for highest price owner
  //         const newHistoryHighest = await prisma.auctionRoomHistory.create({
  //           data: {
  //             auctionRoomId: req.body.roomId,
  //             bidAmount: (currentPrice + stepPrice * 2).toString(),
  //             bidder: top2Highest[0].bidder,
  //           },
  //         });
  //         //update current price
  //         await prisma.auctionRooms.update({
  //           where: { id: req.body.roomId },
  //           data: {
  //             currentPrice: newHistoryHighest.bidAmount,
  //           },
  //         });
  //         const newHistoryArr = [newHistoryHighest, newHistoryCurrent];
  //         //get user name
  //         const historyDestructuring = await newHistoryArr.reduce(async (previousPromise, item) => {
  //           let arr = await previousPromise;
  //           const user = await prisma.user.findUnique({
  //             where: { id: item.bidder },
  //             select: { userName: true },
  //           });
  //           arr.push({
  //             id: item.id,
  //             bidder: user.userName,
  //             bidAmount: item.bidAmount,
  //             bidTime: item.bidTime,
  //           });
  //           return arr;
  //         }, Promise.resolve([]));
  //         console.log("case2.2");
  //         return res.json({ message: "CASE1", historyDestructuring: historyDestructuring });
  //       }
  //       //CASE 3: Current user exist in top 2 highest price
  //       //current user history
  //       const newHistoryCurrent = await prisma.auctionRoomHistory.create({
  //         data: {
  //           auctionRoomId: req.body.roomId,
  //           bidAmount: (currentPrice + stepPrice).toString(),
  //           bidder: userId,
  //         },
  //       });
  //       let currentOwner = newHistoryCurrent.bidder;
  //       do {
  //         if (currentOwner !== top2Highest[0].bidder) {
  //           console.log("Tick");
  //           if (currentPrice <= top2Highest[0].highestPrice) {
  //             const newHis = await prisma.auctionRoomHistory.create({
  //               data: {
  //                 auctionRoomId: req.body.roomId,
  //                 bidAmount: (currentPrice + stepPrice).toString(),
  //                 bidder: top2Highest[0].bidder,
  //               },
  //             });
  //             currentPrice = parseInt(newHis.bidAmount);
  //             currentOwner = newHis.bidder;
  //           } else {
  //             currentPrice = currentPrice + stepPrice;
  //           }
  //         } else {

  //           if (currentPrice <= top2Highest[1].highestPrice) {
  //             const newHis = await prisma.auctionRoomHistory.create({
  //               data: {
  //                 auctionRoomId: req.body.roomId,
  //                 bidAmount: (currentPrice + stepPrice).toString(),
  //                 bidder: top2Highest[1].bidder,
  //               },
  //             });
  //             currentPrice = parseInt(newHis.bidAmount);
  //             currentOwner = newHis.bidder;
  //           } else {
  //             currentPrice = currentPrice + stepPrice;
  //           }
  //         }
  //       } while (currentPrice < top2Highest[1].highestPrice);
  //       //update current price
  //       await prisma.auctionRooms.update({
  //         where: { id: req.body.roomId },
  //         data: {
  //           currentPrice: currentPrice.toString(),
  //         },
  //       });
  //       console.log("case3");
  //       return res.json({ message: "CASE3", currentPrice: currentPrice.toString() });
  //     } catch (error) {
  //       return next(error);
  //     }
  //   };
}

module.exports = new AuctionRoomController();
