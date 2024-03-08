import { useEffect, useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "../../utils/AxiosSetup";
import { Navigate, useNavigate } from "react-router-dom";
import MessagePopup from "../../components/MessagePopup";

function SignUp() {
	const { user, userDispatch } = useAuthContext();
	const [msg, setMsg] = useState(null);
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
			if (error.response?.data?.message) {
				setMsg(error.response.data.message);
			}
		}
	};

	useEffect(() => {
		getRegions();
	}, []);

	return (
		<div className="flex w-fit flex-1 flex-col items-center">
			{!!msg && <MessagePopup message={msg} setMessage={setMsg} />}
			<form
				method="get"
				onSubmit={signupSubmit}
				className="m-auto flex min-w-52 flex-col items-center justify-center gap-5"
			>
				<h1 className="text-h1 -mt-20">Sign Up</h1>
				<input type="text" name="name" placeholder="Name" className="input" />
				<input type="password" name="password" placeholder="Password" className="input" />
				<div className="flex w-full items-center justify-center">
					<label htmlFor="region" className="mr-2">
						Region :
					</label>
					<select name="region" className="flex-1 rounded-md p-1 text-black">
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
