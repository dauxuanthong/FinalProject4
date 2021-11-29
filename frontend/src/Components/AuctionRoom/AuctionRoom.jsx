import React, { useEffect, useState } from "react";
import "./AuctionRoom.css";
import AuctFuction from "./AuctFuction";
import AuctHistory from "./AuctHistory";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import userApi from "../../API/userApi";
import AuctInfo from "./AuctInfo";

AuctionRoom.propTypes = {
  socket: PropTypes.object,
};

function AuctionRoom(props) {
  //PARAM
  const { roomId } = useParams();
  //PROPS
  const { socket } = props;
  //STATE
  const [trigger, setTrigger] = useState(0);
  const [socketID, setSocketId] = useState("");
  //EFFECT
  useEffect(() => {
    if (socket.current) {
      setSocketId(socket.current.id);
      return socket.current.emit("joinRoom", roomId);
    }
    setTrigger((prev) => {
      let value;
      prev === 0 ? (value = 1) : (value = 0);
      return value;
    });
  }, [trigger, socketID]);

  return (
    <div className="auctionRoom-container">
      <div className="auctionRoom-leftPart">
        <div className="auctionRoom-product-info">
          <AuctInfo roomId={roomId} />
        </div>
        <div className="auctionRoom-function">
          <AuctFuction roomId={Number(roomId)} socket={socket} />
        </div>
      </div>
      <div className="auctionRoom-rightPart">
        <div className="auctionRoom-history">
          <AuctHistory roomId={Number(roomId)} socket={socket} />
        </div>
        <div className="auctionRoom-conversation">
          <p></p>
        </div>
      </div>
    </div>
  );
}

export default AuctionRoom;
