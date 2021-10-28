import React from "react";
import "./AuctionRoom.css";
import AuctFuction from "./AuctFuction";
import AuctHistory from "./AuctHistory";

function AuctionRoom(props) {
  return (
    <div className="auctionRoom-container">
      <div className="auctionRoom-leftPart">
        <div className="auctionRoom-product-info">
          <p>Left-top</p>
        </div>
        <div className="auctionRoom-function">
          <AuctFuction />
        </div>
      </div>
      <div className="auctionRoom-rightPart">
        <div className="auctionRoom-history">
          <AuctHistory />
        </div>
        <div className="auctionRoom-conversation">
          <p>Right-bottom</p>
        </div>
      </div>
    </div>
  );
}

export default AuctionRoom;
