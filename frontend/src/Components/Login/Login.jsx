import React, { useState } from "react";
import { TextInput, Button, PasswordInput, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { BiUserCircle, BiLock } from "react-icons/bi";
import "./Login.css";
import userApi from "../../API/userApi";
import { useNotifications } from "@mantine/notifications";
import { GoogleLogin } from "react-google-login";

function Login(props) {
  //STATE
  const [loading, setLoading] = useState(false);
  //USE-FORM
  const form = useForm({
    initialValues: {
      userName: "",
      password: "",
    },
    validationRules: {
      userName: (value) => value.trim().length > 0,
      password: (value) => value.trim().length > 0,
    },
  });
  //USE-NOTIFICATION
  const notifications = useNotifications();
  //EVENT
  const handleSubmit = async (value) => {
    setLoading(true);
    try {
      const loginRes = await userApi.login(value);

      if (loginRes.errMessage) {
        setLoading(false);
        notifications.showNotification({
          color: "red",
          title: "Login failed",
          message: loginRes.errMessage,
          autoClose: false,
        });
      } else {
        localStorage.setItem("accessToken", JSON.stringify(loginRes));
        localStorage.setItem("status", "signIn");
        setLoading(false);
        window.location = "/";
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleLogin = async (googleData) => {
    try {
      console.log("GOOGLE");
      const googleLoginRes = await userApi.googleLogin({ token: googleData.tokenId });
      localStorage.setItem("accessToken", JSON.stringify(googleLoginRes));
      localStorage.setItem("status", "signIn");
      window.location = "/";
    } catch (error) {
      console.log(error);
    }
  };
  const direction = () => {
    window.location = "/register";
  };
  return (
    <div className="login-container">
      <p className="login-tittle">LOGIN</p>
      <form onSubmit={form.onSubmit(handleSubmit)} className="login-form">
        <LoadingOverlay visible={loading} />
        <div className="login-form-item">
          <TextInput
            required="true"
            label="User Name"
            icon={<BiUserCircle />}
            error={form.errors.userName && "This field required"}
            value={form.values.userName}
            onChange={(event) => form.setFieldValue("userName", event.currentTarget.value)}
            onFocus={() => {
              form.setFieldError("userName", false);
            }}
          />
        </div>
        <div className="login-form-item">
          <PasswordInput
            required="true"
            label="Password"
            showPasswordLabel="Show password"
            hidePasswordLabel="Hide password"
            icon={<BiLock />}
            value={form.values.password}
            onChange={(event) => {
              form.setFieldValue("password", event.currentTarget.value);
            }}
            onFocus={() => form.setFieldError("password", false)}
            error={form.errors.password && "This field required"}
          />
        </div>
        <Button
          type="submit"
          classNames={{
            root: "login-button-root",
            inner: "login-button-inner",
          }}
        >
          Login
        </Button>
        <div className="options">
          <GoogleLogin
            className="googleLogin"
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            onSuccess={handleLogin}
            onFailure={handleLogin}
            cookiePolicy={"single_host_origin"}
          />
          <button type="button" className="register-option" onClick={direction}>
            Create new Account
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
