import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import TeamList from "./components/TeamList";
import TeamDetail from "./components/TeamDetail";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div className="navbar bg-base-100 shadow-sm">
				<div className="flex-none">
					<button className="btn btn-square btn-ghost">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
							{" "}
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>{" "}
						</svg>
					</button>
				</div>
				<div className="flex-1">
					<a className="btn btn-ghost text-xl">daisyUI</a>
				</div>
				<div className="flex-none">
					<button className="btn btn-square btn-ghost">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
							{" "}
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
							></path>{" "}
						</svg>
					</button>
				</div>
			</div>
			// DaisyUI container for full height (optional, but good for styling)
			<div className="min-h-screen bg-gray-50">
				{/* The Routes component defines all possible paths */}
				<Routes>
					{/* 1. Main Path: Team List (e.g., http://localhost:5173/) */}
					<Route path="*" element={<TeamList />} />

					{/* 2. Detail Path: Team Dashboard (e.g., http://localhost:5173/teams/21) */}
					{/* :teamId is a URL parameter that the TeamDetail component uses */}
					<Route path="/teams/:teamId" element={<TeamDetail />} />

					{/* Optional: Add a catch-all route for 404 pages */}
					<Route path="*" element={<div className="p-10 text-center text-red-600">404: Page Not Found</div>} />
				</Routes>
			</div>
		</>
	);
}

export default App;
