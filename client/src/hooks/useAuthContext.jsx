import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";

function useAuthContext() {
	const context = useContext(AuthContext);

	if (!context) {
		throw Error("useAuthContext must be used inside an TrainerContextProvider");
	}

	return context;
}

export default useAuthContext;
