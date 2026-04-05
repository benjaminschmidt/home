import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { listIngredients } from "home-api/dist/src";
import { IngredientList } from "@/pages/ingredient-list";

const ingredientsQueryOptions = queryOptions({
	queryKey: ["ingredients"],
	queryFn: async () => {
		const response = await listIngredients();
		return response?.data ?? [];
	},
});

const Route = createFileRoute("/ingredients")({
	component: () => {
		const { data: ingredients } = useSuspenseQuery(ingredientsQueryOptions);
		return <IngredientList ingredients={ingredients} />;
	},
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(ingredientsQueryOptions),
});

export { Route };
