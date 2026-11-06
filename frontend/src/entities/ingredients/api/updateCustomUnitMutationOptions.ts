import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import type {
	CustomUnitDto,
	CustomUnitWriteRequest,
	IngredientDto,
} from "home-api";
import { updateCustomUnit } from "home-api";
import { getMutationResponseData } from "@/entities/ingredients/api/mutationResponse.ts";
import { sortCustomUnits } from "@/entities/ingredients/lib/sortCustomUnits.ts";

type UpdateCustomUnitVariables = {
	ingredientId: string;
	unitId: string;
	customUnitWriteRequest: CustomUnitWriteRequest;
};

const createUpdateCustomUnitMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<CustomUnitDto, Error, UpdateCustomUnitVariables> => ({
	mutationFn: async ({ ingredientId, unitId, customUnitWriteRequest }) => {
		const response = await updateCustomUnit({
			path: { ingredientId, unitId },
			body: customUnitWriteRequest,
		});

		return getMutationResponseData(response, "Failed to update custom unit");
	},
	onSuccess: (updatedUnit, { ingredientId, unitId }) => {
		queryClient.setQueryData<IngredientDto>(
			["ingredient", ingredientId],
			(currentIngredient) => {
				if (currentIngredient === undefined) return currentIngredient;

				return {
					...currentIngredient,
					customUnits: sortCustomUnits(
						currentIngredient.customUnits.map((unit) =>
							unit.id === unitId ? updatedUnit : unit,
						),
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

export { createUpdateCustomUnitMutationOptions };
