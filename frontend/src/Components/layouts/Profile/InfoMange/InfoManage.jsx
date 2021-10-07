import React, { useState, useEffect } from "react";
import { useForm } from "@mantine/hooks";
import { TextInput, Button, Avatar } from "@mantine/core";
import "./InfoManage.css";
import { useNotifications } from "@mantine/notifications";
import { RiFolderUserLine } from "react-icons/ri";
import { TiHomeOutline } from "react-icons/ti";
import { BiPhoneCall, BiCheckShield } from "react-icons/bi";
import userApi from "../../../../API/userApi";
import PropTypes from "prop-types";
import { Switch } from "@mantine/core";

InfoManage.propTypes = {
  allInfo: PropTypes.object.isRequired,
};

function InfoManage(props) {
  //PROP
  const { allInfo } = props;

  //STATE
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [realNameChecked, setRealNameChecked] = useState(false);
  const [addressChecked, setAddressChecked] = useState(false);
  const [phoneNumberChecked, setPhoneNumberChecked] = useState(false);
  //EFFECT
  useEffect(() => {
    setFileUrl(allInfo.avatar);
    form.setFieldValue("realName", allInfo.realName);
    form.setFieldValue("address", allInfo.address);
    form.setFieldValue("phoneNumber", allInfo.phoneNumber);
    setRealNameChecked(allInfo.realNameSetting);
    setAddressChecked(allInfo.addressSetting);
    setPhoneNumberChecked(allInfo.phoneNumberSetting);
  }, [allInfo]);

  //USE FORM
  const form = useForm({
    initialValues: {
      realName: "",
      address: "",
      phoneNumber: "",
    },
    validationRules: {
      phoneNumber: (value) =>
        value === "" || (!isNaN(value) && Number.isInteger(parseFloat(value))) ? true : false,
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

  const handleSubmit = async (value) => {
    try {
      let formData = new FormData();
      formData.append("file", file);
      if (file) {
        const uploadAvatarRes = await userApi.uploadAvatar(formData);
        if (uploadAvatarRes !== "OK") {
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
        realNameSetting: realNameChecked,
        addressSetting: addressChecked,
        phoneNumberSetting: phoneNumberChecked,
      };
      const updateInfo = await userApi.updateInfo(data);
      if (updateInfo !== "OK") {
        return notifications.showNotification({
          color: "red",
          title: "Update profile failed!",
          message:
            "Some error occurred while updating information. Please try to update your information again !",
          autoClose: 10000,
        });
      }
      return (window.location = "/profile");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="info-manage-container">
      <form onSubmit={form.onSubmit(handleSubmit)} className="info-manage-form">
        <div className="img-area">
          <Avatar size={240} radius="md" src={fileUrl} />
          <input className="file-input" type="file" onChange={handleFile} />
        </div>
        <div className="info-form-item">
          <TextInput
            styles={{ input: { width: "280px" } }}
            label="Name"
            icon={<RiFolderUserLine />}
            value={form.values.realName}
            onChange={(event) => form.setFieldValue("realName", event.currentTarget.value)}
          />
          <Switch
            styles={{
              root: { paddingTop: "20px" },
              label: { fontSize: "19px", marginTop: "2.5px", paddingLeft: "5px" },
            }}
            radius="lg"
            color="cyan"
            label={<BiCheckShield />}
            checked={realNameChecked}
            onChange={(event) => setRealNameChecked(event.currentTarget.checked)}
          />
        </div>
        <div className="info-form-item">
          <TextInput
            styles={{ input: { width: "280px" } }}
            label="Address"
            icon={<TiHomeOutline />}
            value={form.values.address}
            onChange={(event) => form.setFieldValue("address", event.currentTarget.value)}
          />
          <Switch
            styles={{
              root: { paddingTop: "20px" },
              label: { fontSize: "19px", marginTop: "2.5px", paddingLeft: "5px" },
            }}
            radius="lg"
            color="cyan"
            label={<BiCheckShield />}
            checked={addressChecked}
            onChange={(event) => setAddressChecked(event.currentTarget.checked)}
          />
        </div>
        <div className="info-form-item">
          <TextInput
            styles={{ input: { width: "280px" } }}
            label="Phone Number"
            icon={<BiPhoneCall />}
            error={form.errors.phoneNumber && "Please specify valid phone number (number only)!"}
            value={form.values.phoneNumber}
            onChange={(event) => form.setFieldValue("phoneNumber", event.currentTarget.value)}
            onFocus={() => {
              form.setFieldError("phoneNumber", false);
            }}
          />
          <Switch
            styles={{
              root: { paddingTop: "20px" },
              label: { fontSize: "19px", marginTop: "2.5px", paddingLeft: "5px" },
            }}
            radius="lg"
            color="cyan"
            label={<BiCheckShield />}
            checked={phoneNumberChecked}
            onChange={(event) => setPhoneNumberChecked(event.currentTarget.checked)}
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
