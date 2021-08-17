import React from "react";
import { Tabs, Tab } from "@mantine/core";
import "./Profile.css";
import { Avatar } from "@mantine/core";
import AccountManage from "./AccountMange/AccountManage.jsx";
import InfoManage from "./InfoMange/InfoManage.jsx";

function Profile(props) {
  return (
    <div className="profile-container">
      <div className="profile-display">
        <div className="public-profile">
          <Avatar size={150} radius="md" src={null} />
          <p>User Name</p>
        </div>
        <div className="private-profile">Private Product</div>
      </div>
      <div className="profile-function">
        <Tabs 
          classNames={{
            root: 'root-profile',
            tabsListWrapper: 'tabsListWrapper-profile',
            tabsList: 'tabsList-profile',
            body: 'body-profile',
            tabControl: 'your-tabControl-class',
            tabActive: 'your-tabActive-class',
            tabInner: 'your-tabInner-class',
            tabLabel: 'your-tabLabel-class',
            tabIcon: 'your-tabIcon-class',
          }}
          color="cyan" variant="pills">
          <Tab label="Gallery">Gallery tab content</Tab>
          <Tab label="Manage Profile"><InfoManage/></Tab>
          <Tab label="Manage Account"><AccountManage/></Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;
