import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import type { IngredientDto } from "home-api";
import { deleteIngredientVariant } from "home-api";
import { throwIfMutationResponseError } from "@/entities/ingredients/api/mutationResponse.ts";

type DeleteIngredientVariantVariables = {
	ingredientId: string;
	variantId: string;
};

const createDeleteIngredientVariantMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<void, Error, DeleteIngredientVariantVariables> => ({
	mutationFn: async ({ ingredientId, variantId }) => {
		const response = await deleteIngredientVariant({
			path: { ingredientId, variantId },
		});

		throwIfMutationResponseError(
			response.error,
			"Failed to delete ingredient variant",
		);
	},
	onSuccess: (_, { ingredientId, variantId }) => {
		queryClient.setQueryData<IngredientDto>(
			["ingredient", ingredientId],
			(currentIngredient) => {
				if (currentIngredient === undefined) return currentIngredient;

				return {
					...currentIngredient,
					ingredientVariants: currentIngredient.ingredientVariants.filter(
						(variant) => variant.id !== variantId,
					),
				};
			},
		);
		void queryClient.invalidateQueries({
			queryKey: ["ingredient", ingredientId],
		});
		void queryClient.invalidateQueries({ queryKey: ["ingredients"] });
	},
});

export { createDeleteIngredientVariantMutationOptions };
