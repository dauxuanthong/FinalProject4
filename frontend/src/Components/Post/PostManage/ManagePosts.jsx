import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@mantine/core";
import { RiAuctionLine } from "react-icons/ri";
import { RiListCheck2 } from "react-icons/ri";
import "./ManagePosts.css";
import PostLists from "./PostLists";
import AuctionRooms from "./AuctionRooms";

function ManagePosts(props) {
  //STATE
  const [statisticData, setStatisticData] = useState([]);
  //EFFECT

  //FUNCTION
  const getStatistic = (jsonData) => {
    const ArrayData = Object.entries(jsonData);
    console.log("ArrayData: ", ArrayData);
    setStatisticData(ArrayData);
  };

  const updateStatistic = (trigger) => {
    if (trigger === "Expired") {
      const newStatistic = [
        [statisticData[0][0], statisticData[0][1] - 1],
        [statisticData[1][0], statisticData[1][1] - 1],
      ];
      setStatisticData(newStatistic);
    } else {
      const newStatistic = [
        [statisticData[0][0], statisticData[0][1] - 1],
        [statisticData[1][0], statisticData[1][1]],
      ];
      setStatisticData(newStatistic);
    }
  };
  //EVENT

  return (
    <div className="ManagePost-Container">
      <div className="ManagePost-Tabs-div">
        <Tabs>
          <Tab label="All Posts" icon={<RiListCheck2 />}>
            <PostLists getStatistic={getStatistic} updateStatistic={updateStatistic} />
          </Tab>
          <Tab label="Auction Room" icon={<RiAuctionLine />}>
            <AuctionRooms />
          </Tab>
        </Tabs>
      </div>
      <div className="ManagePost-statistic">
        <div className="ManagePost-statistic-label">
          <p>STATISTIC</p>
        </div>
        <div className="ManagePost-statistic-detail-div">
          {statisticData?.map((item) => (
            <p key={item[0]}>{`${item[0].charAt(0).toUpperCase() + item[0].slice(1)}: ${
              item[1]
            }`}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManagePosts;
