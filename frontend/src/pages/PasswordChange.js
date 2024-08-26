import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { parseErrorMessages } from "../utils/errorUtils";

const PasswordChange = () => {
	const navigate = useNavigate();

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false); // Loading state
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { isAuthenticated } = useSelector((state) => state.auth);

	const handlePasswordChange = (e) => {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			toast.error("New passwords do not match.");
			return;
		}

		setIsLoading(true); // Start loading

		axios
			.post(
				"/dashboard/api/change-password/",
				{
					old_password: oldPassword,
					new_password: newPassword,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `JWT ${localStorage.getItem("access")}`,
						Accept: "application/json",
					},
				}
			)
			.then((response) => {
				toast.success(
					response.data?.detail || "Password changed successfully!"
				);
				setOldPassword("");
				setNewPassword("");
				setConfirmPassword("");
			})
			.catch((error) => {
				const errorMessages = parseErrorMessages(error.response.data);
				errorMessages.forEach((message) => toast.error(message));
			})
			.finally(() => {
				setIsLoading(false); // Stop loading
			});
	};

	useEffect(() => {
		const handlePageLoad = () => {
			if (!isAuthenticated) {
				navigate("/signin");
			}
		};

		window.onload = handlePageLoad;

		return () => {
			window.onload = null;
		};
	}, [isAuthenticated, navigate]);

	return (
		<div
			className="d-flex flex-column justify-content-center align-items-center"
			style={{ margin: "100px 0 0 0" }}
		>
			<div className="w-25 mb-4">
				<h1 className="text-center mb-4">Update Password</h1>
				<form onSubmit={handlePasswordChange}>
					<div className="mb-3">
						<label htmlFor="oldPassword" className="form-label">
							Old Password
						</label>
						<div className="input-group">
							<input
								type={showOldPassword ? "text" : "password"}
								className="form-control"
								id="oldPassword"
								placeholder="Enter old password"
								value={oldPassword}
								onChange={(e) => setOldPassword(e.target.value)}
								required
							/>
							<span
								className="input-group-text"
								onClick={() =>
									setShowOldPassword(!showOldPassword)
								}
								style={{ cursor: "pointer" }}
							>
								<i
									className={`fas ${
										showOldPassword
											? "fa-eye-slash"
											: "fa-eye"
									}`}
								></i>
							</span>
						</div>
					</div>

					<div className="mb-3">
						<label htmlFor="newPassword" className="form-label">
							New Password
						</label>
						<div className="input-group">
							<input
								type={showNewPassword ? "text" : "password"}
								className="form-control"
								id="newPassword"
								placeholder="Enter new password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
							/>
							<span
								className="input-group-text"
								onClick={() =>
									setShowNewPassword(!showNewPassword)
								}
								style={{ cursor: "pointer" }}
							>
								<i
									className={`fas ${
										showNewPassword
											? "fa-eye-slash"
											: "fa-eye"
									}`}
								></i>
							</span>
						</div>
					</div>

					<div className="mb-3">
						<label htmlFor="confirmPassword" className="form-label">
							Confirm New Password
						</label>
						<div className="input-group">
							<input
								type={showConfirmPassword ? "text" : "password"}
								className="form-control"
								id="confirmPassword"
								placeholder="Confirm new password"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								required
							/>
							<span
								className="input-group-text"
								onClick={() =>
									setShowConfirmPassword(!showConfirmPassword)
								}
								style={{ cursor: "pointer" }}
							>
								<i
									className={`fas ${
										showConfirmPassword
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
						disabled={isLoading} // Disable button while loading
					>
						{isLoading ? "Changing..." : "Change Password"}{" "}
						{/* Show loading text */}
					</button>
					<Link
						className="btn btn-link mt-2 text-center"
						to="/profile"
					>
						Back to profile
					</Link>
				</form>
			</div>
		</div>
	);
};

export default PasswordChange;
