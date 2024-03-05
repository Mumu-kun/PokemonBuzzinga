import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
	return (
		<div className="flex min-h-screen flex-col items-center bg-slate-900 text-slate-200">
			<Navbar />
			<div className="mx-6 mb-8 flex max-w-[1280px] flex-1 flex-col items-center">
				<Outlet />
			</div>
		</div>
	);
}

export default Layout;
