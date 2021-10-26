import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./PostLists.css";
import LinesEllipsis from "react-lines-ellipsis";
import postApi from "../../../API/postApi";
import { Modal } from "@mantine/core";

PostLists.propTypes = {
  getStatistic: PropTypes.array,
  updateStatistic: PropTypes.func,
};

function PostLists(props) {
  //STATE
  const [postItem, setPostItem] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [focusPost, setFocusPost] = useState({
    postId: 0,
    postName: "",
    postType: "",
  });
  //PROPS
  const { getStatistic, updateStatistic } = props;
  //USE-EFFECT
  //get my post
  useEffect(() => {
    const getMyPost = async () => {
      const myPostRes = await postApi.getMyPost();
      getStatistic(myPostRes.statistic);
      setPostItem(myPostRes.allMyPost);
    };
    getMyPost();
    // eslint-disable-next-line
  }, []);

  //EVENT
  const deletePost = async () => {
    try {
      const data = {
        postID: focusPost.postId,
        postType: focusPost.postType,
      };
      const deletePostRes = await postApi.deletePost({ data });
      if (deletePostRes === "OK") {
        //update statistic
        const postFocus = postItem.find((item) => item.postId === focusPost.postId);
        if (postFocus?.status === "Expired") {
          updateStatistic("Expired");
        } else {
          updateStatistic("Active");
        }
        //remove post in state list
        const newPostItem = postItem.filter((item) => item.postId !== focusPost.postId);
        setPostItem(newPostItem);
      }
      setDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="PostList-detail-div">
        {postItem?.map((item) => (
          <div className="PostList-detail-item-div" key={item.postId}>
            <img className="PostList-detail-item-image" src={item.imageUrl} alt="Product"></img>
            <div className="PostList-detail-item-info">
              <LinesEllipsis
                className="PostList-detail-item-info-ellipsis"
                text={`Product name: ${item.productName}`}
                maxLine="1"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
              <p>{`Post type: ${item.postType}`}</p>
              <p>{`Status: ${item.status}`}</p>
              <p>{`Upload at: ${new Date(new Date(item.uploadAt))
                .toLocaleString()
                .replace(",", "")}`}</p>
            </div>
            <div className="PostList-detail-item-func">
              <button style={{ backgroundColor: "rgb(86, 173, 133)" }}>Detail</button>
              <button style={{ backgroundColor: "rgb(86, 127, 173)" }}>Edit</button>
              <button
                style={{ backgroundColor: "#FF4D4F" }}
                onClick={() => {
                  setFocusPost({
                    postId: item.postId,
                    postName: item.productName,
                    postType: item.postType,
                  });
                  setDeleteModal(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        hideCloseButton
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
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
      </Modal>
    </>
  );
}

export default PostLists;
