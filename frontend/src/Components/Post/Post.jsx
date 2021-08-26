import React from "react";
import "./Post.css";
import { Tabs, Tab } from "@mantine/core";
import { BsFilePost } from "react-icons/bs";
import { RiAuctionLine } from "react-icons/ri";
import NormalPost from "./PostType/NormalPost";
function Post(props) {
  return (
    <div className="post-component-container">
      <div className="post-component-div">
        <Tabs
          classNames={{
            root: "post-component-tab-root",
            tabsListWrapper: "post-component-tabsListWrapper",
            body: "post-component-tab-body",
          }}
          color="cyan"
          variant="pills"
        >
          <Tab label="Post" icon={<BsFilePost />}>
            <NormalPost />
          </Tab>
          <Tab label="Auction Post" icon={<RiAuctionLine />}>
            Auction Post
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Post;
