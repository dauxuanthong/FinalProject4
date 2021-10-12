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
import { useParams } from "react-router-dom";

Media.propTypes = {
  newImageMedia: PropTypes.object,
  updateConversationList: PropTypes.func,
  getNewMapMessage: PropTypes.func,
  socket: PropTypes.object,
  partnerIdMedia: PropTypes.number,
  newMarker: PropTypes.object,
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
    zoom: 12,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  });
  const [currentPing, setCurrentPing] = useState({});
  const [partnerPing, setPartnerPing] = useState({});
  //PROP
  const {
    newImageMedia,
    updateConversationList,
    getNewMapMessage,
    socket,
    partnerIdMedia,
    newMarker,
  } = props;
  //USE-PARAMS
  const { conversationId } = useParams();
  //USE-EFFECT
  useEffect(() => {
    const getListImageMedia = async () => {
      const listImageRes = await conversationApi.getImageListMedia(conversationId);
      setListImage(listImageRes);
    };
    getListImageMedia();
  }, [conversationId]);

  //get message effect
  useEffect(() => {
    if (Object.keys(newImageMedia).length) {
      setListImage((pre) => [...pre, newImageMedia]);
    }
  }, [newImageMedia]);

  //get new marker from conversationDetail
  useEffect(() => {
    if (newMarker.belongTo.length > 0) {
      const newLocationOverwrite = {
        latitude: Number(newMarker.location.latitude),
        longitude: Number(newMarker.location.longitude),
        zoom: 15,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
      };
      if (newMarker.belongTo === "partner") {
        setPartnerPing({
          longitude: newLocationOverwrite.longitude,
          latitude: newLocationOverwrite.latitude,
        });
      } else {
        setCurrentPing({
          longitude: newLocationOverwrite.longitude,
          latitude: newLocationOverwrite.latitude,
        });
      }
      return setViewport({ ...viewport, ...newLocationOverwrite });
    }
  }, [newMarker]);
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
      setCurrentPing({
        longitude: newLocationOverwrite.longitude,
        latitude: newLocationOverwrite.latitude,
      });
      setViewport({ ...viewport, ...newLocationOverwrite });
    }
  };

  //FUNCTION
  const mineMarker = () => {
    if (currentPing.latitude.length > 0 && currentPing.longitude.length > 0) {
      return setViewport({
        ...viewport,
        ...currentPing,
        zoom: 15,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
      });
    }
  };

  const partnerMarker = () => {
    setViewport({
      ...viewport,
      ...partnerPing,
      zoom: 15,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const sendMapAddress = async () => {
    // latt:longt
    if (Object.keys(currentPing).length) {
      const mapMessage = `${currentPing.latitude}:${currentPing.longitude}`;
      const mapMessageJson = {
        message: mapMessage,
        conversationId: Number(conversationId),
      };
      const sendMapMessageRes = await conversationApi.sendMapMessage(mapMessageJson);
      //Update conversation Detail
      getNewMapMessage(sendMapMessageRes);
      //Send to socket
      socket.current.emit("sendMessage", partnerIdMedia, sendMapMessageRes);
      //Update conversationList
      updateConversationList(sendMapMessageRes);
      console.log(sendMapMessageRes);
    } else {
      //Error notification
    }
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
          {Object.keys(partnerPing).length > 0 && (
            <Marker
              latitude={partnerPing.latitude}
              longitude={partnerPing.longitude}
              offsetLeft={-10}
              offsetTop={-20}
            >
              <FaMapMarkerAlt style={{ fontSize: viewport.zoom * 2, color: "#7e8188" }} />
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
          <button
            style={{ color: "#7e8188" }}
            className="map-feature-ping-bnt"
            onClick={() => partnerMarker()}
          >
            <FaMapMarkerAlt />
          </button>
          <button
            style={{ backgroundColor: "#6AE0B5" }}
            className="map-feature-bnt"
            onClick={() => sendMapAddress()}
          >
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
