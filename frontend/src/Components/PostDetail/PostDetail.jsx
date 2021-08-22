import React from "react";
import "./PostDetail.css";

function PostDetail(props) {
  return (
    <div className="post-detail-container">
      <div className="img-area">
        <img
          className="main-img"
          src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"
        ></img>
        <div className="sub-img">
          <img src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
          <img src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
          <img src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
          <img src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
        </div>
      </div>
      {/* <div className="img-area">
                <img
                    className="main-img" 
                    src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
                <div className="sub-img">
                    
                </div>
            </div> */}
    </div>
  );
}

export default PostDetail;
