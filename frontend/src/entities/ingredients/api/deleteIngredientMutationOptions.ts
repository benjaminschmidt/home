import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import { deleteIngredient } from "home-api";

const getDeleteErrorMessage = (error: unknown) => {
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

const createDeleteIngredientMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<void, Error, string> => ({
	mutationFn: async (ingredientId) => {
		const response = await deleteIngredient({
			path: { ingredientId },
		});

		if (response.error !== undefined) {
			throw new Error(
				getDeleteErrorMessage(response.error) ?? "Failed to delete ingredient",
			);
		}
	},
	onSuccess: (_, ingredientId) => {
		queryClient.removeQueries({ queryKey: ["ingredient", ingredientId] });
		void queryClient.invalidateQueries({ queryKey: ["ingredients"] });
	},
});

export { createDeleteIngredientMutationOptions };
