import { QueryClient } from "@tanstack/react-query";
import type { IngredientDto } from "home-api";
import { updateIngredientVariant } from "home-api";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createUpdateIngredientVariantMutationOptions } from "@/entities/ingredients/api/updateIngredientVariantMutationOptions.ts";

vi.mock("home-api", async () => {
	const actual = await vi.importActual<typeof import("home-api")>("home-api");
	return {
		...actual,
		updateIngredientVariant: vi.fn(),
	};
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("createUpdateIngredientVariantMutationOptions", () => {
	test("updates a variant and refreshes ingredient queries", async () => {
		// given
		const queryClient = new QueryClient();
		const ingredientId = "ingredient-id";
		const variantId = "variant-id";
		const ingredient: IngredientDto = {
			id: ingredientId,
			name: "Flour",
			ingredientVariants: [
				{
					id: variantId,
					description: "Whole",
					defaultVariant: true,
				},
			],
			customUnits: [],
		};
		const updatedVariant = {
			...ingredient.ingredientVariants[0],
			description: "Sliced",
		};
		queryClient.setQueryData(["ingredient", ingredientId], ingredient);
		const invalidateQueries = vi
			.spyOn(queryClient, "invalidateQueries")
			.mockResolvedValue();
		vi.mocked(updateIngredientVariant).mockResolvedValue({
			data: updatedVariant,
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		const options = createUpdateIngredientVariantMutationOptions(queryClient);

		// when
		const result = await options.mutationFn?.(
			{
				ingredientId,
				variantId,
				ingredientVariantWriteRequest: {
					description: "Sliced",
				},
			},
			{} as never,
		);
		if (result === undefined) throw new Error("Mutation function is missing");
		options.onSuccess?.(
			result,
			{
				ingredientId,
				variantId,
				ingredientVariantWriteRequest: {
					description: "Sliced",
				},
			},
			undefined,
			{} as never,
		);

		// then
		expect(result).toEqual(updatedVariant);
		expect(vi.mocked(updateIngredientVariant)).toHaveBeenCalledWith({
			path: { ingredientId, variantId },
			body: { description: "Sliced" },
		});
		expect(
			queryClient.getQueryData<IngredientDto>(["ingredient", ingredientId]),
		).toEqual({
			...ingredient,
			ingredientVariants: [updatedVariant],
		});
		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: ["ingredient", ingredientId],
		});
		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: ["ingredients"],
		});
	});

	test("turns an API error into a mutation error", async () => {
		// given
		const queryClient = new QueryClient();
		vi.mocked(updateIngredientVariant).mockResolvedValue({
			data: undefined,
			error: { message: "Description already exists" },
			request: new Request("http://localhost"),
			response: new Response(),
		});
		const options = createUpdateIngredientVariantMutationOptions(queryClient);

		// when
		const update = options.mutationFn?.(
			{
				ingredientId: "ingredient-id",
				variantId: "variant-id",
				ingredientVariantWriteRequest: { description: "Whole" },
			},
			{} as never,
		);

		// then
		await expect(update).rejects.toThrow("Description already exists");
	});
});
