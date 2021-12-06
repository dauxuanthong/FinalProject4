import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./PostLists.css";
import LinesEllipsis from "react-lines-ellipsis";
import { Modal, NumberInput, Divider } from "@mantine/core";
import { useHistory } from "react-router";
import postApi from "../../../API/postApi";
import { useNotifications } from "@mantine/notifications";
import { FiArchive } from "react-icons/fi";
import { GiMoneyStack } from "react-icons/gi";

PostLists.propTypes = {
  postList: PropTypes.array,
  deletePostUpdate: PropTypes.func,
  updatePostList: PropTypes.func,
};

function PostLists(props) {
  //STATE
  // const [postItem, setPostItem] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [focusPost, setFocusPost] = useState({
    postId: 0,
    postName: "",
  });
  const [focusPostEdit, setFocusEdit] = useState({
    quantity: 0,
    price: 0,
  });
  //PROPS
  const { postList, deletePostUpdate, updatePostList } = props;

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

  const editPost = async () => {
    const data = {
      postId: focusPost.postId,
      quantity: focusPostEdit.quantity,
      price: String(focusPostEdit.price),
    };
    const editPostRes = await postApi.editPost(data);
    console.log(editPostRes);
    updatePostList(editPostRes);
    setEditModal(false);
    setFocusPost({
      postId: 0,
      postName: "",
    });
    setFocusEdit({
      quantity: 0,
      price: 0,
    });
    return notifications.showNotification({
      color: "green",
      title: "Edit post successfully",
      autoClose: 1500,
    });
  };

  return (
    <div>
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
                // onClick={() => {
                //   history.push(`/managePosts/edit/${item.id}`);
                // }}
                onClick={() => {
                  setFocusPost({
                    postId: item.id,
                    postName: item.productName,
                  });
                  setFocusEdit({
                    quantity: Number(item.quantity),
                    price: Number(item.price),
                  });
                  setEditModal(true);
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
      <Modal
        hideCloseButton
        opened={editModal}
        onClose={() => {
          setEditModal(false);
          setFocusPost({
            postId: 0,
            postName: "",
          });
          setFocusEdit({
            quantity: 0,
            price: 0,
          });
        }}
        title={`Edit ${focusPost.postName} post`}
      >
        <div className="PostList-edit-modal-div">
          <NumberInput
            defaultValue={focusPostEdit.quantity}
            placeholder="Quantity"
            label="Current Quantity"
            radius="md"
            required
            hideControls
            min={1}
            icon={<FiArchive />}
            onChange={(val) => setFocusEdit({ ...focusPostEdit, quantity: val })}
          />
          <NumberInput
            style={{ marginTop: 15 }}
            defaultValue={focusPostEdit.price}
            placeholder="Price your product"
            label="Price (Vnd)"
            radius="md"
            required
            hideControls
            min={1000}
            icon={<GiMoneyStack />}
            onChange={(val) => setFocusEdit({ ...focusPostEdit, price: val })}
          />
        </div>
        <div className="PostList-delete-modal-button">
          <button
            style={{ backgroundColor: "#228BE6", marginRight: 30 }}
            onClick={() => {
              setEditModal(false);
              setFocusPost({
                postId: 0,
                postName: "",
              });
              setFocusEdit({
                quantity: 0,
                price: 0,
              });
            }}
          >
            Cancel
          </button>
          <button
            style={{ backgroundColor: "#FF4D4F", marginLeft: 30 }}
            onClick={() => {
              editPost();
            }}
          >
            Edit
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default PostLists;
