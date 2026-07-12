import type { CustomUnitDto, GenericUnitDto } from "home-api";
import { formatUnit } from "@/entities/ingredients/lib/formatUnit.ts";
import {
	isVolumeUnit,
	isWeightUnit,
	volumeUnitDtoArray,
	weightUnitDtoArray,
} from "@/entities/ingredients/lib/unitType.ts";
import type { Ingredient } from "@/entities/ingredients/model/ingredient.ts";

type UnitOption = {
	key: string;
	value: string;
	displayText: string;
};

type UnitOptions = {
	weight: UnitOption[];
	volume: UnitOption[];
	custom: UnitOption[];
};

const mapUnitToOption = (unit: string): UnitOption => ({
	key: unit,
	value: unit,
	displayText: formatUnit(unit) ?? unit,
});

const emptyUnitOptions: UnitOptions = {
	weight: [],
	volume: [],
	custom: [],
};

const hasWeightVolumeConversion = (ingredient: Ingredient) =>
	ingredient.weightToVolumeConversionFactor !== undefined &&
	ingredient.weightToVolumeConversionFactor > 0 &&
	ingredient.conversionWeightUnit !== undefined &&
	ingredient.conversionVolumeUnit !== undefined;

const canConvertGenericUnit = (
	ingredient: Ingredient,
	defaultUnit: GenericUnitDto,
	targetUnit: GenericUnitDto,
) => {
	if (isWeightUnit(defaultUnit) && isWeightUnit(targetUnit)) return true;
	if (isVolumeUnit(defaultUnit) && isVolumeUnit(targetUnit)) return true;

	return hasWeightVolumeConversion(ingredient);
};

const canConvertCustomUnit = (
	ingredient: Ingredient,
	defaultUnit: GenericUnitDto,
	customUnit: CustomUnitDto,
) =>
	customUnit.conversionUnit !== undefined &&
	customUnit.customUnitToConversionUnitFactor !== undefined &&
	customUnit.customUnitToConversionUnitFactor > 0 &&
	canConvertGenericUnit(ingredient, defaultUnit, customUnit.conversionUnit);

const getUnitOptions = (ingredient: Ingredient): UnitOptions => {
	if (ingredient.defaultUnit === undefined) return emptyUnitOptions;

	const defaultUnit = ingredient.defaultUnit;

	return {
		weight: weightUnitDtoArray
			.filter((unit) => canConvertGenericUnit(ingredient, defaultUnit, unit))
			.map(mapUnitToOption),
		volume: volumeUnitDtoArray
			.filter((unit) => canConvertGenericUnit(ingredient, defaultUnit, unit))
			.map(mapUnitToOption),
		custom: ingredient.customUnits
			.filter((customUnit) =>
				canConvertCustomUnit(ingredient, defaultUnit, customUnit),
			)
			.map((customUnit) => ({
				key: customUnit.name,
				value: customUnit.name,
				displayText: customUnit.name,
			})),
	};
};

export { getUnitOptions };
