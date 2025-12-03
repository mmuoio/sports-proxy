import "./App.css";
//import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router"; // ADD this import

import TeamList from "./components/TeamList";
import TeamDetail from "./components/TeamDetail";

function App() {
	return (
		// Wrap your entire application in BrowserRouter for routing
		<BrowserRouter>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
				</Routes>
			</BrowserRouter>
			,
			<div className="navbar bg-base-200 shadow-md">
				<a href="#" className="btn btn-ghost text-xl">
					Sports Proxy
				</a>
				<a href="#" className="btn btn-dash btn-error">
					Test Button
				</a>
			</div>
			<Routes>
				{/* Route for the main team list */}
				<Route path="/" element={<TeamList />} />

				{/* Route for individual team details. teamId is a URL parameter. */}
				<Route path="/teams/:teamId" element={<TeamDetail />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
