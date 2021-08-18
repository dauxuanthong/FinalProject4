import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@mantine/core";
import "./Profile.css";
import { Avatar } from "@mantine/core";
import AccountManage from "./AccountMange/AccountManage.jsx";
import InfoManage from "./InfoMange/InfoManage.jsx";
import userApi from "../../../API/userApi";
import {HiOutlineMail} from "react-icons/hi";
import {BiHome, BiUser} from "react-icons/bi";
import {MdPhoneAndroid} from "react-icons/md"
import { Divider } from '@mantine/core';

function Profile(props) {
  const [allInfo, setAllInfo] = useState({
    userName: "",
    email: "",
    avatar: "",
    realName: "",
    address: "",
    phoneNumber: "",
    realNameSetting: false,
    addressSetting: false,
    phoneNumberSetting: false,
  });

  useEffect(() => {
    const getAllInfo = async() => {
      const getAllInfoRes = await userApi.allInfo();
      setAllInfo({
        userName: getAllInfoRes.userName,
        email: getAllInfoRes.email,
        avatar: getAllInfoRes.avatar,
        realName: getAllInfoRes.realName,
        address: getAllInfoRes.address,
        phoneNumber: getAllInfoRes.phoneNumber,
        realNameSetting: getAllInfoRes.setting.realName,
        addressSetting: getAllInfoRes.setting.address,
        phoneNumberSetting: getAllInfoRes.setting.phoneNumber,
      });
    };
    getAllInfo();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-display">
        <div className="public-profile">
          <Avatar size={150} radius="md" src={allInfo.avatar}/>
          <p>{allInfo.userName}</p>
        </div>
        <div className="private-profile">
          <div className="private-profile-item">
            <HiOutlineMail/>
            <p>{allInfo.email}</p>
          </div>
          <Divider size="sm"/>
          <div className="private-profile-item">
            <BiUser/>
            <p>{allInfo.realName}</p>
          </div>
          <Divider size="sm"/>
          <div className="private-profile-item">
            <BiHome/>
            <p>{allInfo.address}</p>
          </div>
          <Divider size="sm"/>
          <div className="private-profile-item">
            <MdPhoneAndroid/>
            <p>{allInfo.phoneNumber}</p>
          </div>
          <Divider size="sm"/>
        </div>
      </div>
      <div className="profile-function">
        <Tabs
          classNames={{
            root: "root-profile",
            tabsListWrapper: "tabsListWrapper-profile",
            tabsList: "tabsList-profile",
            body: "body-profile",
          }}
          color="cyan"
          variant="pills"
        >
          <Tab label="Manage Profile">
            <InfoManage allInfo={allInfo}/>
          </Tab>
          <Tab label="Manage Account">
            <AccountManage />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;
