import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import type {
	IngredientDto,
	IngredientVariantDto,
	IngredientVariantWriteRequest,
} from "home-api";
import { updateIngredientVariant } from "home-api";

type UpdateIngredientVariantVariables = {
	ingredientId: string;
	variantId: string;
	ingredientVariantWriteRequest: IngredientVariantWriteRequest;
};

const createUpdateIngredientVariantMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<
	IngredientVariantDto,
	Error,
	UpdateIngredientVariantVariables
> => ({
	mutationFn: async ({
		ingredientId,
		variantId,
		ingredientVariantWriteRequest,
	}) => {
		const response = await updateIngredientVariant({
			path: { ingredientId, variantId },
			body: ingredientVariantWriteRequest,
		});

		if (response.data === undefined) {
			throw new Error(
				response.error?.message ?? "Failed to update ingredient variant",
			);
		}

		return response.data;
	},
	onSuccess: (updatedVariant, { ingredientId, variantId }) => {
		queryClient.setQueryData<IngredientDto>(
			["ingredient", ingredientId],
			(currentIngredient) => {
				if (currentIngredient === undefined) return currentIngredient;

				return {
					...currentIngredient,
					ingredientVariants: currentIngredient.ingredientVariants.map(
						(variant) => (variant.id === variantId ? updatedVariant : variant),
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

export { createUpdateIngredientVariantMutationOptions };
