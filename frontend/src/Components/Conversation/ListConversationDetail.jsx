import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ListConversationDetail.css";
import LinesEllipsis from "react-lines-ellipsis";
import { Avatar } from "@mantine/core";
import ConversationApi from "../../API/conversationApi";
import { useHistory, useLocation } from "react-router";
import { render } from "@testing-library/react";
ListConversationDetail.propTypes = {
  item: PropTypes.object,
  currentUserId: PropTypes.string,
};

function ListConversationDetail(props) {
  //STATE
  const [partnerInfo, setPartnerInfo] = useState({ avatar: "", userName: "" });
  //PROPS
  const { item, currentUserId } = props;

  //USE-EFFECT
  useEffect(() => {
    const getPartnerInfo = async () => {
      const partnerId = item.users.filter((id) => id !== currentUserId)[0];
      const partnerInfoRes = await ConversationApi.partnerInfo(partnerId);
      setPartnerInfo(partnerInfoRes);
    };
    getPartnerInfo();
  }, []);

  //LOCATION
  const location = useLocation();

  //USE-history
  const history = useHistory();

  //STYLE
  const focusConversationColor = "#A3BAE5";
  const ConversationColor = "#e4f1fae0";

  return (
    <div
      style={{
        backgroundColor:
          item.id === Number(location.pathname.split("/")[2])
            ? focusConversationColor
            : ConversationColor,
      }}
      onClick={() => {
        history.push(`/Message/${item.id}`);
      }}
      className="ListConversation-item"
      key={item.conversationId}
    >
      <Avatar
        src={partnerInfo.avatar}
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
            text={partnerInfo.userName ? partnerInfo.userName : ""}
            maxLine="1"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
        </div>
        <div>
          <LinesEllipsis
            className="ListConversation-LinesEllipsis-lastMessage"
            text={
              item.conversationDetails.length > 0
                ? item.conversationDetails[0].type === "map"
                  ? item.conversationDetails[0].senderId === currentUserId
                    ? "You: Map location"
                    : "Map location"
                  : item.conversationDetails[0].type === "image"
                  ? item.conversationDetails[0].senderId === currentUserId
                    ? "You: Image"
                    : "Image"
                  : item.conversationDetails[0].senderId === currentUserId
                  ? `You: ${item.conversationDetails[0].message}`
                  : item.conversationDetails[0].message
                : "No message"
            }
            maxLine="1"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
        </div>
      </div>
      <div className="ListConversation-item-dateTime">
        <p>
          {item.conversationDetails.length
            ? new Date().toLocaleDateString() !==
              new Date(item.conversationDetails[0].createAt).toLocaleDateString()
              ? new Date(new Date(item.conversationDetails[0].createAt)).toLocaleString("en-us", {
                  month: "short",
                }) +
                " " +
                new Date(new Date(item.conversationDetails[0].createAt)).getDate()
              : new Date(new Date(item.conversationDetails[0].createAt)).getHours() +
                ":" +
                new Date(new Date(item.conversationDetails[0].createAt)).getMinutes()
            : ""}
        </p>
      </div>
    </div>
  );
}

export default ListConversationDetail;
