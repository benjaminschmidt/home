import { createFileRoute } from "@tanstack/react-router";
import { IngredientList } from "@/pages/ingredient-list";

const Route = createFileRoute("/ingredients")({
	component: IngredientList,
});

export { Route };
