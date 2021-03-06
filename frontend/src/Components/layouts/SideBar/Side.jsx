import React, { useState, useEffect } from "react";
import "./Side.css";
import { RiContactsBookUploadLine } from "react-icons/ri";
import { BsFilePost } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
function Side(props) {
  //STATE
  const [userStatus, setUserStatus] = useState();

  //USE HISTORY
  const history = useHistory();

  //EFFECT
  useEffect(() => {
    setUserStatus(localStorage.getItem("status") || "");
  }, []);
  return (
    <div className="side-container">
      {userStatus === "signIn" ? (
        <div>
          <div
            className="item"
            onClick={() => {
              history.push("/post");
            }}
          >
            <div className="icon-item">
              <RiContactsBookUploadLine style={{ color: "#353d5f" }} />
            </div>
            <div className="description-item-side">
              <p>New post</p>
            </div>
          </div>
          <div
            className="item"
            onClick={() => {
              history.push("/managePosts");
            }}
          >
            <div className="icon-item">
              <BsFilePost style={{ color: "#353d5f" }} />
            </div>
            <div className="description-item-side">
              <p>My post</p>
            </div>
          </div>
          <div
            className="item"
            onClick={() => {
              history.push("/message");
            }}
          >
            <div className="icon-item">
              <IoChatboxEllipsesOutline style={{ color: "#353d5f" }} />
            </div>
            <div className="description-item-side">
              <p>Message</p>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Side;
