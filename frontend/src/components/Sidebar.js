import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
	return (
		<div
			className="d-flex flex-column flex-shrink-0 p-3 bg-light"
			style={{ width: "250px", height: "100vh", position: "fixed" }}
		>
			<Link
				to="/"
				className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
			>
				<span className="fs-4">Dashboard</span>
			</Link>
			<hr />
			<ul className="nav nav-pills flex-column mb-auto">
				<li className="nav-item">
					<Link
						to="/dashboard"
						className="nav-link active"
						aria-current="page"
					>
						Home
					</Link>
				</li>
				<li>
					<Link
						to="/dashboard/settings"
						className="nav-link link-dark"
					>
						Settings
					</Link>
				</li>
				<li>
					<Link
						to="/dashboard/profile"
						className="nav-link link-dark"
					>
						Profile
					</Link>
				</li>
				<li>
					<Link to="/dashboard/help" className="nav-link link-dark">
						Help
					</Link>
				</li>
			</ul>
			<hr />
			<div className="dropdown">
				<Link
					to="#"
					className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
					id="dropdownUser1"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					<img
						src="https://via.placeholder.com/40"
						alt=""
						width="40"
						height="40"
						className="rounded-circle me-2"
					/>
					<strong>Username</strong>
				</Link>
				<ul
					className="dropdown-menu text-small shadow"
					aria-labelledby="dropdownUser1"
				>
					<li>
						<Link className="dropdown-item" to="/dashboard/profile">
							Profile
						</Link>
					</li>
					<li>
						<Link
							className="dropdown-item"
							to="/dashboard/settings"
						>
							Settings
						</Link>
					</li>
					<li>
						<hr className="dropdown-divider" />
					</li>
					<li>
						<Link className="dropdown-item" to="/logout">
							Sign out
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
