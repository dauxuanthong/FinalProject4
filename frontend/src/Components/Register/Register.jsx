import React, { useState } from "react";
import "./Register.css";
import { TextInput, Button, PasswordInput, LoadingOverlay } from "@mantine/core";
import { HiOutlineMail } from "react-icons/hi";
import { BiUserCircle, BiLock } from "react-icons/bi";
import { useForm } from "@mantine/hooks";
import userApi from "../../API/userApi";
import { useNotifications } from "@mantine/notifications";

function Register(props) {
  //STATE
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState("");
  //USE-FORM
  const form = useForm({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationRules: {
      userName: (value) => value.trim().length >= 2,
      email: (value) => /^\S+@\S+$/.test(value),
      password: (value) => /^(?=.*[0-9])(?=.*[a-z]).{6,32}$/.test(value),
      confirmPassword: (value) => (value === pass ? true : false),
    },
  });
  //USE-NOTIFICATION
  const notifications = useNotifications();
  //EVENT
  const handleSubmit = async (value) => {
    setLoading(true);
    try {
      const registerRes = await userApi.register(value);
      if (registerRes.errMessage) {
        setLoading(false);
        registerRes.errMessage.map((err) => {
          return notifications.showNotification({
            color: "red",
            title: "Registration failed",
            message: err,
            autoClose: false,
          });
        });
      } else {
        setLoading(false);
        window.location = "/login";
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="register-container">
      <p className="register-title">REGISTER</p>
      <form onSubmit={form.onSubmit(handleSubmit)} className="register-form">
        <LoadingOverlay visible={loading} />
        <div className="register-form-item">
          <TextInput
            required="true"
            label="User Name"
            icon={<BiUserCircle />}
            error={form.errors.userName && "Please specify valid name"}
            value={form.values.userName}
            onChange={(event) => form.setFieldValue("userName", event.currentTarget.value)}
            onFocus={() => {
              form.setFieldError("userName", false);
            }}
          />
        </div>

        <div className="register-form-item">
          <TextInput
            required="true"
            label="Email"
            icon={<HiOutlineMail />}
            error={form.errors.email && "Please specify valid email"}
            value={form.values.email}
            onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
            onFocus={() => {
              form.setFieldError("email", false);
            }}
          />
        </div>

        <div className="register-form-item">
          <PasswordInput
            required="true"
            label="Password"
            showPasswordLabel="Show password"
            hidePasswordLabel="Hide password"
            icon={<BiLock />}
            value={form.values.password}
            onChange={(event) => {
              form.setFieldValue("password", event.currentTarget.value);
              setPass(event.currentTarget.value);
            }}
            onFocus={() => form.setFieldError("password", false)}
            error={form.errors.password && "At least 6 characters contain number, letter, symbol"}
          />
        </div>

        <div className="register-form-item">
          <PasswordInput
            required="true"
            label="Confirm Password"
            showPasswordLabel="Show password"
            hidePasswordLabel="Hide password"
            icon={<BiLock />}
            value={form.values.confirmPassword}
            onChange={(event) => form.setFieldValue("confirmPassword", event.currentTarget.value)}
            onFocus={() => form.setFieldError("confirmPassword", false)}
            error={form.errors.confirmPassword && "Confirm password is not match"}
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default Register;
