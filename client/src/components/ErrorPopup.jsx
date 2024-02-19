const ErrorPopup = ({ message, setMessage }) => {
	return (
		<div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen z-50 bg-opacity-50 bg-slate-900">
			<div className="p-6 min-w-96 min-h-52 flex flex-col justify-evenly items-center bg-slate-900 text-white rounded-md">
				{message}
				<button
					className="btn--red"
					onClick={() => {
						setMessage(null);
					}}
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default ErrorPopup;
