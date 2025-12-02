/**
 * Access to the Django backend.
 * Add consts here for each page we need displayed
 * Then define these routes in App.js
 */

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

export const getTeamDetail = async (teamId) => {
	const response = await api.get(`/teams/data/${teamId}`);
	return response.data;
};
