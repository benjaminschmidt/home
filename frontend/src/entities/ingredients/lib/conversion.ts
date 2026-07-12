import type {
	CustomUnitDto,
	GenericUnitDto,
	IngredientDto,
	VolumeUnitDto,
	WeightUnitDto,
} from "home-api/dist/src";
import { findCustomUnit } from "@/entities/ingredients/lib/searchCustomUnits.ts";
import {
	isGenericUnit,
	isVolumeUnit,
	isWeightUnit,
} from "@/entities/ingredients/lib/unitType.ts";

const weightToGramConversionFactors: Record<WeightUnitDto, number> = {
	GRAM: 1,
	MILLIGRAM: 0.001,
	KILOGRAM: 1000,
	OUNCE: 28.3495,
	POUND: 453.592,
};

const volumeToMlConversionFactors: Record<VolumeUnitDto, number> = {
	MILLILITER: 1,
	LITER: 1000,
	FLUID_OUNCE: 29.5735,
	TEASPOON: 4.92892,
	TABLESPOON: 14.7868,
	CUP: 236.588,
};

const calculateConversionFactorFromVolumeUnitAToB = (
	unitA: VolumeUnitDto,
	unitB: VolumeUnitDto,
) => {
	return (
		volumeToMlConversionFactors[unitA] / volumeToMlConversionFactors[unitB]
	);
};

const calculateConversionFactorFromWeightUnitAToVolumeUnitB = (
	unitA: WeightUnitDto,
	unitB: VolumeUnitDto,
	weightToVolumeConversionFactor: number,
	conversionWeightUnit: WeightUnitDto,
	conversionVolumeUnit: VolumeUnitDto,
) => {
	return (
		calculateConversionFactorFromWeightUnitAToB(unitA, conversionWeightUnit) *
		weightToVolumeConversionFactor *
		calculateConversionFactorFromVolumeUnitAToB(conversionVolumeUnit, unitB)
	);
};

const calculateConversionFactorFromWeightUnitAToB = (
	unitA: WeightUnitDto,
	unitB: WeightUnitDto,
) => {
	return (
		weightToGramConversionFactors[unitA] / weightToGramConversionFactors[unitB]
	);
};

const calculateConversionFactorFromVolumeUnitAToWeightUnitB = (
	unitA: VolumeUnitDto,
	unitB: WeightUnitDto,
	weightToVolumeConversionFactor: number,
	conversionWeightUnit: WeightUnitDto,
	conversionVolumeUnit: VolumeUnitDto,
) => {
	return (
		(calculateConversionFactorFromVolumeUnitAToB(unitA, conversionVolumeUnit) /
			weightToVolumeConversionFactor) *
		calculateConversionFactorFromWeightUnitAToB(conversionWeightUnit, unitB)
	);
};

const calculateConversionFactorFromUnitAToB = (
	ingredient: IngredientDto,
	unitA: GenericUnitDto,
	unitB: GenericUnitDto,
	errorContext: string[],
): number | undefined => {
	if (isWeightUnit(unitA) && isWeightUnit(unitB)) {
		return calculateConversionFactorFromWeightUnitAToB(unitA, unitB);
	}

	if (isVolumeUnit(unitA) && isVolumeUnit(unitB)) {
		return calculateConversionFactorFromVolumeUnitAToB(unitA, unitB);
	}

	if (ingredient.weightToVolumeConversionFactor === undefined) {
		errorContext.push("Weight to volume conversion factor is undefined.");
		return undefined;
	}

	if (ingredient.weightToVolumeConversionFactor <= 0) {
		errorContext.push("Weight to volume conversion factor must be positive.");
		return undefined;
	}

	if (ingredient.conversionWeightUnit === undefined) {
		errorContext.push("Conversion weight unit is undefined.");
		return undefined;
	}

	if (ingredient.conversionVolumeUnit === undefined) {
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
	ingredient: IngredientDto,
	defaultUnit: GenericUnitDto | undefined,
	customUnit: CustomUnitDto | undefined,
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

	if (customUnit.conversionUnit === undefined) {
		errorContext.push("Conversion unit is undefined.");
		return undefined;
	}

	if (customUnit.customUnitToConversionUnitFactor === undefined) {
		errorContext.push("Conversion unit to custom unit factor is undefined.");
		return undefined;
	}

	if (customUnit.customUnitToConversionUnitFactor <= 0) {
		errorContext.push(
			"Conversion unit to custom unit factor must be positive.",
		);
		return undefined;
	}

	const factor = calculateConversionFactorFromUnitAToB(
		ingredient,
		defaultUnit,
		customUnit.conversionUnit,
		errorContext,
	);

	return factor !== undefined
		? factor / customUnit.customUnitToConversionUnitFactor
		: undefined;
};

const calculateConversionFactorFromDefaultUnitToUnit = (
	ingredient: IngredientDto,
	defaultUnit: GenericUnitDto | undefined,
	targetUnit: string,
	errorContext: string[],
) => {
	if (defaultUnit === undefined) {
		errorContext.push("Default unit is undefined.");
		return undefined;
	}

	return isGenericUnit(targetUnit)
		? calculateConversionFactorFromUnitAToB(
				ingredient,
				defaultUnit,
				targetUnit,
				errorContext,
			)
		: calculateConversionFactorFromDefaultUnitToCustomUnit(
				ingredient,
				defaultUnit,
				findCustomUnit(ingredient.customUnits ?? [], targetUnit, errorContext),
				errorContext,
			);
};

const calculateConversionFactorFromUnitToUnit = (
	ingredient: IngredientDto,
	defaultUnit: GenericUnitDto | undefined,
	sourceUnit: string,
	targetUnit: string,
	errorContext: string[],
) => {
	const sourceFactor = calculateConversionFactorFromDefaultUnitToUnit(
		ingredient,
		defaultUnit,
		sourceUnit,
		errorContext,
	);
	const targetFactor = calculateConversionFactorFromDefaultUnitToUnit(
		ingredient,
		defaultUnit,
		targetUnit,
		errorContext,
	);

	return sourceFactor !== undefined && targetFactor !== undefined
		? targetFactor / sourceFactor
		: undefined;
};

export {
	calculateConversionFactorFromDefaultUnitToCustomUnit,
	calculateConversionFactorFromDefaultUnitToUnit,
	calculateConversionFactorFromUnitToUnit,
};
