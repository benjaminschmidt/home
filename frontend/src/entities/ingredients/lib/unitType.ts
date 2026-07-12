import type {
	GenericUnitDto,
	VolumeUnitDto,
	WeightUnitDto,
} from "home-api/dist/src";

const genericUnitDtoObject: Record<GenericUnitDto, undefined> = {
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
const genericUnitDtoArray = Object.keys(
	genericUnitDtoObject,
) as GenericUnitDto[];

const volumeUnitDtoObject: Record<VolumeUnitDto, undefined> = {
	MILLILITER: undefined,
	LITER: undefined,
	FLUID_OUNCE: undefined,
	TEASPOON: undefined,
	TABLESPOON: undefined,
	CUP: undefined,
};
const volumeUnitDtoArray = Object.keys(volumeUnitDtoObject) as VolumeUnitDto[];

const weightUnitDtoObject: Record<WeightUnitDto, undefined> = {
	GRAM: undefined,
	MILLIGRAM: undefined,
	KILOGRAM: undefined,
	OUNCE: undefined,
	POUND: undefined,
};
const weightUnitDtoArray = Object.keys(weightUnitDtoObject) as WeightUnitDto[];

const isGenericUnit = (value: string): value is GenericUnitDto =>
	(genericUnitDtoArray as readonly string[]).includes(value);

const isVolumeUnit = (value: string): value is VolumeUnitDto =>
	(volumeUnitDtoArray as readonly string[]).includes(value);

const isWeightUnit = (value: string): value is WeightUnitDto =>
	(weightUnitDtoArray as readonly string[]).includes(value);

export {
	isGenericUnit,
	isVolumeUnit,
	isWeightUnit,
	volumeUnitDtoArray,
	weightUnitDtoArray,
};
