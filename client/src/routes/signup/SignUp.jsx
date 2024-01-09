import React from "react";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "../../utils/AxiosSetup";
import { useNavigate } from "react-router-dom";

function SignUp() {
	const { userDispatch } = useAuthContext();
	const navigate = useNavigate();

	const signupSubmit = async (e) => {
		e.preventDefault();

		const formData = {
			name: e.target.name.value,
			password: e.target.password.value,
		};

		try {
			const req = await axios.post("/signup", formData);
			const data = req.data;

			userDispatch({
				type: "LOGIN",
				payload: data,
			});

			navigate("/");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="min-h-dvh flex flex-col items-center bg-slate-900 text-black">
			<form
				method="get"
				onSubmit={signupSubmit}
				className="flex flex-col m-auto justify-center items-center gap-5 w-40"
			>
				<input type="text" name="name" placeholder="Name" className="py-2 px-4 rounded-lg" />
				<input type="password" name="password" placeholder="Password" className="py-2 px-4 rounded-lg" />
				<button className="bg-slate-500 p-2 w-32 rounded-lg">Sign Up</button>
			</form>
		</div>
	);
}

export default SignUp;
