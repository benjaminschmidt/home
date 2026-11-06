import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import type { IngredientDto, IngredientWriteRequest } from "home-api";
import { updateIngredient } from "home-api";
import { getMutationResponseData } from "@/entities/ingredients/api/mutationResponse.ts";

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

		return getMutationResponseData(response, "Failed to update ingredient");
	},
	onSuccess: (_, { ingredientId }) => {
		void queryClient.invalidateQueries({
			queryKey: ["ingredient", ingredientId],
		});
		void queryClient.invalidateQueries({ queryKey: ["ingredients"] });
	},
});

export { createUpdateIngredientMutationOptions };
