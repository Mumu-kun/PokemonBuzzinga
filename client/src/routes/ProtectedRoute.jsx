import React from "react";
import useAuthContext from "../hooks/useAuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
	const { user } = useAuthContext();

	if (user == null) {
		return <Navigate to="/login" />;
	}

	return (
		<>
			<Outlet />
		</>
	);
}

export default ProtectedRoute;
