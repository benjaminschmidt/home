import { describe, expect, it } from "vitest";
import { getIngredientVariantDetailArray } from "@/entities/ingredients";

describe("getIngredientVariantDetailArray", () => {
	it("returns em-dashes for all fields when called with no argument", () => {
		// given / when
		const result = getIngredientVariantDetailArray({});

		// then
		expect(result).toHaveLength(8);
		for (const item of result) {
			expect(item.value).toBe("\u2014");
		}
	});

	it("returns correct labels in order", () => {
		// when
		const result = getIngredientVariantDetailArray({});
		const labels = result.map((r) => r.label);

		// then
		expect(labels).toEqual([
			"Serving",
			"Calories",
			"Protein",
			"Carbs",
			"Fat",
			"Saturated fat",
			"Sodium",
			"Sugar",
		]);
	});

	it("formats serving size with unit symbol", () => {
		// when
		const result = getIngredientVariantDetailArray({
			servingSize: 100,
			unit: "GRAM",
		});

		// then
		expect(result[0]).toEqual({ label: "Serving", value: "100 g" });
	});

	it("formats serving size without unit when unit is absent", () => {
		// when
		const result = getIngredientVariantDetailArray({
			servingSize: 50,
		});

		// then
		expect(result[0]).toEqual({ label: "Serving", value: "50" });
	});

	it("formats calories with kcal unit", () => {
		// when
		const result = getIngredientVariantDetailArray({
			calories: 250,
		});

		// then
		expect(result[1]).toEqual({ label: "Calories", value: "250 kcal" });
	});

	it("formats carbohydrate with g unit", () => {
		// when
		const result = getIngredientVariantDetailArray({
			carbohydrate: 30,
		});

		// then
		expect(result[3]).toEqual({ label: "Carbs", value: "30 g" });
	});

	it("formats protein with g unit", () => {
		// when
		const result = getIngredientVariantDetailArray({
			protein: 10,
		});

		// then
		expect(result[2]).toEqual({ label: "Protein", value: "10 g" });
	});

	it("formats fat with g unit", () => {
		// when
		const result = getIngredientVariantDetailArray({
			fat: 5,
		});

		// then
		expect(result[4]).toEqual({ label: "Fat", value: "5 g" });
	});

	it("formats saturated fat with g unit", () => {
		// when
		const result = getIngredientVariantDetailArray({
			saturatedFat: 2,
		});

		// then
		expect(result[5]).toEqual({ label: "Saturated fat", value: "2 g" });
	});

	it("formats sodium with g unit", () => {
		// when
		const result = getIngredientVariantDetailArray({
			sodium: 0.5,
		});

		// then
		expect(result[6]).toEqual({ label: "Sodium", value: "0.5 g" });
	});

	it("formats sugar with g unit", () => {
		// when
		const result = getIngredientVariantDetailArray({
			sugar: 12,
		});

		// then
		expect(result[7]).toEqual({ label: "Sugar", value: "12 g" });
	});

	it("shows em-dash for missing optional fields alongside present ones", () => {
		// when
		const result = getIngredientVariantDetailArray({
			servingSize: 100,
			unit: "GRAM",
			calories: 200,
		});

		// then
		expect(result[0].value).toBe("100 g");
		expect(result[1].value).toBe("200 kcal");
		expect(result[2].value).toBe("\u2014");
		expect(result[3].value).toBe("\u2014");
	});

	it("handles zero values as present (not em-dash)", () => {
		// when
		const result = getIngredientVariantDetailArray({
			calories: 0,
			fat: 0,
			sugar: 0,
		});

		// then
		expect(result[1].value).toBe("0 kcal");
		expect(result[4].value).toBe("0 g");
		expect(result[7].value).toBe("0 g");
	});
});
