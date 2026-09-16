import { describe, expect, it } from "vitest";
import {
	getIngredientNutritionDetailArray,
	getIngredientServingDetail,
} from "@/entities/ingredients";

describe("ingredient details", () => {
	it("formats serving sizes with generic and absent units", () => {
		expect(
			getIngredientServingDetail({ servingSize: 100, unit: "GRAM" }),
		).toEqual({ label: "Serving", value: "100 g" });
		expect(getIngredientServingDetail({ servingSize: 50 })).toEqual({
			label: "Serving",
			value: "50",
		});
	});

	it("formats all nutrition details in display order", () => {
		expect(
			getIngredientNutritionDetailArray({
				calories: 250,
				protein: 10,
				carbohydrate: 30,
				fat: 5,
				saturatedFat: 2,
				sodium: 0.5,
				sugar: 12,
			}),
		).toEqual([
			{ label: "Calories", value: "250 kcal" },
			{ label: "Protein", value: "10 g" },
			{ label: "Carbs", value: "30 g" },
			{ label: "Fat", value: "5 g" },
			{ label: "Saturated fat", value: "2 g" },
			{ label: "Sodium", value: "0.5 g" },
			{ label: "Sugar", value: "12 g" },
		]);
	});

	it("uses an em-dash only for absent values", () => {
		expect(getIngredientServingDetail({})).toEqual({
			label: "Serving",
			value: "—",
		});
		expect(
			getIngredientNutritionDetailArray({ calories: 0, fat: 0, sugar: 0 }),
		).toEqual([
			{ label: "Calories", value: "0 kcal" },
			{ label: "Protein", value: "—" },
			{ label: "Carbs", value: "—" },
			{ label: "Fat", value: "0 g" },
			{ label: "Saturated fat", value: "—" },
			{ label: "Sodium", value: "—" },
			{ label: "Sugar", value: "0 g" },
		]);
	});
});
