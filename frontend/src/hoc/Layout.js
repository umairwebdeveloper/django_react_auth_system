import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import SidebarNavbar from "../components/dashboard/Navbar";

const Layout = ({ children }) => {
	const location = useLocation();

	const sidebarRoutes = [
		"/dashboard",
		"/expense",
		"/expense/create",
		"/expense/edit",
		"/income",
		"/income/create",
		"/income/edit",
		"/budget-ai",
		"/budget",
		"/source-category",
	]; // Only dashboard routes

	// Check if the current path matches any of the dashboard routes
	const showSidebar = sidebarRoutes.some((route) =>
		location.pathname.startsWith(route)
	);

	const showNavbar = !showSidebar;

	useEffect(() => {
		if (showSidebar) {
			import("../style/dashboard.css");
		}
	}, [showSidebar]);

	return (
		<div>
			{showNavbar && (
				<>
					<Navbar />
					{children}
				</>
			)}
			{showSidebar && (
				<>
					<div className="wrapper">
						<Sidebar />
						<div className="main">
							<SidebarNavbar />
							<main
								className="content px-3 py-4"
								style={{ overflow: "auto" }}
							>
								<div className="container-fluid">
									{children}
								</div>
							</main>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Layout;
