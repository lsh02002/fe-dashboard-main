import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "end",
        paddingRight: "60px",
        paddingTop: "40px",
      }}
    >
      <Link to="/">홈 페이지</Link>
      <Link to="/mypage">마이 페이지</Link>
    </div>
  );
};

export default Header;
