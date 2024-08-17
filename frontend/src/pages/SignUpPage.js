import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../store/auth";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		re_password: "",
	});
	const { first_name, last_name, email, password, re_password } = formData;

	const { isAuthenticated, loading } = useSelector((state) => state.auth);

	const handleOnChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password === re_password) {
			const response = await dispatch(
				signup(first_name, last_name, email, password, re_password)
			);
			if (response.success) {
				toast.success(
					"Account created successfully. Check your email to verify!"
				);
				navigate("/email-sent");
			} else {
				console.log(response);
			}
		} else {
			toast.error("Passwords do not match!");
		}
	};

	useEffect(() => {
		isAuthenticated && navigate("/");
	}, [isAuthenticated]);

	return (
		<div
			className="container mt-5 d-flex justify-content-center align-items-center"
			style={{ minHeight: "90vh" }}
		>
			<div className="row justify-content-center align-items-center w-100">
				<div className="col-lg-4 col-md-10">
					<h1 className="text-center">Sign Up</h1>
					<p className="text-center">Create your account</p>
					<form onSubmit={(e) => handleSubmit(e)}>
						<div className="form-group mb-3">
							<label htmlFor="first_name">First Name</label>
							<input
								type="text"
								name="first_name"
								value={first_name}
								onChange={handleOnChange}
								className="form-control"
								id="first_name"
								required
								placeholder="Enter First Name"
							/>
						</div>
						<div className="form-group mb-3">
							<label htmlFor="last_name">Last Name</label>
							<input
								type="text"
								name="last_name"
								value={last_name}
								onChange={handleOnChange}
								className="form-control"
								id="last_name"
								required
								placeholder="Enter Last Name"
							/>
						</div>
						<div className="form-group mb-3">
							<label htmlFor="email">Email address</label>
							<input
								type="email"
								name="email"
								value={email}
								onChange={handleOnChange}
								className="form-control"
								id="email"
								required
								aria-describedby="emailHelp"
								placeholder="Enter email"
							/>
						</div>
						<div className="form-group mb-3">
							<label htmlFor="password">Password</label>
							<input
								type="password"
								name="password"
								value={password}
								onChange={handleOnChange}
								className="form-control"
								id="password"
								required
								placeholder="Password"
							/>
						</div>

						<div className="form-group mb-3">
							<label htmlFor="re_password">
								Confirm Password
							</label>
							<input
								type="password"
								name="re_password"
								value={re_password}
								onChange={handleOnChange}
								className="form-control"
								id="re_password"
								required
								placeholder="Confirm Password"
							/>
						</div>

						<button
							type="submit"
							className="btn btn-primary w-100"
							style={{ borderRadius: "50px" }}
							disabled={loading}
						>
							{loading ? "Loading..." : "Sign Up"}
						</button>
					</form>

					<p className="text-center my-3">
						Already have an account?{" "}
						<Link to="/signin">Sign in</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
