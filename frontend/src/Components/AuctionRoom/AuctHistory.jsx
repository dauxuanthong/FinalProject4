import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./AuctHistory.css";
import { Table } from "@mantine/core";
import auctionRoomApi from "../../API/auctionRoomApi";

AuctHistory.propTypes = {
  roomId: PropTypes.number,
  socket: PropTypes.object,
};

function AuctHistory(props) {
  //STATE
  const [historyData, setHistoryData] = useState([
    {
      id: 0,
      bidder: "",
      bidAmount: "",
      bidTime: "",
    },
  ]);
  // const [trigger, setTrigger] = useState(0);
  //props
  const { roomId, socket } = props;

  //Effect
  useEffect(() => {
    const getAuctionRoomHistory = async () => {
      const historyRes = await auctionRoomApi.history(roomId);
      setHistoryData(historyRes);
    };
    getAuctionRoomHistory();
  }, []);
  //socket updateHistory
  useEffect(() => {
    socket.current?.on("historyUpdateClient", (value) => {
      setHistoryData((prev) => {
        const Arr = prev.slice(0, 5 - value.length);
        const newArr = [...value, ...Arr];
        return newArr;
      });
    });
  }, []);
  //socket updateAllHistory
  // useEffect(() => {
  //   socket.current?.on("historyUpdateAllClient", () => {
  //     setTrigger((prev) => {
  //       return prev === 0 ? 1 : 0;
  //     });
  //   });
  // }, []);

  return (
    <div className="AuctHistory-container">
      <div className="AuctHistory-table-div">
        <Table>
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
                <td>
                  {new Intl.NumberFormat("vi", {
                    style: "currency",
                    currency: "VND",
                  })
                    .format(item.bidAmount)
                    .split("₫")}
                </td>
                <td>{new Date(item.bidTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default AuctHistory;
