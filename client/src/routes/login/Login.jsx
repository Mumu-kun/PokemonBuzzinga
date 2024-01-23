import React from "react";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "../../utils/AxiosSetup";
import { Navigate, useNavigate } from "react-router-dom";

function Login() {
	const { user, userDispatch } = useAuthContext();
	const navigate = useNavigate();

	if (user) {
		return <Navigate to="/" />;
	}

	const loginSubmit = async (e) => {
		e.preventDefault();

		const formData = {
			name: e.target.name.value,
			password: e.target.password.value,
		};

		try {
			const req = await axios.post("/login", formData);
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
		<div className="min-h-dvh flex flex-col items-center bg-slate-900 ">
			<form method="get" onSubmit={loginSubmit} className="flex flex-col m-auto justify-center items-center gap-5 w-40">
				<input type="text" name="name" placeholder="Name" className="input" />
				<input type="password" name="password" placeholder="Password" className="input" />
				<button className="btn">Login</button>
			</form>
		</div>
	);
}

export default Login;
