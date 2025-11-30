import "./App.css";
//import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // ADD this import

import TeamList from "./components/TeamList";
import TeamDetail from "./components/TeamDetail";

function App() {
	return (
		// Wrap your entire application in BrowserRouter for routing
		<BrowserRouter>
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
