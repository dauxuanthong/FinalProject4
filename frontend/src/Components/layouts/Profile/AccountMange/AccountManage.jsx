import React, { useState } from "react";
import { useForm } from "@mantine/hooks";
import { Button, PasswordInput, LoadingOverlay } from "@mantine/core";
import { BiLock, BiChevronDownCircle } from "react-icons/bi";
import "./AccountManage.css";
import userApi from "../../../../API/userApi";
import { useNotifications } from "@mantine/notifications";


function AccountManage(props) {
  //STATE
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState("");

  //USE-FORM
  const form = useForm({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationRules: {
      oldPassword: (value) => value.trim().length >= 1,
      newPassword: (value) => /^(?=.*[0-9])(?=.*[a-z]).{6,32}$/.test(value),
      confirmNewPassword: (value) => (value === pass ? true : false),
    },
  });
  //USE-NOTIFICATION
  const notifications = useNotifications();

  //EVENT
  const handleSubmit = async (value) => {
    setLoading(true);
    try {
      //change account
      const changeAccountRes = await userApi.changeAccount(value);
      if (changeAccountRes.errMessage) {
        setLoading(false);
        return notifications.showNotification({
          color: "red",
          title: "Change password failed",
          message: changeAccountRes.errMessage,
          autoClose: 10000,
        });
      }
      if (changeAccountRes.successMessage) {
        setLoading(false);
        return notifications.showNotification({
          color: "green",
          title: "Change password status",
          message: changeAccountRes.successMessage,
          autoClose: 3000,
          icon: <BiChevronDownCircle/>
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="account-manage-container">
      <p className="account-form-title">Change password</p>
      <form onSubmit={form.onSubmit(handleSubmit)} className="account-manage-form">
        <LoadingOverlay visible={loading} />
        <div className="account-form-item">
          <PasswordInput
            required="true"
            label="Old Password"
            showPasswordLabel="Show password"
            hidePasswordLabel="Hide password"
            icon={<BiLock />}
            value={form.values.oldPassword}
            onChange={(event) => {
              form.setFieldValue("oldPassword", event.currentTarget.value);
            }}
            onFocus={() => form.setFieldError("oldPassword", false)}
            error={form.errors.oldPassword && "this field is required"}
          />
        </div>
        <div className="account-form-item">
          <PasswordInput
            required="true"
            label="New Password"
            showPasswordLabel="Show password"
            hidePasswordLabel="Hide password"
            icon={<BiLock />}
            value={form.values.newPassword}
            onChange={(event) => {
              form.setFieldValue("newPassword", event.currentTarget.value);
              setPass(event.currentTarget.value);
            }}
            onFocus={() => form.setFieldError("newPassword", false)}
            error={
              form.errors.newPassword && "At least 6 characters contain number, letter, symbol"
            }
          />
        </div>
        <div className="account-form-item">
          <PasswordInput
            required="true"
            label="Confirm Password"
            showPasswordLabel="Show password"
            hidePasswordLabel="Hide password"
            icon={<BiLock />}
            value={form.values.confirmNewPassword}
            onChange={(event) => {
              form.setFieldValue("confirmNewPassword", event.currentTarget.value);
              setPass(event.currentTarget.value);
            }}
            onFocus={() => form.setFieldError("confirmNewPassword", false)}
            error={form.errors.confirmNewPassword && "Confirm password is not match"}
          />
        </div>
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}

export default AccountManage;
