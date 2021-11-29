import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./AuctInfo.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import parseHtml from "html-react-parser";
import postApi from "../../API/postApi";
import conversationApi from "../../API/conversationApi";
import { useHistory } from "react-router";
import { useNotifications } from "@mantine/notifications";
AuctInfo.propTypes = {
  roomId: PropTypes.number,
};

function AuctInfo(props) {
  //STATE
  const [auctionData, setAuctionData] = useState({
    postId: 0,
    imageList: [],
    productName: "",
    type: [],
    quantity: "",
    description: "",
  });

  const [mainImg, setMainImg] = useState("");

  //PROPS
  const { roomId } = props;

  //USE-history
  const history = useHistory();

  //USE-NOTIFICATION
  const notifications = useNotifications();

  //EFFECT
  useEffect(() => {
    const getAuctionDetail = async () => {
      if (roomId) {
        const auctionDetailRes = await postApi.auctionRoomPostDetail(roomId);
        setAuctionData(auctionDetailRes);
        setMainImg(auctionDetailRes.imageList[0]);
      }
    };
    getAuctionDetail();
  }, [roomId]);

  //slider
  const settings = {
    arrows: false,
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
          autoClose: 1500,
        });
      }
      history.push(`/Message/${contactRes.conversationId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const changeMainImg = (index) => {
    setMainImg(auctionData.imageList[index]);
  };

  return (
    <div className="AuctInfo-container">
      <div className="AuctInfo-leftPart">
        <img className="AuctInfo-main-img" src={mainImg}></img>
        <div className="AuctInfo-slider">
          <Slider {...settings}>
            {auctionData.imageList.map((item) => (
              <div key={auctionData.imageList.indexOf(item)}>
                <img
                  className="AuctInfo-sub-image"
                  src={item}
                  alt="main product"
                  onClick={() => changeMainImg(auctionData.imageList.indexOf(item))}
                ></img>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="AuctInfo-rightPart">
        <p className="AuctInfo-product-name"> {auctionData.productName}</p>
        <div className="AuctInfo-product-description-div">
          <div className="AuctInfo-product-tag-div">
            <p className="AuctInfo-product-tag-label">Product type: </p>
            {auctionData.type.map((item) => (
              <p className="AuctInfo-product-tag-item">{item}</p>
            ))}
          </div>
          <p className="AuctInfo-product-quantity">Quantity: {auctionData.quantity}</p>
          <p style={{ fontSize: 14 }}>{parseHtml(auctionData.description)}</p>
        </div>
        <div className="AuctInfo-product-button-div">
          <button
            onClick={() => {
              contact(auctionData.postId, "Auction");
            }}
          >
            GET CONTACT NOW
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuctInfo;
