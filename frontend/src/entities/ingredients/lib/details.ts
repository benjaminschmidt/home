import { formatUnit } from "@/entities/ingredients/lib/formatUnit.ts";

type IngredientNutrition = {
	servingSize?: number;
	unit?: string;
	calories?: number;
	carbohydrate?: number;
	fat?: number;
	protein?: number;
	saturatedFat?: number;
	sodium?: number;
	sugar?: number;
};

const formatNumber = (value: number) =>
	`${Math.round((value + Number.EPSILON) * 100) / 100}`;

const getIngredientDetail = (label: string, value?: number, unit?: string) => {
	if (value == null)
		return {
			label,
			value: "\u2014",
		};

	if (unit == null)
		return {
			label,
			value: formatNumber(value),
		};

	return {
		label,
		value: `${formatNumber(value)} ${unit}`,
	};
};

const getIngredientServingDetail = (ingredient?: IngredientNutrition) => {
	return getIngredientDetail(
		"Serving",
		ingredient?.servingSize,
		formatUnit(ingredient?.unit),
	);
};

const getIngredientNutritionDetailArray = (
	ingredient?: IngredientNutrition,
) => {
	return [
		getIngredientDetail("Calories", ingredient?.calories, "kcal"),
		getIngredientDetail("Protein", ingredient?.protein, "g"),
		getIngredientDetail("Carbs", ingredient?.carbohydrate, "g"),
		getIngredientDetail("Fat", ingredient?.fat, "g"),
		getIngredientDetail("Saturated fat", ingredient?.saturatedFat, "g"),
		getIngredientDetail("Sodium", ingredient?.sodium, "g"),
		getIngredientDetail("Sugar", ingredient?.sugar, "g"),
	];
};

export { getIngredientNutritionDetailArray, getIngredientServingDetail };
