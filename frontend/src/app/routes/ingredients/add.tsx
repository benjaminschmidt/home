import { createFileRoute } from "@tanstack/react-router";
import { EditIngredientPage } from "@/pages/ingredient-edit";

const Component = () => {
	const navigate = Route.useNavigate();

	return (
		<EditIngredientPage
			mode="create"
			onCancel={() => {
				void navigate({ to: "/ingredients" });
			}}
			onCreated={(ingredientDto) => {
				void navigate({
					to: "/ingredients/$id/edit",
					params: { id: ingredientDto.id },
					replace: true,
				});
			}}
		/>
	);
};

export const Route = createFileRoute("/ingredients/add")({
	component: Component,
});
