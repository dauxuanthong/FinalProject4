import React, { useState } from "react";
import PropTypes from "prop-types";
import "./AuctionPostDetail.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import parseHtml from "html-react-parser";

AuctionPostDetail.propTypes = {};

function AuctionPostDetail(props) {
  //STACK
  const [imageList, setImageList] = useState([
    "https://i.pinimg.com/236x/df/4f/39/df4f3976af7b74014cc753bdc517064b--pusheen-cat-nyan-cat.jpg",
    "https://i.pinimg.com/236x/df/4f/39/df4f3976af7b74014cc753bdc517064b--pusheen-cat-nyan-cat.jpg",
    "https://i.pinimg.com/236x/df/4f/39/df4f3976af7b74014cc753bdc517064b--pusheen-cat-nyan-cat.jpg",
    "https://i.pinimg.com/236x/df/4f/39/df4f3976af7b74014cc753bdc517064b--pusheen-cat-nyan-cat.jpg",
  ]);
  //slider
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <div className="AuctionPostDetail-container">
      <div className="AuctionPostDetail-div">
        <div className="AuctionPostDetail-image-area">
          <img
            className="AuctionPostDetail-main-img"
            src="https://i.pinimg.com/236x/df/4f/39/df4f3976af7b74014cc753bdc517064b--pusheen-cat-nyan-cat.jpg"
            alt="main product"
          ></img>
          <div className="AuctionPostDetail-slider-div">
            <div className="AuctionPostDetail-slider-div">
              <Slider {...settings}>
                {imageList.map((item) => (
                  <div key={imageList.indexOf(item)}>
                    <img
                      className="AuctionPostDetail-sub-image"
                      src={item}
                      alt="main product"
                    ></img>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
        <div className="AuctionPostDetail-info-area">
          <p className="AuctionPostDetail-productName">
            Super Sharp Multi-Purpose 4 Blades Meat Grinder, Garlic, Chilli, Vegetables, Vegetables,
            3 Months Warranty
          </p>
          <div style={{ overflow: "hidden", width: 475, height: 23, marginBottom: 5 }}>
            <p className="AuctionPostDetail-type">Product type: </p>
            <p className="AuctionPostDetail-type-item">Electronic</p>
          </div>
          <p
            style={{
              fontSize: 16,
              fontWeight: "550",
              color: "rgba(0, 0, 0, 0.767)",
            }}
          >
            Quantity available: 2
          </p>
          <div className="AuctionPostDetail-info-note">
            <p style={{ fontSize: 14 }}>
              {parseHtml(
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
              )}
            </p>
          </div>
          <div style={{ marginTop: 5 }}>
            <p className="AuctionPostDetail-info-price-label">First price:</p>
            <p className="AuctionPostDetail-info-price-number">
              {" "}
              {new Intl.NumberFormat("vi", {
                style: "currency",
                currency: "VND",
              }).format(100000)}
            </p>
          </div>
          <div style={{ marginTop: 5 }}>
            <p className="AuctionPostDetail-info-price-label">Step price:</p>
            <p className="AuctionPostDetail-info-price-number">
              {" "}
              {new Intl.NumberFormat("vi", {
                style: "currency",
                currency: "VND",
              }).format(10000)}
            </p>
          </div>
          <div style={{ marginTop: 5 }}>
            <p className="AuctionPostDetail-info-price-label">Buy it now:</p>
            <p className="AuctionPostDetail-info-price-number">
              {" "}
              {new Intl.NumberFormat("vi", {
                style: "currency",
                currency: "VND",
              }).format(1000000)}
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
              15/11/2021 13h56'
            </p>
          </div>
          <div className="AuctionPostDetail-button-div">
            <button style={{ backgroundColor: "#a3b6da" }}>CONTACT NOW</button>
            <button style={{ backgroundColor: "#88b2c0" }}>JOIN ROOM</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionPostDetail;
