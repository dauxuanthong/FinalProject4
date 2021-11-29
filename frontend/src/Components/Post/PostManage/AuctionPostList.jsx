import React from "react";
import PropTypes from "prop-types";
import "./AuctionPostList.css";
import LinesEllipsis from "react-lines-ellipsis";
import { useHistory } from "react-router";

AuctionPostList.propTypes = {
  auctionPostList: PropTypes.array,
};

function AuctionPostList(props) {
  //PROPS
  const { auctionPostList } = props;

  //USE-history
  const history = useHistory();

  return (
    <>
      <div className="PostList-detail-div">
        {auctionPostList.map((item) => (
          <div className="PostList-detail-item-div" key={item.id}>
            <img className="PostList-detail-item-image" src={item.imageUrl[0]} alt="Product"></img>
            <div className="PostList-detail-item-info">
              <LinesEllipsis
                className="PostList-detail-item-info-ellipsis"
                text={`Product name: ${item.productName}`}
                maxLine="1"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
              <p>
                Buy it now:{" "}
                {new Intl.NumberFormat("vi", {
                  style: "currency",
                  currency: "VND",
                }).format(item.buyItNow)}
              </p>
              <p>
                Current Price:{" "}
                {new Intl.NumberFormat("vi", {
                  style: "currency",
                  currency: "VND",
                }).format(item.auctionRooms.currentPrice)}
              </p>
              <p
                style={{ color: new Date(item.auctionDatetime) < new Date() ? "#FF4D4F" : "black" }}
              >{`End at: ${new Date(new Date(item.auctionDatetime))
                .toLocaleString()
                .replace(",", "")}`}</p>
            </div>
            <div className="PostList-detail-item-func">
              <button
                style={{ backgroundColor: "rgb(86, 173, 133)" }}
                onClick={() => {
                  history.push(`/postDetail/auctionPost/${item.id}`);
                }}
              >
                Detail
              </button>
              <button
                style={{ backgroundColor: "rgb(86, 127, 173)" }}
                onClick={() => {
                  history.push(`/auctionRoom/${item.auctionRooms.id}`);
                }}
              >
                Join Room
              </button>
              {/* <button
                style={{ backgroundColor: "#FF4D4F" }}
                // onClick={() => {
                //   setFocusPost({
                //     postId: item.id,
                //     postName: item.productName,
                //   });
                //   setDeleteModal(true);
                // }}
              >
                Delete
              </button> */}
            </div>
          </div>
        ))}
      </div>
      {/* <Modal
        hideCloseButton
        opened={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setFocusPost({
            postId: 0,
            postName: "",
          });
        }}
        title="Remove your post!"
      >
        <div className="PostList-delete-modal-div">
          <p>Are you sure to delete the post of {focusPost.postName} product?</p>
          <div className="PostList-delete-modal-button">
            <button
              style={{ backgroundColor: "#228BE6" }}
              onClick={() => {
                setDeleteModal(false);
                setFocusPost({
                  postId: 0,
                  postName: "",
                });
              }}
            >
              Cancel
            </button>
            <button
              style={{ backgroundColor: "#FF4D4F" }}
              onClick={() => {
                deletePost();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal> */}
    </>
  );
}

export default AuctionPostList;
