import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import type { IngredientDto, IngredientWriteRequest } from "home-api";
import { updateIngredient } from "home-api";

type UpdateIngredientVariables = {
	ingredientId: string;
	ingredientWriteRequest: IngredientWriteRequest;
};

const createUpdateIngredientMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<IngredientDto, Error, UpdateIngredientVariables> => ({
	mutationFn: async ({ ingredientId, ingredientWriteRequest }) => {
		const response = await updateIngredient({
			path: { ingredientId: ingredientId },
			body: ingredientWriteRequest,
		});

		if (response.data === undefined) {
			throw new Error(response.error?.message ?? "Failed to update ingredient");
		}

		return response.data;
	},
	onSuccess: (_, { ingredientId }) => {
		void queryClient.invalidateQueries({
			queryKey: ["ingredient", ingredientId],
		});
		void queryClient.invalidateQueries({ queryKey: ["ingredients"] });
	},
});

export { createUpdateIngredientMutationOptions };
