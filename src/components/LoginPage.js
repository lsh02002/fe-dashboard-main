import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { blue, CustomButton } from "./CustomButton";
import { isalnum } from "./IsAlnum";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
  });
  const [emailErrMessage, setEmailErrMessage] = useState("");
  const [passwordErrMessage, setPasswordErrMessage] = useState("");
  const [loginErrMessage, setLoginErrMessage] = useState("");

  const emailChangeHandler = (event) => {
    setLoginErrMessage("");
    setEmailErrMessage("");
    //setPasswordErrMessage("");

    setLoginState((prev) => ({ ...prev, email: event.target.value }));
  };

  const emailBlurHandler = (event) => {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(event.target.value)) {
      setEmailErrMessage("이메일이 올바른 형식이 아닙니다.");
    }
  };

  const passwordChangeHandler = (event) => {
    setLoginErrMessage("");
    //setEmailErrMessage("");
    setPasswordErrMessage("");

    setLoginState((prev) => ({ ...prev, password: event.target.value }));
  };

  const passwordBlurHandler = (event) => {
    if (event.target.value.length < 8 || !isalnum(event.target.value.length)) {
      setPasswordErrMessage(
        "패스워드는 최소 길이 8자이고 숫자와 알파벳 조합이어야 합니다."
      );
    }
  };

  const loginHandler = async (path, email, password) => {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(loginState.email)) {
      setEmailErrMessage("이메일이 올바른 형식이 아닙니다.");
    }

    if (loginState.password.length < 8 || !isalnum(loginState.password)) {
      setPasswordErrMessage(
        "패스워드는 최소 길이 8자이고 숫자와 알파벳 조합이어야 합니다."
      );
    }

    if (
      loginState.email !== "" &&
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(loginState.email) &&
      emailErrMessage === "" &&
      loginState.password !== "" &&
      (loginState.password.length >= 8 || isalnum(loginState.password)) &&
      passwordErrMessage === ""
    ) {
      await axios
        .post(`http://localhost:8080${path}`, {
          email,
          password,
        })
        .then((res) => {
          if (path === "/api/signup") {
            console.log(res);

            alert("회원가입이 완료되었습니다.");

            navigate("/login");
            navigate(0);
          } else if (path === "/api/login") {
            console.log(res);
            const token = res.headers.getAuthorization();
            localStorage.setItem("Authorization", token);
            localStorage.setItem("email", email);

            navigate("/");
          }
        })
        .catch((err) => {
          console.error(err);
          setLoginErrMessage(err.response.data.message);
        });
    }
  };

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>로그인 페이지</h1>
      <h2>이메일</h2>
      <TextField
        id="outlined-basic"
        label="이메일을 입력해주세요."
        variant="outlined"
        onChange={(event) => emailChangeHandler(event)}
        onBlur={(event) => emailBlurHandler(event)}
      />
      {emailErrMessage && (
        <div
          style={{
            paddingTop: "5px",
            fontSize: "12px",
            color: "red",
            width: "220px",
          }}
        >
          {emailErrMessage}
        </div>
      )}
      <h2>비밀번호</h2>
      <TextField
        id="outlined-basic"
        type="password"
        label="비밀번호를 입력해주세요."
        variant="outlined"
        onChange={(event) => passwordChangeHandler(event)}
        onBlur={(event) => passwordBlurHandler(event)}
      />
      {passwordErrMessage && (
        <div
          style={{
            paddingTop: "5px",
            fontSize: "12px",
            color: "red",
            width: "220px",
          }}
        >
          {passwordErrMessage}
        </div>
      )}
      {loginErrMessage && (
        <div
          style={{
            paddingTop: "5px",
            fontSize: "12px",
            color: "red",
            width: "220px",
          }}
        >
          {loginErrMessage}
        </div>
      )}
      <div
        style={{
          marginTop: "20px",
        }}
      >
        <CustomButton
          style={{ backgroundColor: blue[900] }}
          onClick={() =>
            loginHandler("/api/signup", loginState.email, loginState.password)
          }
        >
          회원가입
        </CustomButton>
        <CustomButton
          style={{ backgroundColor: blue[500] }}
          onClick={() =>
            loginHandler("/api/login", loginState.email, loginState.password)
          }
        >
          로그인
        </CustomButton>
      </div>
    </div>
  );
};

export default LoginPage;
