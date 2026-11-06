import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import type {
	CustomUnitDto,
	CustomUnitWriteRequest,
	IngredientDto,
} from "home-api";
import { addCustomUnit } from "home-api";
import { getMutationResponseData } from "@/entities/ingredients/api/mutationResponse.ts";
import { sortCustomUnits } from "@/entities/ingredients/lib/sortCustomUnits.ts";

type CreateCustomUnitVariables = {
	ingredientId: string;
	customUnitWriteRequest: CustomUnitWriteRequest;
};

const createCustomUnitMutationOptions = (
	queryClient: QueryClient,
): UseMutationOptions<CustomUnitDto, Error, CreateCustomUnitVariables> => ({
	mutationFn: async ({ ingredientId, customUnitWriteRequest }) => {
		const response = await addCustomUnit({
			path: { ingredientId },
			body: customUnitWriteRequest,
		});

		return getMutationResponseData(response, "Failed to create custom unit");
	},
	onSuccess: (createdUnit, { ingredientId }) => {
		queryClient.setQueryData<IngredientDto>(
			["ingredient", ingredientId],
			(currentIngredient) => {
				if (currentIngredient === undefined) return currentIngredient;

				return {
					...currentIngredient,
					customUnits: sortCustomUnits([
						...currentIngredient.customUnits,
						createdUnit,
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

export { createCustomUnitMutationOptions };
