package net.fuzzyhome.home.services.mappers;

import net.fuzzyhome.home.database.enums.GenericUnit;
import net.fuzzyhome.home.database.enums.VolumeUnit;
import net.fuzzyhome.home.database.enums.WeightUnit;
import org.jspecify.annotations.Nullable;
import org.openapitools.model.GenericUnitDto;
import org.openapitools.model.VolumeUnitDto;
import org.openapitools.model.WeightUnitDto;

public class UnitUtils {

    @Nullable
    public static GenericUnitDto mapGenericUnitToDto(@Nullable final GenericUnit genericUnit) {
        return switch (genericUnit) {
            case GRAM -> GenericUnitDto.GRAM;
            case MILLIGRAM -> GenericUnitDto.MILLIGRAM;
            case KILOGRAM -> GenericUnitDto.KILOGRAM;
            case OUNCE -> GenericUnitDto.OUNCE;
            case POUND -> GenericUnitDto.POUND;
            case MILLILITER -> GenericUnitDto.MILLILITER;
            case LITER -> GenericUnitDto.LITER;
            case FLUID_OUNCE -> GenericUnitDto.FLUID_OUNCE;
            case TEASPOON -> GenericUnitDto.TEASPOON;
            case TABLESPOON -> GenericUnitDto.TABLESPOON;
            case CUP -> GenericUnitDto.CUP;
            case null -> null;
        };
    }

    @Nullable
    @SuppressWarnings("Duplicates")
    public static GenericUnit mapDtoToGenericUnit(@Nullable final GenericUnitDto genericUnitDto) {
        return switch (genericUnitDto) {
            case GRAM -> GenericUnit.GRAM;
            case MILLIGRAM -> GenericUnit.MILLIGRAM;
            case KILOGRAM -> GenericUnit.KILOGRAM;
            case OUNCE -> GenericUnit.OUNCE;
            case POUND -> GenericUnit.POUND;
            case MILLILITER -> GenericUnit.MILLILITER;
            case LITER -> GenericUnit.LITER;
            case FLUID_OUNCE -> GenericUnit.FLUID_OUNCE;
            case TEASPOON -> GenericUnit.TEASPOON;
            case TABLESPOON -> GenericUnit.TABLESPOON;
            case CUP -> GenericUnit.CUP;
            case null -> null;
        };
    }

    @Nullable
    public static VolumeUnitDto mapVolumeUnitToDto(@Nullable final VolumeUnit volumeUnit) {
        return switch (volumeUnit) {
            case MILLILITER -> VolumeUnitDto.MILLILITER;
            case LITER -> VolumeUnitDto.LITER;
            case FLUID_OUNCE -> VolumeUnitDto.FLUID_OUNCE;
            case TEASPOON -> VolumeUnitDto.TEASPOON;
            case TABLESPOON -> VolumeUnitDto.TABLESPOON;
            case CUP -> VolumeUnitDto.CUP;
            case null -> null;
        };
    }

    @Nullable
    @SuppressWarnings("Duplicates")
    public static VolumeUnit mapDtoToVolumeUnit(@Nullable final VolumeUnitDto volumeUnitDto) {
        return switch (volumeUnitDto) {
            case MILLILITER -> VolumeUnit.MILLILITER;
            case LITER -> VolumeUnit.LITER;
            case FLUID_OUNCE -> VolumeUnit.FLUID_OUNCE;
            case TEASPOON -> VolumeUnit.TEASPOON;
            case TABLESPOON -> VolumeUnit.TABLESPOON;
            case CUP -> VolumeUnit.CUP;
            case null -> null;
        };
    }

    @Nullable
    public static WeightUnitDto mapWeightUnitToDto(@Nullable final WeightUnit weightUnit) {
        return switch (weightUnit) {
            case GRAM -> WeightUnitDto.GRAM;
            case MILLIGRAM -> WeightUnitDto.MILLIGRAM;
            case KILOGRAM -> WeightUnitDto.KILOGRAM;
            case OUNCE -> WeightUnitDto.OUNCE;
            case POUND -> WeightUnitDto.POUND;
            case null -> null;
        };
    }

    @Nullable
    public static WeightUnit mapDtoToWeightUnit(@Nullable final WeightUnitDto weightUnitDto) {
        return switch (weightUnitDto) {
            case GRAM -> WeightUnit.GRAM;
            case MILLIGRAM -> WeightUnit.MILLIGRAM;
            case KILOGRAM -> WeightUnit.KILOGRAM;
            case OUNCE -> WeightUnit.OUNCE;
            case POUND -> WeightUnit.POUND;
            case null -> null;
        };
    }
}
