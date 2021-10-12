import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./DetailConversation.css";
import { Divider } from "@mantine/core";
import { IoIosSend } from "react-icons/io";
import { Textarea } from "@mantine/core";
import conversationApi from "../../API/conversationApi";
import { Avatar } from "@mantine/core";
import { BsImages } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useNotifications } from "@mantine/notifications";
import { FaMapMarkerAlt } from "react-icons/fa";

DetailConversation.propTypes = {
  socket: PropTypes.object,
  updateConversationList: PropTypes.func,
  newMessageProp: PropTypes.object,
  getImageMedia: PropTypes.func,
  getPartnerId: PropTypes.func,
  getMapMarkers: PropTypes.func,
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
  const [scrollTriggerAuto, setScrollTriggerAuto] = useState(0);
  const [imageButtonStatus, setImageButtonStatus] = useState(false);
  const [imgFile, setImgFile] = useState({});
  const [imgUrl, setImgUrl] = useState("");
  //PROP
  const {
    socket,
    updateConversationList,
    newMessageProp,
    getImageMedia,
    getPartnerId,
    getMapMarkers,
  } = props;

  //USER-REF
  const scrollRef = useRef();

  //USE-PARAMS
  const { conversationId } = useParams();

  //USE-EFFECT
  useEffect(() => {
    try {
      const getConversationDetail = async () => {
        const getConversationDetailRes = await conversationApi.getConversationDetail(
          conversationId
        );
        setPartnerInfo(getConversationDetailRes.partnerInfo);
        //Get partnerID for media socket
        getPartnerId(getConversationDetailRes.partnerInfo.id);
        setConversationDetail(getConversationDetailRes.conversationDetail);
        // to myself in future: trigger Scroll for first times contact. Don't delete
        setScrollTriggerAuto(scrollTriggerAuto === 0 ? 1 : 0);
      };
      getConversationDetail();
    } catch (error) {
      console.log(error);
    }
  }, [conversationId]);

  useEffect(() => {
    if (
      Object.keys(newMessageProp).length &&
      newMessageProp.conversationId === Number(conversationId)
    ) {
      const newPromise = new Promise((resolve, reject) => {
        setConversationDetail((pre) => {
          return [...pre, newMessageProp];
        });
        return resolve();
      });
      newPromise
        .then(() => {
          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        })
        .catch((err) => console.log(err));
    }
  }, [newMessageProp]);

  useEffect(() => {
    if (conversationDetail.length !== 0) {
      if (!scrollRef.current) {
        setScrollTriggerAuto(scrollTriggerAuto === 0 ? 1 : 0);
      }
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "auto" });
      }, 300);
    }
  }, [scrollTriggerAuto, conversationId]);

  //USE-NOTIFICATION
  const notifications = useNotifications();

  //DROP-ZONE
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/jpg",
    onDropAccepted: async (files) => {
      //add file to ImgListFile
      setImgFile(files[0]);
      //File reader handle
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImgUrl(reader.result);
        }
      };
      return reader.readAsDataURL(files[0]);
    },
    onDropRejected: () => {
      notifications.showNotification({
        color: "red",
        title: "Load file failed",
        message: `File type is not accepted (.jpg/.jpeg/.png only)`,
        autoClose: 3000,
      });
    },
  });

  //STYLE
  const partnerMessageColor = "#a0a6b1";
  const messageColor = "#768eb8";

  //function
  const SendMessage = async () => {
    try {
      if (newMessage.trim().length > 0) {
        const sendMessageRes = await conversationApi.sendMessage({ newMessage, conversationId });
        //PROMISE
        const promise = new Promise((resolve) => {
          setConversationDetail([...conversationDetail, sendMessageRes]);
          return resolve();
        });
        promise
          .then(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
          })
          .catch((err) => console.log(err));
        //socket send message
        socket.current.emit("sendMessage", partnerInfo.id, sendMessageRes);
        setNewMessage("");
        updateConversationList(sendMessageRes);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      e.preventDefault();
      SendMessage();
    }
  };
  const sendImageMessage = async () => {
    if (Object.keys(imgFile).length === 0 || imgUrl.length === 0) {
      return notifications.showNotification({
        color: "red",
        title: "Send image failed",
        message: `Drag and drop an image to send it`,
        autoClose: 3000,
      });
    }
    //Upload image
    let formData = new FormData();
    formData.append("imageFile", imgFile);
    try {
      const sendImageMessageRes = await conversationApi.sendImgMessage(formData, conversationId);
      //set state & send to socket
      socket.current.emit("sendMessage", partnerInfo.id, sendImageMessageRes);
      //PROMISE
      const promise = new Promise((resolve) => {
        setConversationDetail([...conversationDetail, sendImageMessageRes]);
        return resolve();
      });
      promise
        .then(() => {
          setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 300);
        })
        .catch((err) => console.log(err));
      //socket send message
      updateConversationList(sendImageMessageRes);
      setImgFile({});
      setImgUrl("");
      //update MEDIA
      getImageMedia({ message: sendImageMessageRes.message });
      setImageButtonStatus(false);
    } catch (error) {
      console.log(error);
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
      <Divider
        styles={{
          root: { color: "#A3BAE5" },
        }}
      />
      <div className="DetailConversation-message-div">
        <div className="DetailConversation-display-message">
          {/*messenger*/}
          {conversationDetail?.map((item) =>
            item.senderId === partnerInfo.id ? (
              <div
                ref={scrollRef}
                key={item.id}
                className="DetailConversation-display-message-item-div"
              >
                {item.type === "image" && (
                  <div>
                    <img
                      style={{ maxWidth: 350, borderRadius: 10 }}
                      src={item.message}
                      alt="Image message"
                    ></img>
                  </div>
                )}
                {item.type === "text" && (
                  <div
                    style={{ backgroundColor: partnerMessageColor }}
                    className="DetailConversation-display-message-item"
                  >
                    <p>{item.message}</p>
                  </div>
                )}
                {item.type === "map" && (
                  <div
                    style={{ backgroundColor: partnerMessageColor }}
                    className="DetailConversation-display-message-item"
                  >
                    <div
                      className="DetailConversation-display-map"
                      onClick={() => {
                        getMapMarkers({ belongTo: "partner", location: item.message });
                      }}
                    >
                      <FaMapMarkerAlt />
                      <p>Map marker</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                ref={scrollRef}
                key={item.id}
                style={{ justifyContent: "flex-end" }}
                className="DetailConversation-display-message-item-div"
              >
                {item.type === "image" && (
                  <div>
                    <img
                      style={{ maxWidth: 350, borderRadius: 10 }}
                      src={item.message}
                      alt="Image message"
                    ></img>
                  </div>
                )}
                {item.type === "text" && (
                  <div
                    style={{ backgroundColor: messageColor }}
                    className="DetailConversation-display-message-item"
                  >
                    <p>{item.message}</p>
                  </div>
                )}
                {item.type === "map" && (
                  <div
                    style={{ backgroundColor: messageColor }}
                    className="DetailConversation-display-message-item"
                    onClick={() => {
                      getMapMarkers({ belongTo: "mine", location: item.message });
                    }}
                  >
                    <div className="DetailConversation-display-map">
                      <FaMapMarkerAlt />
                      <p>Map marker</p>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
        <div className="DetailConversation-send-message">
          <Textarea
            classNames={{
              root: "DetailConversation-send-message-textarea-root",
              input: "DetailConversation-send-message-textarea-input",
              rightSection: "DetailConversation-send-message-textarea-rightSection",
            }}
            autosize="true"
            minRows="1"
            maxRows="5"
            multiline="true"
            placeholder="Write your message"
            value={newMessage}
            rightSection={<BsImages onClick={() => setImageButtonStatus(true)} />}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            onKeyDown={handleKeypress}
          />
          {/* <input type="text" placeholder="Write your message" /> */}
          <button onClick={SendMessage}>
            <IoIosSend />
          </button>
        </div>
      </div>
      {/* Modal */}
      <div
        className="DetailConversation-modal-container"
        style={{ zIndex: imageButtonStatus ? 5 : -5 }}
      >
        <div className="DetailConversation-modal-uploadImg">
          <div className="DetailConversation-modal-uploadImg-img-area">
            {imgUrl.length ? (
              <img src={imgUrl} alt="Send image"></img>
            ) : (
              <div>
                <p>SEND IMAGE</p>
              </div>
            )}
          </div>
          <div {...getRootProps({ className: "DetailConversation-modal-uploadImg-dropZone" })}>
            <input {...getInputProps()} />
            <p style={{ fontSize: 14, textAlign: "center" }}>
              Drag 'n' drop here ,or click to select images. Only accept .jpg/.jpeg/.png files type
            </p>
          </div>
          <div className="DetailConversation-modal-uploadImg-button">
            <button
              style={{
                backgroundColor: "#FF4D4F",
                boxShadow: "rgb(238, 96, 99) 0px 1px 2px 0px, rgb(221, 83, 86) 0px 1px 3px 1px",
              }}
              onClick={() => {
                setImageButtonStatus(false);
                setImgFile({});
                setImgUrl("");
              }}
            >
              Cancel
            </button>
            <button
              style={{
                backgroundColor: "#6ecfac",
                boxShadow: "#71d3af 0px 1px 2px 0px, #71bea2 0px 1px 3px 1px",
              }}
              onClick={() => {
                sendImageMessage();
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailConversation;
