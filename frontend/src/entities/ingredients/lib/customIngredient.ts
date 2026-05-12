import type {
	IngredientDtoRoot,
	IngredientVariantDtoRoot,
} from "home-api/dist/src";
import { findIngredientVariant } from "@/entities/ingredients";
import {
	calculateConversionFactorFromDefaultUnitToCustomUnit,
	calculateConversionFactorFromUnitAToB,
} from "@/entities/ingredients/lib/conversion.ts";
import { findCustomUnit } from "@/entities/ingredients/lib/searchCustomUnits.ts";
import { isGenericUnit } from "@/entities/ingredients/lib/unitType.ts";
import type { Ingredient } from "@/entities/ingredients/model/ingredient.ts";

const nutrientFields = [
	"calories",
	"carbohydrate",
	"fat",
	"protein",
	"saturatedFat",
	"sodium",
	"sugar",
] as const;

const recalculateValue = (
	conversionFactor: number,
	defaultServingSize: number,
	servingSize: number,
	value?: number,
) => {
	if (defaultServingSize === 0)
		throw new Error("Default serving size must not be zero.");

	return value !== undefined
		? (value * servingSize) / defaultServingSize / conversionFactor
		: undefined;
};

const recalculateIngredient = (
	name: string,
	variant: IngredientVariantDtoRoot,
	conversionFactor: number,
	defaultServingSize: number,
	servingSize: number,
	unit: string,
): Ingredient => {
	return {
		name,
		description: variant.description,
		servingSize,
		unit,
		...Object.fromEntries(
			nutrientFields.map((field) => [
				field,
				recalculateValue(
					conversionFactor,
					defaultServingSize,
					servingSize,
					variant[field],
				),
			]),
		),
	};
};

const copyIngredient = (
	name: string,
	variant?: IngredientVariantDtoRoot,
): Ingredient => {
	return {
		name,
		description: variant?.description,
		servingSize: variant?.servingSize,
		unit: variant?.unit,
		...Object.fromEntries(
			nutrientFields.map((field) => [field, variant?.[field]]),
		),
	};
};

const getCustomIngredient = (
	ingredient: IngredientDtoRoot,
	variantId?: string,
	rawServingSize?: number,
	rawUnit?: string,
	errorContext: string[] = [],
): Ingredient => {
	const variant = findIngredientVariant(
		ingredient.ingredientVariants ?? [],
		variantId,
		errorContext,
	);

	if (variant === undefined) {
		return copyIngredient(ingredient.name, undefined);
	}

	if (variant.servingSize == null || variant.servingSize === 0) {
		errorContext.push("Serving size is missing or 0 on ingredient variant.");
		return copyIngredient(ingredient.name, variant);
	}

	if (variant.unit == null) {
		errorContext.push("Unit is missing on ingredient variant.");
		return copyIngredient(ingredient.name, variant);
	}

	const servingSize = rawServingSize ?? variant.servingSize;
	const unit = rawUnit ?? variant.unit;

	const conversionFactor = isGenericUnit(unit)
		? calculateConversionFactorFromUnitAToB(
				ingredient,
				variant.unit,
				unit,
				errorContext,
			)
		: calculateConversionFactorFromDefaultUnitToCustomUnit(
				ingredient,
				variant.unit,
				findCustomUnit(ingredient.customUnits ?? [], unit, errorContext),
				errorContext,
			);

	if (conversionFactor == null) {
		return copyIngredient(ingredient.name, variant);
	}

	return recalculateIngredient(
		ingredient.name,
		variant,
		conversionFactor,
		variant.servingSize,
		servingSize,
		unit,
	);
};

export { getCustomIngredient };
