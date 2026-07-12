import type {
	CustomUnitDto,
	GenericUnitDto,
	VolumeUnitDto,
	WeightUnitDto,
} from "home-api";

type Ingredient = {
	name: string;
	description?: string;
	servingSize?: number;
	unit?: string;
	defaultUnit?: GenericUnitDto;
	weightToVolumeConversionFactor?: number;
	conversionWeightUnit?: WeightUnitDto;
	conversionVolumeUnit?: VolumeUnitDto;
	customUnits: CustomUnitDto[];
	calories?: number;
	carbohydrate?: number;
	fat?: number;
	protein?: number;
	saturatedFat?: number;
	sodium?: number;
	sugar?: number;
};

export type { Ingredient };
