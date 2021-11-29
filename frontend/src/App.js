import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Nav from "./Components/layouts/NavBar/Nav";
import Side from "./Components/layouts/SideBar/Side";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register.jsx";
import Login from "./Components/Login/Login.jsx";
import userApi from "./API/userApi";
import Profile from "./Components/layouts/Profile/Profile";
import PostDetails from "./Components/Post/Detail/PostDetail.jsx";
import AuctionPostDetails from "./Components/Post/Detail/AuctionPostDetail";
import Post from "./Components/Post/Post.jsx";
import Conversation from "./Components/Conversation/Conversation";
import ManagePosts from "./Components/Post/PostManage/ManagePosts";
import AuctionRoom from "./Components/AuctionRoom/AuctionRoom";
import EditPost from "./Components/Post/PostManage/EditPost";
import Search from "./Components/Search/Search";
import io from "socket.io-client";
const socketURL = "ws://localhost:3002";

function App() {
  //STATE
  const [updateTK, setUpdateTK] = useState({
    value: 1,
  });
  const [userStatus, setUserStatus] = useState("signIn");
  const [currentUserId, setCurrentUserId] = useState("");
  //EFFECT
  useEffect(() => {
    refresh();
    setTimeout(() => {
      if (updateTK.value === 1) {
        setUpdateTK({
          value: 2,
        });
      } else {
        setUpdateTK({
          value: 1,
        });
      }
    }, [600000]); // 10 minutes
  }, [updateTK]);

  //setStatus
  useEffect(() => {
    setUserStatus(localStorage.getItem("status") || "");
    const getCurrentUserId = async () => {
      if (localStorage.getItem("status") === "signIn") {
        const currentUserIdRes = await userApi.allInfo();
        setCurrentUserId(currentUserIdRes.id);
      }
    };
    getCurrentUserId();
  }, []);

  useEffect(() => {
    socket.current = io(socketURL);
    socket.current.emit("addUser", currentUserId);
  }, [userStatus, currentUserId]);

  //USEREF
  const socket = useRef();

  //Function
  const refresh = async () => {
    const newToken = await userApi.refreshToken();
    localStorage.setItem("accessToken", JSON.stringify(newToken));
  };
  console.log("USER STATUS: ", userStatus);
  return (
    <Router>
      <div className="main-display">
        <div className="side-bar">
          <Side />
        </div>
        <div className="body-container">
          <Nav />
          <div className="main-container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              {!userStatus && <Redirect to="/login" />}
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/post" component={Post} />
              <Route path="/Message" render={() => <Conversation socket={socket} />} />
              {/*Post*/}
              <Route exact path="/postDetail/post/:id" component={PostDetails} />
              <Route exact path="/postDetail/auctionPost/:id" component={AuctionPostDetails} />
              <Route exact path="/managePosts" component={ManagePosts} />
              <Route exact path="/managePosts/edit/:id" component={EditPost} />
              {/* Auction room */}
              <Route path="/auctionRoom/:roomId" render={() => <AuctionRoom socket={socket} />} />
              {/* SEARCH */}
              <Route exact path="/search/" component={Search} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
