import { QueryClient } from "@tanstack/react-query";
import { getIngredient } from "home-api";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createIngredientIdQueryOptions } from "@/entities/ingredients/api/ingredientIdQueryOptions.ts";

vi.mock("home-api", async () => {
	const actual = await vi.importActual<typeof import("home-api")>("home-api");
	return {
		...actual,
		getIngredient: vi.fn(),
	};
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("createIngredientIdQueryOptions", () => {
	test("loads the requested ingredient", async () => {
		// given
		const ingredientId = "ingredient-id";
		const ingredient = {
			id: ingredientId,
			name: "Flour",
			ingredientVariants: [],
			customUnits: [],
		};
		vi.mocked(getIngredient).mockResolvedValue({
			data: ingredient,
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		const options = createIngredientIdQueryOptions(ingredientId);
		const queryClient = new QueryClient();

		// when
		const result = await queryClient.fetchQuery(options);

		// then
		expect(result).toEqual(ingredient);
		expect(vi.mocked(getIngredient)).toHaveBeenCalledWith({
			path: { ingredientId },
			throwOnError: true,
		});
	});

	test("propagates an ingredient request failure", async () => {
		// given
		const error = new Error("Ingredient could not be loaded");
		vi.mocked(getIngredient).mockRejectedValue(error);
		const options = createIngredientIdQueryOptions("ingredient-id");
		const queryClient = new QueryClient();

		// when
		const request = queryClient.fetchQuery(options);

		// then
		await expect(request).rejects.toBe(error);
	});
});
