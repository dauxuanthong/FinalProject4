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
    { value: "AnotherType ", label: "Another type" },
  ]);

  //USE-FORM
  const form = useForm({
    initialValues: {
      productName: "",
      // productType: [],
      // typeDetail: "",
      // productQuantity: 0,
      // cost: 1000,
    },
    validationRules: {
      productName: (value) => value.trim().length >= 1 && value.trim().length <= 50,
      // productType: (value) => value.trim().length > 0,
      // typeDetail: (value) => value.trim().length >= 1,
      // productQuantity: (value) => value >= 1,
      // cost: (value) => value >= 1000,
      // email: (value) => /^\S+@\S+$/.test(value),
      // password: (value) => /^(?=.*[0-9])(?=.*[a-z]).{6,32}$/.test(value),
      // confirmPassword: (value) => (value === pass ? true : false),
    },
  });

  //TOOL-TIP
  const productNameTip = (
    <Tooltip
      label="Use the exact name of the product to make it easy to find and sell"
      position="top"
      placement="end"
      withArrow
    >
      <BsInfoCircle />
    </Tooltip>
  );
  const productTypeTip = (
    <Tooltip
      label="If you can't find a tag that matches your product, select 'Another type' and fill in the 'Type detail' section below."
      position="top"
      placement="end"
      withArrow
    >
      <BsInfoCircle />
    </Tooltip>
  );

  //EVENT
  const handleSubmit = async (value) => {
    const data = {
      productName: value.productName,
    };
    console.log(data);
  };
  return (
    <div className="normal-post-container">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="first-part-div">
          <div className="normal-post-info-area">
            <div>
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
            <div>
              <MultiSelect></MultiSelect>
            </div>
            {/* <div>
              <MultiSelect
                required
                label="Product type"
                icon={<AiOutlineTags />}
                rightSection={productTypeTip}
                data={productType}
                placeholder="Select product tags"
                error={form.errors.productType && "Please choose your product type"}
                onChange={(event) => {
                  form.setFieldValue("productType", event.currentTarget.value);
                }}
                onFocus={() => {
                  form.setFieldError("productType", false);
                }}
              />
            </div> */}
            {/* <div>
              <TextInput
                disabled={(form) => {
                  form.productType.some((item) => {
                    item === "AnotherType";
                  });
                }}
                required="true"
                label="Type detail"
                icon={<AiOutlineTags />}
                error={form.errors.typeDetail && "Please specify valid type detail"}
                value={form.values.typeDetail}
                onChange={(event) => form.setFieldValue("typeDetail", event.currentTarget.value)}
                onFocus={() => {
                  form.setFieldError("typeDetail", false);
                }}
              />
            </div> */}
            {/* <div>
              <NumberInput
                required="true"
                label="Product quantity available"
                icon={<FiArchive />}
                min={1000}
                step={100000}
                error={form.errors.productQuantity && "Enter product quantity available"}
                onChange={(event) =>
                  form.setFieldValue("productQuantity", event.currentTarget.value)
                }
                onFocus={() => {
                  form.setFieldError("productQuantity", false);
                }}
              />
            </div> */}
            {/* <div>
              <div>
                <NumberInput
                  required="true"
                  label="Product value"
                  placeholder="Price your product (price only applies for 1 product)"
                  icon={<GiMoneyStack />}
                  min={1000}
                  step={100000}
                  error={form.errors.cost && "Please price your product"}
                  onChange={(event) => form.setFieldValue("cost", event.currentTarget.value)}
                  onFocus={() => {
                    form.setFieldError("cost", false);
                  }}
                />
              </div>
              <div>
                <p>vnd</p>
              </div>
            </div> */}
          </div>
          {/* <div className="normal-post-img-area">
            <img className="normal-post-main-img" src={mainImgUrl}></img>
            <div className="normal-post-sub-img"></div>
          </div> */}
        </div>
        <Button type="submit">Post</Button>
      </form>
    </div>
  );
}

export default NormalPost;
