import type { IngredientDto, IngredientVariantDto } from "home-api/dist/src";
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
	if (defaultServingSize <= 0)
		throw new Error("Default serving size must be positive.");

	if (conversionFactor <= 0)
		throw new Error("Conversion factor must be positive.");

	return value !== undefined
		? (value * servingSize) / defaultServingSize / conversionFactor
		: undefined;
};

const recalculateIngredient = (
	ingredient: IngredientDto,
	variant: IngredientVariantDto,
	conversionFactor: number,
	defaultServingSize: number,
	servingSize: number,
	unit: string,
): Ingredient => {
	return {
		name: ingredient.name,
		description: variant.description,
		servingSize,
		unit,
		...getIngredientConversionContext(ingredient, variant),
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
	ingredient: IngredientDto,
	variant?: IngredientVariantDto,
): Ingredient => {
	return {
		name: ingredient.name,
		description: variant?.description,
		servingSize: variant?.servingSize,
		unit: variant?.unit,
		...getIngredientConversionContext(ingredient, variant),
		...Object.fromEntries(
			nutrientFields.map((field) => [field, variant?.[field]]),
		),
	};
};

const getIngredientConversionContext = (
	ingredient: IngredientDto,
	variant?: IngredientVariantDto,
): Pick<
	Ingredient,
	| "defaultUnit"
	| "weightToVolumeConversionFactor"
	| "conversionWeightUnit"
	| "conversionVolumeUnit"
	| "customUnits"
> => ({
	defaultUnit: variant?.unit ?? undefined,
	weightToVolumeConversionFactor:
		ingredient.weightToVolumeConversionFactor ?? undefined,
	conversionWeightUnit: ingredient.conversionWeightUnit ?? undefined,
	conversionVolumeUnit: ingredient.conversionVolumeUnit ?? undefined,
	customUnits: ingredient.customUnits ?? [],
});

const getCustomIngredient = (
	ingredient: IngredientDto,
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
		return copyIngredient(ingredient, undefined);
	}

	if (variant.servingSize === undefined || variant.servingSize <= 0) {
		errorContext.push(
			"Serving size is missing or not positive on ingredient variant.",
		);
		return copyIngredient(ingredient, variant);
	}

	if (variant.unit === undefined) {
		errorContext.push("Unit is missing on ingredient variant.");
		return copyIngredient(ingredient, variant);
	}

	const servingSize = rawServingSize ?? variant.servingSize;
	const unit = rawUnit ?? variant.unit;

	if (servingSize <= 0) {
		errorContext.push("Serving size must be positive.");
		return copyIngredient(ingredient, variant);
	}

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

	if (conversionFactor === undefined) {
		return copyIngredient(ingredient, variant);
	}

	return recalculateIngredient(
		ingredient,
		variant,
		conversionFactor,
		variant.servingSize,
		servingSize,
		unit,
	);
};

export { getCustomIngredient };
