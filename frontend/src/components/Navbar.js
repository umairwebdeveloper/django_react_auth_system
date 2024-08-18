import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { checkAuthenticated, loadUser, logout } from "../store/auth";

const Navbar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { isAuthenticated, user } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(checkAuthenticated());
		isAuthenticated && dispatch(loadUser());
	}, [dispatch, isAuthenticated]);

	const handleLogout = () => {
		toast.success("Logged out successfully!");
		dispatch(logout());
		navigate("/signin");
	};

	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
			<div className="container">
				<NavLink className="navbar-brand" to="/">
					FinTrack
				</NavLink>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto mb-2 mb-lg-0">
						{isAuthenticated ? (
							<>
								<li className="nav-item dropdown">
									<a
										className="nav-link dropdown-toggle d-flex align-items-center"
										href="#"
										id="navbarDropdown"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										<i className="fa-solid fa-circle-user me-2 fs-2"></i>
										<span className="navbar-text py-0">
											{user?.first_name}
										</span>
									</a>
									<ul
										className="dropdown-menu dropdown-menu-end"
										aria-labelledby="navbarDropdown"
									>
										<li className="dropdown-item">
											<div
												className="d-flex flex-column"
												style={{ cursor: "pointer" }}
												onClick={() =>
													navigate("/profile")
												}
											>
												<span className="fw-bold">
													<span>#{user?.id}</span>
												</span>
												<span>
													{user?.first_name}{" "}
													{user?.last_name}
												</span>
												<span>{user?.email}</span>
											</div>
										</li>
										<div className="dropdown-divider"></div>
										<li>
											<button
												className="dropdown-item"
												onClick={handleLogout}
											>
												<i className="fa-solid fa-right-from-bracket me-1"></i>
												Logout
											</button>
										</li>
									</ul>
								</li>
							</>
						) : (
							<>
								<li className="nav-item">
									<NavLink
										className="nav-link"
										to="/signin"
										activeClassName="active"
									>
										<i className="fa-solid fa-right-to-bracket me-1"></i>
										Sign In
									</NavLink>
								</li>
								<li className="nav-item">
									<NavLink
										className="nav-link"
										to="/signup"
										activeClassName="active"
									>
										<i className="fa-solid fa-registered me-1"></i>
										Sign Up
									</NavLink>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
