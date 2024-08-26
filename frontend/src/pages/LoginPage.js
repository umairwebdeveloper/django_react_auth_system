import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/auth";
import toast from "react-hot-toast";

const LoginPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false); // State for password visibility

	const { email, password } = formData;

	const { isAuthenticated, loading } = useSelector((state) => state.auth);

	const handleOnChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch(login(email, password));
	};

	useEffect(() => {
		if (isAuthenticated) {
			toast.success("Logged in successfully!");
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	return (
		<div
			className="container mt-5 d-flex justify-content-center align-items-center"
			style={{ minHeight: "90vh" }}
		>
			<div className="row justify-content-center align-items-center w-100">
				<div className="col-lg-4 col-md-10">
					<h1 className="text-center">Sign In</h1>
					<p className="text-center">Sign into your account</p>
					<form onSubmit={(e) => handleSubmit(e)}>
						<div className="form-group mb-3">
							<label htmlFor="email">Email address</label>
							<input
								type="email"
								name="email"
								value={email}
								onChange={handleOnChange}
								className="form-control"
								id="email"
								aria-describedby="emailHelp"
								placeholder="Enter email"
							/>
						</div>
						<div className="form-group mb-3">
							<label htmlFor="password">Password</label>
							<div className="input-group">
								<input
									type={showPassword ? "text" : "password"} // Toggle input type based on state
									name="password"
									value={password}
									onChange={handleOnChange}
									className="form-control"
									id="password"
									placeholder="Password"
								/>
								<span
									className="input-group-text"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									style={{ cursor: "pointer" }}
								>
									<i
										className={`fas ${
											showPassword
												? "fa-eye-slash"
												: "fa-eye"
										}`}
									></i>
								</span>
							</div>
						</div>

						<button
							type="submit"
							className="btn btn-primary w-100"
							style={{ borderRadius: "50px" }}
							disabled={loading}
						>
							{loading ? "Loading..." : "Sign In"}
						</button>
					</form>
					<p className="text-center my-3">
						Don't have an account? <Link to="/signup">Sign Up</Link>
					</p>

					<p className="text-center">
						Forgot your password?{" "}
						<Link to="/reset-password">Reset Password</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
