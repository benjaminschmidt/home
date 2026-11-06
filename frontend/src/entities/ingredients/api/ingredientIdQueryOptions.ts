import { queryOptions } from "@tanstack/react-query";
import { getIngredient } from "home-api";

const createIngredientIdQueryOptions = (ingredientId: string) =>
	queryOptions({
		queryKey: ["ingredient", ingredientId],
		queryFn: async () => {
			const response = await getIngredient({
				path: { ingredientId: ingredientId },
				throwOnError: true,
			});
			return response.data;
		},
		staleTime: 1000,
	});

export { createIngredientIdQueryOptions };
