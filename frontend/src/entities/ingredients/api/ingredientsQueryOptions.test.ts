import { QueryClient } from "@tanstack/react-query";
import { listIngredients } from "home-api";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createIngredientsQueryOptions } from "@/entities/ingredients/api/ingredientsQueryOptions.ts";

vi.mock("home-api", async () => {
	const actual = await vi.importActual<typeof import("home-api")>("home-api");
	return {
		...actual,
		listIngredients: vi.fn(),
	};
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("createIngredientsQueryOptions", () => {
	test("loads a page with a trimmed search term", async () => {
		// given
		const ingredients = [
			{
				id: "ingredient-id",
				name: "Flour",
				ingredientVariants: [],
				customUnits: [],
			},
		];
		vi.mocked(listIngredients).mockResolvedValue({
			data: ingredients,
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		const options = createIngredientsQueryOptions("  flour  ");
		const queryClient = new QueryClient();

		// when
		const result = await queryClient.fetchInfiniteQuery(options);

		// then
		expect(result.pages).toEqual([ingredients]);
		expect(vi.mocked(listIngredients)).toHaveBeenCalledWith({
			query: { page: 0, size: 10, search: "flour" },
			throwOnError: true,
		});
	});

	test("propagates a list request failure", async () => {
		// given
		const error = new Error("Ingredients could not be loaded");
		vi.mocked(listIngredients).mockRejectedValue(error);
		const options = createIngredientsQueryOptions();
		const queryClient = new QueryClient();

		// when
		const request = queryClient.fetchInfiniteQuery(options);

		// then
		await expect(request).rejects.toBe(error);
	});
});
