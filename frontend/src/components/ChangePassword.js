import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PasswordChange = () => {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handlePasswordChange = (e) => {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			toast.error("New passwords do not match.");
			return;
		}
        

		axios
			.post(
				"/api/change-password/",
				{
					old_password: oldPassword,
					new_password: newPassword,
					confirm_password: confirmPassword,
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
				toast.success(response.data.detail);
				setOldPassword("");
				setNewPassword("");
				setConfirmPassword("");
			})
			.catch((err) => {
				toast.error(err.response?.data?.detail || "An error occurred.");
			});
	};

	return (
		<div className="w-25 mb-4">
			<h1 className="text-center">Update Password</h1>
			<form onSubmit={handlePasswordChange}>
				<div className="mb-3">
					<label htmlFor="oldPassword" className="form-label">
						Old Password
					</label>
					<input
						type="password"
						className="form-control"
						id="oldPassword"
						placeholder="Enter old password"
						value={oldPassword}
						onChange={(e) => setOldPassword(e.target.value)}
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="newPassword" className="form-label">
						New Password
					</label>
					<input
						type="password"
						className="form-control"
						id="newPassword"
						placeholder="Enter new password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="confirmPassword" className="form-label">
						Confirm New Password
					</label>
					<input
						type="password"
						className="form-control"
						id="confirmPassword"
						placeholder="Confirm new password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</div>

				<button
					type="submit"
					className="btn btn-primary w-100"
					style={{ borderRadius: "50px" }}
				>
					Change Password
				</button>
			</form>
		</div>
	);
};

export default PasswordChange;
