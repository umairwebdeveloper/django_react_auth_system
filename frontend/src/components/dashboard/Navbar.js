import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { checkAuthenticated, loadUser, logout } from "../../store/auth";

const SidebarNavbar = () => {
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
		<nav className="navbar navbar-expand px-4 py-1">
			<form action="#" className="d-none d-sm-inline-block"></form>
			<div className="navbar-collapse collapse">
				<ul className="navbar-nav ms-auto">
					{isAuthenticated && (
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
											onClick={() => navigate("/profile")}
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
											<i class="fa-solid fa-right-from-bracket me-1"></i>
											Logout
										</button>
									</li>
								</ul>
							</li>
						</>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default SidebarNavbar;
