import React, { useState } from "react";
import "./AuctionPost.css";
import { useForm } from "@mantine/hooks";
import {
  TextInput,
  Button,
  Tooltip,
  MultiSelect,
  NumberInput,
  Modal,
  Overlay,
} from "@mantine/core";
import { BsInfoCircle } from "react-icons/bs";
import { AiOutlineTags } from "react-icons/ai";
import { RiProductHuntLine, RiEyeLine } from "react-icons/ri";
import { FiArchive } from "react-icons/fi";
import { GiMoneyStack } from "react-icons/gi";
import { useDropzone } from "react-dropzone";
import { useNotifications } from "@mantine/notifications";
import { IoCloseSharp } from "react-icons/io5";
import { Editor } from "@tinymce/tinymce-react";
import postApi from "../../../API/postApi";
import PropTypes from "prop-types";
import DateTimePicker from "react-datetime-picker";
import { useHistory } from "react-router-dom";

AuctionPost.propTypes = {
  types: PropTypes.array.isRequired,
};

function AuctionPost(props) {
  //PROPS
  const { types } = props;
  //STATE
  const [imgIndex, setImgIndex] = useState(1);
  const [imgListFile, setImgListFile] = useState([]);
  const [imgListUrl, setImgListUrl] = useState([]);
  const [opacityAddImgError, setOpacityAddImgError] = useState(0);
  const [opened, setOpened] = useState(false);
  const [modalImg, setModalImg] = useState("");
  const [description, setDescription] = useState("");
  const [opacityDescription, setOpacityDescription] = useState(0);
  const [datetime, setDatetime] = useState(new Date());

  //USE-FORM
  const form = useForm({
    initialValues: {
      productName: "",
      productType: [],
      typeDetail: "",
      productQuantity: 1,
      cost: 1000,
      stepPrice: 1000,
    },
    validationRules: {
      productName: (value) => value.trim().length >= 1 && value.trim().length <= 50,
      productType: (value) => value.length > 0,
      typeDetail: (value) => {
        if (form.values.productType.some((item) => item === 5)) {
          return value.trim().length >= 1 ? true : false;
        }
        return true;
      },
    },
  });

  //USE HISTORY
  const history = useHistory();

  //USE-NOTIFICATION
  const notifications = useNotifications();

  //TOOL-TIP
  const productNameTip = (
    <Tooltip
      label="Use the exact name of the product to make it easy to find and sell"
      position="bottom"
      placement="end"
      withArrow
    >
      <BsInfoCircle />
    </Tooltip>
  );

  //DROP-ZONE
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/jpg",
    onDropAccepted: async (files) => {
      //add file to ImgListFile
      setImgListFile((prevArr) => [...prevArr, { index: imgIndex, imgFile: files[0] }]);
      //Reset error
      setOpacityAddImgError(0);
      //File reader handle
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImgListUrl((prevArr) => [...prevArr, { index: imgIndex, imgUrl: reader.result }]);
        }
      };
      // setNumOfImg(numOfImg + 1);
      setImgIndex(imgIndex + 1);
      return reader.readAsDataURL(files[0]);
    },
    onDropRejected: () => {
      notifications.showNotification({
        color: "red",
        title: "Load file failed",
        message: `File type is not accepted (.jpg/.jpeg/.png only)`,
        autoClose: 5000,
      });
    },
  });

  //EVENT
  const handleSubmit = async (value) => {
    //check err
    let errCount = 0;
    //check num of img
    if (imgListFile.length < 4 || imgListFile.length > 8) {
      setOpacityAddImgError(1);
      errCount = errCount + 1;
    }
    //check description
    if (description.length <= 0) {
      setOpacityDescription(1);
      errCount = errCount + 1;
    }
    if (errCount > 0) {
      return;
    }
    let listFile = [];
    imgListFile.map((item) => {
      listFile.push(item.imgFile);
    });
    try {
      console.log("submit");
      //UPLOAD IMG
      let formData = new FormData();
      const listFile = [...imgListFile];
      listFile.map((item) => {
        formData.append("listFile", item.imgFile);
      });
      const uploadListImgRes = await postApi.normalPostImg(formData);
      const data = {
        productName: value.productName,
        productType: value.productType,
        typeDetail: value.productType.some((item) => item === 5) ? value.typeDetail : "",
        productQuantity: value.productQuantity,
        firstPrice: value.cost.toString(),
        imgListFile: uploadListImgRes,
        description: description,
        stepPrice: value.stepPrice.toString(),
        auctionDatetime: datetime,
      };
      const uploadAllInfo = await postApi.auctionPostInfo(data);
      if (uploadAllInfo.successMessage) {
        notifications.showNotification({
          color: "green",
          title: uploadAllInfo.successMessage,
          autoClose: 5000,
        });
      }
      return history.push("/postManage");
    } catch (error) {
      console.log(error);
    }
  };

  const removeImg = (index) => {
    //remove url
    setImgListUrl((prev) => {
      const filter = prev.filter((image) => image.index !== index);
      return filter;
    });
    //remove file
    setImgListFile((prev) => {
      const filter = prev.filter((image) => image.index !== index);
      return filter;
    });
  };

  const showImg = (url) => {
    setModalImg(url);
    setOpened(true);
  };

  const editorOnChange = (value) => {
    setDescription(value);
    setOpacityDescription(0);
  };

  return (
    <div className="auction-post-container">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="auction-post-first-part-div">
          <div className="auction-post-info-area">
            {/*Product name*/}
            <div className="auction-post-info-item">
              <TextInput
                required="true"
                label="Product name"
                icon={<RiProductHuntLine />}
                rightSection={productNameTip}
                error={form.errors.productName && "Please specify valid product name"}
                value={form.values.productName}
                onChange={(event) => form.setFieldValue("productName", event.currentTarget.value)}
                onFocus={() => {
                  form.setFieldError("productName", false);
                }}
              />
            </div>
            {/*Product type*/}
            <div className="auction-post-info-item">
              <MultiSelect
                required
                label="Product type"
                icon={<AiOutlineTags />}
                data={types}
                multiline="false"
                clearButtonLabel="Clear selection"
                clearable
                searchable
                transitionDuration={150}
                transition="pop-top-left"
                transitionTimingFunction="ease"
                maxDropdownHeight={160}
                placeholder="Select product tags"
                error={form.errors.productType && "Please choose your product type"}
                onChange={(event) => {
                  form.setFieldValue("productType", event);
                }}
                onFocus={() => {
                  form.setFieldError("productType", false);
                }}
              />
            </div>
            {/*AnotherType*/}
            <div className="auction-post-info-item">
              <TextInput
                disabled={!form.values.productType.some((item) => item === 5)}
                required="true"
                label="Type detail"
                icon={<AiOutlineTags />}
                error={form.errors.typeDetail && "Please specify valid type detail"}
                onChange={(event) => form.setFieldValue("typeDetail", event.currentTarget.value)}
                onFocus={() => {
                  form.setFieldError("typeDetail", false);
                }}
              />
            </div>
            {/* Quantity */}
            <div className="normal-post-info-item">
              <NumberInput
                required="true"
                label="Product quantity available"
                icon={<FiArchive />}
                min={1}
                hideControls
                error={form.errors.productQuantity && "Enter product quantity available"}
                onChange={(event) => form.setFieldValue("productQuantity", event)}
              />
            </div>
            {/* Cost */}
            <div className="currency-area">
              <div className="currency-input">
                <NumberInput
                  required="true"
                  label="First price"
                  placeholder="Price your product (price only applies for 1 product)"
                  icon={<GiMoneyStack />}
                  min={1000}
                  hideControls
                  onChange={(event) => form.setFieldValue("cost", event)}
                />
              </div>
              <div className="currency-unit">
                <p>vnd</p>
              </div>
            </div>
            <div className="currency-area">
              <div className="currency-input">
                <NumberInput
                  required="true"
                  label="Step price"
                  placeholder="Minimum price per step"
                  icon={<GiMoneyStack />}
                  min={1000}
                  hideControls
                  onChange={(event) => form.setFieldValue("stepPrice", event)}
                />
              </div>
              <div className="currency-unit">
                <p>vnd</p>
              </div>
            </div>
            {/* DATETIME */}
            <div className="auction-post-datetime-area">
              <div className="auction-post-datetime-label">
                <p style={{ fontSize: 14, color: "#212529" }}>Auction starts at</p>
                <p style={{ fontSize: 14, width: 11.36, color: "#F03E3E", marginLeft: 3 }}>*</p>
              </div>
              <div className="auction-post-datetime-input">
                <DateTimePicker
                  className="auction-post-datetime-input"
                  required={true}
                  disableClock={true}
                  minDate={new Date()}
                  onChange={setDatetime}
                  value={datetime}
                />
              </div>
              <div style={{ width: 920, height: 50 }}>
                <p></p>
              </div>
            </div>
          </div>
          <div className="auction-post-img-area">
            <div className="add-img-auction-post">
              <div className="add-img-auction-post-label">
                <p style={{ fontSize: 14, color: "#212529" }}>Add product images</p>
                <p style={{ fontSize: 14, width: 11.36, color: "#F03E3E", marginLeft: 3 }}>*</p>
                <div className="add-img-auction-post-toolTips-icon">
                  <Tooltip
                    wrapLines
                    width={300}
                    withArrow
                    position="bottom"
                    transition="slide-up"
                    placement="end"
                    transitionDuration={200}
                    label="Please provide images of your product (minimum 4 images, maximum 8 images)"
                  >
                    <BsInfoCircle />
                  </Tooltip>
                </div>
              </div>
              <div {...getRootProps({ className: "add-img-auction-post-dropZone" })}>
                <input {...getInputProps()} />
                <p>
                  Drag 'n' drop here ,or click to select some images. Only accept .jpg/.jpeg/.png
                  files type
                </p>
              </div>
              <p
                style={{ opacity: opacityAddImgError }}
                className="add-img-auction-post-dropZone-error"
              >
                Please provide a minimum of 4 images or a maximum of 8 images
              </p>
            </div>
            <div className="auction-post-show-img-list-div">
              {imgListUrl?.map((item) => (
                <div key={item.index} className="auction-post-show-img-list-div-item">
                  <img src={item.imgUrl}></img>
                  <div className="auction-post-show-img-list-background">
                    <p></p>
                  </div>
                  <div
                    onClick={() => showImg(item.imgUrl)}
                    className="auction-post-show-img-list-view-button"
                  >
                    <RiEyeLine />
                  </div>
                  <div
                    onClick={() => removeImg(item.index)}
                    className="auction-post-show-img-list-delete-button"
                  >
                    <IoCloseSharp />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="auction-post-description-div">
          <div className="auction-post-description-label-div">
            <p style={{ fontSize: 14, color: "#212529" }}>Description</p>
            <p style={{ fontSize: 14, width: 11.36, color: "#F03E3E", marginLeft: 3 }}>*</p>
          </div>
          <div style={{ width: 920 }}>
            <Editor
              onEditorChange={editorOnChange}
              outputFormat="html"
              init={{
                resize: false,
                height: 400,
                menubar: false,
                branding: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                  "lists link image paste help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic underline backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>
          <div style={{ width: 920 }}>
            <p style={{ opacity: opacityDescription }} className="auction-post-description-error">
              Please describe your product
            </p>
          </div>
          <Button
            style={{ fontSize: 16, height: 50, width: 300, marginTop: 10, marginBottom: 40 }}
            type="submit"
          >
            Post
          </Button>
        </div>
      </form>
      {opened === true && (
        <div>
          <div className="auction-post-modal-background">
            <p></p>
          </div>
          <div
            className="auction-post-modal"
            onClick={() => {
              setOpened(false);
            }}
          >
            <img className="auction-post-img-modal" src={modalImg}></img>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuctionPost;
