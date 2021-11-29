import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./PostLists.css";
import LinesEllipsis from "react-lines-ellipsis";
import { Modal } from "@mantine/core";
import { useHistory } from "react-router";
import postApi from "../../../API/postApi";
import { useNotifications } from "@mantine/notifications";

PostLists.propTypes = {
  postList: PropTypes.array,
  deletePostUpdate: PropTypes.func,
};

function PostLists(props) {
  //STATE
  // const [postItem, setPostItem] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [focusPost, setFocusPost] = useState({
    postId: 0,
    postName: "",
  });
  //PROPS
  const { postList, deletePostUpdate } = props;

  //USE-history
  const history = useHistory();

  //USE-NOTIFICATION
  const notifications = useNotifications();

  const deletePost = async () => {
    try {
      const deletePostRes = await postApi.deletePost({ postId: focusPost.postId });
      if (deletePostRes.message === "ERROR") {
        return notifications.showNotification({
          color: "red",
          title: "System error",
          message: `An error occurred during the transaction, please try again later!`,
          autoClose: 3000,
        });
      }
      deletePostUpdate(focusPost.postId);
      setDeleteModal(false);
      setFocusPost({
        postId: 0,
        postName: "",
      });
      return notifications.showNotification({
        color: "green",
        title: "Remove post successfully",
        autoClose: 1500,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="PostList-detail-div">
        {postList.map((item) => (
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
              <p>Quantity: {item.quantity}</p>
              <p>
                Price:{" "}
                {new Intl.NumberFormat("vi", {
                  style: "currency",
                  currency: "VND",
                }).format(item.price)}
              </p>
              <p>{`Upload at: ${new Date(new Date(item.createAt))
                .toLocaleString()
                .replace(",", "")}`}</p>
            </div>
            <div className="PostList-detail-item-func">
              <button
                style={{ backgroundColor: "rgb(86, 173, 133)" }}
                onClick={() => {
                  history.push(`/postDetail/post/${item.id}`);
                }}
              >
                Detail
              </button>
              <button
                style={{ backgroundColor: "rgb(86, 127, 173)" }}
                onClick={() => {
                  history.push(`/managePosts/edit/${item.id}`);
                }}
              >
                Edit
              </button>
              <button
                style={{ backgroundColor: "#FF4D4F" }}
                onClick={() => {
                  setFocusPost({
                    postId: item.id,
                    postName: item.productName,
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
      </Modal>
    </>
  );
}

export default PostLists;
