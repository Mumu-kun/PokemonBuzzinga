import React from "react";

const Popup = ({ children }) => {
	return (
		<div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center bg-slate-500 bg-opacity-50">
			<div className="flex min-h-52 w-fit min-w-96 flex-col items-center justify-evenly rounded-md bg-slate-900 p-6 text-white">
				{children}
			</div>
		</div>
	);
};

export default Popup;
