import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import type { IngredientDto } from "home-api";
import { deleteCustomUnit } from "home-api";

type DeleteCustomUnitVariables = {
	ingredientId: string;
	unitId: string;
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

const createDeleteCustomUnitMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<void, Error, DeleteCustomUnitVariables> => ({
	mutationFn: async ({ ingredientId, unitId }) => {
		const response = await deleteCustomUnit({
			path: { ingredientId, unitId },
		});

		if (response.error !== undefined) {
			throw new Error(
				getDeleteErrorMessage(response.error) ?? "Failed to delete custom unit",
			);
		}
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
