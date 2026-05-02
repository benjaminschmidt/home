import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	createIngredientsQueryOptions,
	IngredientList,
	useInfiniteScroll,
} from "@/pages/ingredient-list";

const ingredientsQueryOptions = createIngredientsQueryOptions(10);

const IngredientsPage = () => {
	const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
		useSuspenseInfiniteQuery(ingredientsQueryOptions);

	const sentinelRef = useInfiniteScroll({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	});

	return (
		<IngredientList ingredients={data.pages.flat()} sentinelRef={sentinelRef} />
	);
};

const Route = createFileRoute("/ingredients")({
	component: IngredientsPage,
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureInfiniteQueryData(ingredientsQueryOptions),
});

export { Route };
