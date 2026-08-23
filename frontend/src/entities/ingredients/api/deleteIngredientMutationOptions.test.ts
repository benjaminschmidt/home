import type { MutationFunctionContext } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { deleteIngredient } from "home-api";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createDeleteIngredientMutationOptions } from "@/entities/ingredients/api/deleteIngredientMutationOptions.ts";

vi.mock("home-api", async () => {
	const actual = await vi.importActual<typeof import("home-api")>("home-api");
	return {
		...actual,
		deleteIngredient: vi.fn(),
	};
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("createDeleteIngredientMutationOptions", () => {
	test("deletes an ingredient and refreshes ingredient queries", async () => {
		// given
		const queryClient = new QueryClient();
		const ingredientId = "ingredient-id";
		const removeQueries = vi.spyOn(queryClient, "removeQueries");
		const invalidateQueries = vi
			.spyOn(queryClient, "invalidateQueries")
			.mockResolvedValue();
		vi.mocked(deleteIngredient).mockResolvedValue({
			data: undefined,
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		const options = createDeleteIngredientMutationOptions(queryClient);

		// when
		await options.mutationFn?.(ingredientId, {} as MutationFunctionContext);
		options.onSuccess?.(
			undefined,
			ingredientId,
			undefined,
			{} as MutationFunctionContext,
		);

		// then
		expect(vi.mocked(deleteIngredient)).toHaveBeenCalledWith({
			path: { ingredientId },
		});
		expect(removeQueries).toHaveBeenCalledWith({
			queryKey: ["ingredient", ingredientId],
		});
		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: ["ingredients"],
		});
	});

	test("turns a delete API error into a mutation error", async () => {
		// given
		const queryClient = new QueryClient();
		vi.mocked(deleteIngredient).mockResolvedValue({
			data: undefined,
			error: { message: "Ingredient is still in use" },
			request: new Request("http://localhost"),
			response: new Response(),
		});
		const options = createDeleteIngredientMutationOptions(queryClient);

		// when
		const deletion = options.mutationFn?.(
			"ingredient-id",
			{} as MutationFunctionContext,
		);

		// then
		await expect(deletion).rejects.toThrow("Ingredient is still in use");
	});
});
