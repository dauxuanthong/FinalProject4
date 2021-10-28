import React from "react";
import PropTypes from "prop-types";
import "./AuctFuction.css";
import { Divider } from "@mantine/core";
import { Tabs, Tab } from "@mantine/core";
import { NumberInput } from "@mantine/core";

AuctFuction.propTypes = {};

function AuctFuction(props) {
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
            .format("1000000000")
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
          Ends at: 11/15/2021 12h30'
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
                <button className="AuctFuction-basic-button">Bid</button>
                <div style={{ display: "flex" }}>
                  <button className="AuctFuction-basic-button" style={{ marginRight: 10 }}>
                    Up price
                  </button>
                  <NumberInput
                    hideControls
                    radius="md"
                    defaultValue={0}
                    styles={{
                      input: { height: 40, marginTop: 5 },
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
                  Highest price: Not set
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
                  >
                    Reset
                  </button>
                  <button
                    className="AuctFuction-autoBid-button"
                    style={{ backgroundColor: "#70dab6" }}
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
