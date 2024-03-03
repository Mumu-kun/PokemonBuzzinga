import React, { useState } from "react";
// import ReactDatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const CreateTournament = () => {
	const [startDate, onStartDate] = useState(new Date());
	const handleSubmit = (e) => {};
	return (
		<div className="w-full flex-1 flex flex-col justify-center items-center -translate-y-16">
			<h1 className="text-h1 mb-20">Create Tournament</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3 w-2/3">
				<label htmlFor="name">Tournament Name</label>
				<input type="text" name="tournament_name" id="name" className="text-black" />
				<label htmlFor="max">Max Participants</label>
				<select name="max_participants" id="max" className="text-black">
					{[...Array(4).keys()].map((i) => (
						<option key={i} value={2 ** (i + 1)}>
							{2 ** (i + 1)}
						</option>
					))}
				</select>
				<label htmlFor="start">Start Time</label>
				{/* <ReactDatePicker selected={startDate} onChange={onStartDate} showTimeSelect /> */}
			</form>
		</div>
	);
};

export default CreateTournament;
