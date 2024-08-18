import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
	LineChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Line,
} from "recharts";
import toast from "react-hot-toast";

const DashboardPage = () => {
	const [expenseData, setExpenseData] = useState({});
	const [expenseDataTime, setExpenseDataTime] = useState({});
	const [expenseDataWeeklyChart, setexpenseDataWeeklyChart] = useState([]);
	const [expenseDataYearlyChart, setexpenseDataYearlyChart] = useState([]);
	const [incomeData, setIncomeData] = useState({});
	const [incomeDataTime, setIncomeDataTime] = useState({});
	const [incomeDataWeeklyChart, setIncomeDataWeeklyChart] = useState([]);
	const [incomeDataYearlyChart, setIncomeDataYearlyChart] = useState([]);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	const { isAuthenticated } = useSelector((state) => state.auth);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem("access"); // Get the token from localStorage
				const response = await axios.get("/dashboard/api/summary/", {
					headers: {
						Authorization: `JWT ${token}`, // Send token in the header
					},
				});

				setExpenseData(response.data.expense_category_data);
				setIncomeData(response.data.income_source_data);
				setExpenseDataTime(response.data.user_expenses);
				setIncomeDataTime(response.data.user_incomes);
				setexpenseDataWeeklyChart(response.data.weekly_expenses);
				setexpenseDataYearlyChart(response.data.yearly_expenses);
				setIncomeDataWeeklyChart(response.data.weekly_incomes);
				setIncomeDataYearlyChart(response.data.yearly_incomes);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching the dashboard data:", error);
				setLoading(false);
				toast.error("Failed to load dashboard data.");
			}
		};

		fetchData();
	}, []);

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

	const expenseChartData = Object.entries(expenseData).map(
		([category, amount]) => ({ name: category, value: amount })
	);

	const incomeChartData = Object.entries(incomeData).map(
		([source, amount]) => ({ name: source, value: amount })
	);

	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

	const renderCustomLabel = ({ name, value }) => `$${value}`;

	const expenseCards = [
		{
			title: "Today",
			value: expenseDataTime.total_today,
			count: expenseDataTime.count_today,
			bg: "primary",
		},
		{
			title: "This Week",
			value: expenseDataTime.total_this_week,
			count: expenseDataTime.count_this_week,
			bg: "success",
		},
		{
			title: "This Month",
			value: expenseDataTime.total_this_month,
			count: expenseDataTime.count_this_month,
			bg: "warning",
		},
		{
			title: "This Year",
			value: expenseDataTime.total_this_year,
			count: expenseDataTime.count_this_year,
			bg: "danger",
		},
	];

	const incomeCards = [
		{
			title: "Today",
			value: incomeDataTime.total_today,
			count: incomeDataTime.count_today,
			bg: "primary",
		},
		{
			title: "This Week",
			value: incomeDataTime.total_this_week,
			count: incomeDataTime.count_this_week,
			bg: "success",
		},
		{
			title: "This Month",
			value: incomeDataTime.total_this_month,
			count: incomeDataTime.count_this_month,
			bg: "warning",
		},
		{
			title: "This Year",
			value: incomeDataTime.total_this_year,
			count: incomeDataTime.count_this_year,
			bg: "danger",
		},
	];

	const formattedWeeklyExpenses = expenseDataWeeklyChart.map((expense) => {
		const dateObj = new Date(expense.date);
		const formattedDate = dateObj.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
		});
		return {
			...expense,
			formattedDate,
			total_amount: parseFloat(expense.total_amount),
		};
	});

	const formattedWeeklyIncomes = incomeDataWeeklyChart.map((income) => {
		const dateObj = new Date(income.date);
		const formattedDate = dateObj.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
		});
		return {
			...income,
			formattedDate,
			total_amount: parseFloat(income.total_amount),
		};
	});

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const formattedYearlyExpenses = expenseDataYearlyChart.map((expense) => {
		return {
			...expense,
			formattedMonth: monthNames[expense.month - 1],
			total_amount: parseFloat(expense.total_amount),
		};
	});

	const formattedYearlyIncomes = incomeDataYearlyChart.map((income) => {
		return {
			...income,
			formattedMonth: monthNames[income.month - 1],
			total_amount: parseFloat(income.total_amount),
		};
	});

	if (loading) {
		return (
			<div className="d-flex justify-content-center my-5">
				<div className="spinner-border" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="container">
			<div className="row">
				<div className="card col-12 pt-3 bg-light mb-4">
					<h3 className="text-center fs-3 mb-3">Expenses Summary</h3>
					<div>
						<div className="row">
							{expenseCards.map((card, index) => (
								<div className="col-md-3" key={index}>
									<div
										className={`card text-white bg-${card.bg} mb-3`}
									>
										<div className="card-header">
											{card.title}
											<span className="float-end badge bg-light text-dark">
												{card.count}
											</span>
										</div>
										<div className="card-body">
											<h5 className="card-title">
												${card.value.toFixed(2)}
											</h5>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="row my-4">
						<div className="col-md-6">
							<div className="card h-100">
								<h3 className="py-3 px-4 fs-5">
									Weeky Expenses
								</h3>
								<div className="card-body">
									<ResponsiveContainer
										width="100%"
										height={300}
									>
										<LineChart
											data={formattedWeeklyExpenses}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="formattedDate" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Line
												type="monotone"
												dataKey="total_amount"
												stroke="#8884d8"
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="card h-100">
								<h3 className="py-3 px-4 fs-5">
									Yearly Expenses
								</h3>
								<div className="card-body">
									<ResponsiveContainer
										width="100%"
										height={300}
									>
										<LineChart
											data={formattedYearlyExpenses}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="formattedMonth" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Line
												type="monotone"
												dataKey="total_amount"
												stroke="#82ca9d"
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</div>

					<hr />
					<h3 className="text-center fs-3 mb-3">
						Expense Categories
					</h3>
					<div className="row">
						<div className="col-md-12">
							<div className="row">
								{Object.entries(expenseData).map(
									([category, amount], index) => (
										<div
											className="col-md-3"
											key={category}
										>
											<div
												className={`card text-white bg-secondary mb-3`}
											>
												<div className="card-body">
													<h5 className="card-title">
														{category}
													</h5>
													<p className="card-text">
														${amount}
													</p>
												</div>
											</div>
										</div>
									)
								)}
							</div>
						</div>
						<div className="col-md-12">
							<div className="">
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie
											data={expenseChartData}
											cx="50%"
											cy="50%"
											outerRadius={100}
											fill="#8884d8"
											dataKey="value"
											label={renderCustomLabel}
										>
											{expenseChartData.map(
												(entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={
															COLORS[
																index %
																	COLORS.length
															]
														}
													/>
												)
											)}
										</Pie>
										<Tooltip
											formatter={(value) => `$${value}`}
										/>
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>

				<div className="card col-12 pt-3 bg-light mb-4">
					<h2 className="text-center fs-3 mb-3">Income Summary</h2>
					<div>
						<div className="row">
							{incomeCards.map((card, index) => (
								<div className="col-md-3" key={index}>
									<div
										className={`card text-white bg-${card.bg} mb-3`}
									>
										<div className="card-header">
											{card.title}
											<span className="float-end badge bg-light text-dark">
												{card.count}
											</span>
										</div>
										<div className="card-body">
											<h5 className="card-title">
												${card.value.toFixed(2)}
											</h5>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="row my-4">
						<div className="col-md-6">
							<div className="card h-100">
								<h3 className="py-3 px-4 fs-5">
									Weeky Incomes
								</h3>
								<div className="card-body">
									<ResponsiveContainer
										width="100%"
										height={300}
									>
										<LineChart
											data={formattedWeeklyIncomes}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="formattedDate" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Line
												type="monotone"
												dataKey="total_amount"
												stroke="#8884d8"
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="card h-100">
								<h3 className="py-3 px-4 fs-5">
									Yearly Incomes
								</h3>
								<div className="card-body">
									<ResponsiveContainer
										width="100%"
										height={300}
									>
										<LineChart
											data={formattedYearlyIncomes}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="formattedMonth" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Line
												type="monotone"
												dataKey="total_amount"
												stroke="#82ca9d"
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</div>
					<hr />
					<h2 className="text-center fs-3 mb-3">Income Sources</h2>
					<div className="row">
						<div className="col-md-12">
							<div className="row">
								{Object.entries(incomeData).map(
									([source, amount], index) => (
										<div className="col-md-3" key={source}>
											<div
												className={`card text-white bg-secondary mb-3`}
											>
												<div className="card-body">
													<h5 className="card-title">
														{source}
													</h5>
													<p className="card-text">
														${amount}
													</p>
												</div>
											</div>
										</div>
									)
								)}
							</div>
						</div>
						<div className="col-md-12">
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={incomeChartData}
										cx="50%"
										cy="50%"
										outerRadius={100}
										fill="#82ca9d"
										dataKey="value"
										label={renderCustomLabel}
									>
										{incomeChartData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={
													COLORS[
														index % COLORS.length
													]
												}
											/>
										))}
									</Pie>
									<Tooltip
										formatter={(value) => `$${value}`}
									/>
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
