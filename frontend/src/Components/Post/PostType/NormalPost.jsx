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
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
  };

  //EVENT
  const handleSubmit = async (value) => {
    const data = {
      productName: value.productName,
      productType: value.productType,
      typeDetail: value.productType.some((item) => item === "AnotherType") ? value.typeDetail : "",
      productQuantity: value.productQuantity,
      productPrice: value.cost,
    };
    console.log(data);
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
                step={1}
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
                  step={100000}
                  onChange={(event) => form.setFieldValue("cost", event)}
                />
              </div>
              <div className="currency-unit">
                <p>vnd</p>
              </div>
            </div>
          </div>
          <div className="normal-post-img-area">
            <img className="normal-post-main-img" src={mainImgUrl}></img>
            <div className="normal-post-sub-img">
              <Slider {...settings}>
                <div>
                  <p>1</p>
                </div>
                <div>
                  <p>2</p>
                </div>
                <div>
                  <p>3</p>
                </div>
              </Slider>
            </div>
            {/* <div>
              <input type="file" />
            </div> */}
          </div>
        </div>
        <Button type="submit">Post</Button>
      </form>
    </div>
  );
}

export default NormalPost;
