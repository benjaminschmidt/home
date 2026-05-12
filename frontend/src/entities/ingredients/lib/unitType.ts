import type {
	GenericUnitDtoRoot,
	VolumeUnitDtoRoot,
	WeightUnitDtoRoot,
} from "home-api/dist/src";

const genericUnitDtoRootObject: Record<GenericUnitDtoRoot, undefined> = {
	GRAM: undefined,
	MILLIGRAM: undefined,
	KILOGRAM: undefined,
	OUNCE: undefined,
	POUND: undefined,
	MILLILITER: undefined,
	LITER: undefined,
	FLUID_OUNCE: undefined,
	TEASPOON: undefined,
	TABLESPOON: undefined,
	CUP: undefined,
};
const genericUnitDtoRootArray = Object.keys(genericUnitDtoRootObject);

const volumeUnitDtoRootObject: Record<VolumeUnitDtoRoot, undefined> = {
	MILLILITER: undefined,
	LITER: undefined,
	FLUID_OUNCE: undefined,
	TEASPOON: undefined,
	TABLESPOON: undefined,
	CUP: undefined,
};
const volumeUnitDtoRootArray = Object.keys(volumeUnitDtoRootObject);

const weightUnitDtoRootObject: Record<WeightUnitDtoRoot, undefined> = {
	GRAM: undefined,
	MILLIGRAM: undefined,
	KILOGRAM: undefined,
	OUNCE: undefined,
	POUND: undefined,
};
const weightUnitDtoRootArray = Object.keys(weightUnitDtoRootObject);

const isGenericUnit = (value: string): value is GenericUnitDtoRoot =>
	genericUnitDtoRootArray.includes(value);

const isVolumeUnit = (value: string): value is VolumeUnitDtoRoot =>
	volumeUnitDtoRootArray.includes(value);

const isWeightUnit = (value: string): value is WeightUnitDtoRoot =>
	weightUnitDtoRootArray.includes(value);

export { isGenericUnit, isVolumeUnit, isWeightUnit };
