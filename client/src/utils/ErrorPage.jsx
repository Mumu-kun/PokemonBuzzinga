import { useRouteError } from "react-router-dom";

function ErrorPage() {
	const error = useRouteError();
	console.error(error);

	return (
		<div className="h-dvh flex flex-col justify-center items-center gap-10 bg-slate-800 text-slate-200">
			<h1 className="text-6xl">Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>{error.statusText || error.message}</p>
		</div>
	);
}

export default ErrorPage;
