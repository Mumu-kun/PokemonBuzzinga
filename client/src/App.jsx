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
import PokemonDetailsPage from "./routes/pokemondets/PokemonDetailsPage";
import NaturePage from "./routes/pokemons/NaturePage";
import Profile from "./routes/profile/Profile";
import BattlePage from "./routes/battle/BattlePage";
import Tournaments from "./routes/tournaments/Tournaments";
import CreateTournament from "./routes/tournaments/CreateTournament";
import BattleSpecific from "./routes/battle/BattleSpecific";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="login/" element={<Login />} />
					<Route path="signup/" element={<SignUp />} />
					<Route path="pokemons/" element={<AllPokemons />} />
					<Route path="pokemonsdets/:id" element={<PokemonDetailsPage />} />
					<Route path="naturing/" element={<NaturePage />} />
					<Route path="profile/:trainer_id" element={<Profile />} />

					<Route element={<ProtectedRoute />}>
						<Route path="battle/" element={<BattlePage />} />
						<Route path="battle/:battleId" element={<BattleSpecific />} />
						<Route path="my-teams/" element={<MyTeams />} />
						<Route path="my-pokemons/" element={<MyPokemons />} />
						<Route path="team/:team_id" element={<TeamPage />} />
						<Route path="tournaments/" element={<Tournaments />} />
						<Route path="tournaments/create" element={<CreateTournament />} />
					</Route>

					<Route path="*" element={<ErrorPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
