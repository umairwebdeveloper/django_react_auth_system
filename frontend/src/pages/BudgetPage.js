import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function BudgetPage() {
	const [currency, setCurrency] = useState("");
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate()

	const { isAuthenticated } = useSelector((state) => state.auth);

	useEffect(() => {
		// Fetch user preference
		axios
			.get("/dashboard/api/user-preference/", {
				headers: {
					Authorization: `JWT ${localStorage.getItem("access")}`,
				},
			})
			.then((response) => {
				setCurrency(response.data.currency);
				setLoading(false);
			})
			.catch((error) => {
				console.error(
					"There was an error fetching the user preference!",
					error
				);
				setLoading(false);
			});
	}, []);

	const handleCurrencyChange = (e) => {
		setCurrency(e.target.value);
	};

	const handleSave = (e) => {
		e.preventDefault();
		setSubmitting(true);

		axios
			.put(
				"/dashboard/api/user-preference/",
				{ currency },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `JWT ${localStorage.getItem("access")}`,
						Accept: "application/json",
					},
				}
			)
			.then((response) => {
				toast.success("Budget updated successfully!");
				setSubmitting(false);
			})
			.catch((error) => {
				console.error(
					"There was an error updating the currency!",
					error
				);
				toast.error("There was an error updating the currency!");
				setSubmitting(false);
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
		<div className="py-3 row justify-content-center">
			<div className="col-md-4">
				<h3 className="text-center mb-4">My Budget</h3>
				<form onSubmit={handleSave}>
					<div className="form-group">
						<label className="mb-1">Budget ($)</label>
						<input
							type="number"
							className="form-control"
							placeholder={
								loading ? "Loading..." : "Enter your budget"
							}
							value={currency}
							onChange={handleCurrencyChange}
							disabled={loading || submitting}
						/>
					</div>
					<button
						type="submit"
						className="btn btn-primary mt-3"
						disabled={loading || submitting}
					>
						{submitting ? "Saving..." : "Save"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default BudgetPage;
