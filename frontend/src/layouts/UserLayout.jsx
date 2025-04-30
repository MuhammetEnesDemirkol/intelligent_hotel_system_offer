import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import "../styles/user.css";

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <div className="user-fullscreen">
        <Outlet />
        <ChatBot />
      </div>
    </>
  );
};

export default UserLayout;
