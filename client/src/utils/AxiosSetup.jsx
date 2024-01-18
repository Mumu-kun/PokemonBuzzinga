import axios from "axios";

const baseURL = "http://localhost:8080/api";
// const baseURL = "https://pokemon-buzzinga-server.onrender.com/api/"

const instance = axios.create({
	baseURL,
});

export default instance;
