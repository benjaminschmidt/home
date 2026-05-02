import { infiniteQueryOptions } from "@tanstack/react-query";
import { listIngredients } from "home-api/dist/src";

const createIngredientsQueryOptions = (pageSize: number) =>
	infiniteQueryOptions({
		queryKey: ["ingredients"],
		queryFn: async ({ pageParam }) => {
			const response = await listIngredients({
				query: { page: pageParam, size: pageSize },
			});
			return response?.data ?? [];
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage, _, lastPageParam) => {
			if (lastPage.length < pageSize) return undefined;
			return lastPageParam + 1;
		},
	});

export { createIngredientsQueryOptions };
