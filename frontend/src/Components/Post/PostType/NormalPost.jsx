import React, { useState } from "react";
import "./NormalPost.css";
import { useForm } from "@mantine/hooks";
import { TextInput, Button, LoadingOverlay } from "@mantine/core";
function NormalPost(props) {
  //STATE
  const [mainImgUrl, setMainImgUrl] = useState(
    "https://thailamlandscape.vn/wp-content/uploads/2017/10/no-image.png"
  );
  //USE-FORM
  const form = useForm({
    initialValues: {
      productName: "",
      productType: "",
      anotherType: "",
    },
    validationRules: {
      userName: (value) => value.trim().length >= 1 && value.trim().length <= 50,
      // email: (value) => /^\S+@\S+$/.test(value),
      // password: (value) => /^(?=.*[0-9])(?=.*[a-z]).{6,32}$/.test(value),
      // confirmPassword: (value) => (value === pass ? true : false),
    },
  });

  return (
    <div className="normal-post-container">
      <div className="first-part-div">
        <div className="normal-post-info-area">
          <form>
            <div>
              <TextInput
                required="true"
                label="Product name"
                icon={<BiUserCircle />}
                error={form.errors.productName && "Please specify valid product name"}
                value={form.values.productName}
                onChange={(event) => form.setFieldValue("userName", event.currentTarget.value)}
                onFocus={() => {
                  form.setFieldError("userName", false);
                }}
              />
            </div>
          </form>
        </div>
        <div className="normal-post-img-area">
          <img className="normal-post-main-img" src={mainImgUrl}></img>
          <div className="normal-post-sub-img"></div>
        </div>
      </div>
    </div>
  );
}

export default NormalPost;
