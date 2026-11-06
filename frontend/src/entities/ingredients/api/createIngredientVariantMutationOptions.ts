import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import type {
	IngredientDto,
	IngredientVariantDto,
	IngredientVariantWriteRequest,
} from "home-api";
import { addIngredientVariant } from "home-api";
import { getMutationResponseData } from "@/entities/ingredients/api/mutationResponse.ts";
import { sortIngredientVariants } from "@/entities/ingredients/lib/sortVariants.ts";

type CreateIngredientVariantVariables = {
	ingredientId: string;
	ingredientVariantWriteRequest: IngredientVariantWriteRequest;
};

const createIngredientVariantMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<
	IngredientVariantDto,
	Error,
	CreateIngredientVariantVariables
> => ({
	mutationFn: async ({ ingredientId, ingredientVariantWriteRequest }) => {
		const response = await addIngredientVariant({
			path: { ingredientId },
			body: ingredientVariantWriteRequest,
		});

		return getMutationResponseData(
			response,
			"Failed to create ingredient variant",
		);
	},
	onSuccess: (createdVariant, { ingredientId }) => {
		queryClient.setQueryData<IngredientDto>(
			["ingredient", ingredientId],
			(currentIngredient) => {
				if (currentIngredient === undefined) return currentIngredient;

				return {
					...currentIngredient,
					ingredientVariants: sortIngredientVariants([
						...currentIngredient.ingredientVariants,
						createdVariant,
					]),
				};
			},
		);
		void queryClient.invalidateQueries({
			queryKey: ["ingredient", ingredientId],
		});
		void queryClient.invalidateQueries({ queryKey: ["ingredients"] });
	},
});

export { createIngredientVariantMutationOptions };
