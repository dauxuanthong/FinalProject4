import React from "react";
import "./Conversation.css";
import ListConversation from "./ListConversation";
import DetailConversation from "./DetailConversation";

function Conversation(props) {
  return (
    <div className="conversation-container">
      <div className="conversation-list-container">
        <ListConversation />
      </div>
      <div className="conversation-detail-container">
        <DetailConversation />
      </div>
      <div className="conversation-media-container">media</div>
    </div>
  );
}

export default Conversation;
