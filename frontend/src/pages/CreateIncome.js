import React, { useEffect } from "react";
import CreateData from "../components/CreateData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Breadcrumb from "../components/BreadCrumb";

const CreateIncome = () => {
	const navigate = useNavigate();

	const { isAuthenticated } = useSelector((state) => state.auth);

	const endpoint = "/dashboard/api/incomes/"; // Replace with your actual API endpoint

	const columns = [
		{ field: "amount", header: "Amount ($)", inputType: "number" },
		{ field: "description", header: "Description", inputType: "text" },
		{ field: "date", header: "Date", inputType: "date" },
	];

	const entityName = "income";

	const breadcrumbItems = [
		{ label: "Income", path: "/income", active: false },
		{ label: "Create", path: "/income/create", active: true },
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
			<CreateData
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

export default CreateIncome;
