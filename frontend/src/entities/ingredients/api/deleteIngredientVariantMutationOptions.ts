import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import type { IngredientDto } from "home-api";
import { deleteIngredientVariant } from "home-api";

type DeleteIngredientVariantVariables = {
	ingredientId: string;
	variantId: string;
};

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

const createDeleteIngredientVariantMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<void, Error, DeleteIngredientVariantVariables> => ({
	mutationFn: async ({ ingredientId, variantId }) => {
		const response = await deleteIngredientVariant({
			path: { ingredientId, variantId },
		});

		if (response.error !== undefined) {
			throw new Error(
				getDeleteErrorMessage(response.error) ??
					"Failed to delete ingredient variant",
			);
		}
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
