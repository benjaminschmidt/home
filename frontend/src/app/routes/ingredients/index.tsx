import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
	createIngredientsQueryOptions,
	IngredientListPage,
	useInfiniteScroll,
} from "@/pages/ingredient-list";

const IngredientsPage = () => {
	const { search } = Route.useSearch();
	const navigate = Route.useNavigate();
	const ingredientsQueryOptions = createIngredientsQueryOptions(search);
	const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
		useSuspenseInfiniteQuery(ingredientsQueryOptions);
	const handleSearchChange = (nextSearch: string) => {
		navigate({
			search: {
				search: nextSearch || undefined,
			},
			replace: true,
		});
	};

	const sentinelRef = useInfiniteScroll({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	});

	return (
		<IngredientListPage
			ingredients={data.pages.flat()}
			search={search ?? ""}
			onSearchChange={handleSearchChange}
			sentinelRef={sentinelRef}
		/>
	);
};

const Route = createFileRoute("/ingredients/")({
	component: IngredientsPage,
	validateSearch: (search) => {
		return z
			.object({
				search: z.string().optional(),
			})
			.parse(search);
	},
	loaderDeps: ({ search }) => ({
		search: search.search,
	}),
	loader: ({ context: { queryClient }, deps }) =>
		queryClient.ensureInfiniteQueryData(
			createIngredientsQueryOptions(deps.search),
		),
});

export { Route };
