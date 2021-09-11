import React from "react";
import "./Home.css";
import { Grid, Col } from "@mantine/core";
import LinesEllipsis from "react-lines-ellipsis";
import { Divider } from "@mantine/core";

function Home(props) {
  return (
    <div className="home-container">
      {/*header home page*/}
      <div
        style={{
          width: "100%",
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="home-introduction-part">
          <img src="https://c.pxhere.com/photos/0e/9e/technology_digital_tablet_digital_tablet_computer_device_black_white-1325876.jpg!d"></img>
          <div className="home-trending-product-tag">
            <div className="home-trending-product-tag-item">
              <p></p>
            </div>
            <div className="home-trending-product-tag-item">
              <p></p>
            </div>
            <div className="home-trending-product-tag-item">
              <p></p>
            </div>
            <div className="home-trending-product-tag-item">
              <p></p>
            </div>
          </div>
        </div>
      </div>
      {/*new product*/}
      <div
        style={{
          width: "100%",
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="new-product-div">
          <div className="new-product-title">NEW PRODUCT</div>
          <div className="new-product-item-div">
            <Grid justify="space-between" gutter={10} columns={25} style={{ margin: 0 }}>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <div className="new-product-card-content">
                    <img src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
                    <LinesEllipsis
                      className="new-product-card-content-ellipsis"
                      text="Product name Product name Product name Product name Product name"
                      maxLine="2"
                      ellipsis="..."
                      trimRight
                      basedOn="letters"
                    />
                    <div className="new-product-card-content-bottom">
                      <p style={{ fontSize: 20, fontWeight: 560 }}>100.000.000</p>
                      <p style={{ fontSize: 15, marginLeft: 2 }}>vnd</p>
                    </div>
                  </div>
                  <div className="new-product-card-button">
                    <button>Contact</button>
                    <button>Detail</button>
                  </div>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card"></div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
            </Grid>
          </div>
        </div>
      </div>
      {/*Auction post*/}
      <div
        style={{
          width: "100%",
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="new-product-div">
          <div className="new-product-title">AUCTION PRODUCT</div>
          <div className="new-product-item-div">
            <Grid justify="space-between" gutter={10} columns={25} style={{ margin: 0 }}>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="auction-product-card">
                  <div className="new-product-card-content">
                    <img src="https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg"></img>
                    <LinesEllipsis
                      className="auction-product-card-content-ellipsis"
                      text="Product name Product name Product name Product name Product name"
                      maxLine="2"
                      ellipsis="..."
                      trimRight
                      basedOn="letters"
                    />
                    <div className="auction-product-card-content-bottom">
                      <p className="auction-product-card-content-title">Auction at</p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-end",
                          height: "fit-content",
                        }}
                      >
                        <p style={{ fontSize: 16, fontWeight: 560 }}>12/02/1975</p>
                        <p style={{ fontSize: 14, marginLeft: 5, paddingBottom: 1 }}>12h15m</p>
                      </div>
                      <p className="auction-product-card-content-title">First price</p>
                      <div className="auction-product-card-content-price">
                        <p style={{ fontSize: 20, fontWeight: 560 }}>100.000.000</p>
                        <p style={{ fontSize: 15, marginLeft: 2 }}>vnd</p>
                      </div>
                    </div>
                  </div>
                  <div className="auction-product-card-button">
                    <button>Contact</button>
                    <button>Detail</button>
                    <button>Bet</button>
                  </div>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card"></div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
              <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
                <div className="new-product-card">
                  <p></p>
                </div>
              </Col>
            </Grid>
          </div>
        </div>
      </div>
      {/*___________________________________*/}
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
                    <p style={{ fontSize: 22, fontWeight: 560, marginLeft: 10 }}>100.000</p>
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
            <div className="card">
              <div className="post-container">
                <div className="top-side">
                  <img
                    className="post-img"
                    src="https://resize.cdnbridge.com//resources/18/160536/Image/fat-scottish-fold-kitten-wallpaper-hd-700x468.jpg"
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
                    <p style={{ fontSize: 22, fontWeight: 560, marginLeft: 10 }}>400.000</p>
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
            <div className="card">
              <div className="post-container">
                <div className="top-side">
                  <img
                    className="post-img"
                    src="https://buzzsharer.com/wp-content/uploads/2015/07/Scottish-Fold-cute-cat.jpg"
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
                    <p style={{ fontSize: 22, fontWeight: 560, marginLeft: 10 }}>300.000</p>
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
            <div className="card">
              <div className="post-container">
                <div className="top-side">
                  <img
                    className="post-img"
                    src="https://petpricelist.com/wp-content/uploads/2017/12/scottish-fold-cat-1.jpg"
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
                    <p style={{ fontSize: 22, fontWeight: 560, marginLeft: 10 }}>200.000</p>
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
        </Grid>
      </div>
    </div>
  );
}

export default Home;
