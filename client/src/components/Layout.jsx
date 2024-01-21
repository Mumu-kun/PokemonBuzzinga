import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
	return (
		<div className=" min-h-dvh flex flex-col items-center bg-slate-900 text-slate-200">
			<Navbar />
			<Outlet />
		</div>
	);
}

export default Layout;
