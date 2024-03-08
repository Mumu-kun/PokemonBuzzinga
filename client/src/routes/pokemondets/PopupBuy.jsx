import React, { useState } from "react";

const PopupBuy = ({ onSubmit, onCancel, children }) => {
	const [nickname, setNickname] = useState("");

	const handleSubmit = () => {
		onSubmit(nickname || null);
		setNickname("");
	};

	const handleCancel = () => {
		onCancel();
		setNickname("");
	};

	return (
		<div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center bg-slate-200 bg-opacity-50">
			<div className="flex min-h-52 min-w-96 flex-col items-center justify-evenly rounded-md bg-slate-700 p-8 text-white">
				{children}
				<input
					type="text"
					value={nickname}
					onChange={(e) => setNickname(e.target.value)}
					placeholder="Enter a nickname"
					className="mt-4 rounded-md  px-4 py-2 text-black outline-none"
				/>
				<div className="mt-4 flex justify-center space-x-4">
					<button onClick={handleSubmit} className="btn--green ">
						Submit
					</button>
					<button onClick={handleCancel} className="btn--red">
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default PopupBuy;
