type MutationResponse<T> = {
	data?: T;
	error?: unknown;
};

const getErrorMessage = (error: unknown) => {
	if (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof error.message === "string"
	) {
		return error.message;
	}

	return undefined;
};

const getMutationResponseData = <T>(
	response: MutationResponse<T>,
	fallbackMessage: string,
) => {
	if (response.data === undefined) {
		throw new Error(getErrorMessage(response.error) ?? fallbackMessage);
	}

	return response.data;
};

const throwIfMutationResponseError = (
	error: unknown,
	fallbackMessage: string,
) => {
	if (error !== undefined) {
		throw new Error(getErrorMessage(error) ?? fallbackMessage);
	}
};

export { getMutationResponseData, throwIfMutationResponseError };
