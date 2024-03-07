import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import "./main.css";

function Layout() {
  return (
    <div className="min-h-screen bg-parmesean text-slate-200 flex flex-col items-center">
      <Navbar />
      <div className="max-w-[1280px] mx-6 mb-8 flex-1 flex flex-col items-center">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;


  