import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import type { IngredientDto } from "home-api";
import { deleteCustomUnit } from "home-api";
import { throwIfMutationResponseError } from "@/entities/ingredients/api/mutationResponse.ts";

type DeleteCustomUnitVariables = {
	ingredientId: string;
	unitId: string;
};

const createDeleteCustomUnitMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<void, Error, DeleteCustomUnitVariables> => ({
	mutationFn: async ({ ingredientId, unitId }) => {
		const response = await deleteCustomUnit({
			path: { ingredientId, unitId },
		});

		throwIfMutationResponseError(
			response.error,
			"Failed to delete custom unit",
		);
	},
	onSuccess: (_, { ingredientId, unitId }) => {
		queryClient.setQueryData<IngredientDto>(
			["ingredient", ingredientId],
			(currentIngredient) => {
				if (currentIngredient === undefined) return currentIngredient;

				return {
					...currentIngredient,
					customUnits: currentIngredient.customUnits.filter(
						(unit) => unit.id !== unitId,
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

export { createDeleteCustomUnitMutationOptions };
