import React from "react";

const Popup = ({ children }) => {
	return (
		<div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen z-20 bg-opacity-50 bg-slate-800">
			<div className="p-6 w-fit min-w-96 min-h-52 flex flex-col justify-evenly items-center bg-slate-900 text-white rounded-md">
				{children}
			</div>
		</div>
	);
};

export default Popup;
