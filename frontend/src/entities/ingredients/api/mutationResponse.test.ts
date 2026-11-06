import { describe, expect, test } from "vitest";
import {
	getMutationResponseData,
	throwIfMutationResponseError,
} from "@/entities/ingredients/api/mutationResponse.ts";

describe("mutation response helpers", () => {
	test("returns successful mutation data", () => {
		expect(
			getMutationResponseData({ data: { id: "ingredient-id" } }, "Fallback"),
		).toEqual({ id: "ingredient-id" });
	});

	test("throws the API error message when mutation data is missing", () => {
		expect(() =>
			getMutationResponseData(
				{ data: undefined, error: { message: "Name already exists" } },
				"Fallback",
			),
		).toThrow("Name already exists");
	});

	test("uses the fallback when a mutation has no error message", () => {
		expect(() =>
			getMutationResponseData({ data: undefined }, "Fallback"),
		).toThrow("Fallback");
	});

	test("throws delete errors and ignores successful deletes", () => {
		expect(() =>
			throwIfMutationResponseError(
				{ message: "Ingredient could not be deleted" },
				"Fallback",
			),
		).toThrow("Ingredient could not be deleted");
		expect(() =>
			throwIfMutationResponseError(undefined, "Fallback"),
		).not.toThrow();
	});
});
