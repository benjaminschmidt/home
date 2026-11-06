import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import { deleteIngredient } from "home-api";
import { throwIfMutationResponseError } from "@/entities/ingredients/api/mutationResponse.ts";

const createDeleteIngredientMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<void, Error, string> => ({
	mutationFn: async (ingredientId) => {
		const response = await deleteIngredient({
			path: { ingredientId },
		});

		throwIfMutationResponseError(response.error, "Failed to delete ingredient");
	},
	onSuccess: (_, ingredientId) => {
		queryClient.removeQueries({ queryKey: ["ingredient", ingredientId] });
		void queryClient.invalidateQueries({ queryKey: ["ingredients"] });
	},
});

export { createDeleteIngredientMutationOptions };
