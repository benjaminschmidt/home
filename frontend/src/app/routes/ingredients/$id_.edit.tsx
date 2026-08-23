import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createIngredientIdQueryOptions } from "@/entities/ingredients";
import { EditIngredientPage } from "@/pages/ingredient-edit";

const Component = () => {
	const { id } = Route.useParams();
	const navigate = Route.useNavigate();
	const { data } = useSuspenseQuery(createIngredientIdQueryOptions(id));

	return (
		<EditIngredientPage
			mode="edit"
			ingredientDto={data}
			onCancel={() => {
				void navigate({ to: "/ingredients/$id", params: { id } });
			}}
			onDeleted={() => {
				void navigate({ to: "/ingredients", replace: true });
			}}
		/>
	);
};

export const Route = createFileRoute("/ingredients/$id_/edit")({
	component: Component,
	loader: async ({ context: { queryClient }, params: { id } }) => {
		await queryClient.ensureQueryData(createIngredientIdQueryOptions(id));
	},
	params: {
		parse: (params) => z.object({ id: z.uuid() }).parse(params),
	},
});
