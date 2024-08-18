import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditData = ({
	endpoint,
	columns,
	entityName,
	selectEndpoint,
	selectName,
	selectHeader,
}) => {
	const [formData, setFormData] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [selectOptions, setSelectOptions] = useState([]);
	const [isSelectLoading, setIsSelectLoading] = useState(true); // Loader state for select input
	const { id } = useParams(); // Get the ID from the route parameters
	const navigate = useNavigate();

	const accessToken = localStorage.getItem("access");

	useEffect(() => {
		// Fetch the existing data to pre-fill the form
		axios
			.get(`${endpoint}/${id}/`, {
				headers: {
					Authorization: `JWT ${accessToken}`,
				},
			})
			.then((response) => {
				setFormData(response.data);
			})
			.catch((error) => {
				toast.error("Failed to load data.");
				console.error(error.message);
			});

		// Fetch data for the select input
		axios
			.get(selectEndpoint, {
				headers: {
					Authorization: `JWT ${accessToken}`,
				},
			})
			.then((response) => {
				setSelectOptions(response.data);
			})
			.catch((error) => {
				toast.error("Failed to load select options.");
				console.error(error.message);
			})
			.finally(() => {
				setIsSelectLoading(false);
			});
	}, [id, endpoint, selectEndpoint, accessToken]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);

		axios
			.put(`${endpoint}/${id}/`, formData, {
				headers: {
					Authorization: `JWT ${accessToken}`,
				},
			})
			.then(() => {
				toast.success(`${entityName} updated successfully!`);
				navigate(`/${entityName}`);
			})
			.catch((error) => {
				toast.error("Failed to update item.");
				console.error(error.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div className="container">
			<div className="card">
				<div className="card-title">
					<h2 className="text-center my-3 text-capitalize">
						Edit {entityName}
					</h2>
				</div>
				<div className="card-body">
					<form onSubmit={handleSubmit}>
						{columns.map((col) => (
							<div className="mb-3" key={col.field}>
								<label className="form-label">
									{col.header}
								</label>
								<input
									type={col.inputType || "text"}
									name={col.field}
									className="form-control"
									value={formData[col.field] || ""}
									onChange={handleInputChange}
									required
								/>
							</div>
						))}
						<div className="mb-3">
							<label className="form-label">{selectHeader}</label>
							<select
								name={selectName}
								className="form-control"
								value={formData[selectName] || ""}
								onChange={handleInputChange}
								disabled={isSelectLoading} // Disable while loading
								required
							>
								<option value="" disabled>
									{isSelectLoading
										? "Loading options..."
										: "Select an option"}
								</option>
								{selectOptions.map((option) => (
									<option key={option.id} value={option.id}>
										{option.name}
									</option>
								))}
							</select>
						</div>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<span
										className="spinner-border spinner-border-sm"
										role="status"
										aria-hidden="true"
									></span>
									<span className="sr-only">Loading...</span>
								</>
							) : (
								`Save Changes`
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditData;
