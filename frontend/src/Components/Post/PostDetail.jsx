import React, { useState, useEffect } from "react";
import "./PostDetail.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from "react-router-dom";
import postApi from "../../API/postApi";
import parseHtml from "html-react-parser";

function PostDetail(props) {
  //STATE
  const [imgList, setImgList] = useState([]);
  const [postData, setPostData] = useState({
    productName: "",
    quantity: "",
    price: "",
    description: "",
  });
  //USE-PARAMS
  const { id } = useParams();

  // USE-EFFECT
  useEffect(() => {
    const getNormalPostDetail = async () => {
      const getNormalPostDetailRes = await postApi.normalPostDetail(id);
      setImgList(getNormalPostDetailRes.imageUrl);
      setPostData({
        productName: getNormalPostDetailRes.productName,
        quantity: getNormalPostDetailRes.quantity,
        price: getNormalPostDetailRes.price,
        description: getNormalPostDetailRes.description,
      });
    };
    getNormalPostDetail();
  }, []);

  //react-slick
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    swipeToSlide: true,
  };

  return (
    <div className="PostDetail-container">
      <div className="PostDetail-div-1st">
        <div className="PostDetail-image-area">
          <img className="PostDetail-main-image" src={imgList[0]} alt="product"></img>
          <div className="PostDetail-image-slide-div">
            <Slider {...settings} className="PostDetail-image-slide">
              {imgList.map((item) => (
                <div key={imgList.indexOf(item)} className="PostDetail-image-slide-div-item">
                  <img src={item} alt="product" className="PostDetail-image-slide-item"></img>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="PostDetail-info-area">
          <p className="PostDetail-info-productName">{postData.productName}</p>
          <div className="PostDetail-info-middle-part">
            <p className="PostDetail-info-productType">Product type: </p>
            <p className="PostDetail-info-productQuantity">Quantity: {postData.quantity}</p>
            <p className="PostDetail-info-description">{parseHtml(postData.description)}</p>
          </div>
          <p className="PostDetail-info-price">
            {new Intl.NumberFormat("vi", {
              style: "currency",
              currency: "VND",
            }).format(postData.price)}
          </p>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 20.5 }}
          >
            <button className="PostDetail-info-button">CONTACT NOW</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
