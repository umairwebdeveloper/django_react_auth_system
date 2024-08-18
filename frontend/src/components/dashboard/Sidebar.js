import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../../store/auth";

const Sidebar = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isExpanded, setIsExpanded] = useState(() => {
		// Check if sidebar state is stored in localStorage
		const savedState = localStorage.getItem("isSidebarExpanded");
		if (savedState !== null) {
			return JSON.parse(savedState);
		}
		// Default state: open on desktop/PC, closed on mobile
		return window.innerWidth >= 768;
	});

	const toggleSidebar = () => {
		setIsExpanded((prevState) => {
			const newState = !prevState;
			localStorage.setItem("isSidebarExpanded", newState);
			return newState;
		});
	};

	const handleLogout = () => {
		toast.success("Logged out successfully!");
		dispatch(logout());
		navigate("/signin");
	};

	useEffect(() => {
		// Save the state of the sidebar when the page changes
		localStorage.setItem("isSidebarExpanded", isExpanded);
	}, [location, isExpanded]);

	// Function to check if the link is active
	const isActive = (path) => {
		const currentPath = location.pathname.split("/")[1];
		if (currentPath === "") {
			return path === "/dashboard";
		}
		return currentPath === path.split("/")[1];
	};

	return (
		<aside id="sidebar" className={isExpanded ? "expand" : ""}>
			<div className="d-flex">
				<button
					className="toggle-btn"
					type="button"
					onClick={toggleSidebar}
				>
					<i
						className={`fas fa-chevron-${
							isExpanded ? "left" : "right"
						}`}
					></i>
				</button>
				<div className="sidebar-logo">
					<Link to="/">FinTrack</Link>
				</div>
			</div>
			<ul className="sidebar-nav pt-3">
				<li className="sidebar-item mb-2">
					<Link
						to="/dashboard"
						className={`sidebar-link d-flex align-items-center gap-1 ${
							isActive("/dashboard") ? "active" : ""
						}`}
					>
						<i className="fa-solid fa-gauge"></i>
						<span>Dashboard</span>
					</Link>
				</li>
				<li className="sidebar-item mb-2">
					<Link
						to="/income"
						className={`sidebar-link d-flex align-items-center gap-1 ${
							isActive("/income") ? "active" : ""
						}`}
					>
						<i className="fas fa-file"></i>
						<span>My Income</span>
					</Link>
				</li>
				<li className="sidebar-item mb-2">
					<Link
						to="/expense"
						className={`sidebar-link d-flex align-items-center gap-1 ${
							isActive("/expense") ? "active" : ""
						}`}
					>
						<i className="fas fa-money-bill"></i>
						<span>My Expenses</span>
					</Link>
				</li>
			</ul>
			<div className="sidebar-footer">
				<a
					href="#"
					className="sidebar-link d-flex align-items-center gap-1"
					onClick={handleLogout}
				>
					<i className="fas fa-sign-out-alt"></i>
					<span>Logout</span>
				</a>
			</div>
		</aside>
	);
};

export default Sidebar;
