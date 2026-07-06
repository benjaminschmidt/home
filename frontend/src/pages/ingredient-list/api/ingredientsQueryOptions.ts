import { infiniteQueryOptions } from "@tanstack/react-query";
import { listIngredients } from "home-api/dist/src";

const INGREDIENTS_PAGE_SIZE = 10;

const createIngredientsQueryOptions = (search?: string) => {
	const trimmedSearch = search?.trim() || undefined;

	return infiniteQueryOptions({
		queryKey: ["ingredients", { search: trimmedSearch }],
		queryFn: async ({ pageParam }) => {
			const response = await listIngredients({
				query: {
					page: pageParam,
					size: INGREDIENTS_PAGE_SIZE,
					search: trimmedSearch,
				},
			});
			return response?.data ?? [];
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage, _, lastPageParam) => {
			if (lastPage.length < INGREDIENTS_PAGE_SIZE) return undefined;
			return lastPageParam + 1;
		},
	});
};

export { createIngredientsQueryOptions };
