import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import type { IngredientDto, IngredientWriteRequest } from "home-api";
import { createIngredient } from "home-api";
import { getMutationResponseData } from "@/entities/ingredients/api/mutationResponse.ts";

const createIngredientMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<IngredientDto, Error, IngredientWriteRequest> => ({
	mutationFn: async (ingredientWriteRequest) => {
		const response = await createIngredient({
			body: ingredientWriteRequest,
		});

		return getMutationResponseData(response, "Failed to create ingredient");
	},
	onSuccess: (ingredientDto) => {
		queryClient.setQueryData(["ingredient", ingredientDto.id], ingredientDto);
		void queryClient.invalidateQueries({ queryKey: ["ingredients"] });
	},
});

export { createIngredientMutationOptions };
