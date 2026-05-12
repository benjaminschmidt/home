import type { IngredientVariantDtoRoot } from "home-api/dist/src";
import { formatUnit } from "@/entities/ingredients";

const getIngredientVariantDetail = (
	label: string,
	value?: number,
	unit?: string,
) => {
	if (value == null)
		return {
			label: label,
			value: "\u2014",
		};

	if (unit == null)
		return {
			label: label,
			value: `${value}`,
		};

	return {
		label: label,
		value: `${value} ${unit}`,
	};
};

const getIngredientVariantDetailArray = (
	ingredientVariant?: IngredientVariantDtoRoot,
) => [
	getIngredientVariantDetail(
		"Serving",
		ingredientVariant?.servingSize,
		formatUnit(ingredientVariant?.unit),
	),
	getIngredientVariantDetail("Calories", ingredientVariant?.calories, "kcal"),
	getIngredientVariantDetail("Carbs", ingredientVariant?.carbohydrate, "g"),
	getIngredientVariantDetail("Protein", ingredientVariant?.protein, "g"),
	getIngredientVariantDetail("Fat", ingredientVariant?.fat, "g"),
	getIngredientVariantDetail("Sat. Fat", ingredientVariant?.saturatedFat, "g"),
	getIngredientVariantDetail("Sodium", ingredientVariant?.sodium, "g"),
	getIngredientVariantDetail("Sugar", ingredientVariant?.sugar, "g"),
];

export { getIngredientVariantDetailArray };
