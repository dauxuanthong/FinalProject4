import React, { useEffect, useState, useRef } from "react";
import "./Conversation.css";
import ListConversation from "./ListConversation";
import DetailConversation from "./DetailConversation";
import conversationApi from "../../API/conversationApi";
import Media from "./Media";
import io from "socket.io-client";
import { Route } from "react-router";

function Conversation(props) {
  //STATE
  const [conversationList, setConversationList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [newMessage, setNewMessage] = useState({});
  const [newMessageSocket, setNewMessageSocket] = useState({});
  const [trigger, setTrigger] = useState(0);
  const [currentConversation, setCurrentConversation] = useState();
  const [newImageMedia, setNewImageMedia] = useState({});
  //USEREF
  const socket = useRef();

  //USE-EFFECT
  useEffect(() => {
    //Get conversation list
    const getMyConversationList = async () => {
      try {
        //get the conversation list
        const myConversationListRes = await conversationApi.myConversationList();
        //sort the conversation
        const myConversationSort = myConversationListRes.conversationList.sort((a, b) => {
          return (
            new Date(
              b.conversationDetails.length ? b.conversationDetails[0].createAt : b.createAt
            ) -
            new Date(a.conversationDetails.length ? a.conversationDetails[0].createAt : a.createAt)
          );
        });
        setCurrentUserId(myConversationListRes.currentUserId);
        setConversationList(myConversationSort);
      } catch (error) {
        console.log(error);
      }
    };
    getMyConversationList();
  }, [trigger]);

  //initial socket
  useEffect(() => {
    socket.current = io("ws://localhost:3002");
    socket.current.on("getMessage", (message) => {
      setNewMessageSocket(message);
      setNewMessage(message);
      if (message.type === "image") {
        setNewImageMedia({ message: message.message });
      }
    });
    // eslint-disable-next-line
  }, []);

  //New-user
  useEffect(() => {
    socket.current.emit("addUser", currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    if (!conversationList.length) return;
    if (!conversationList.some((item) => item.id === newMessageSocket?.conversationId)) {
      setTrigger(trigger === 0 ? 1 : 0);
    }
    updateConversationList(newMessageSocket);
  }, [newMessageSocket]);

  //FUNCTION
  const updateConversationList = (message) => {
    //get current conversation Message
    const currentConversationData = conversationList.find(
      (item) => item.id === message.conversationId
    );
    const newConversationData = {
      conversationDetails: [
        {
          conversationId: message.conversationId,
          createAt: message.createAt,
          id: message.id,
          message: message.message,
          senderId: message.senderId,
        },
      ],
      createAt: currentConversationData.createAt,
      id: currentConversationData.id,
      users: currentConversationData.users,
    };
    //delete current conversation Message
    const newConversationList = conversationList.filter(
      (item) => item.id !== message.conversationId
    );
    //push on top
    newConversationList.unshift(newConversationData);
    // setState
    setConversationList(newConversationList);
  };

  const getCurrentConversation = (data) => {
    setCurrentConversation(Number(data));
  };

  const getImageMedia = (image) => {
    setNewImageMedia(image);
  };
  return (
    <div className="conversation-container">
      <div className="conversation-list-container">
        <ListConversation conversationList={conversationList} currentUserId={currentUserId} />
      </div>

      <Route
        exact
        path="/Message"
        render={() => (
          <div className="conversation-detail-container">
            <div className="null-conversation-detail">
              <p>Select a chat to start texting</p>
            </div>
          </div>
        )}
      />

      {socket.current && (
        <Route
          path="/Message/:conversationId"
          render={() => (
            <div className="conversation-detail-container">
              <DetailConversation
                updateConversationList={updateConversationList}
                newMessageProp={newMessage}
                socket={socket}
                getCurrentConversation={getCurrentConversation}
                getImageMedia={getImageMedia}
              />
            </div>
          )}
        />
      )}

      <div className="conversation-media-container">
        <Media
          currentConversation={currentConversation ? currentConversation : -1}
          newImageMedia={newImageMedia}
        />
      </div>
    </div>
  );
}

export default Conversation;
