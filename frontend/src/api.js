import axios from "axios";

const api = axios.create({
	baseURL: process.env.REACT_APP_API_BASE,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getTeams = async () => {
	const response = await api.get("/teams/");
	return response.data;
};
