import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./AuctionPostDetail.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import parseHtml from "html-react-parser";
import { useParams } from "react-router-dom";
import postApi from "../../../API/postApi";
import { useNotifications } from "@mantine/notifications";
import { useHistory } from "react-router";
import conversationApi from "../../../API/conversationApi";
import auctionRoomApi from "../../../API/auctionRoomApi";

AuctionPostDetail.propTypes = {};

function AuctionPostDetail(props) {
  //STACK
  const [auctionData, setAuctionData] = useState({
    id: "",
    imageList: [],
    productName: "",
    type: [],
    quantity: "",
    description: "",
    firstPrice: "",
    stepPrice: "",
    buyItNow: "",
    endAt: "",
    auctionRoomsId: "",
  });

  const [mainImg, setMainImg] = useState("");

  //PARAM
  const { id } = useParams();

  //USE-NOTIFICATION
  const notifications = useNotifications();

  //USE-history
  const history = useHistory();

  //EFFECT
  useEffect(() => {
    const getAuctionDetail = async () => {
      const auctionDetailRes = await postApi.auctionPostDetail(id);
      setAuctionData(auctionDetailRes);
      setMainImg(auctionDetailRes.imageList[0]);
    };
    getAuctionDetail();
  }, []);
  //slider
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  //FUNCTION
  const contact = async (id, type) => {
    const data = {
      postId: id,
      postType: type,
    };
    try {
      const contactRes = await conversationApi.contact(data);
      if (contactRes.message === "duplicated userId") {
        return notifications.showNotification({
          color: "red",
          title: "This post belong to you",
          message: `you can't contact with yourself!`,
          autoClose: 3000,
        });
      }
      history.push(`/Message/${contactRes.conversationId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const joinRoom = async (roomId) => {
    const joinRoomRes = await auctionRoomApi.joinAuctionRoom({ roomId: roomId });
    if (joinRoomRes.message === "OK") {
      return history.push(`/auctionRoom/${roomId}`);
    } else {
      return notifications.showNotification({
        color: "red",
        title: "Error",
        message: `system error! Please try again later`,
        autoClose: 3000,
      });
    }
  };

  const imgOnChange = (index) => {
    setMainImg(auctionData.imageList[index]);
  };
  return (
    <div className="AuctionPostDetail-container">
      <div className="AuctionPostDetail-div">
        <div className="AuctionPostDetail-image-area">
          <img className="AuctionPostDetail-main-img" src={mainImg} alt="main product"></img>
          <div className="AuctionPostDetail-slider-div">
            <div className="AuctionPostDetail-slider-div">
              <Slider {...settings}>
                {auctionData.imageList.map((item) => (
                  <div key={auctionData.imageList.indexOf(item)}>
                    <img
                      className="AuctionPostDetail-sub-image"
                      src={item}
                      alt="main product"
                      onClick={() => imgOnChange(auctionData.imageList.indexOf(item))}
                    ></img>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
        <div className="AuctionPostDetail-info-area">
          <p className="AuctionPostDetail-productName">{auctionData.productName}</p>
          <div style={{ overflow: "hidden", width: 475, height: 23, marginBottom: 5 }}>
            <p className="AuctionPostDetail-type">Product type: </p>
            {auctionData.type.map((item) => (
              <p key={auctionData.type.indexOf(item)} className="AuctionPostDetail-type-item">
                {item}
              </p>
            ))}
          </div>
          <p
            style={{
              fontSize: 16,
              fontWeight: "550",
              color: "rgba(0, 0, 0, 0.767)",
            }}
          >
            Quantity available: {auctionData.quantity}
          </p>
          <div className="AuctionPostDetail-info-note">
            <p style={{ fontSize: 14 }}>{parseHtml(auctionData.description)}</p>
          </div>
          <div style={{ marginTop: 5 }}>
            <p className="AuctionPostDetail-info-price-label">First price:</p>
            <p className="AuctionPostDetail-info-price-number">
              {" "}
              {new Intl.NumberFormat("vi", {
                style: "currency",
                currency: "VND",
              }).format(auctionData.firstPrice)}
            </p>
          </div>
          <div style={{ marginTop: 5 }}>
            <p className="AuctionPostDetail-info-price-label">Step price:</p>
            <p className="AuctionPostDetail-info-price-number">
              {" "}
              {new Intl.NumberFormat("vi", {
                style: "currency",
                currency: "VND",
              }).format(auctionData.stepPrice)}
            </p>
          </div>
          <div style={{ marginTop: 5 }}>
            <p className="AuctionPostDetail-info-price-label">Buy it now:</p>
            <p className="AuctionPostDetail-info-price-number">
              {" "}
              {new Intl.NumberFormat("vi", {
                style: "currency",
                currency: "VND",
              }).format(auctionData.buyItNow)}
            </p>
          </div>
          <div style={{ marginTop: 5 }}>
            <p className="AuctionPostDetail-info-price-label">Auction ends at: </p>
            <p
              style={{
                fontSize: 17,
                fontWeight: 550,
                color: "red",
                display: "inline-block",
                marginLeft: 5,
              }}
            >
              {new Date(auctionData.endAt).toLocaleString()}
            </p>
          </div>
          <div className="AuctionPostDetail-button-div">
            <button
              style={{ backgroundColor: "#a3b6da" }}
              onClick={() => {
                contact(auctionData.id, "Auction");
              }}
            >
              CONTACT NOW
            </button>
            <button
              style={{ backgroundColor: "#88b2c0" }}
              onClick={() => joinRoom(auctionData.auctionRoomsId)}
            >
              JOIN ROOM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionPostDetail;
