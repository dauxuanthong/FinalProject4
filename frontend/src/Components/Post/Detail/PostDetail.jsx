import React, { useState, useEffect } from "react";
import "./PostDetail.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams, useHistory } from "react-router-dom";
import postApi from "../../../API/postApi";
import parseHtml from "html-react-parser";
import conversationApi from "../../../API/conversationApi";
import { useNotifications } from "@mantine/notifications";

function PostDetail(props) {
  //STATE
  const [imgList, setImgList] = useState([]);
  const [mainImg, setMainImg] = useState("");
  const [postData, setPostData] = useState({
    id: "",
    productName: "",
    quantity: "",
    price: "",
    type: [],
    description: "",
  });
  //USE-PARAMS
  const { id } = useParams();

  //USE-history
  const history = useHistory();

  //USE-NOTIFICATION
  const notifications = useNotifications();

  // USE-EFFECT
  useEffect(() => {
    const getNormalPostDetail = async () => {
      const getNormalPostDetailRes = await postApi.normalPostDetail(id);
      setImgList(getNormalPostDetailRes.imageUrl);
      setMainImg(getNormalPostDetailRes.imageUrl[0]);
      setPostData({
        id: getNormalPostDetailRes.id,
        productName: getNormalPostDetailRes.productName,
        quantity: getNormalPostDetailRes.quantity,
        price: getNormalPostDetailRes.price,
        type: getNormalPostDetailRes.type,
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

  const imgOnChange = (index) => {
    setMainImg(imgList[index]);
  };

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

  return (
    <div className="PostDetail-container">
      <div className="PostDetail-div-1st">
        <div className="PostDetail-image-area">
          <img className="PostDetail-main-image" src={mainImg} alt="product"></img>
          <div className="PostDetail-image-slide-div">
            <Slider {...settings} className="PostDetail-image-slide">
              {imgList.map((item) => (
                <div key={imgList.indexOf(item)} className="PostDetail-image-slide-div-item">
                  <img
                    src={item}
                    alt="product"
                    className="PostDetail-image-slide-item"
                    onClick={() => {
                      imgOnChange(imgList.indexOf(item));
                    }}
                  ></img>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="PostDetail-info-area">
          <p className="PostDetail-info-productName">{postData.productName}</p>
          <div className="PostDetail-info-middle-part">
            <div className="PostDetail-info-productType-div">
              <p className="PostDetail-info-productType">Product type: </p>
              {postData.type.map((item) => (
                <p className="PostDetail-info-productType-item">{item}</p>
              ))}
            </div>
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
            <button
              className="PostDetail-info-button"
              onClick={() => {
                contact(postData.id, "Post");
              }}
            >
              CONTACT NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
