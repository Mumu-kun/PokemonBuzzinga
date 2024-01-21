import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./routes/home/Home";
import Login from "./routes/login/Login";
import SignUp from "./routes/signup/SignUp";
import ProtectedRoute from "./routes/ProtectedRoute";
import AllPokemons from "./routes/pokemons/AllPokemons";
import MyPokemons from "./routes/pokemons/MyPokemons";
import ErrorPage from "./utils/ErrorPage";

function App() {
	return (
		<div className=" min-h-dvh flex flex-col items-center bg-slate-900 text-slate-200">
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} errorElement={<ErrorPage />} />
					<Route path="login/" element={<Login />} />
					<Route path="signup/" element={<SignUp />} />
					<Route path="pokemons/" element={<AllPokemons />} />

					<Route element={<ProtectedRoute />}>
						<Route path="my-pokemons/" element={<MyPokemons />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
