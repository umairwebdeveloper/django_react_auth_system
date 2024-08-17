import httpService from "../../utils/httpService";
import * as actions from "../api";
import { toast } from "react-hot-toast";

const api =
	({ dispatch }) =>
	(next) =>
	async (action) => {
		if (action.type !== actions.apiCallBegun.type) return next(action);

		const { url, method, data, headers, onSuccess, onError, onStart } =
			action.payload;

		if (onStart) dispatch({ type: onStart });

		next(action);

		try {
			const response = await httpService.request({
				url,
				method,
				data,
				headers,
			});
			// General Success
			dispatch(actions.apiCallSuccess(response.data));

			// Specific Success
			if (onSuccess)
				dispatch({ type: onSuccess, payload: response.data });

			if (url === "/auth/users/") {
				toast.success(
					"Account created successfully. Check your email to verify!"
				);
				setTimeout(() => {
					window.location.href = "/email-sent";
				}, 2000);
			}
		} catch (error) {
			if (error.response.data.detail) {
				toast.error(error.response.data.detail);
			} else if (error.response && error.response.data) {
				const errorData = error.response.data;
				// Handle dynamic errors from backend
				for (const key in errorData) {
					if (errorData.hasOwnProperty(key)) {
						toast.error(`${errorData[key][0]}`);
					}
				}
			} else {
				toast.error("Something went wrong!");
			}
			const errorMessage =
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message;

			// General Error
			dispatch(actions.apiCallFailed(errorMessage));

			// Specific Error
			if (onError) dispatch({ type: onError, payload: errorMessage });
		}
	};

export default api;
