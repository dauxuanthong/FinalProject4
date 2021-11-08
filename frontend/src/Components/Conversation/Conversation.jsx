import React, { useEffect, useState, useRef } from "react";
import "./Conversation.css";
import ListConversation from "./ListConversation";
import DetailConversation from "./DetailConversation";
import conversationApi from "../../API/conversationApi";
import Media from "./Media";
import PropTypes from "prop-types";
import { Route } from "react-router";

Conversation.propTypes = {
  socket: PropTypes.object,
};

function Conversation(props) {
  //STATE
  const [conversationList, setConversationList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [newMessage, setNewMessage] = useState({});
  const [newMessageSocket, setNewMessageSocket] = useState({});
  const [trigger, setTrigger] = useState(0);
  const [newImageMedia, setNewImageMedia] = useState({});
  const [partnerIdMedia, setPartnerIdMedia] = useState(-1);
  const [newMarker, setNewMarker] = useState({
    belongTo: "",
    location: {
      latitude: "",
      longitude: "",
    },
  });

  //PROPS
  const { socket } = props;

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
    socket.current?.on("getMessage", (message) => {
      setNewMessageSocket(message);
      setNewMessage(message);
      if (message.type === "image") {
        setNewImageMedia({ message: message.message });
      }
    });
    // eslint-disable-next-line
  }, []);

  //New-user
  // useEffect(() => {
  //   socket.current.emit("addUser", currentUserId);
  // }, [currentUserId]);

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
          type: message.type,
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

  //Media func
  const getImageMedia = (image) => {
    setNewImageMedia(image);
  };

  const getNewMapMessage = (jsonData) => {
    setNewMessage(jsonData);
  };

  const getPartnerId = (id) => {
    setPartnerIdMedia(id);
  };

  const getMapMarkers = (stringData) => {
    const splitStringData = stringData.location.split(":");
    setNewMarker({
      belongTo: stringData.belongTo,
      location: {
        latitude: splitStringData[0],
        longitude: splitStringData[1],
      },
    });
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
                getImageMedia={getImageMedia}
                getPartnerId={getPartnerId}
                getMapMarkers={getMapMarkers}
              />
            </div>
          )}
        />
      )}

      <Route
        exact
        path="/Message"
        render={() => (
          <div className="conversation-media-container">
            <div className="null-media-div">
              <div className="null-Media-image-area">
                <p></p>
              </div>
              <div className="null-Media-map-area">
                <p></p>
              </div>
            </div>
          </div>
        )}
      />
      <Route
        path="/Message/:conversationId"
        render={() => (
          <div className="conversation-media-container">
            <Media
              newImageMedia={newImageMedia}
              updateConversationList={updateConversationList}
              getNewMapMessage={getNewMapMessage}
              socket={socket}
              partnerIdMedia={partnerIdMedia}
              newMarker={newMarker}
            />
          </div>
        )}
      />
    </div>
  );
}

export default Conversation;
