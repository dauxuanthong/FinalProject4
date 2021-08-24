import React, { useState, useEffect } from "react";
import "./Side.css";
import { RiContactsBookUploadLine } from "react-icons/ri";
import { useHistory } from "react-router-dom";

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
      ) : (
        ""
      )}
    </div>
  );
}

export default Side;
