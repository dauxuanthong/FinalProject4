import React, { useState, useEffect } from "react";
import "./Nav.css";
import { Link } from "react-router-dom";
import { Avatar } from "@mantine/core";
import { Menu, MenuItem, MenuLabel, Divider } from "@mantine/core";
import userApi from "../../../API/userApi";
import { ImProfile, ImExit } from "react-icons/im";
import Cookies from "js-cookie";

function Nav(props) {
  //STATE
  const [userStatus, setUserStatus] = useState("");
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  //EFFECT
  useEffect(() => {
    const status = localStorage.getItem("status");
    if (!status) {
      setUserStatus("");
    } else {
      setUserStatus(status);
      const getInfoNav = async () => {
        const navInfoRes = await userApi.navInfo();
        setUserName(navInfoRes.userName);
        setAvatar(navInfoRes.avatar);
      };
      getInfoNav();
    }
  }, [userStatus]);

  //EVENT
  const logout = async () => {
    console.log("onClick");
    const logoutRes = await userApi.logout();
    console.log(logoutRes);
    Cookies.remove("refreshToken");
    localStorage.clear();
    window.location = "/";
  };

  return (
    <div className="nav-div">
      <Link className="home-page" to="/">
        SHW
      </Link>
      {userStatus === "signIn" ? (
        <div className="nav-item-div-sign-in">
          <Menu
            trigger="hover"
            delay={200}
            control={<Avatar size={50} radius="md" src={avatar || null} />}
            controlRefProp="ref"
            transition="slide-down"
            transitionDuration={400}
            transitionTimingFunction="ease"
            menuPosition={{ bottom: -134, right: -74 }}
            styles={{
              label: { fontSize: "16px", textAlign: "center" },
            }}
            // classNames={{
            //   label: 'label-of-menu',
            //   itemLabel: 'item-label-of-menu'
            // }}
          >
            <MenuLabel>{userName}</MenuLabel>
            <Divider />
            <MenuItem>
              <div className="profile">
                <ImProfile style={{ fontSize: "20px", color: "rgb(134, 142, 150)" }} />
                <Link to="/profile">Profile</Link>
              </div>
            </MenuItem>
            <MenuItem>
              <div className="logout" onClick={logout}>
                <ImExit style={{ fontSize: "20px", color: "rgb(134, 142, 150)" }} />
                <p>Logout</p>
              </div>
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <div className="nav-item-div">
          <Link to="login">Login</Link>
          <Link to="register">Register</Link>
        </div>
      )}
    </div>
  );
}

export default Nav;
