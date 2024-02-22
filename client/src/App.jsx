import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/home/Home";
import Login from "./routes/login/Login";
import SignUp from "./routes/signup/SignUp";
import ProtectedRoute from "./routes/ProtectedRoute";
import AllPokemons from "./routes/pokemons/AllPokemons";
import MyPokemons from "./routes/pokemons/MyPokemons";
import ErrorPage from "./utils/ErrorPage";
import Layout from "./components/Layout";
import MyTeams from "./routes/my-teams/MyTeams";
import TeamPage from "./routes/team/TeamPage";
import Profile from "./routes/profile/Profile";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} errorElement={<ErrorPage />} />
					<Route path="login/" element={<Login />} />
					<Route path="signup/" element={<SignUp />} />
					<Route path="profile/:trainer_id" element={<Profile />} />
					<Route path="pokemons/" element={<AllPokemons />} />

					<Route element={<ProtectedRoute />}>
						<Route path="my-teams/" element={<MyTeams />} />
						<Route path="my-pokemons/" element={<MyPokemons />} />
						<Route path="team/:team_id" element={<TeamPage />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
