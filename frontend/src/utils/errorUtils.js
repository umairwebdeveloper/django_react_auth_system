export const parseErrorMessages = (errorObject) => {
	const messages = [];
	for (const key in errorObject) {
		if (errorObject.hasOwnProperty(key)) {
			messages.push(...errorObject[key]);
		}
	}
	return messages;
};
