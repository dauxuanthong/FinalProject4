import React, { useEffect, useState } from "react";
import "./PostManage.css";
import { Divider } from "@mantine/core";
import LinesEllipsis from "react-lines-ellipsis";
import postApi from "../../../API/postApi";

function PostManage(props) {
  //STATE
  const [statistic, setStatistic] = useState({});
  const [postItem, setPostItem] = useState([]);

  //USE-EFFECT
  useEffect(() => {
    console.log("TESTTTTTT");
    const getMyPost = async () => {
      const myPostRes = await postApi.getMyPost();
      setStatistic(myPostRes.statistic);
      setPostItem(myPostRes.allMyPost);
    };
    getMyPost(postItem);
  }, []);

  //EVENT
  const deletePost = () => {};
  return (
    <div className="PostManage-container">
      <div className="PostManage-component">
        {/*Statistic*/}
        <div className="PostManage-list">
          <p style={{ fontSize: 18, color: "rgba(20, 61, 150, 0.747)", fontWeight: 600 }}>
            POST LIST
          </p>
          <div className="PostManage-post-list">
            {postItem?.map((item) => (
              <div key={item.postId}>
                <Divider />
                <div className="PostManage-post-list-item">
                  <div className="PostManage-post-list-item-img">
                    <img src={item.imageUrl}></img>
                  </div>
                  <div className="PostManage-post-list-item-info">
                    <LinesEllipsis
                      className="PostManage-post-list-item-ellipsis"
                      text={`Product name: ${item.productName}`}
                      maxLine="1"
                      ellipsis="..."
                      trimRight
                      basedOn="letters"
                    />
                    <p>{`Post type: ${item.postType}`}</p>
                    <p>{`Status: ${item.status}`}</p>
                    <p>{`Upload at: ${item.uploadAt}`}</p>
                  </div>
                  <div className="PostManage-post-list-item-button">
                    <button style={{ backgroundColor: "rgb(86, 173, 133)" }}>Detail</button>
                    <button style={{ backgroundColor: "rgb(86, 127, 173)" }}>Edit</button>
                    <button
                      style={{ backgroundColor: "#FF4D4F" }}
                      onClick={() => {
                        deletePost(item.postId);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="PostManage-statistic">
          <div className="PostManage-statistic-title">
            <p>POST STATISTIC</p>
          </div>
          <Divider style={{ width: 200 }} />
          <div className="PostManage-statistic-item">
            <p>{`Posts: ${statistic.posts}`}</p>
            <p>{`Expired: ${statistic.expired}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostManage;
