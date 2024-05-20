import React, { useEffect, useState } from "react";
import { blue, CustomButton } from "./CustomButton";
import { useNavigate } from "react-router-dom";
import { red } from "@mui/material/colors";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

const ListPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [posts, setPosts] = useState([
    /*    {
      id: 1,
      title: "게시물 제목1",
      content: "게시물 내용1",
      author: "작성자",
      create_at: "작성일시",
      modify_at: "수정일시",
    },
    {
      id: 2,
      title: "게시물 제목2",
      content: "게시물 내용2",
      author: "작성자",
      created_at: "작성일시",
      modify_at: "수정일시",
    },
    */
  ]);

  useEffect(() => {
    async function fetchData() {
      await axios
        .get("http://localhost:8080/api/posts")
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

    fetchData();
  }, []);

  const logoutHandler = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      navigate("/login");
      return;
    }
    await axios
      .post(`http://localhost:8080/api/logout`, {
        body: JSON.stringify({
          email,
        }),
      })
      .then((res) => res.json())
      .then(() => {
        localStorage.removeItem("Authorization");
        localStorage.removeItem("email");

        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
        localStorage.removeItem("Authorization");
        localStorage.removeItem("email");

        navigate("/login");
      });
  };

  const searchHandler = async (email) => {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(keyword)) return;

    await axios
      .get(`http://localhost:8080/api/posts/search?author_email=${keyword}`)
      .then((res) => {
        console.log(res);

        const posts = res.data.posts;

        if (!res.data) return;
        setPosts([...posts]);
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
      <h1>게시판 리스트</h1>
      <div>
        <TextField
          id="standard-required"
          label="작성자 이메일 검색"
          variant="standard"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <CustomButton
          style={{ backgroundColor: blue[500] }}
          onClick={() => searchHandler(keyword)}
        >
          검색
        </CustomButton>
      </div>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>이름</TableCell>
            <TableCell>게시물내용</TableCell>
            <TableCell>작성자</TableCell>
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
              <TableCell>{post.author}</TableCell>
              <TableCell>{post.create_at}</TableCell>
              <TableCell>{post.modify_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CustomButton
        style={{ backgroundColor: blue[500] }}
        onClick={() => navigate("/post/create")}
      >
        게시글 작성
      </CustomButton>
      <CustomButton
        style={{ backgroundColor: red[500] }}
        onClick={logoutHandler}
      >
        로그아웃
      </CustomButton>
    </div>
  );
};

export default ListPage;
