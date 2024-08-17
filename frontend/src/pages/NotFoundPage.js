import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
	return (
		<div
			className="container mt-5 d-flex justify-content-center align-items-center"
			style={{ minHeight: "90vh" }}
		>
			<div className="row justify-content-center align-items-center w-100">
				<div className="col-lg-4 col-md-10"></div>
				<div className="text-center" style={{ padding: "50px" }}>
					<h1>404</h1>
					<p>Oops! The page you are looking for does not exist.</p>
					<Link to="/" className="btn btn-primary">
						Go Back Home
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
