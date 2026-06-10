import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
	createIngredientIdQueryOptions,
	dropUnnecessarySearchParams,
	IngredientDetail,
} from "@/pages/ingredient-display";

const Component = () => {
	const { id } = Route.useParams();
	const { variantId, servingSize, unit } = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data } = useSuspenseQuery(createIngredientIdQueryOptions(id));

	return (
		<IngredientDetail
			ingredientDto={data}
			rawVariantId={variantId}
			rawServingSize={servingSize}
			rawUnit={unit}
			onVariantIdChange={(selectedVariantId) => {
				navigate({
					to: "/ingredients/$id",
					params: { id: data.id },
					search: {
						variantId: selectedVariantId,
						servingSize,
						unit,
					},
					replace: true,
				});
			}}
		/>
	);
};

export const Route = createFileRoute("/ingredients/$id")({
	component: Component,
	validateSearch: (search) => {
		return z
			.object({
				variantId: z.uuid().optional(),
				servingSize: z.number().optional(),
				unit: z.string().optional(),
			})
			.parse(search);
	},
	loaderDeps: ({ search }) => ({
		variantId: search.variantId,
		servingSize: search.servingSize,
		unit: search.unit,
	}),
	loader: async ({ context: { queryClient }, params: { id }, deps }) => {
		const data = await queryClient.ensureQueryData(
			createIngredientIdQueryOptions(id),
		);

		const {
			updatedVariantId,
			updatedServingSize,
			updatedUnit,
			hasRedundantParams,
		} = dropUnnecessarySearchParams(
			data,
			deps.variantId,
			deps.servingSize,
			deps.unit,
		);

		if (hasRedundantParams) {
			throw Route.redirect({
				to: "/ingredients/$id",
				params: { id },
				search: {
					variantId: updatedVariantId,
					servingSize: updatedServingSize,
					unit: updatedUnit,
				},
				replace: true,
			});
		}

		return data;
	},
	params: {
		parse: (params) => z.object({ id: z.uuid() }).parse(params),
	},
});
