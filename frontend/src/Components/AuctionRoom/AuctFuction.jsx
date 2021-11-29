import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./AuctFuction.css";
import { Divider } from "@mantine/core";
import { Tabs, Tab } from "@mantine/core";
import { NumberInput } from "@mantine/core";
import auctionRoomApi from "../../API/auctionRoomApi";
import { useNotifications } from "@mantine/notifications";

AuctFuction.propTypes = {
  roomId: PropTypes.number,
  socket: PropTypes.object,
};

function AuctFuction(props) {
  //STATE
  const [functionData, setFunctionData] = useState({
    currentValue: "",
    endAt: "",
    highestPrice: "N/A",
  });
  const [upPriceValue, setUpPriceValue] = useState(0);
  const [highestPrice, setHighestPrice] = useState(0);

  //Prop
  const { roomId, socket } = props;
  //EFFECT
  useEffect(() => {
    const getFunctionData = async () => {
      const functionDataRes = await auctionRoomApi.functionData(parseInt(roomId));
      setFunctionData(functionDataRes);
    };
    getFunctionData();
  }, [roomId]);

  useEffect(() => {
    socket.current?.on("bidValueUpdateClient", (value) => {
      setFunctionData((prev) => {
        return { ...prev, currentValue: value };
      });
    });
    // eslint-disable-next-line
  }, []);

  //USE-NOTIFICATION
  const notifications = useNotifications();

  //FUNCTION
  const bidFunction = async () => {
    const bidFunctionRes = await auctionRoomApi.bid({ roomId: parseInt(roomId) });
    if (bidFunctionRes.message === "DuplicateOwner") {
      return notifications.showNotification({
        color: "red",
        title: "Bid failed",
        message: `You have offered the highest price for the product`,
        autoClose: 4000,
      });
    }
    if (bidFunctionRes.message === "ERROR") {
      return notifications.showNotification({
        color: "red",
        title: "System error",
        message: `An error occurred during the transaction, please try again later!`,
        autoClose: 4000,
      });
    }
    // setFunctionData({ ...functionData, currentValue: bidFunctionRes.data[0].bidAmount });

    // socket value
    socket.current.emit("bidValueUpdateSever", {
      roomId: roomId.toString(),
      currentValue: bidFunctionRes.data[0].bidAmount,
    });
    // socket history
    socket.current.emit("historyUpdateSever", {
      roomId: roomId.toString(),
      arrayData: bidFunctionRes.data,
    });
    return notifications.showNotification({
      color: "green",
      title: "Bid successfully",
      autoClose: 3000,
    });
  };
  //upPrice
  const upPrice = async () => {
    if (upPriceValue < 1) {
      return notifications.showNotification({
        color: "red",
        title: "Up price failed",
        message: `You have offered the highest price for the product`,
        autoClose: 4000,
      });
    }
    const upPriceFunctionRes = await auctionRoomApi.upPrice({
      roomId: parseInt(roomId),
      bidAmount: upPriceValue.toString(),
    });
    if (upPriceFunctionRes.message === "DuplicateOwner") {
      return notifications.showNotification({
        color: "red",
        title: "Up price failed",
        message: `You have offered the highest price for the product`,
        autoClose: 3000,
      });
    }
    if (upPriceFunctionRes.message === "ERROR") {
      return notifications.showNotification({
        color: "red",
        title: "System error",
        message: `An error occurred during the transaction, please try again later!`,
        autoClose: 3000,
      });
    }
    if (upPriceFunctionRes.message === "UpPriceInvalid") {
      return notifications.showNotification({
        color: "red",
        title: "Up price failed",
        message: `Bid value is lower than step value. Please increase the bid price and try again!`,
        autoClose: 3000,
      });
    }
    // socket
    socket.current.emit("bidValueUpdateSever", {
      roomId: roomId.toString(),
      currentValue: upPriceFunctionRes.data[0].bidAmount,
    });
    // socket history
    socket.current.emit("historyUpdateSever", {
      roomId: roomId.toString(),
      arrayData: upPriceFunctionRes.data,
    });
    setUpPriceValue(0);
    return notifications.showNotification({
      color: "green",
      title: "Up price successfully",
      autoClose: 3000,
    });
  };

  //auto bid
  const applyAutoBid = async () => {
    //check price
    if (highestPrice <= Number(functionData.currentValue)) {
      return notifications.showNotification({
        color: "red",
        title: "Up price failed",
        message: `Highest value is lower than step value. Please increase the bid price and try again!`,
        autoClose: 4000,
      });
    }
    //Apply auto bid
    const applyAutoBidRes = await auctionRoomApi.applyAutoBid({
      roomId: parseInt(roomId),
      highestPrice: highestPrice.toString(),
      currentValue: functionData.currentValue,
    });
    if (applyAutoBidRes.message === "ERROR") {
      return notifications.showNotification({
        color: "red",
        title: "Up price failed",
        message: `An error occurred during the transaction, please try again later!`,
        autoClose: 4000,
      });
    }
    if (applyAutoBidRes.message === "UpPriceInvalid") {
      return notifications.showNotification({
        color: "red",
        title: "Up price failed",
        message: `Highest value is lower than step value. Please increase the bid price and try again!`,
        autoClose: 4000,
      });
    }
    //update highestPrice
    setFunctionData((prev) => {
      return {
        ...prev,
        highestPrice: highestPrice,
      };
    });
    if (applyAutoBidRes.message === "OK") {
      return notifications.showNotification({
        color: "green",
        title: `Highest price: ${highestPrice}`,
        autoClose: 3000,
      });
    }
    console.log(applyAutoBidRes);
    // socket
    socket.current.emit("bidValueUpdateSever", {
      roomId: roomId.toString(),
      currentValue: applyAutoBidRes.data[0].bidAmount,
    });
    // socket history
    socket.current.emit("historyUpdateSever", {
      roomId: roomId.toString(),
      arrayData: applyAutoBidRes.data,
    });
    return notifications.showNotification({
      color: "green",
      title: `Highest price: ${highestPrice}`,
      autoClose: 3000,
    });
  };

  //Reset AutoBid highest
  const resetAutoBid = async () => {
    const resetAutoBidRes = await auctionRoomApi.resetAutoBid({ roomId: parseInt(roomId) });
    if (resetAutoBidRes.message === "ERROR") {
      return notifications.showNotification({
        color: "red",
        title: "Reset failed",
        message: `An error occurred during the transaction, please try again later!`,
        autoClose: 3000,
      });
    }
    if (resetAutoBidRes.message === "NOT FOUND") {
      return notifications.showNotification({
        color: "red",
        title: "Reset failed",
        message: `You have never set up automatic bidding`,
        autoClose: 3000,
      });
    }
    if (resetAutoBidRes.message === "SUCCESSFUL") {
      setFunctionData({ ...functionData, highestPrice: "N/A" });
      return notifications.showNotification({
        color: "green",
        title: "Reset successful",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="AuctFuction-container">
      <div className="AuctFuction-price-div">
        <p
          style={{
            fontSize: 18,
            fontWeight: "550",
            color: "rgba(20, 61, 150, 0.747)",
          }}
        >
          Current Value (vnd)
        </p>
        <p
          style={{
            marginTop: 10,
            marginBottom: 15,
            fontSize: 26,
            fontWeight: "550",
            color: "rgba(22, 64, 155, 0.822)",
          }}
        >
          {new Intl.NumberFormat("vi", {
            style: "currency",
            currency: "VND",
          })
            .format(functionData.currentValue)
            .split("₫")}
        </p>
        <div style={{ width: "95%" }}>
          <Divider />
        </div>
        <p
          style={{
            marginTop: 15,
            fontSize: 18,
            fontWeight: "550",
            color: "rgba(20, 61, 150, 0.747)",
          }}
        >
          Ends at: {new Date(functionData.endAt).toLocaleString()}
        </p>
        <p
          style={{
            marginTop: 5,
            fontSize: 18,
            fontWeight: "550",
            color: "rgba(207, 67, 67, 0.877)",
          }}
        >
          6 days - 20:15
        </p>
      </div>
      <div className="AuctFuction-btn-div">
        <Tabs>
          <Tab label="Basic">
            <div className="AuctFuction-btn-tab-item">
              <div className="AuctFuction-tab-basic">
                <button
                  className="AuctFuction-basic-button"
                  onClick={() => {
                    bidFunction();
                  }}
                >
                  Bid
                </button>
                <div style={{ display: "flex" }}>
                  <button
                    disabled={upPriceValue <= Number(functionData.currentValue) ? true : false}
                    className="AuctFuction-basic-button"
                    style={{ marginRight: 10 }}
                    onClick={() => {
                      upPrice();
                    }}
                  >
                    Up price
                  </button>
                  <NumberInput
                    hideControls
                    radius="md"
                    defaultValue={0}
                    styles={{
                      input: { height: 40, marginTop: 5 },
                    }}
                    value={upPriceValue}
                    onChange={(value) => {
                      setUpPriceValue(value);
                    }}
                  />
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 550,
                      color: "rgba(20, 61, 150, 0.747)",
                      marginLeft: 5,
                      marginTop: 13,
                    }}
                  >
                    Vnd
                  </p>
                </div>
              </div>
            </div>
          </Tab>
          <Tab label="Auto bid">
            <div className="AuctFuction-btn-tab-item">
              <div className="AuctFuction-tab-autoBid">
                <p
                  style={{
                    margin: "5px 0 0 10px",
                    fontSize: 17,
                    fontWeight: 550,
                    color: "rgba(20, 61, 150, 0.747)",
                  }}
                >
                  Highest price:{" "}
                  {functionData.highestPrice === "N/A"
                    ? "N/A"
                    : new Intl.NumberFormat("vi", {
                        style: "currency",
                        currency: "VND",
                      })
                        .format(functionData.highestPrice)
                        .split("₫")}
                  {functionData.highestPrice === "N/A" ? "" : "vnd"}
                </p>
                <div style={{ marginTop: 5, display: "flex", alignItems: "center" }}>
                  <p
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      fontWeight: 510,
                      color: "rgba(0, 0, 0, 0.651)",
                    }}
                  >
                    Set highest price
                  </p>
                  <NumberInput
                    hideControls
                    radius="md"
                    defaultValue={0}
                    styles={{
                      input: { marginLeft: 5 },
                    }}
                    value={highestPrice}
                    onChange={(value) => {
                      setHighestPrice(value);
                    }}
                  />
                  <p
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      fontWeight: 550,
                      color: "rgba(20, 61, 150, 0.747)",
                    }}
                  >
                    Vnd
                  </p>
                </div>
                <div
                  style={{
                    marginTop: 15,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    className="AuctFuction-autoBid-button"
                    style={{ backgroundColor: "#D55A5A" }}
                    onClick={() => {
                      resetAutoBid();
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="AuctFuction-autoBid-button"
                    style={{ backgroundColor: "#70dab6" }}
                    onClick={() => {
                      applyAutoBid();
                      setHighestPrice(0);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default AuctFuction;
