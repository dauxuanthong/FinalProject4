import React, { useState, useEffect } from "react";
import "./Search.css";
import { Select } from "@mantine/core";
import { MdOutlinePriceChange } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { GoTag } from "react-icons/go";
import { Input } from "@mantine/core";
import { BiSearchAlt } from "react-icons/bi";
import { useParams } from "react-router-dom";
import searchApi from "../../API/searchApi";
import LinesEllipsis from "react-lines-ellipsis";
import { Grid, Col } from "@mantine/core";
import { useHistory } from "react-router";
import { useNotifications } from "@mantine/notifications";
import conversationApi from "../../API/conversationApi";
import auctionRoomApi from "../../API/auctionRoomApi";
import { Avatar } from "@mantine/core";

function Search(props) {
  //STATE
  const [tab, setTab] = useState(["Post", "Auction", "User"]);
  const [tabLine, setTabLine] = useState("All");
  const [priceFilterData, setPriceFilterData] = useState([
    { value: "None", label: "None" },
    { value: "Ascending", label: "Ascending" },
    { value: "Descending", label: "Descending" },
  ]);
  const [datetimeFilterData, setDatetimeFilterData] = useState([
    { value: "None", label: "None" },
    { value: "Ascending", label: "Ascending" },
    { value: "Descending", label: "Descending" },
  ]);
  const [categoryFilterData, setCategoryFilterData] = useState([{ value: "0", label: "All" }]);
  const [postList, setPostList] = useState([]);
  const [auctionPostList, setAuctionPostList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [timeFilter, setTimeFilter] = useState("None");
  const [priceFilter, setPriceFilter] = useState("None");
  const [categoryFilter, setCategoryFilter] = useState("0");

  //PARAMS
  const { value } = useParams();

  //EFFECT
  useEffect(() => {
    const getAllSearchData = async () => {
      setSearchValue(value);
      const getData = await searchApi.getAllSearchData(value);
      setCategoryFilterData([...categoryFilterData, ...getData.productTypeListDestructuring]);
      setPostList(getData.postList);
      setAuctionPostList(getData.auctionPostList);
      setUserList(getData.userList);
    };
    getAllSearchData();
  }, [value]);

  //USE-NOTIFICATION
  const notifications = useNotifications();

  //USE-history
  const history = useHistory();

  // VARIABLE
  const tabBorderBottom = "3px solid greenyellow";
  //Event
  const contact = async (id, type) => {
    const data = {
      postId: id,
      postType: type,
    };
    try {
      const contactRes = await conversationApi.contact(data);
      if (contactRes.message === "duplicated userId") {
        return notifications.showNotification({
          color: "red",
          title: "This post belong to you",
          message: `you can't contact with yourself!`,
          autoClose: 3000,
        });
      }
      history.push(`/Message/${contactRes.conversationId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const detail = (id, type) => {
    if (type === "Post") {
      return history.push(`/postDetail/post/${id}`);
    }
    if (type === "Auction") {
      return history.push(`/postDetail/auctionPost/${id}`);
    }
  };

  const joinRoom = async (roomId) => {
    const joinRoomRes = await auctionRoomApi.joinAuctionRoom({ roomId: roomId });
    if (joinRoomRes.message === "OK") {
      return history.push(`/auctionRoom/${roomId}`);
    } else {
      return notifications.showNotification({
        color: "red",
        title: "Error",
        message: `system error! Please try again later`,
        autoClose: 2000,
      });
    }
  };

  const getUserContact = async (userId) => {
    const getContact = await conversationApi.getUserContact({ userId });
    if (getContact.message === "duplicated userId") {
      return notifications.showNotification({
        color: "red",
        title: "Get contact failure",
        message: `you can't contact with yourself!`,
        autoClose: 2000,
      });
    }
    history.push(`/Message/${getContact.conversationId}`);
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      e.preventDefault();
      search();
    }
  };

  const search = async () => {
    const data = {
      sortObj: timeFilter === "None" ? (priceFilter === "None" ? "None" : "Price") : "Time",
      sort: timeFilter === "None" ? (priceFilter === "None" ? "None" : priceFilter) : timeFilter,
      searchValue: searchValue,
      category: categoryFilter,
    };
    const search = await searchApi.search(data);
    console.log(search);
    setPostList(search.searchPostDetail);
    setAuctionPostList(search.searchAuctionPostDetail);
    setUserList(search.searchUser);
  };

  const handleTimeFilter = (value) => {
    setTimeFilter(value);
    setPriceFilter("None");
    if (value === "Ascending") {
      setPostList((pre) => {
        const arr =
          pre.length > 0
            ? pre.sort((a, b) => {
                return new Date(a.createAt) - new Date(b.createAt);
              })
            : pre;
        return arr;
      });
      setAuctionPostList((pre) => {
        const arr =
          pre.length > 0
            ? pre.sort((a, b) => {
                return new Date(a.createAt) - new Date(b.createAt);
              })
            : pre;
        return arr;
      });
      return notifications.showNotification({
        color: "green",
        title: "Sort by ascending dateTime",
        autoClose: 1500,
      });
    }
    if (value === "Descending") {
      setPostList((pre) => {
        const arr =
          pre.length > 0
            ? pre.sort((a, b) => {
                return new Date(b.createAt) - new Date(a.createAt);
              })
            : pre;
        return arr;
      });
      setAuctionPostList((pre) => {
        const arr =
          pre.length > 0
            ? pre.sort((a, b) => {
                return new Date(b.createAt) - new Date(a.createAt);
              })
            : pre;
        return arr;
      });
      return notifications.showNotification({
        color: "green",
        title: "Sort by Descending dateTime",
        autoClose: 1500,
      });
    }
  };

  const handlePriceFilter = (value) => {
    setPriceFilter(value);
    setTimeFilter("None");
    if (value === "Ascending") {
      setPostList((pre) => {
        return pre.length > 0
          ? pre.sort((a, b) => {
              return Number(a.price) - Number(b.price);
            })
          : pre;
      });
      setAuctionPostList((pre) => {
        console.log("auction tang");
        return pre.length > 0
          ? pre.sort((a, b) => {
              return Number(a.firstPrice) - Number(b.firstPrice);
            })
          : pre;
      });
      return notifications.showNotification({
        color: "green",
        title: "Sort by ascending price",
        autoClose: 1500,
      });
    }
    if (value === "Descending") {
      console.log("auction tang");
      setPostList((pre) => {
        return pre.length > 0
          ? pre.sort((a, b) => {
              return Number(b.price) - Number(a.price);
            })
          : pre;
      });
      setAuctionPostList((pre) => {
        return pre.length > 0
          ? pre.sort((a, b) => {
              return Number(b.firstPrice) - Number(a.firstPrice);
            })
          : pre;
      });
      return notifications.showNotification({
        color: "green",
        title: "Sort by descending price",
        autoClose: 1500,
      });
    }
  };

  return (
    <div className="Search-component">
      <div className="Search-main">
        <div className="Search-leftPart">
          <div className="Search-leftPart-tab">
            <div
              className="Search-leftPart-tab-item"
              style={{ borderBottom: tabLine === "All" ? tabBorderBottom : "" }}
              onClick={() => {
                setTab(["Post", "Auction", "User"]);
                setTabLine("All");
              }}
            >
              <p>All</p>
            </div>
            <div
              style={{ borderBottom: tabLine === "Post" ? tabBorderBottom : "" }}
              className="Search-leftPart-tab-item"
              onClick={() => {
                setTab(["Post"]);
                setTabLine("Post");
              }}
            >
              <p>Posts</p>
            </div>
            <div
              style={{ borderBottom: tabLine === "Auction" ? tabBorderBottom : "" }}
              className="Search-leftPart-tab-item"
              onClick={() => {
                setTab(["Auction"]);
                setTabLine("Auction");
              }}
            >
              <p>Auctions</p>
            </div>
            <div
              style={{ borderBottom: tabLine === "User" ? tabBorderBottom : "" }}
              className="Search-leftPart-tab-item"
              onClick={() => {
                setTab(["User"]);
                setTabLine("User");
              }}
            >
              <p>Users</p>
            </div>
          </div>
          <div className="Search-leftPart-filter">
            <p style={{ fontSize: 16, fontWeight: 550, color: "#98a6be" }}>Filter</p>
            <div style={{ display: "flex" }}>
              <div className="Search-leftPart-func">
                <div className="Search-leftPart-item">
                  <Select
                    placeholder="Price sort"
                    icon={<MdOutlinePriceChange />}
                    onChange={(e) => {
                      handlePriceFilter(e);
                    }}
                    data={priceFilterData}
                    defaultValue={"None"}
                    value={priceFilter}
                  />
                </div>
                <div className="Search-leftPart-item">
                  <Select
                    placeholder="Datetime sort"
                    icon={<MdDateRange />}
                    onChange={(e) => {
                      handleTimeFilter(e);
                    }}
                    data={datetimeFilterData}
                    defaultValue={"None"}
                    value={timeFilter}
                  />
                </div>
                <div className="Search-leftPart-item">
                  <Select
                    placeholder="Category"
                    icon={<GoTag />}
                    data={categoryFilterData}
                    onChange={(e) => {
                      setCategoryFilter(e);
                    }}
                    defaultValue={"0"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Search-rightPart">
          <div className="Search-rightPart-search">
            <Input
              placeholder="Search"
              radius="md"
              rightSection={<BiSearchAlt />}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onKeyDown={handleKeypress}
            />
          </div>
          <div className="Search-rightPart-div">
            <p>Result for: {searchValue}</p>
            <p>Type: {tabLine}</p>
            <p>Price sort: {priceFilter}</p>
            <p>Datetime sort: {timeFilter}</p>
            <p>
              Category:{" "}
              {categoryFilterData.length > 0 &&
                categoryFilterData.find((item) => item.value === categoryFilter)?.label}
            </p>
          </div>
        </div>
      </div>
      <div className="Search-info">
        {tab.some((item) => item === "Post") && (
          <div className="Search-info-post">
            {/*new product*/}
            <div
              style={{
                width: "100%",
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="new-product-div">
                <div className="new-product-title">POST</div>
                <div className="new-product-item-div">
                  {postList.length ? (
                    <Grid gutter={10} columns={25} style={{ margin: 0 }}>
                      {postList.map((item) => (
                        <div key={item.id}>
                          <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                            <div className="new-product-card">
                              <div className="new-product-card-content">
                                <img src={item.imageUrl[0]} alt="Product"></img>
                                <LinesEllipsis
                                  className="new-product-card-content-ellipsis"
                                  text={item.productName}
                                  maxLine="2"
                                  ellipsis="..."
                                  trimRight
                                  basedOn="letters"
                                />
                                <div className="new-product-card-content-bottom">
                                  <p style={{ fontSize: 20, fontWeight: 560 }}>
                                    {new Intl.NumberFormat("vi", {
                                      style: "currency",
                                      currency: "VND",
                                    })
                                      .format(item.price)
                                      .split("₫")}
                                  </p>
                                  <p style={{ fontSize: 15 }}>₫</p>
                                </div>
                              </div>
                              <div className="new-product-card-button">
                                <button
                                  onClick={() => {
                                    contact(item.id, "Post");
                                  }}
                                >
                                  Contact
                                </button>
                                <button
                                  onClick={() => {
                                    detail(item.id, "Post");
                                  }}
                                >
                                  Detail
                                </button>
                              </div>
                            </div>
                          </Col>
                        </div>
                      ))}
                    </Grid>
                  ) : (
                    <p
                      style={{
                        fontSize: 17,
                        fontWeight: 550,
                        marginTop: 10,
                        color: "rgba(43, 43, 43, 0.479)",
                      }}
                    >
                      No result for this product
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {tab.some((item) => item === "Auction") && (
          <div className="Search-info-auction">
            {/*Auction post*/}
            <div
              style={{
                width: "100%",
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="new-product-div">
                <div className="new-product-title">AUCTION</div>
                <div className="new-product-item-div">
                  {auctionPostList.length ? (
                    <Grid gutter={10} columns={25} style={{ margin: 0 }}>
                      {auctionPostList.map((item) => (
                        <div key={item.id}>
                          <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                            <div className="auction-product-card">
                              <div className="new-product-card-content">
                                <img src={item.imageUrl[0]} alt="Product"></img>
                                <LinesEllipsis
                                  className="auction-product-card-content-ellipsis"
                                  text={item.productName}
                                  maxLine="2"
                                  ellipsis="..."
                                  trimRight
                                  basedOn="letters"
                                />
                                <div className="auction-product-card-content-bottom">
                                  <p className="auction-product-card-content-title">
                                    Auction ends at
                                  </p>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "flex-end",
                                      height: "fit-content",
                                    }}
                                  >
                                    <p style={{ fontSize: 16, fontWeight: 560 }}>
                                      {
                                        new Date(new Date(item.auctionDatetime))
                                          .toLocaleString()
                                          .split(",")[0]
                                      }
                                    </p>
                                    <p style={{ fontSize: 14, marginLeft: 5, paddingBottom: 0.5 }}>
                                      {
                                        new Date(new Date(item.auctionDatetime))
                                          .toLocaleString()
                                          .split(",")[1]
                                      }
                                    </p>
                                  </div>
                                  <p className="auction-product-card-content-title">First price</p>
                                  <div className="auction-product-card-content-price">
                                    <p style={{ fontSize: 20, fontWeight: 560 }}>
                                      {new Intl.NumberFormat("vi", {
                                        style: "currency",
                                        currency: "VND",
                                      })
                                        .format(item.firstPrice)
                                        .split("₫")}
                                    </p>
                                    <p style={{ fontSize: 15 }}>₫</p>
                                  </div>
                                </div>
                              </div>
                              <div className="auction-product-card-button">
                                <button
                                  onClick={() => {
                                    contact(item.id, "Auction");
                                  }}
                                >
                                  Contact
                                </button>
                                <button
                                  onClick={() => {
                                    detail(item.id, "Auction");
                                  }}
                                >
                                  Detail
                                </button>
                                <button
                                  onClick={() => {
                                    joinRoom(item.auctionRooms.id);
                                  }}
                                >
                                  Join
                                </button>
                              </div>
                            </div>
                          </Col>
                        </div>
                      ))}
                    </Grid>
                  ) : (
                    <p
                      style={{
                        fontSize: 17,
                        fontWeight: 550,
                        marginTop: 10,
                        color: "rgba(43, 43, 43, 0.479)",
                      }}
                    >
                      No result for this product
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {tab.some((item) => item === "User") && (
          <div className="Search-info-user">
            {/*User*/}
            <div
              style={{
                width: "100%",
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="new-product-div">
                <div className="new-product-title">USER</div>
                <div className="new-product-item-div">
                  {userList.length ? (
                    <Grid gutter={10} columns={25} style={{ margin: 0 }}>
                      {userList.map((item) => (
                        <div key={item.id}>
                          <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                            <div className="user-card">
                              <div className="user-card-content">
                                <Avatar size={180} radius="md" src={item.avatar} />
                                <LinesEllipsis
                                  className="new-product-card-content-ellipsis"
                                  text={item.userName}
                                  maxLine="2"
                                  ellipsis="..."
                                  trimRight
                                  basedOn="letters"
                                />
                              </div>
                              <div className="user-card-button">
                                <button
                                  onClick={() => {
                                    getUserContact(item.id);
                                  }}
                                >
                                  Contact
                                </button>
                              </div>
                            </div>
                          </Col>
                        </div>
                      ))}
                    </Grid>
                  ) : (
                    <p
                      style={{
                        fontSize: 17,
                        fontWeight: 550,
                        marginTop: 10,
                        color: "rgba(43, 43, 43, 0.479)",
                      }}
                    >
                      No result for this user
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
