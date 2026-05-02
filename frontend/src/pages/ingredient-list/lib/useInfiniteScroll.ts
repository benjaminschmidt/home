import { useEffect, useRef } from "react";

type Options = {
	fetchNextPage: () => Promise<unknown>;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
};

const useInfiniteScroll = ({
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
}: Options) => {
	const sentinelRef = useRef<HTMLDivElement | null>(null);
	// Tracks whether the sentinel is currently visible. It is used by the second useEffect to handle the race
	// condition where the sentinel stays visible after a page finishes loading. The IntersectionObserver won't
	// re-fire in that case, so the second effect triggers the next fetch.
	const sentinelVisibleRef = useRef(false);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				sentinelVisibleRef.current = entries[0].isIntersecting;
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					void fetchNextPage();
				}
			},
			{ rootMargin: "400px" },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	useEffect(() => {
		if (!isFetchingNextPage && hasNextPage && sentinelVisibleRef.current) {
			fetchNextPage().then();
		}
	}, [isFetchingNextPage, hasNextPage, fetchNextPage]);

	return sentinelRef;
};

export { useInfiniteScroll };
