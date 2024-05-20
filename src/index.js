import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import ListPage from "./components/ListPage";
import PostDetailPage from "./components/PostDetailPage";
import CreatePostPage from "./components/CreatePostPage";
import Header from "./components/Header";
import MyPage from "./components/MyPage";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      {
        path: "/",
        element: <ListPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/post/:documentId",
        element: <PostDetailPage />,
      },
      {
        path: "/post/create",
        element: <CreatePostPage />,
      },
      {
        path: "/mypage",
        element: <MyPage />,
      },
    ],
  },
]);

root.render(<RouterProvider router={router} />);
