import React from "react";
import { useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "../../utils/AxiosSetup";
import { Navigate, useNavigate } from "react-router-dom";
import MessagePopup from "../../components/MessagePopup";

function Login() {
	const { user, userDispatch } = useAuthContext();
	const [msg, setMsg] = useState(null);
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
			if (error.response?.data?.message) {
				setMsg(error.response.data.message);
			}
		}
	};

	return (
		<div className="flex w-fit flex-1 flex-col items-center">
			{!!msg && <MessagePopup message={msg} setMessage={setMsg} />}
			<form method="get" onSubmit={loginSubmit} className="m-auto flex flex-col items-center justify-center gap-5">
				<h1 className="text-h1 -mt-20">Login</h1>
				<input type="text" name="name" placeholder="Name" className="input" />
				<input type="password" name="password" placeholder="Password" className="input" />
				<button className="btn">Login</button>
			</form>
		</div>
	);
}

export default Login;
