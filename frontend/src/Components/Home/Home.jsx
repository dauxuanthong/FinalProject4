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
            <div className="post-container">
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
              <div style={{ width: 270 }}>
                <Divider />
              </div>
              <div className="post-price">
                <p style={{ fontSize: 20 }}>100.000</p>
                <p>vnd</p>
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
      <div className="sub-display"></div>
    </div>
  );
}

export default Home;
