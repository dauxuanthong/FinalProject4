const prisma = require("../database/prisma/prisma");

class SearchController {
  getAllSearchData = async (req, res, next) => {
    // const userId = req.session.userId;
    try {
      //get product type list
      const productTypeList = await prisma.productType.findMany();
      const productTypeListDestructuring = productTypeList.reduce((arr, item) => {
        return [
          ...arr,
          {
            value: String(item.id),
            label: item.type,
          },
        ];
      }, []);
      //search by post name
      const postList = await prisma.post.findMany({
        take: 10,
        where: {
          productName: {
            contains: req.params.value,
            mode: "insensitive",
          },
        },
      });
      //search by auction post name
      const auctionPostList = await prisma.auctionPost.findMany({
        take: 10,
        where: {
          productName: {
            contains: req.params.value,
            mode: "insensitive",
          },
        },
        include: { auctionRooms: true },
      });
      //search by user
      const userList = await prisma.user.findMany({
        take: 10,
        where: {
          userName: {
            contains: req.params.value,
            mode: "insensitive",
          },
        },
      });
      return res.json({ productTypeListDestructuring, postList, auctionPostList, userList });
    } catch (error) {
      return next(error);
    }
  };

  searchDetail = async (req, res, next) => {
    try {
      //get basic data
      const { searchValue, sortObj, sort } = req.query;
      const category = Number(req.query.category);
      if (category === 0) {
        //Find ALL
        //post
        const searchPostDetail = await prisma.post.findMany({
          take: 10,
          where: {
            productName: {
              contains: searchValue,
              mode: "insensitive",
            },
          },
        });
        const searchAuctionPostDetail = await prisma.auctionPost.findMany({
          take: 10,
          where: {
            productName: {
              contains: searchValue,
              mode: "insensitive",
            },
          },
          include: { auctionRooms: true },
        });
        const searchUser = await prisma.user.findMany({
          take: 10,
          where: {
            userName: {
              contains: searchValue,
              mode: "insensitive",
            },
          },
        });
        //Soft
        if (sortObj === "Time") {
          //sort by time
          searchPostDetail.length > 0 &&
            searchPostDetail.sort((a, b) => {
              return sort === "Ascending"
                ? new Date(b.createAt) - new Date(a.createAt)
                : new Date(a.createAt) - new Date(b.createAt);
            });

          searchAuctionPostDetail.length > 0 &&
            searchAuctionPostDetail.sort((a, b) => {
              return sort === "Ascending"
                ? new Date(b.createAt) - new Date(a.createAt)
                : new Date(a.createAt) - new Date(b.createAt);
            });

          return res.json({ searchPostDetail, searchAuctionPostDetail, searchUser });
        }
        if (sortObj === "Price") {
          //sort by price
          searchPostDetail.length > 0 &&
            searchPostDetail.sort((a, b) => {
              return sort === "Ascending"
                ? Number(a.price) - Number(b.price)
                : Number(b.price) - Number(a.price);
            });
          console.log(sort);
          searchAuctionPostDetail.length > 0 &&
            searchAuctionPostDetail.sort((a, b) => {
              return sort === "Ascending"
                ? Number(a.firstPrice) - Number(b.firstPrice)
                : Number(b.firstPrice) - Number(a.firstPrice);
            });

          return res.json({ searchPostDetail, searchAuctionPostDetail, searchUser });
        }
        return res.json({ searchPostDetail, searchAuctionPostDetail, searchUser });
      } else {
        //find by category
        //post
        const searchPostDetail = await prisma.post.findMany({
          take: 10,
          where: {
            AND: [
              {
                productName: {
                  contains: searchValue,
                  mode: "insensitive",
                },
              },
              {
                typeId: { hasEvery: [category] },
              },
            ],
          },
        });
        const searchAuctionPostDetail = await prisma.auctionPost.findMany({
          take: 10,
          where: {
            AND: [
              {
                productName: {
                  contains: searchValue,
                  mode: "insensitive",
                },
              },
              {
                typeId: { hasEvery: [category] },
              },
            ],
          },
          include: { auctionRooms: true },
        });
        const searchUser = await prisma.user.findMany({
          take: 10,
          where: {
            userName: {
              contains: searchValue,
              mode: "insensitive",
            },
          },
        });
        //Soft
        if (sortObj === "Time") {
          //sort by time
          searchPostDetail.length > 0 &&
            searchPostDetail.sort((a, b) => {
              return sort === "Ascending"
                ? new Date(b.createAt) - new Date(a.createAt)
                : new Date(a.createAt) - new Date(b.createAt);
            });

          searchAuctionPostDetail.length > 0 &&
            searchAuctionPostDetail.sort((a, b) => {
              return sort === "Ascending"
                ? new Date(b.createAt) - new Date(a.createAt)
                : new Date(a.createAt) - new Date(b.createAt);
            });

          return res.json({ searchPostDetail, searchAuctionPostDetail, searchUser });
        }
        if (sortObj === "Price") {
          //sort by price
          searchPostDetail.length > 0 &&
            searchPostDetail.sort((a, b) => {
              return sort === "Ascending"
                ? Number(a.price) - Number(b.price)
                : Number(b.price) - Number(a.price);
            });
          console.log(sort);
          searchAuctionPostDetail.length > 0 &&
            searchAuctionPostDetail.sort((a, b) => {
              return sort === "Ascending"
                ? Number(a.firstPrice) - Number(b.firstPrice)
                : Number(b.firstPrice) - Number(a.firstPrice);
            });

          return res.json({ searchPostDetail, searchAuctionPostDetail, searchUser });
        }
        return res.json({ searchPostDetail, searchAuctionPostDetail, searchUser });
      }
    } catch (error) {
      return next(error);
    }
  };
}
module.exports = new SearchController();
