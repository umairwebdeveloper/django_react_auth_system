import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loadUser } from "../store/auth";

const ProfilePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { isAuthenticated, user } = useSelector((state) => state.auth);

	// State to handle form data
	const [formData, setFormData] = useState({
		first_name: user?.first_name || "",
		last_name: user?.last_name || "",
		email: user?.email || "",
	});

	// Handle form data change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();

		// Retrieve JWT token from localStorage
		const token = localStorage.getItem("access");

		axios
			.put("/auth/users/me/", formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `JWT ${token}`,
					Accept: "application/json",
				},
			})
			.then((response) => {
				toast.success("Profile updated successfully!");
				dispatch(loadUser()); // Reload user data after update
			})
			.catch((error) => {
				console.error(
					"There was an error updating the profile!",
					error
				);
				toast.error("Failed to update profile. Please try again.");
			});
	};

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/signin");
        }
    }, [isAuthenticated, navigate]);

	return (
		<div
			className="container mt-5 d-flex justify-content-center align-items-center"
			style={{ minHeight: "90vh" }}
		>
			<div className="row justify-content-center align-items-center w-100">
				<div className="col-lg-4 col-md-10">
					<h1 className="text-center">Update Profile</h1>
					<form onSubmit={handleSubmit}>
						<div className="form-group mb-3">
							<label htmlFor="first_name">First Name:</label>
							<input
								type="text"
								name="first_name"
								value={formData.first_name}
								onChange={handleChange}
								className="form-control"
								placeholder="Enter first name"
								id="first_name"
								required
							/>
						</div>
						<div className="form-group mb-3">
							<label htmlFor="last_name">Last Name:</label>
							<input
								type="text"
								name="last_name"
								value={formData.last_name}
								onChange={handleChange}
								className="form-control"
								placeholder="Enter last name"
								id="last_name"
								required
							/>
						</div>
						<div className="form-group mb-3">
							<label htmlFor="email">Email address</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="form-control"
								aria-describedby="emailHelp"
								placeholder="Enter email"
								id="email"
								required
							/>
						</div>
						<button
							type="submit"
							className="btn btn-primary w-100"
							style={{ borderRadius: "50px" }}
						>
							Update Profile
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
