import React from "react";
import PropTypes from "prop-types";
import "./ListConversation.css";
import { Input } from "@mantine/core";
import { IoMdSearch } from "react-icons/io";
import LinesEllipsis from "react-lines-ellipsis";
import { Avatar } from "@mantine/core";
import { useHistory } from "react-router";

ListConversation.propTypes = {
  conversationList: PropTypes.array,
};

function ListConversation(props) {
  //PROP
  const { conversationList } = props;
  //STATE
  //USE-history
  const history = useHistory();

  return (
    <>
      <div className="ListConversation-search-input">
        <Input icon={<IoMdSearch />} placeholder="Search" radius="xl" />
      </div>
      <div style={{ width: 260, marginTop: 20 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#6E85AD" }}>Last contact</p>
      </div>
      <div className="ListConversation-item-div">
        {conversationList?.map((item) => (
          <div
            onClick={() => {
              history.push(`/Message/${item.conversationId}`);
            }}
            className="ListConversation-item"
            key={item.conversationId}
          >
            <Avatar
              src={item.partnerAvatar}
              classNames={{
                image: "ListConversation-item-avatar-image",
                placeholder: "ListConversation-item-avatar-placeholder",
              }}
              size={50}
            />
            <div className="ListConversation-item-detail">
              <div>
                <LinesEllipsis
                  className="ListConversation-LinesEllipsis-userName"
                  text={item.partnerName ? item.partnerName : ""}
                  maxLine="1"
                  ellipsis="..."
                  trimRight
                  basedOn="letters"
                />
              </div>
              <div>
                <LinesEllipsis
                  className="ListConversation-LinesEllipsis-lastMessage"
                  text={item.lastMessage ? item.lastMessage : "No message"}
                  maxLine="1"
                  ellipsis="..."
                  trimRight
                  basedOn="letters"
                />
              </div>
            </div>
            <div className="ListConversation-item-dateTime">
              <p>{item.sendAt ? item.sendAt : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ListConversation;
