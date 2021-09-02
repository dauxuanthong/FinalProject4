import React, { useState, useEffect } from "react";
import "./Post.css";
import { Tabs, Tab } from "@mantine/core";
import { BsFilePost } from "react-icons/bs";
import { RiAuctionLine } from "react-icons/ri";
import NormalPost from "./PostType/NormalPost";
import postApi from "../../API/postApi";
function Post(props) {
  //STATE
  const [types, setTypes] = useState([]);

  //USE-EFFECT
  useEffect(() => {
    const type = async () => {
      const getTypeRes = await postApi.getType();
      setTypes(
        getTypeRes.reduce((arr, item) => {
          arr.push({
            value: item.id,
            label: item.type,
          });
          return arr;
        }, [])
      );
    };
    type();
  }, []);

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
            <NormalPost types={types} />
          </Tab>
          <Tab label="Auction Post" icon={<RiAuctionLine />}>
            Auction Post
          </Tab>
        </Tabs>
      </div>
      <p></p>
    </div>
  );
}

export default Post;
