import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ListData from "../components/ListData";

const Income = () => {
	const navigate = useNavigate();

	const { isAuthenticated } = useSelector((state) => state.auth);

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
			<ListData
				endpoint="/dashboard/api/incomes/"
				columns={[
					{ header: "Amount ($)", field: "amount" },
					{ header: "Description", field: "description" },
					{ header: "Source", field: "source_name" },
					{ header: "Date", field: "date" },
				]}
				entityName="income"
			/>
		</div>
	);
};

export default Income;
