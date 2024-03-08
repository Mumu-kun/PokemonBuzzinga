const MessagePopup = ({ message, setMessage }) => {
	return (
		<div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-slate-300 bg-opacity-50">
			<div className="flex min-h-52 min-w-96 flex-col items-center justify-evenly rounded-md bg-slate-900 p-6 text-white">
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

export default MessagePopup;
