import React, { useEffect, useState } from "react";
import "./PostManage.css";
import { Divider } from "@mantine/core";
import LinesEllipsis from "react-lines-ellipsis";
import postApi from "../../../API/postApi";
import { Modal } from "@mantine/core";

function PostManage(props) {
  //STATE
  const [statistic, setStatistic] = useState({});
  const [postItem, setPostItem] = useState([]);
  const [postFocusId, setPostFocusId] = useState(Number);
  const [deleteModal, setDeleteModal] = useState(false);
  const [productFocusName, setProductFocusName] = useState("");
  const [postFocusType, setPostFocusType] = useState("");

  //USE-EFFECT
  useEffect(() => {
    const getMyPost = async () => {
      const myPostRes = await postApi.getMyPost();
      setStatistic(myPostRes.statistic);
      setPostItem(myPostRes.allMyPost);
    };
    getMyPost();
    // eslint-disable-next-line
  }, []);

  //EVENT
  const deletePost = async () => {
    try {
      const data = {
        postID: postFocusId,
        postType: postFocusType,
      };
      const deletePostRes = await postApi.deletePost({ data });
      if (deletePostRes === "OK") {
        //remove post in state list
        const newPostItem = postItem.filter((item) => item.postId !== postFocusId);
        setPostItem(newPostItem);
        //update statistic
        const postFocus = postItem.find((item) => item.postId === postFocusId);
        if (postFocus?.status === "Expired") {
          console.log("Expired");
          setStatistic({
            posts: statistic.posts - 1,
            expired: statistic.expired - 1 === 0 ? 0 : statistic.expired - 1,
          });
        } else {
          setStatistic({
            posts: statistic.posts - 1,
            expired: statistic.expired,
          });
        }
      }
      setDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="PostManage-container">
      <div className="PostManage-component">
        {/*Statistic*/}
        <div className="PostManage-list">
          <p style={{ fontSize: 18, color: "rgba(20, 61, 150, 0.747)", fontWeight: 600 }}>
            POST LIST
          </p>
          <div className="PostManage-post-list">
            {postItem?.map((item) => (
              <div key={item.postId}>
                <Divider />
                <div className="PostManage-post-list-item">
                  <div className="PostManage-post-list-item-img">
                    <img src={item.imageUrl} alt="Product"></img>
                  </div>
                  <div className="PostManage-post-list-item-info">
                    <LinesEllipsis
                      className="PostManage-post-list-item-ellipsis"
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
                  <div className="PostManage-post-list-item-button">
                    <button style={{ backgroundColor: "rgb(86, 173, 133)" }}>Detail</button>
                    <button style={{ backgroundColor: "rgb(86, 127, 173)" }}>Edit</button>
                    <button
                      style={{ backgroundColor: "#FF4D4F" }}
                      onClick={() => {
                        setPostFocusId(item.postId);
                        setDeleteModal(true);
                        setProductFocusName(item.productName);
                        setPostFocusType(item.postType);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="PostManage-statistic">
          <div className="PostManage-statistic-title">
            <p>POST STATISTIC</p>
          </div>
          <Divider style={{ width: 200 }} />
          <div className="PostManage-statistic-item">
            <p>{`Posts: ${statistic.posts}`}</p>
            <p>{`Expired: ${statistic.expired}`}</p>
          </div>
        </div>
      </div>
      {/*Delete modal */}
      <Modal
        hideCloseButton
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Remove your post!"
      >
        <div className="delete-modal-div">
          <p>Are you sure to delete the post of {productFocusName} product?</p>
          <div className="delete-modal-button">
            <button
              style={{ backgroundColor: "#228BE6" }}
              onClick={() => {
                setPostFocusId(0);
                setDeleteModal(false);
                setProductFocusName("");
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
    </div>
  );
}

export default PostManage;
