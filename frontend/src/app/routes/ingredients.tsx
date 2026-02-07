import { createFileRoute } from "@tanstack/react-router";
import { listIngredients } from "home-api/dist/src";
import { IngredientList } from "@/pages/ingredient-list";

const Route = createFileRoute("/ingredients")({
	component: () => {
		const ingredients = Route.useLoaderData();
		return <IngredientList ingredients={ingredients} />;
	},
	loader: async () => {
		const res = await listIngredients();
		return res?.data ?? [];
	},
});

export { Route };
