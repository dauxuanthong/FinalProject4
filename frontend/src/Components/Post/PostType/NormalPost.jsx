import React, { useState } from "react";
import "./NormalPost.css";
import { useForm } from "@mantine/hooks";
import {
  TextInput,
  Button,
  LoadingOverlay,
  Tooltip,
  MultiSelect,
  NumberInput,
} from "@mantine/core";
import { BsInfoCircle } from "react-icons/bs";
import { AiOutlineTags } from "react-icons/ai";
import { RiProductHuntLine } from "react-icons/ri";
import { FiArchive } from "react-icons/fi";
import { GiMoneyStack } from "react-icons/gi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import { useNotifications } from "@mantine/notifications";
import { TiDeleteOutline } from "react-icons/ti";

function NormalPost(props) {
  //STATE
  const [mainImgUrl, setMainImgUrl] = useState(
    "https://thailamlandscape.vn/wp-content/uploads/2017/10/no-image.png"
  );
  const [productType, setProductType] = useState([
    { value: "SmartPhone", label: "SmartPhone" },
    { value: "Kitchen tools", label: "Kitchen tools" },
    { value: "Technological", label: "Technological" },
    { value: "Repair tools", label: "Repair tools" },
    { value: "AnotherType", label: "Another type" },
  ]);
  const [imgIndex, setImgIndex] = useState(1);
  // const [numOfImg, setNumOfImg] = useState(0);
  const [imgListFile, setImgListFile] = useState([]);
  const [imgListUrl, setImgListUrl] = useState([]);
  const [opacityAddImgError, setOpacityAddImgError] = useState(0);

  //USE-FORM
  const form = useForm({
    initialValues: {
      productName: "",
      productType: [],
      typeDetail: "",
      productQuantity: 1,
      cost: 1000,
    },
    validationRules: {
      productName: (value) => value.trim().length >= 1 && value.trim().length <= 50,
      productType: (value) => value.length > 0,
      typeDetail: (value) => {
        if (form.values.productType.some((item) => item === "AnotherType")) {
          return value.trim().length >= 1 ? true : false;
        }
        return true;
      },
    },
  });

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

  //SLIDER
  let settings = {
    infinite: true,
    speed: 500,
    slidesToShow: imgListUrl.length < 3 ? imgListUrl.length : 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <MdKeyboardArrowRight />,
    prevArrow: <MdKeyboardArrowLeft />,
  };

  //DROP-ZONE
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/jpg",
    onDropAccepted: async (files) => {
      //add file to ImgListFile
      setImgListFile((prev) => {
        prev.push({ index: imgIndex, imgFile: files[0] });
        return [...prev];
      });
      //Reset error
      setOpacityAddImgError(0);
      //File reader handle
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImgListUrl((prevArr) => [...prevArr, { index: imgIndex, imgUrl: reader.result }]);
          setMainImgUrl(reader.result);
        }
      };
      // setNumOfImg(numOfImg + 1);
      console.log(imgListUrl);
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
    if (imgListFile.length < 4 || imgListFile.length > 8) {
      return setOpacityAddImgError(1);
    }
    let listFile = [];
    imgListFile.map((item) => {
      listFile.push(item.imgFile);
    });
    const data = {
      productName: value.productName,
      productType: value.productType,
      typeDetail: value.productType.some((item) => item === "AnotherType") ? value.typeDetail : "",
      productQuantity: value.productQuantity,
      productPrice: value.cost,
      imgListFile: listFile,
    };
    console.log(data);
  };

  const deleteImg = (index) => {
    //delete file in imgListFile
    const file = imgListFile.find((item) => item.index === index);
    const fileIndex = imgListFile.indexOf(file);
    imgListFile.splice(fileIndex, 1);
    //delete url in imgListUrl
    const url = imgListUrl.find((item) => item.index === index);
    const urlIndex = imgListUrl.indexOf(url);
    //change main img
    url.imgUrl === mainImgUrl &&
      setMainImgUrl(
        imgListUrl[0].imgUrl ||
          "https://thailamlandscape.vn/wp-content/uploads/2017/10/no-image.png"
      );
    imgListUrl.splice(urlIndex, 1);
  };

  return (
    <div className="normal-post-container">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="first-part-div">
          <div className="normal-post-info-area">
            {/*Product name*/}
            <div className="normal-post-info-item">
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
            <div className="normal-post-info-item">
              <MultiSelect
                required
                label="Product type"
                icon={<AiOutlineTags />}
                data={productType}
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
            <div className="normal-post-info-item">
              <TextInput
                disabled={!form.values.productType.some((item) => item === "AnotherType")}
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
            <div className="currency-area">
              <div className="currency-input">
                <NumberInput
                  required="true"
                  label="Product value"
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
            <div className="add-img-normal-post">
              <div className="add-img-normal-post-label">
                <p style={{ fontSize: 14, color: "#212529" }}>Add product images</p>
                <p style={{ fontSize: 14, width: 11.36, color: "#F03E3E", marginLeft: 3 }}>*</p>
                <div className="add-img-normal-post-toolTips-icon">
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
              <div {...getRootProps({ className: "add-img-normal-post-dropZone" })}>
                <input {...getInputProps()} />
                <p>
                  Drag 'n' drop here ,or click to select some images. Only accept .jpg/.jpeg/.png
                  files type
                </p>
              </div>
              <p
                style={{ opacity: opacityAddImgError }}
                className="add-img-normal-post-dropZone-error"
              >
                Please provide a minimum of 4 images or a maximum of 8 images
              </p>
            </div>
          </div>
          <div className="normal-post-img-area">
            <img className="normal-post-main-img" src={mainImgUrl}></img>
            <div className="normal-post-sub-img">
              <Slider {...settings}>
                {imgListUrl?.map((item) => (
                  <div key={item.index}>
                    <div
                      className="normal-post-sub-img-slider-item"
                      onClick={() => {
                        setMainImgUrl(item.imgUrl);
                      }}
                    >
                      <img src={item.imgUrl}></img>
                      <div
                        className="normal-post-sub-img-slider-icon"
                        onClick={() => {
                          deleteImg(item.index);
                        }}
                      >
                        <TiDeleteOutline />
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
        <Button type="submit">Post</Button>
      </form>
    </div>
  );
}

export default NormalPost;
