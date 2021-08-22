import React from "react";
import "./Home.css";
import { Grid, Col } from "@mantine/core";
import LinesEllipsis from "react-lines-ellipsis";
import { Divider } from "@mantine/core";

function Home(props) {
  return (
    <div className="home-container">
      <div className="display-posts">
        <Grid gutter="xl" columns={24} style={{ margin: "0 10px 0 10px" }}>
          <Col span={6}>
            <div className="card">
              <div className="post-container">
                <div className="top-side">
                  <img
                    className="post-img"
                    src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"
                  ></img>
                  <LinesEllipsis
                    className="post-line-ellipsis"
                    text="Product name Product name Product name Product name Product name"
                    maxLine="2"
                    ellipsis="..."
                    trimRight
                    basedOn="letters"
                  />
                </div>
                <div className="bottom-side">
                  <Divider />
                  <div className="post-price">
                    <p style={{ fontSize: 22, fontWeight: 560 , marginLeft: 10}}>100.000</p>
                    <p style={{ fontSize: 15 }}>vnd</p>
                  </div>
                </div>
              </div>
              <div className="post-function">
                <button type="button">Contact</button>
                <button type="button">Detail</button>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="post-container"></div>
          </Col>
          <Col span={6}>
            <div className="post-container"></div>
          </Col>
          <Col span={6}>
            <div className="post-container"></div>
          </Col>
        </Grid>
      </div>
    </div>
  );
}

export default Home;
