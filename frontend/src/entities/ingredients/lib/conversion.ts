import type {
	CustomUnitDtoRoot,
	GenericUnitDtoRoot,
	IngredientDtoRoot,
	VolumeUnitDtoRoot,
	WeightUnitDtoRoot,
} from "home-api/dist/src";
import {
	isVolumeUnit,
	isWeightUnit,
} from "@/entities/ingredients/lib/unitType.ts";

const weightToGramConversionFactors: Record<WeightUnitDtoRoot, number> = {
	GRAM: 1,
	MILLIGRAM: 0.001,
	KILOGRAM: 1000,
	OUNCE: 28.3495,
	POUND: 453.592,
};

const volumeToMlConversionFactors: Record<VolumeUnitDtoRoot, number> = {
	MILLILITER: 1,
	LITER: 1000,
	FLUID_OUNCE: 29.5735,
	TEASPOON: 4.92892,
	TABLESPOON: 14.7868,
	CUP: 236.588,
};

const calculateConversionFactorFromVolumeUnitAToB = (
	unitA: VolumeUnitDtoRoot,
	unitB: VolumeUnitDtoRoot,
) => {
	return (
		volumeToMlConversionFactors[unitA] / volumeToMlConversionFactors[unitB]
	);
};

const calculateConversionFactorFromWeightUnitAToVolumeUnitB = (
	unitA: WeightUnitDtoRoot,
	unitB: VolumeUnitDtoRoot,
	weightToVolumeConversionFactor: number,
	conversionWeightUnit: WeightUnitDtoRoot,
	conversionVolumeUnit: VolumeUnitDtoRoot,
) => {
	return (
		calculateConversionFactorFromWeightUnitAToB(unitA, conversionWeightUnit) *
		weightToVolumeConversionFactor *
		calculateConversionFactorFromVolumeUnitAToB(conversionVolumeUnit, unitB)
	);
};

const calculateConversionFactorFromWeightUnitAToB = (
	unitA: WeightUnitDtoRoot,
	unitB: WeightUnitDtoRoot,
) => {
	return (
		weightToGramConversionFactors[unitA] / weightToGramConversionFactors[unitB]
	);
};

const calculateConversionFactorFromVolumeUnitAToWeightUnitB = (
	unitA: VolumeUnitDtoRoot,
	unitB: WeightUnitDtoRoot,
	weightToVolumeConversionFactor: number,
	conversionWeightUnit: WeightUnitDtoRoot,
	conversionVolumeUnit: VolumeUnitDtoRoot,
) => {
	return (
		(calculateConversionFactorFromVolumeUnitAToB(unitA, conversionVolumeUnit) /
			weightToVolumeConversionFactor) *
		calculateConversionFactorFromWeightUnitAToB(conversionWeightUnit, unitB)
	);
};

const calculateConversionFactorFromUnitAToB = (
	ingredient: IngredientDtoRoot,
	unitA: GenericUnitDtoRoot,
	unitB: GenericUnitDtoRoot,
	errorContext: string[],
): number | undefined => {
	if (isWeightUnit(unitA) && isWeightUnit(unitB)) {
		return calculateConversionFactorFromWeightUnitAToB(unitA, unitB);
	}

	if (isVolumeUnit(unitA) && isVolumeUnit(unitB)) {
		return calculateConversionFactorFromVolumeUnitAToB(unitA, unitB);
	}

	if (ingredient.weightToVolumeConversionFactor == null) {
		errorContext.push("Weight to volume conversion factor is undefined.");
		return undefined;
	}

	if (ingredient.conversionWeightUnit == null) {
		errorContext.push("Conversion weight unit is undefined.");
		return undefined;
	}

	if (ingredient.conversionVolumeUnit == null) {
		errorContext.push("Conversion volume unit is undefined.");
		return undefined;
	}

	if (isWeightUnit(unitA) && isVolumeUnit(unitB)) {
		return calculateConversionFactorFromWeightUnitAToVolumeUnitB(
			unitA,
			unitB,
			ingredient.weightToVolumeConversionFactor,
			ingredient.conversionWeightUnit,
			ingredient.conversionVolumeUnit,
		);
	}

	if (isVolumeUnit(unitA) && isWeightUnit(unitB)) {
		return calculateConversionFactorFromVolumeUnitAToWeightUnitB(
			unitA,
			unitB,
			ingredient.weightToVolumeConversionFactor,
			ingredient.conversionWeightUnit,
			ingredient.conversionVolumeUnit,
		);
	}
};

const calculateConversionFactorFromDefaultUnitToCustomUnit = (
	ingredient: IngredientDtoRoot,
	defaultUnit: GenericUnitDtoRoot | undefined,
	customUnit: CustomUnitDtoRoot | undefined,
	errorContext: string[],
) => {
	if (defaultUnit === undefined) {
		errorContext.push("Default unit is undefined.");
		return undefined;
	}

	if (customUnit === undefined) {
		errorContext.push("Custom unit is undefined.");
		return undefined;
	}

	if (customUnit.conversionUnit == null) {
		errorContext.push("Conversion unit is undefined.");
		return undefined;
	}

	if (customUnit.conversionUnitToCustomUnitFactor == null) {
		errorContext.push("Conversion unit to custom unit factor is undefined.");
		return undefined;
	}

	const factor = calculateConversionFactorFromUnitAToB(
		ingredient,
		defaultUnit,
		customUnit.conversionUnit,
		errorContext,
	);

	return factor !== undefined
		? factor * customUnit.conversionUnitToCustomUnitFactor
		: undefined;
};

export {
	calculateConversionFactorFromDefaultUnitToCustomUnit,
	calculateConversionFactorFromUnitAToB,
};
