import { QueryClient } from "@tanstack/react-query";
import type { IngredientDto } from "home-api";
import { deleteIngredientVariant } from "home-api";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createDeleteIngredientVariantMutationOptions } from "@/entities/ingredients/api/deleteIngredientVariantMutationOptions.ts";

vi.mock("home-api", async () => {
	const actual = await vi.importActual<typeof import("home-api")>("home-api");
	return {
		...actual,
		deleteIngredientVariant: vi.fn(),
	};
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("createDeleteIngredientVariantMutationOptions", () => {
	test("deletes a variant and refreshes ingredient queries", async () => {
		// given
		const queryClient = new QueryClient();
		const ingredientId = "ingredient-id";
		const variantId = "variant-id";
		const ingredient: IngredientDto = {
			id: ingredientId,
			name: "Flour",
			ingredientVariants: [
				{ id: variantId, description: "Whole", defaultVariant: true },
				{
					id: "other-variant-id",
					description: "Sliced",
					defaultVariant: false,
				},
			],
			customUnits: [],
		};
		queryClient.setQueryData(["ingredient", ingredientId], ingredient);
		const invalidateQueries = vi
			.spyOn(queryClient, "invalidateQueries")
			.mockResolvedValue();
		vi.mocked(deleteIngredientVariant).mockResolvedValue({
			data: undefined,
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		const options = createDeleteIngredientVariantMutationOptions(queryClient);

		// when
		await options.mutationFn?.({ ingredientId, variantId }, {} as never);
		options.onSuccess?.(
			undefined,
			{ ingredientId, variantId },
			undefined,
			{} as never,
		);

		// then
		expect(vi.mocked(deleteIngredientVariant)).toHaveBeenCalledWith({
			path: { ingredientId, variantId },
		});
		expect(
			queryClient.getQueryData<IngredientDto>(["ingredient", ingredientId]),
		).toEqual({
			...ingredient,
			ingredientVariants: [ingredient.ingredientVariants[1]],
		});
		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: ["ingredient", ingredientId],
		});
		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: ["ingredients"],
		});
	});

	test("turns a delete API error into a mutation error", async () => {
		// given
		const queryClient = new QueryClient();
		vi.mocked(deleteIngredientVariant).mockResolvedValue({
			data: undefined,
			error: { message: "Variant is still in use" },
			request: new Request("http://localhost"),
			response: new Response(),
		});
		const options = createDeleteIngredientVariantMutationOptions(queryClient);

		// when
		const deletion = options.mutationFn?.(
			{ ingredientId: "ingredient-id", variantId: "variant-id" },
			{} as never,
		);

		// then
		await expect(deletion).rejects.toThrow("Variant is still in use");
	});
});
