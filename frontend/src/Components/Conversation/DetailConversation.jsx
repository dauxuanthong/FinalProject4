import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./DetailConversation.css";
import { Divider } from "@mantine/core";
import { IoIosSend } from "react-icons/io";
import { Textarea } from "@mantine/core";
import conversationApi from "../../API/conversationApi";
import { Avatar } from "@mantine/core";

DetailConversation.propTypes = {
  conversationId: PropTypes.number,
};

function DetailConversation(props) {
  //USE-STATE
  const [partnerInfo, setPartnerInfo] = useState({
    id: "",
    userName: "",
    avatar: "",
  });
  const [conversationDetail, setConversationDetail] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  //PROP
  const { conversationId } = props;
  //USE-EFFECT
  useEffect(() => {
    try {
      const getConversationDetail = async () => {
        const getConversationDetailRes = await conversationApi.getConversationDetail(
          conversationId
        );
        setPartnerInfo(getConversationDetailRes.partnerInfo);
        setConversationDetail(getConversationDetailRes.conversationDetail);
      };
      getConversationDetail();
    } catch (error) {
      console.log(error);
    }
  }, []);

  //function
  const SendMessage = () => {
    console.log(newMessage);
    setNewMessage("");
  };
  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      e.preventDefault();
      SendMessage();
    }
  };
  return (
    <div className="DetailConversation">
      <div className="DetailConversation-info-div">
        <Avatar
          src={partnerInfo.avatar}
          styles={{ root: { marginLeft: 5 } }}
          size={40}
          radius={50}
        />
        <p>{partnerInfo.userName}</p>
      </div>
      <Divider />
      <div className="DetailConversation-message-div">
        <div className="DetailConversation-display-message">
          {/*messenger*/}
          {conversationDetail?.map((item) =>
            item.senderId === partnerInfo.id ? (
              <div className="DetailConversation-display-message-item-div">
                <div className="DetailConversation-display-message-item">
                  <p>{item.message}</p>
                </div>
              </div>
            ) : (
              <div
                style={{ justifyContent: "flex-end" }}
                className="DetailConversation-display-message-item-div"
              >
                <div className="DetailConversation-display-message-item">
                  <p>{item.message}</p>
                </div>
              </div>
            )
          )}
        </div>
        <div className="DetailConversation-send-message">
          <Textarea
            classNames={{
              root: "DetailConversation-send-message-textarea-root",
              input: "DetailConversation-send-message-textarea-input",
            }}
            autosize="true"
            minRows="1"
            maxRows="5"
            multiline="true"
            placeholder="Write your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            onKeyDown={handleKeypress}
          />
          {/* <input type="text" placeholder="Write your message" /> */}
          <button onClick={SendMessage}>
            <IoIosSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailConversation;
