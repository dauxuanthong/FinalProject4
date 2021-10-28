import React, { useState } from "react";
import PropTypes from "prop-types";
import "./AuctHistory.css";
import { Table } from "@mantine/core";

AuctHistory.propTypes = {};

function AuctHistory(props) {
  //STATE
  const [historyData, setHistoryData] = useState([
    {
      id: 1,
      bidder: "User 1",
      bidAmount: "100000",
      bidTime: "12/11/2021 at 13h55'",
    },
    {
      id: 2,
      bidder: "User 1",
      bidAmount: "100000",
      bidTime: "12/11/2021 at 13h55'",
    },
    {
      id: 3,
      bidder: "User 1",
      bidAmount: "100000",
      bidTime: "12/11/2021 at 13h55'",
    },
    {
      id: 4,
      bidder: "User 1",
      bidAmount: "100000",
      bidTime: "12/11/2021 at 13h55'",
    },
    {
      id: 5,
      bidder: "User 1",
      bidAmount: "100000",
      bidTime: "12/11/2021 at 13h55'",
    },
  ]);

  return (
    <div className="AuctHistory-container">
      <div className="AuctHistory-table-div">
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Bidder</th>
              <th>Bid Amount (vnd)</th>
              <th>Bid Time</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item) => (
              <tr key={item.id}>
                <td>{item.bidder}</td>
                <td>{item.bidAmount}</td>
                <td>{item.bidTime}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default AuctHistory;
