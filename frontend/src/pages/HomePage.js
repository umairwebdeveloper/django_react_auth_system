import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HomePage = () => {
	const { isAuthenticated } = useSelector((state) => state.auth);

	return (
		<>
			<section className="py-3 py-lg-5 py-xl-8 mt-3">
				<div className="container overflow-hidden">
					<div className="row gy-5 gy-lg-0 align-items-lg-center justify-content-lg-between">
						<div className="col-12 col-lg-6 order-1 order-lg-0 pt-5">
							<h2 className="display-5 fw-bold mb-3 mt-5 mt-md-0">
								Welcome to BudgetApp - Your Personal Finance
								Manager
							</h2>
							<p className="fs-4 mb-3">
								BudgetApp is a comprehensive financial
								management application designed to help you keep
								track of your daily expenses and income.
							</p>
							{!isAuthenticated ? (
								<div className="d-grid gap-2 d-sm-flex">
									<Link
										className="btn btn-primary bsb-btn-2xl rounded-pill"
										to="/signup"
									>
										Get Started
									</Link>
									<Link
										className="btn btn-outline-primary bsb-btn-2xl rounded-pill"
										to="/signin"
									>
										Sign In
									</Link>
								</div>
							) : (
								<Link
									className="btn btn-primary bsb-btn-2xl rounded-pill"
									to="/dashboard"
								>
									Go to Dashboard
								</Link>
							)}
						</div>
						<div className="col-12 col-lg-5 text-center d-none d-md-block">
							<div className="position-relative">
								<img
									className="img-fluid position-relative z-2"
									loading="lazy"
									src="/landing_page.png"
									width="300px"
									alt="A Digital Agency Specialized in AI and Web 3.0"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default HomePage;
