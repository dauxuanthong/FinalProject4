import React, { useState } from "react";
import { useForm } from "@mantine/hooks";
import { TextInput, NumberInput, Button, LoadingOverlay, Avatar } from "@mantine/core";
import "./InfoManage.css";
import { useNotifications } from "@mantine/notifications";
import { RiFolderUserLine } from "react-icons/ri";
import { TiHomeOutline } from "react-icons/ti";
import { BiPhoneCall, BiChevronDownCircle } from "react-icons/bi";
import userApi from "../../../../API/userApi";

function InfoManage(props) {
  //STATE
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      realName: "",
      address: "",
      phoneNumber: "",
    },
    validationRules: {
      // userName: (value) => value.trim().length >= 2,
      // email: (value) => /^\S+@\S+$/.test(value),
      // password: (value) => /^(?=.*[0-9])(?=.*[a-z]).{6,32}$/.test(value),
      phoneNumber: (value) => (value === "" || (!isNaN(value) && Number.isInteger(parseFloat(value))) ? true : false)
    },
  });

  //USE-NOTIFICATION
  const notifications = useNotifications();

  //EVENT
  const handleFile = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const fileType = newFile.type;
      if (fileType === "image/png" || fileType === "image/jpeg" || fileType === "image/jpg") {
        setFile(newFile);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setFileUrl(reader.result);
          }
        };
        return reader.readAsDataURL(e.target.files[0]);
      }
      // File not accepted
      return notifications.showNotification({
        color: "red",
        title: "File not accepted!",
        message: "Image file format must be .jpg/.jpeg./png",
        autoClose: 10000,
      });
    }
  };

  const handleSubmit = async (value) =>{
    try {
      let formData = new FormData();
      formData.append("file", file);
      if(file){
        const uploadAvatarRes = await userApi.uploadAvatar(formData);
        if(uploadAvatarRes !== "OK"){
          return notifications.showNotification({
            color: "red",
            title: "Update profile failed!",
            message: "Some error occurred while updating Avatar. Please try again!",
            autoClose: 10000,
          });
        }
      }
      const data = {
        realName: value.realName,
        address: value.address,
        phoneNumber: value.phoneNumber,
      }
      const updateInfo = await userApi.updateInfo(data);
      if(updateInfo !== "OK"){
        return notifications.showNotification({
          color: "red",
          title: "Update profile failed!",
          message: "Some error occurred while updating information. Please try to update your information again !",
          autoClose: 10000,
        });
      }
      return notifications.showNotification({
        color: "green",
        title: "Update profile success!",
        // message: "Some error occurred while updating Avatar. Please try again!",
        icon: <BiChevronDownCircle/>,
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="info-manage-container">
      <form onSubmit={form.onSubmit(handleSubmit)} className="info-manage-form">
        <div className="img-area">
          <Avatar size={240} radius="md" src={fileUrl} />
          <input className="file-input" type="file" onChange={handleFile} />
        </div>
        <div className="info-form-item">
          <TextInput
            label="Name"
            icon={<RiFolderUserLine />}
            // error={form.errors.email && "Please specify valid email"}
            value={form.values.realName}
            onChange={(event) => form.setFieldValue("realName", event.currentTarget.value)}
            // onFocus={() => {
            //   form.setFieldError("email", false);
            // }}
          />
        </div>
        <div className="info-form-item">
          <TextInput
            label="Address"
            icon={<TiHomeOutline />}
            // error={form.errors.email && "Please specify valid email"}
            value={form.values.address}
            onChange={(event) => form.setFieldValue("address", event.currentTarget.value)}
            // onFocus={() => {
            //   form.setFieldError("email", false);
            // }}
          />
        </div>
        <div className="info-form-item">
          <TextInput
            label="Phone Number"
            icon={<BiPhoneCall />}
            error={form.errors.phoneNumber && "Please specify valid phone number (number only)!"}
            value={form.values.phoneNumber}
            onChange={(event) => form.setFieldValue("phoneNumber", event.currentTarget.value)}
            onFocus={() => {
              form.setFieldError("phoneNumber", false);
            }}
          />
        </div>
        <Button
          type="submit"
          classNames={{
            root: "info-button-root",
          }}
        >
          Update
        </Button>
      </form>
    </div>
  );
}

export default InfoManage;
