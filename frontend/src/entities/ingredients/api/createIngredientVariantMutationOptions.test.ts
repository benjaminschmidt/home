import { QueryClient } from "@tanstack/react-query";
import type { IngredientDto } from "home-api";
import { addIngredientVariant } from "home-api";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createIngredientVariantMutationOptions } from "@/entities/ingredients/api/createIngredientVariantMutationOptions.ts";

vi.mock("home-api", async () => {
	const actual = await vi.importActual<typeof import("home-api")>("home-api");
	return {
		...actual,
		addIngredientVariant: vi.fn(),
	};
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("createIngredientVariantMutationOptions", () => {
	test("creates a variant and refreshes ingredient queries", async () => {
		// given
		const queryClient = new QueryClient();
		const ingredientId = "ingredient-id";
		const ingredient: IngredientDto = {
			id: ingredientId,
			name: "Flour",
			ingredientVariants: [
				{ id: "salted-id", description: "Salted", defaultVariant: false },
				{ id: "unsalted-id", description: "Unsalted", defaultVariant: false },
			],
			customUnits: [],
		};
		const createdVariant = {
			id: "variant-id",
			description: "Test",
			defaultVariant: false,
		};
		queryClient.setQueryData(["ingredient", ingredientId], ingredient);
		const invalidateQueries = vi
			.spyOn(queryClient, "invalidateQueries")
			.mockResolvedValue();
		vi.mocked(addIngredientVariant).mockResolvedValue({
			data: createdVariant,
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		const options = createIngredientVariantMutationOptions(queryClient);
		const variables = {
			ingredientId,
			ingredientVariantWriteRequest: { description: "Test" },
		};

		// when
		const result = await options.mutationFn?.(variables, {} as never);
		if (result === undefined) throw new Error("Mutation function is missing");
		options.onSuccess?.(result, variables, undefined, {} as never);

		// then
		expect(result).toEqual(createdVariant);
		expect(vi.mocked(addIngredientVariant)).toHaveBeenCalledWith({
			path: { ingredientId },
			body: { description: "Test" },
		});
		expect(
			queryClient.getQueryData<IngredientDto>(["ingredient", ingredientId]),
		).toEqual({
			...ingredient,
			ingredientVariants: [
				ingredient.ingredientVariants[0],
				createdVariant,
				ingredient.ingredientVariants[1],
			],
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
		vi.mocked(addIngredientVariant).mockResolvedValue({
			data: undefined,
			error: { message: "Description is required" },
			request: new Request("http://localhost"),
			response: new Response(),
		});
		const options = createIngredientVariantMutationOptions(queryClient);

		// when
		const creation = options.mutationFn?.(
			{
				ingredientId: "ingredient-id",
				ingredientVariantWriteRequest: { description: "" },
			},
			{} as never,
		);

		// then
		await expect(creation).rejects.toThrow("Description is required");
	});
});
