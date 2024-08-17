import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
	const location = useLocation();

	const sidebarRoutes = ["/dashboard"]; // Only dashboard routes

	// Check if the current path matches any of the dashboard routes
	const showSidebar = sidebarRoutes.some((route) =>
		location.pathname.startsWith(route)
	);

	// Show the Navbar if the current path is not in sidebarRoutes
	const showNavbar = !showSidebar;

	return (
		<div>
			{showNavbar && <Navbar />}
			{showSidebar && <Sidebar />}
			<div className={showSidebar ? "content-with-sidebar" : ""}>
				{children}
			</div>
		</div>
	);
};

export default Layout;
