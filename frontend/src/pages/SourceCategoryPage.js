import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Breadcrumb from "../components/BreadCrumb";
import toast from "react-hot-toast";

function SourceCategoryPage() {
	const [currency, setCurrency] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const navigate = useNavigate();
	const location = useLocation(); // Hook to get the current location
	const { isAuthenticated } = useSelector((state) => state.auth);

	// Determine if income or expense is being viewed
	const queryParams = new URLSearchParams(location.search);
	const isIncome = queryParams.get("income") === "true";
	const isExpense = queryParams.get("expense") === "true";
	const isEdit = queryParams.get("edit") === "true"; // Check if label=true is present
	const backUrlId = queryParams.get("backUrlId");
	// Determine the API endpoint based on the query params
	const apiUrl = isIncome
		? "/dashboard/api/sources/" // API endpoint for income (Source)
		: "/dashboard/api/categories/"; // API endpoint for expense (Category)

	const handleCurrencyChange = (e) => {
		setCurrency(e.target.value);
	};

	const handleSave = (e) => {
		e.preventDefault();
		setSubmitting(true);

		axios
			.post(
				apiUrl,
				{ name: currency },
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
					`${isIncome ? "Source" : "Category"} updated successfully!`
				);
				setSubmitting(false);
				setCurrency("");
			})
			.catch((error) => {
				console.error(
					`There was an error updating the ${
						isIncome ? "Source" : "Category"
					}!`,
					error
				);
				toast.error(
					`There was an error updating the ${
						isIncome ? "Source" : "Category"
					}!`
				);
				setSubmitting(false);
			});
	};

	// Update breadcrumb items based on income or expense, and edit or create
	const breadcrumbItems = [
		{
			label: isIncome ? "Income" : "Expense",
			path: isIncome ? "/income" : "/expense",
			active: false,
		},
		{
			label: isEdit ? "Edit" : "Create",
			path: isEdit
				? isIncome
					? `/income/edit/${backUrlId}`
					: `/expense/edit/${backUrlId}`
				: isIncome
				? "/income/create"
				: "/expense/create",
			active: false,
		},
		{
			label: isIncome ? "Source" : "Category",
			path: "#",
			active: true,
		},
	];

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
		<div>
			<div className="mt-3">
				<Breadcrumb items={breadcrumbItems} />
			</div>
			<div className="py-3 row justify-content-center">
				<div className="col-md-4">
					<h3 className="text-center mb-4">
						{isIncome ? "Add Source" : "Add Category"}
					</h3>
					<form onSubmit={handleSave}>
						<div className="form-group">
							<label className="mb-1">
								{isIncome ? "Source" : "Category"}
							</label>
							<input
								type="text"
								className="form-control"
								placeholder={`Enter your ${
									isIncome ? "Source" : "Category"
								}`}
								value={currency}
								onChange={handleCurrencyChange}
								disabled={submitting}
							/>
						</div>
						<button
							type="submit"
							className="btn btn-primary mt-3"
							disabled={submitting}
						>
							{submitting ? "Saving..." : "Save"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default SourceCategoryPage;
