import React, { useEffect, useState } from "react";
import { Card, CardContent, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { blue, CustomButton } from "./CustomButton";
import { StyledTextarea } from "./StyledTextArea";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostDetailPage = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewCommnent] = useState({
    content: "",
    author: "",
  });
  const [like, setLike] = useState(0);

  const [isCommentEntering, setIsCommentEntering] = useState(0);

  useEffect(() => {
    const postData = JSON.parse(localStorage.getItem("post"));
    const author = localStorage.getItem("email");

    setPost({ ...postData });
    setNewCommnent({ author });

    try {
      async function fetchData() {
        await axios
          .get("http://localhost:8080/api/comments")
          .then((res) => {
            if (!res) return;
            console.log(res.data.comments);

            setComments([
              ...res.data.comments.filter(
                (c) => parseInt(c?.post_id) === postData.id
              ),
            ]);
          })
          .catch((err) => console.error(err));
      }

      async function fetchLikeCount() {
        await axios
          .get(`http://localhost:8080/api/likes/${postData.id}`)
          .then((res) => {
            console.log(res);
            setLike(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      }
      fetchData();
      fetchLikeCount();
    } catch (e) {
      console.error(e);
    }
  }, [isCommentEntering]);

  const fetchPostByIdData = async (postid) => {
    await axios
      .get(`http://localhost:8080/api/posts/${postid}`)
      .then((res) => {
        console.log(res);
        localStorage.setItem("post", JSON.stringify({ ...res.data }));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handlePostChange = async () => {
    const Authorization = localStorage.getItem("Authorization");

    await axios
      .put(
        `http://localhost:8080/api/posts/${post.id}`,
        {
          title: post.title,
          content: post.content,
        },
        {
          headers: {
            Authorization,
          },
        }
      )
      .then((res) => {
        console.log(res);
        fetchPostByIdData(post.id);

        alert("글이 수정되었습니다.");
      })
      .catch((err) => console.error(err));
  };

  const handleCommentChange = async (id, content) => {
    const Authorization = localStorage.getItem("Authorization");

    await axios
      .put(
        `http://localhost:8080/api/comments/${id}`,
        {
          content,
        },
        {
          headers: {
            Authorization,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));
  };

  const changeComment = (commentId, comment) => {
    const indexToUpdate = comments.findIndex((item) => item.id === commentId);
    const newComments = comments;
    if (indexToUpdate !== -1) {
      newComments[indexToUpdate] = {
        ...newComments[indexToUpdate],
        content: comment,
      };
      setComments([...newComments]);
    }
  };

  const submitComment = async () => {
    const Authorization = localStorage.getItem("Authorization");
    await axios
      .post(
        `http://localhost:8080/api/comments`,
        {
          author: newComment.author,
          content: newComment.content,
          post_id: post.id,
        },
        {
          headers: {
            Authorization,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setIsCommentEntering(1 - isCommentEntering);
      })
      .catch((err) => console.error(err));
  };

  const handleLikeChange = async (postid) => {
    const Authorization = localStorage.getItem("Authorization");

    await axios
      .get(`http://localhost:8080/api/set-likes/${post.id}`, {
        headers: {
          Authorization,
        },
      })
      .then((res) => {
        console.log(res);
        setLike(res.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>게시판 상세</h1>
      <h2>글 제목</h2>
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        value={post?.title || ""}
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
        value={post?.author || ""}
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
        value={post?.content || ""}
        onChange={(event) =>
          setPost((prev) => ({
            ...prev,
            content: event.target.value,
          }))
        }
      />
      <div>
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid lightgray",
            borderRadius: "5px",
            background: "white",
            marginTop: "20px",
            width: "200px",
            height: "80px",
            cursor: "pointer",
          }}
          onClick={() => handleLikeChange(post.id)}
        >
          <h2 style={{ marginRight: "10px" }}>좋아요 </h2>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-PCvOqupyIzjFDrFO-7pzHtI-zSJ8LFgUG7y9hyYR7Q&s"
            alt=""
            width={40}
          />
          <h2 style={{ color: "red", marginLeft: "10px" }}>{like}</h2>
        </button>
      </div>
      <div
        style={{
          marginTop: "20px",
        }}
      >
        <CustomButton
          style={{ backgroundColor: blue[500] }}
          onClick={handlePostChange}
        >
          수정
        </CustomButton>
        <CustomButton
          style={{ backgroundColor: red[500] }}
          onClick={() => navigate(-1)}
        >
          취소
        </CustomButton>
      </div>
      <div style={{ marginTop: 20 }}>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent style={{ display: "flex", flexDirection: "column" }}>
            <h3>
              댓글 작성자 - <span style={{ color: "blue" }}>본인</span>
            </h3>
            <TextField
              variant="outlined"
              value={newComment.author || ""}
              disabled={true}
              onChange={(event) =>
                setNewCommnent((prev) => ({
                  ...prev,
                  author: event.target.value,
                }))
              }
            />
            <h3>댓글 내용</h3>
            <TextField
              variant="outlined"
              value={newComment.content || ""}
              onChange={(event) =>
                setNewCommnent((prev) => ({
                  ...prev,
                  content: event.target.value,
                }))
              }
            />
            <CustomButton
              style={{ backgroundColor: blue[500], marginTop: 10 }}
              onClick={submitComment}
            >
              생성
            </CustomButton>
          </CardContent>
        </Card>
        {comments.length > 0 &&
          comments.map((c, index) => (
            <Card sx={{ marginBottom: 2 }}>
              <CardContent>
                <TextField
                  variant="outlined"
                  value={c?.content || ""}
                  onChange={(event) => changeComment(c.id, event.target.value)}
                />
                <Typography variant="h5" component="div">
                  {c?.author || ""}
                </Typography>
                <Typography color="text.secondary">
                  {c?.create_at || ""}
                </Typography>
                {newComment.author === c.author ? (
                  <CustomButton
                    style={{ backgroundColor: blue[500] }}
                    onClick={() => handleCommentChange(c.id, c.content)}
                  >
                    수정
                  </CustomButton>
                ) : null}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default PostDetailPage;
