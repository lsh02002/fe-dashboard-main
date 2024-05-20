import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const MyPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likePosts, setLikePosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const email = localStorage.getItem("email");

      await axios
        .get(`http://localhost:8080/api/posts/search?author_email=${email}`)
        .then((res) => {
          console.log(res);

          const posts = res.data.posts;

          if (!posts) return;
          setPosts([...posts]);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    async function fetchCommentData() {
      const email = localStorage.getItem("email");
      await axios
        .get(`http://localhost:8080/api/comments-by-user-email/${email}`)
        .then((res) => {
          if (!res) return;
          console.log(res.data.comments);

          setComments([...res.data.comments]);
        })
        .catch((err) => console.error(err));
    }

    async function fetchlikeData() {
      const Authorization = localStorage.getItem("Authorization");
      await axios
        .get("http://localhost:8080/api/get-likes-by-user-id", {
          headers: {
            Authorization,
          },
        })
        .then((res) => {
          if (!res) return;
          console.log(res);

          setLikePosts([...res.data.posts]);
        })
        .catch((err) => console.error(err));
    }

    fetchData();
    fetchCommentData();
    fetchlikeData();
  }, []);

  const getPostById = async (postid) => {
    await axios
      .get(`http://localhost:8080/api/get-post/${postid}`, {})
      .then((res) => {
        if (!res) return;
        console.log(res);

        const post = res.data;

        console.log(post);

        localStorage.setItem(
          "post",
          JSON.stringify({
            ...post,
          })
        );
        navigate(`/post/${post.id}`);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <h1
        style={{
          paddingLeft: "40px",
        }}
      >
        마이 페이지
      </h1>
      <div
        style={{
          padding: "40px",
        }}
      >
        <h3>내가 등록한 글</h3>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>게시물내용</TableCell>
              <TableCell>작성일시</TableCell>
              <TableCell>수정일시</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => {
                  localStorage.setItem("post", JSON.stringify({ ...post }));
                  navigate(`/post/${post.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {post.title}
                </TableCell>
                <TableCell>
                  {post.content} :
                  <img
                    src="https://png.pngtree.com/png-clipart/20221118/ourlarge/pngtree-comment-icon-symbol-png-image_6459148.png"
                    width={20}
                    height={20}
                    alt=""
                  />
                  <span style={{ color: "red" }}> {post.count}</span>
                </TableCell>
                <TableCell>{post.create_at}</TableCell>
                <TableCell>{post.modify_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <h3>내가 등록한 댓글</h3>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>댓글내용</TableCell>
              <TableCell>글번호</TableCell>
              <TableCell>작성일시</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments.map((comment) => (
              <TableRow
                key={comment.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => getPostById(comment.post_id)}
              >
                <TableCell>{comment.content}</TableCell>
                <TableCell>{comment.post_id}</TableCell>
                <TableCell>{comment.create_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <h3>내가 등록한 좋아요 글</h3>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>댓글내용</TableCell>
              <TableCell>글번호</TableCell>
              <TableCell>작성일시</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {likePosts.map((likePost) => (
              <TableRow
                key={likePost.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => {
                  localStorage.setItem("post", JSON.stringify({ ...likePost }));
                  navigate(`/post/${likePost.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {likePost.title}
                </TableCell>
                <TableCell>
                  {likePost.content} :
                  <img
                    src="https://png.pngtree.com/png-clipart/20221118/ourlarge/pngtree-comment-icon-symbol-png-image_6459148.png"
                    width={20}
                    height={20}
                    alt=""
                  />
                  <span style={{ color: "red" }}> {likePost.count}</span>
                </TableCell>
                <TableCell>{likePost.create_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default MyPage;
