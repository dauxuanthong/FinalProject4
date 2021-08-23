import React from "react";
import "./PostDetail.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

function PostDetail(props) {
  // SLIDE
  let settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 23000,
    arrows: true,
  };

  return (
    <div className="post-detail-container">
      <div className="img-area">
        <img src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
        <div className="sub-img">
          <Slider {...settings}>
            <div className="sub-img-div">
              <img src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
            </div>
            <div className="sub-img-div">
              <img src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
            </div>
            <div className="sub-img-div">
              <img src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
            </div>
            <div className="sub-img-div">
              <img src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
            </div>
          </Slider>
        </div>
      </div>
      <div className="info-area">
        <div className="product-name">
          <p>Product name</p>
        </div>
        <div className="product-detail">
          <p>Product type: </p>
          <p>Detail: </p>
        </div>
        <div className="product-owner">
          <img src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
          <p>User Name</p>
        </div>
        <div className="product-function">
          <button>Contact with product owner</button>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
