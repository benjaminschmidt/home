import { describe, expect, it } from "vitest";
import {
	getIngredientNutritionDetailArray,
	getIngredientServingDetail,
} from "@/entities/ingredients";

describe("getIngredientServingDetail", () => {
	it("returns an em-dash when serving size is absent", () => {
		// when
		const result = getIngredientServingDetail({});

		// then
		expect(result).toEqual({ label: "Serving", value: "\u2014" });
	});

	it("formats serving size with unit symbol", () => {
		// when
		const result = getIngredientServingDetail({
			servingSize: 100,
			unit: "GRAM",
		});

		// then
		expect(result).toEqual({ label: "Serving", value: "100 g" });
	});

	it("formats serving size without unit when unit is absent", () => {
		// when
		const result = getIngredientServingDetail({
			servingSize: 50,
		});

		// then
		expect(result).toEqual({ label: "Serving", value: "50" });
	});
});

describe("getIngredientNutritionDetailArray", () => {
	it("returns em-dashes for all fields when called with no values", () => {
		// given / when
		const result = getIngredientNutritionDetailArray({});

		// then
		expect(result).toHaveLength(7);
		for (const item of result) {
			expect(item.value).toBe("\u2014");
		}
	});

	it("returns correct labels in order", () => {
		// when
		const result = getIngredientNutritionDetailArray({});
		const labels = result.map((r) => r.label);

		// then
		expect(labels).toEqual([
			"Calories",
			"Protein",
			"Carbs",
			"Fat",
			"Saturated fat",
			"Sodium",
			"Sugar",
		]);
	});

	it("formats calories with kcal unit", () => {
		// when
		const result = getIngredientNutritionDetailArray({
			calories: 250,
		});

		// then
		expect(result[0]).toEqual({ label: "Calories", value: "250 kcal" });
	});

	it("formats carbohydrate with g unit", () => {
		// when
		const result = getIngredientNutritionDetailArray({
			carbohydrate: 30,
		});

		// then
		expect(result[2]).toEqual({ label: "Carbs", value: "30 g" });
	});

	it("formats protein with g unit", () => {
		// when
		const result = getIngredientNutritionDetailArray({
			protein: 10,
		});

		// then
		expect(result[1]).toEqual({ label: "Protein", value: "10 g" });
	});

	it("formats fat with g unit", () => {
		// when
		const result = getIngredientNutritionDetailArray({
			fat: 5,
		});

		// then
		expect(result[3]).toEqual({ label: "Fat", value: "5 g" });
	});

	it("formats saturated fat with g unit", () => {
		// when
		const result = getIngredientNutritionDetailArray({
			saturatedFat: 2,
		});

		// then
		expect(result[4]).toEqual({ label: "Saturated fat", value: "2 g" });
	});

	it("formats sodium with g unit", () => {
		// when
		const result = getIngredientNutritionDetailArray({
			sodium: 0.5,
		});

		// then
		expect(result[5]).toEqual({ label: "Sodium", value: "0.5 g" });
	});

	it("formats sugar with g unit", () => {
		// when
		const result = getIngredientNutritionDetailArray({
			sugar: 12,
		});

		// then
		expect(result[6]).toEqual({ label: "Sugar", value: "12 g" });
	});

	it("shows em-dash for missing optional fields alongside present ones", () => {
		// when
		const result = getIngredientNutritionDetailArray({
			calories: 200,
		});

		// then
		expect(result[0].value).toBe("200 kcal");
		expect(result[1].value).toBe("\u2014");
		expect(result[2].value).toBe("\u2014");
	});

	it("handles zero values as present (not em-dash)", () => {
		// when
		const result = getIngredientNutritionDetailArray({
			calories: 0,
			fat: 0,
			sugar: 0,
		});

		// then
		expect(result[0].value).toBe("0 kcal");
		expect(result[3].value).toBe("0 g");
		expect(result[6].value).toBe("0 g");
	});
});
