import React from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";
import "./main.css";
import queue from "../assets/battle.jpg";
import tour from "../assets/tournament.jpg";

const pathToBg = {
	queue: queue,
	tournaments: tour,
};

function Layout() {
	const location = useLocation();
	const { pathname } = location;
	const mainPath = pathname.split("/")[1];

	return (
		<div
			className="bg-parmesean flex min-h-screen flex-col items-center text-slate-950"
			style={{
				backgroundImage: `url(${pathToBg[mainPath] ?? queue})`,
				backgroundSize: "repeat-y",
				backgroundPosition: "top",
			}}
		>
			<Navbar />
			<div className="mx-6 flex w-3/4 min-w-[1000px] max-w-[1280px] flex-1 flex-col items-center bg-blue-50 px-10 pb-8 ">
				<Outlet />
			</div>
		</div>
	);
}

export default Layout;
