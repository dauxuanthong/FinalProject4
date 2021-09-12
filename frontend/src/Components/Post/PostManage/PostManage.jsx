import React from "react";
import "./PostManage.css";
import { Divider } from "@mantine/core";
import LinesEllipsis from "react-lines-ellipsis";

function PostManage(props) {
  return (
    <div className="PostManage-container">
      <div className="PostManage-component">
        {/*Statistic*/}
        <div className="PostManage-list">
          <p style={{ fontSize: 18, color: "rgba(20, 61, 150, 0.747)", fontWeight: 600 }}>
            POST LIST
          </p>
          <div className="PostManage-post-list">
            <Divider />
            <div className="PostManage-post-list-item">
              <div className="PostManage-post-list-item-img">
                <img src="https://c.pxhere.com/photos/0e/9e/technology_digital_tablet_digital_tablet_computer_device_black_white-1325876.jpg!d"></img>
              </div>
              <div className="PostManage-post-list-item-info">
                <LinesEllipsis
                  className="PostManage-post-list-item-ellipsis"
                  text="Product name: "
                  maxLine="1"
                  ellipsis="..."
                  trimRight
                  basedOn="letters"
                />
                <p>Post type: </p>
                <p>Status: </p>
                <p>Upload at:</p>
              </div>
              <div className="PostManage-post-list-item-button">
                <button style={{ backgroundColor: "rgb(86, 173, 133)" }}>Detail</button>
                <button style={{ backgroundColor: "rgb(86, 127, 173)" }}>Edit</button>
                <button style={{ backgroundColor: "#FF4D4F" }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
        <div className="PostManage-statistic">
          <div className="PostManage-statistic-title">
            <p>POST STATISTIC</p>
          </div>
          <Divider style={{ width: 200 }} />
          <div className="PostManage-statistic-item">
            <p>Posts: </p>
            <p>Expired: </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostManage;
