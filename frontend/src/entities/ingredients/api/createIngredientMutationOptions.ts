import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import type { IngredientDto, IngredientWriteRequest } from "home-api";
import { createIngredient } from "home-api";

const createIngredientMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<IngredientDto, Error, IngredientWriteRequest> => ({
	mutationFn: async (ingredientWriteRequest) => {
		const response = await createIngredient({
			body: ingredientWriteRequest,
		});

		if (response.data === undefined) {
			throw new Error(response.error?.message ?? "Failed to create ingredient");
		}

		return response.data;
	},
	onSuccess: (ingredientDto) => {
		queryClient.setQueryData(["ingredient", ingredientDto.id], ingredientDto);
		void queryClient.invalidateQueries({ queryKey: ["ingredients"] });
	},
});

export { createIngredientMutationOptions };
