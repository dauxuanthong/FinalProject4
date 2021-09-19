import React from "react";
import PropTypes from "prop-types";
import "./ListConversation.css";
import { Input } from "@mantine/core";
import { IoMdSearch } from "react-icons/io";
import LinesEllipsis from "react-lines-ellipsis";

ListConversation.propTypes = {};
function ListConversation(props) {
  return (
    <>
      <div className="ListConversation-search-input">
        <Input icon={<IoMdSearch />} placeholder="Search" radius="xl" />
      </div>
      <div style={{ width: 260, marginTop: 20 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#6E85AD" }}>Last contact</p>
      </div>
      <div className="ListConversation-item-div">
        <div className="ListConversation-item">
          <img src="https://images.unsplash.com/photo-1615807713086-bfc4975801d0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2F0JTIwZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" />
          <div className="ListConversation-item-detail">
            <div>
              <LinesEllipsis
                className="ListConversation-LinesEllipsis-userName"
                text="User 1 "
                maxLine="1"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
            </div>
            <div>
              <LinesEllipsis
                className="ListConversation-LinesEllipsis-lastMessage"
                text="Last message"
                maxLine="1"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
            </div>
          </div>
          <div className="ListConversation-item-dateTime">
            <p>10:23</p>
          </div>
        </div>
        <div className="ListConversation-item">
          <img src="https://images.unsplash.com/photo-1615807713086-bfc4975801d0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2F0JTIwZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" />
          <div className="ListConversation-item-detail">
            <div>
              <LinesEllipsis
                className="ListConversation-LinesEllipsis-userName"
                text="User 1 "
                maxLine="1"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
            </div>
            <div>
              <LinesEllipsis
                className="ListConversation-LinesEllipsis-lastMessage"
                text="Last message"
                maxLine="1"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
            </div>
          </div>
          <div className="ListConversation-item-dateTime">
            <p>10:23</p>
          </div>
        </div>
        <div className="ListConversation-item">
          <img src="https://images.unsplash.com/photo-1615807713086-bfc4975801d0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2F0JTIwZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" />
          <div className="ListConversation-item-detail">
            <div>
              <LinesEllipsis
                className="ListConversation-LinesEllipsis-userName"
                text="User 1 "
                maxLine="1"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
            </div>
            <div>
              <LinesEllipsis
                className="ListConversation-LinesEllipsis-lastMessage"
                text="Last message"
                maxLine="1"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
            </div>
          </div>
          <div className="ListConversation-item-dateTime">
            <p>10:23</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListConversation;
