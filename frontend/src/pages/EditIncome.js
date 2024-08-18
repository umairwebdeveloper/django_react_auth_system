import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Breadcrumb from "../components/BreadCrumb";
import EditData from "../components/EditData";

const EditIncome = () => {
	const navigate = useNavigate();

	const { isAuthenticated } = useSelector((state) => state.auth);

	const endpoint = "/dashboard/api/incomes"; // Replace with your actual API endpoint

	const columns = [
		{ field: "amount", header: "Amount ($)", inputType: "number" },
		{ field: "description", header: "Description", inputType: "text" },
		{ field: "date", header: "Date", inputType: "date" },
	];

	const entityName = "income";

	const breadcrumbItems = [
		{ label: "Income", path: "/income", active: false },
		{ label: "Edit", path: "/income/edit", active: true },
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
				selectEndpoint="/dashboard/api/sources/"
				selectName="source"
				selectHeader="Source"
			/>
		</div>
	);
};

export default EditIncome;
