import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { blue, CustomButton } from "./CustomButton";
import { red } from "@mui/material/colors";
import { StyledTextarea } from "./StyledTextArea";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    author: "",
    content: "",
  });

  useEffect(() => {
    const author = localStorage.getItem("email");

    setPost((prev) => ({
      ...prev,
      author,
    }));
  }, [post.author]);

  const submitPost = async () => {
    const Authorization = localStorage.getItem("Authorization");

    await axios
      .post(
        `http://localhost:8080/api/posts`,
        {
          title: post.title,
          author: post.author,
          content: post.content,
        },
        {
          headers: {
            Authorization,
          },
        }
      )
      .then(() => {
        alert("글이 등록되었습니다.");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>게시글 작성하기</h1>
      <h2>글 제목</h2>
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        value={post.title}
        onChange={(event) =>
          setPost((prev) => ({
            ...prev,
            title: event.target.value,
          }))
        }
      />
      <h2>작성자</h2>
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        value={post.author}
        disabled={true}
        onChange={(event) =>
          setPost((prev) => ({
            ...prev,
            author: event.target.value,
          }))
        }
      />
      <h2>본문</h2>
      <StyledTextarea
        aria-label="minimum height"
        minRows={3}
        placeholder="Minimum 3 rows"
        value={post.content}
        onChange={(event) =>
          setPost((prev) => ({
            ...prev,
            content: event.target.value,
          }))
        }
      />
      <div
        style={{
          marginTop: "20px",
        }}
      >
        <CustomButton
          style={{ backgroundColor: blue[500] }}
          onClick={submitPost}
        >
          작성
        </CustomButton>
        <CustomButton
          style={{ backgroundColor: red[500] }}
          onClick={() => navigate("/")}
        >
          취소
        </CustomButton>
      </div>
    </div>
  );
};

export default CreatePostPage;
