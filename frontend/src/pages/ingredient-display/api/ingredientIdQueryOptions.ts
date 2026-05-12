import { queryOptions } from "@tanstack/react-query";
import { getIngredient } from "home-api/dist/src";

const createIngredientIdQueryOptions = (ingredientId: string) =>
	queryOptions({
		queryKey: ["ingredient", ingredientId],
		queryFn: async () => {
			const response = await getIngredient({
				path: { ingredientId: ingredientId },
			});
			return (
				response?.data ?? {
					id: ingredientId,
					name: "Unknown",
				}
			);
		},
		staleTime: 1000,
	});

export { createIngredientIdQueryOptions };
