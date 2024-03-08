import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import "./main.css";

function Layout() {
	return (
		<div className="bg-parmesean flex min-h-screen flex-col items-center text-slate-200">
			<Navbar />
			<div className="mx-6 flex w-3/4 min-w-[1000px] max-w-[1280px] flex-1 flex-col items-center bg-slate-100 px-10 pb-8 ">
				<Outlet />
			</div>
		</div>
	);
}

export default Layout;
