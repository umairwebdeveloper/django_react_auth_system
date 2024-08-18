import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Breadcrumb from "../components/BreadCrumb";
import EditData from "../components/EditData";

const EditExpense = () => {
	const navigate = useNavigate();

	const { isAuthenticated } = useSelector((state) => state.auth);

	const endpoint = "/dashboard/api/expenses"; // Replace with your actual API endpoint

	const columns = [
		{ field: "amount", header: "Amount ($)", inputType: "number" },
		{ field: "description", header: "Description", inputType: "text" },
		{ field: "date", header: "Date", inputType: "date" },
	];

	const entityName = "expense";

	const breadcrumbItems = [
		{ label: "Expense", path: "/expense", active: false },
		{ label: "Edit", path: "/expense/edit", active: true },
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
		<div className="my-3">
			<Breadcrumb items={breadcrumbItems} />
			<EditData
				endpoint={endpoint}
				columns={columns}
				entityName={entityName}
				selectEndpoint="/dashboard/api/categories/"
				selectName="category"
				selectHeader="Category"
			/>
		</div>
	);
};

export default EditExpense;
