import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ListData = ({ endpoint, columns, entityName }) => {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true); // Added loading state
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const accessToken = localStorage.getItem("access");

	useEffect(() => {
		if (
			!Array.isArray(columns) ||
			columns.some((col) => !col.header || !col.field)
		) {
			console.error("Invalid columns configuration");
			toast.error("Invalid columns configuration provided.");
			setError("Invalid columns configuration provided.");
			setLoading(false);
			return;
		}

		if (!accessToken) {
			console.error("No access token found in localStorage");
			toast.error("Please log in to access this data.");
			setError("Please log in to access this data.");
			setLoading(false);
			return;
		}

		// Fetch data
		axios
			.get(endpoint, {
				headers: {
					Authorization: `JWT ${accessToken}`,
				},
			})
			.then((response) => {
				if (response.data) {
					setData(response.data);
					setFilteredData(response.data);
				} else {
					setError("No data available.");
					toast.error("No data available.");
				}
			})
			.catch((err) => {
				console.error(err.message);
				setError("Failed to fetch data from the server.");
				toast.error("Failed to fetch data from the server.");
			})
			.finally(() => {
				setLoading(false); // Set loading to false after data is fetched
			});
	}, [endpoint, columns, accessToken]);

	const LoadEdit = (id) => {
		if (id) {
			navigate(`/${entityName}/edit/${id}`);
		} else {
			toast.error("Invalid ID for edit");
			console.error("Invalid ID for edit");
		}
	};

	const Removefunction = (id) => {
		if (id && window.confirm("Do you want to remove?")) {
			axios
				.delete(`${endpoint}/${id}`, {
					headers: {
						Authorization: `JWT ${accessToken}`,
					},
				})
				.then(() => {
					toast.success("Item removed successfully!");
					const updatedData = data.filter((item) => item.id !== id);
					setData(updatedData);
					setFilteredData(updatedData);
				})
				.catch(() => {
					toast.error("Failed to remove the item.");
					setError("Failed to remove the item.");
				});
		} else {
			toast.error("Not removed!");
		}
	};

	const handleSearch = debounce((query) => {
		const lowerCaseQuery = query.toLowerCase();
		const filtered = data.filter((item) =>
			columns.some((col) =>
				String(item[col.field]).toLowerCase().includes(lowerCaseQuery)
			)
		);
		setFilteredData(filtered);
	}, 300);

	const onSearchChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);
		handleSearch(query);
	};

	// Export to PDF
	const exportPDF = () => {
		const doc = new jsPDF();
		doc.autoTable({
			head: [columns.map((col) => col.header)],
			body: filteredData.map((item) =>
				columns.map((col) => item[col.field])
			),
		});
		doc.save(`${entityName}_data.pdf`);
	};


	// Export to Excel
	const exportExcel = () => {
		const ws = XLSX.utils.json_to_sheet(
			filteredData.map((item) =>
				columns.reduce((acc, col) => {
					acc[col.header] = item[col.field];
					return acc;
				}, {})
			)
		);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, entityName);
		const excelBuffer = XLSX.write(wb, {
			bookType: "xlsx",
			type: "array",
		});
		const data = new Blob([excelBuffer], {
			type: "application/octet-stream",
		});
		saveAs(data, `${entityName}_data.xlsx`);
	};

	if (error) {
		return (
			<div className="alert alert-danger m-3 p-2 rounded">{error}</div>
		);
	}

	return (
		<div className="container">
			<div className="card">
				<div className="card-title text-center my-3 text-capitalize">
					<h2>{entityName} Listing</h2>
				</div>
				<div className="card-body py-0">
					<div className="d-flex justify-content-between align-items-center mb-3">
						<Link
							to={`/${entityName}/create`}
							className="btn btn-dark"
						>
							Add New (+)
						</Link>
						<div>
							<button
								className="btn btn-outline-dark me-2"
								onClick={exportPDF}
							>
								Export PDF
							</button>
							<button
								className="btn btn-outline-dark"
								onClick={exportExcel}
							>
								Export Excel
							</button>
						</div>
						<input
							type="text"
							className="form-control w-25"
							placeholder="Search..."
							value={searchQuery}
							onChange={onSearchChange}
						/>
					</div>
					<div className="table-responsive">
						<table className="table table-bordered table-striped">
							<thead className="bg-dark text-white">
								<tr>
									<td>#</td>
									{columns.map((col, index) => (
										<td key={index}>{col.header}</td>
									))}
									<td></td>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td
											colSpan={columns.length + 2}
											className="text-center"
										>
											<div
												className="spinner-border text-dark"
												role="status"
											>
												<span className="visually-hidden">
													Loading...
												</span>
											</div>
										</td>
									</tr>
								) : filteredData.length > 0 ? (
									filteredData.map((item, mainIndex) => (
										<tr key={item.id}>
											<td>{mainIndex + 1}</td>
											{columns.map((col, index) => (
												<td key={index}>
													{item[col.field]}
												</td>
											))}
											<td>
												<button
													onClick={() =>
														LoadEdit(item.id)
													}
													className="btn btn-primary me-3"
												>
													Edit
												</button>
												<button
													onClick={() =>
														Removefunction(item.id)
													}
													className="btn btn-danger"
												>
													Remove
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={columns.length + 2}
											className="text-center"
										>
											No data available
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ListData;
