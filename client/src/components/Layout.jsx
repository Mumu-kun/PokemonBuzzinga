import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
	return (
		<div className="min-h-dvh bg-slate-900 text-slate-200 flex justify-center">
			<div className="max-w-[1280px] mx-6 mb-8 min-h-full flex flex-col items-center ">
				<Navbar />
				<Outlet />
			</div>
		</div>
	);
}

export default Layout;
