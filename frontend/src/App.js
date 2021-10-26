import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Nav from "./Components/layouts/NavBar/Nav";
import Side from "./Components/layouts/SideBar/Side";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register.jsx";
import Login from "./Components/Login/Login.jsx";
import userApi from "./API/userApi";
import Profile from "./Components/layouts/Profile/Profile";
import PostDetails from "./Components/Post/PostDetail.jsx";
import Post from "./Components/Post/Post.jsx";
import PostManage from "./Components/Post/PostManage/PostManage";
import Conversation from "./Components/Conversation/Conversation";
import ManagePosts from "./Components/Post/PostManage/ManagePosts";
import AuctionRoom from "./Components/AuctionRoom/AuctionRoom";

function App() {
  //STATE
  const [updateTK, setUpdateTK] = useState({
    value: 1,
  });
  const [userStatus, setUserStatus] = useState();
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

  useEffect(() => {
    setUserStatus(localStorage.getItem("status") || "");
  }, []);

  //Function
  const refresh = async () => {
    const newToken = await userApi.refreshToken();
    localStorage.setItem("accessToken", JSON.stringify(newToken));
  };
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
              {userStatus === "" && <Redirect to="/login" />}
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/post" component={Post} />
              <Route exact path="/postManage" component={PostManage} />
              <Route path="/Message" component={Conversation} />
              <Route exact path="/postDetail/post/:id" component={PostDetails} />
              <Route exact path="/managePosts" component={ManagePosts} />
              <Route path="/auctionRoom" component={AuctionRoom} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
