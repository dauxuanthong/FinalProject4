import React, { useEffect, useState } from "react";
import "./Conversation.css";
import ListConversation from "./ListConversation";
import DetailConversation from "./DetailConversation";
import conversationApi from "../../API/conversationApi";
import { useParams } from "react-router-dom";

function Conversation(props) {
  //STATE
  const [conversationList, setConversationList] = useState([
    {
      conversationId: null,
      partnerName: null,
      partnerAvatar: null,
      sender: null,
      lastMessage: null,
      sendAt: null,
    },
  ]);
  //USE-PARAMS
  const { conversationId } = useParams();

  //USE-EFFECT
  useEffect(() => {
    //Get conversation list
    const getMyConversationList = async () => {
      try {
        const myConversationListRes = await conversationApi.myConversationList();
        setConversationList(myConversationListRes);
      } catch (error) {
        console.log(error);
      }
    };
    getMyConversationList();
  }, []);

  //FUNCTION
  return (
    <div className="conversation-container">
      <div className="conversation-list-container">
        <ListConversation conversationList={conversationList} />
      </div>
      <div className="conversation-detail-container">
        {conversationId ? (
          <DetailConversation conversationId={parseInt(conversationId)} />
        ) : (
          <div className="null-conversation-detail">
            <p>Select a chat to start texting</p>
          </div>
        )}
      </div>
      <div className="conversation-media-container">media</div>
    </div>
  );
}

export default Conversation;
