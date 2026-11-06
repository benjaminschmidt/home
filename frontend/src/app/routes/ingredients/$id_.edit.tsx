import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createIngredientIdQueryOptions } from "@/entities/ingredients";
import { EditIngredientPage } from "@/pages/ingredient-edit";
import { QueryErrorState } from "@/shared/ui/QueryErrorState.tsx";

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
	errorComponent: ({ error }) => (
		<QueryErrorState error={error} title="Couldn't load ingredient" />
	),
	loader: async ({ context: { queryClient }, params: { id } }) => {
		await queryClient.query({
			...createIngredientIdQueryOptions(id),
			staleTime: "static",
		});
	},
	params: {
		parse: (params) => z.object({ id: z.uuid() }).parse(params),
	},
});
