import httpService from "../../utils/httpService";
import * as actions from "../api";
import { toast } from "react-hot-toast";
import { parseErrorMessages } from "../../utils/errorUtils";

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
				window.location.href = "/email-sent";
			} else if (url === "/auth/users/reset_password_confirm/") {
				toast.success(
					"Password reset successfully. You can now sign in!"
				);
				window.location.href = "/signin";
			} else {
        toast.success("Success!");
      }
		} catch (error) {
			console.log(error.response);
			if (error.response.data.detail) {
				toast.error(error.response.data.detail);
			} else if (error.response && error.response.data) {
				const errorMessages = parseErrorMessages(error.response.data);
				console.log(errorMessages);
				errorMessages.forEach((error) => toast.error(error));
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
