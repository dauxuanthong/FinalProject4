import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Media.css";
import conversationApi from "../../API/conversationApi";
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdZoomOutMap } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { Input } from "@mantine/core";
import { IoMdSearch } from "react-icons/io";
import { LoadingOverlay } from "@mantine/core";

Media.propTypes = {
  currentConversation: PropTypes.number,
  newImageMedia: PropTypes.object,
};

function Media(props) {
  //STATE
  const [listImage, setListImage] = useState([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [LoadingVisible, setLoadingVisible] = useState(false);

  //Map-box
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: 16.047079,
    longitude: 108.20623,
    zoom: 15,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  });
  const [currentPing, setCurrentPing] = useState({});
  //PROP
  const { currentConversation, newImageMedia } = props;
  //USE-EFFECT
  useEffect(() => {
    if (currentConversation < 0) return;
    const getListImageMedia = async () => {
      const listImageRes = await conversationApi.getImageListMedia(currentConversation);
      setListImage(listImageRes);
    };
    getListImageMedia();
  }, [currentConversation]);

  //get message effect
  useEffect(() => {
    if (Object.keys(newImageMedia).length) {
      setListImage((pre) => [...pre, newImageMedia]);
    }
  }, [newImageMedia]);

  //MAP-BOX
  const mapRef = useRef();
  const handlePing = (e) => {
    const [newLongitude, newLatitude] = e.lngLat;
    setCurrentPing({
      longitude: newLongitude,
      latitude: newLatitude,
    });
  };
  const axios = require("axios");
  const searchMap = async (data) => {
    const address = await axios.get(
      `https://geocode.xyz/${data}?json=1&auth=579566102807764156894x16001`
    );
    setLoadingVisible(false);
    if (Object.keys(address.data).length > 0) {
      const newLocationOverwrite = {
        latitude: Number(address.data.latt),
        longitude: Number(address.data.longt),
        zoom: 15,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
      };
      setCurrentPing(newLocationOverwrite);
      setViewport({ ...viewport, ...newLocationOverwrite });
    }
  };

  //FUNCTION
  const mineMarker = () => {
    setViewport({
      ...viewport,
      ...currentPing,
      zoom: 15,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };
  return (
    <div className="Media-div">
      <div className="Media-image-area">
        <div className="Media-image-label">
          <p style={{ fontSize: 19, fontWeight: 550, color: "rgba(20, 61, 150, 0.747)" }}>Media</p>
          {listImage.length === 0 ? (
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(46, 46, 46, 0.685)",
                marginLeft: 7,
                marginTop: 5,
              }}
            >
              0 image
            </p>
          ) : (
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(46, 46, 46, 0.685)",
                marginLeft: 7,
                marginTop: 5,
              }}
            >
              {listImage.length} images
            </p>
          )}
        </div>
        <div className="Media-image-item">
          {listImage.map((item) => (
            <img key={item.id} src={item.message} alt="Media image"></img>
          ))}
        </div>
      </div>
      <div className="Media-map-area">
        <LoadingOverlay
          visible={LoadingVisible}
          loaderProps={{ size: "lg", color: "teal", variant: "bars" }}
          overlayOpacity={0.3}
          overlayColor="#c5c5c5"
        />
        <ReactMapGL
          ref={mapRef}
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/sexymeoww/ckujkpzig0mvf17nsh79l1abz"
          onViewportChange={(nextViewport) => setViewport(nextViewport)}
          onDblClick={handlePing}
          doubleClickZoom={false}
        >
          {Object.keys(currentPing).length > 0 && (
            <Marker
              latitude={currentPing.latitude}
              longitude={currentPing.longitude}
              offsetLeft={-10}
              offsetTop={-20}
            >
              <FaMapMarkerAlt style={{ fontSize: viewport.zoom * 2, color: "#687fa7" }} />
            </Marker>
          )}
        </ReactMapGL>
        <div className="Media-map-feature">
          <div>
            <Input
              icon={<IoMdSearch />}
              placeholder="Search"
              radius="xl"
              classNames={{
                root: "map-feature-input-root",
              }}
              value={searchAddress}
              onChange={(e) => {
                setSearchAddress(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchMap(e.target.value);
                  setSearchAddress("");
                  setLoadingVisible(true);
                }
              }}
            />
          </div>
          <button
            style={{ color: "#687fa7" }}
            className="map-feature-ping-bnt"
            onClick={() => mineMarker()}
          >
            <FaMapMarkerAlt />
          </button>
          <button style={{ color: "#7e8188" }} className="map-feature-ping-bnt">
            <FaMapMarkerAlt />
          </button>
          <button style={{ backgroundColor: "#6AE0B5" }} className="map-feature-bnt">
            <IoIosSend />
          </button>
          <button style={{ backgroundColor: "#b9c0ca" }} className="map-feature-bnt">
            <MdZoomOutMap />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Media;
