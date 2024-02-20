import axios from "axios";

const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL ?? import.meta.env.REACT_APP_BASE_URL;
console.log(baseURL);
// const baseURL = "http://localhost:8080/api";
// const baseURL = "https://pokemon-buzzinga-server.onrender.com/api"

const axiosApi = axios.create({
	baseURL,
});

axiosApi.interceptors.request.use((config) => {
	config.headers.user = window.localStorage.getItem("user");
	return config;
});

export default axiosApi;
