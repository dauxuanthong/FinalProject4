import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@mantine/core";
import { RiAuctionLine, RiAuctionFill } from "react-icons/ri";
import { RiListCheck2 } from "react-icons/ri";
import "./ManagePosts.css";
import PostLists from "./PostLists";
import postApi from "../../../API/postApi";
import AuctionPostList from "./AuctionPostList";

function ManagePosts(props) {
  //STATE
  const [statisticData, setStatisticData] = useState({
    post: 0,
    auctionPost: 0,
    expired: 0,
    recentAuctionNum: 0,
  });
  const [postList, setPostList] = useState([]);
  const [auctionPostList, setAuctionPostList] = useState([]);
  const [recentAuction, setRecentAuction] = useState([]);
  //EFFECT
  useEffect(() => {
    const manageMyPost = async () => {
      const manageAllMyPost = await postApi.manageAllMyPost();
      setPostList(manageAllMyPost.postList);
      setAuctionPostList(manageAllMyPost.auctionPostList);
      setRecentAuction(manageAllMyPost.recentAuction);
      setStatisticData({
        post: manageAllMyPost.postNum,
        auctionPost: manageAllMyPost.auctionPostNum,
        expired: manageAllMyPost.expired,
        recentAuctionNum: manageAllMyPost.recentAuctionNum,
      });
    };
    manageMyPost();
  }, []);

  const updatePostList = (post) => {
    setPostList((prev) => {
      const index = prev.findIndex((item) => item.id === post.id);
      prev[index] = post;
      return prev;
    });
  };

  //EVENT
  const deletePostUpdate = (postId) => {
    setPostList((pre) => {
      return pre.filter((item) => item.id !== postId);
    });
    setStatisticData((pre) => {
      return { ...pre, post: pre.post - 1 };
    });
  };
  return (
    <div className="ManagePost-Container">
      <div className="ManagePost-Tabs-div">
        <Tabs>
          <Tab label="Posts" icon={<RiListCheck2 />}>
            <PostLists
              postList={postList}
              updatePostList={updatePostList}
              deletePostUpdate={deletePostUpdate}
            />
          </Tab>
          <Tab label="Auction Posts" icon={<RiAuctionLine />}>
            <AuctionPostList auctionPostList={auctionPostList} />
          </Tab>
          <Tab label="Recent Auctions" icon={<RiAuctionFill />}>
            <AuctionPostList auctionPostList={recentAuction} />
          </Tab>
        </Tabs>
      </div>
      <div className="ManagePost-statistic">
        <div className="ManagePost-statistic-label">
          <p>STATISTIC</p>
        </div>
        <div className="ManagePost-statistic-detail-div">
          {statisticData.post > 1 ? (
            <p>Posts: {statisticData.post}</p>
          ) : (
            <p>Post: {statisticData.post}</p>
          )}
          {statisticData.auctionPost > 1 ? (
            <p>Auction Posts: {statisticData.auctionPost}</p>
          ) : (
            <p>Auction Post: {statisticData.auctionPost}</p>
          )}
          <p>Expired: {statisticData.expired}</p>
          <p>Recent Auctions: {statisticData.recentAuctionNum}</p>
        </div>
      </div>
    </div>
  );
}

export default ManagePosts;
