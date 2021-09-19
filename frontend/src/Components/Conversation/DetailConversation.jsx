import React from "react";
import PropTypes from "prop-types";
import "./DetailConversation.css";
import { Divider } from "@mantine/core";
import { IoIosSend } from "react-icons/io";

DetailConversation.propTypes = {};

function DetailConversation(props) {
  return (
    <div className="DetailConversation">
      <div className="DetailConversation-info-div">
        <img src="https://images.unsplash.com/photo-1615807713086-bfc4975801d0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2F0JTIwZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" />
        <p>User 1</p>
      </div>
      <Divider />
      <div className="DetailConversation-message-div">
        <div className="DetailConversation-display-message"></div>
        <div className="DetailConversation-send-message">
          <input type="text" />
          <button>
            <IoIosSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailConversation;
