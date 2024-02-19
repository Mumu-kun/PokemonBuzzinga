import { useEffect, useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "../../utils/AxiosSetup";
import { Navigate, useNavigate } from "react-router-dom";

function SignUp() {
	const { user, userDispatch } = useAuthContext();
	const navigate = useNavigate();

	const [regions, setRegions] = useState([]);

	if (user) {
		return <Navigate to="/" />;
	}

	const getRegions = async () => {
		try {
			const req = await axios.get("/regions");
			const data = req.data;

			setRegions(
				data.map((region) => {
					const { region_id, region_name } = region;
					return {
						region_id,
						region_name,
					};
				})
			);
		} catch (error) {
			console.error(error);
		}
	};

	const signupSubmit = async (e) => {
		e.preventDefault();

		const formData = {
			name: e.target.name.value,
			password: e.target.password.value,
			region_id: e.target.region.value,
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

	useEffect(() => {
		getRegions();
	}, []);

	return (
		<div className="min-h-dvh flex flex-col items-center bg-slate-900">
			<form
				method="get"
				onSubmit={signupSubmit}
				className="flex flex-col m-auto justify-center items-center gap-5 min-w-52"
			>
				<input type="text" name="name" placeholder="Name" className="input" />
				<input type="password" name="password" placeholder="Password" className="input" />
				<div className="flex justify-center items-center w-full">
					<label htmlFor="region" className="text-white mr-2">
						Region :
					</label>
					<select name="region" className="text-black flex-1 p-1 rounded-md">
						{regions.map((region) => (
							<option value={region.region_id}>{region.region_name}</option>
						))}
					</select>
				</div>
				<button className="btn">Sign Up</button>
			</form>
		</div>
	);
}

export default SignUp;
