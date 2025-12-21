package net.fuzzyhome.home.database.enums;

import org.jspecify.annotations.NonNull;

public enum GenericUnit implements Unit {
    GRAM,
    MILLIGRAM,
    KILOGRAM,
    OUNCE,
    POUND,
    MILLILITER,
    LITER,
    FLUID_OUNCE,
    TEASPOON,
    TABLESPOON,
    CUP;

    /**
     * This method ensures that any GenericUnit is either a VolumeUnit or WeightUnit as well.
     * If not, this leads to a compilation error.
     */
    @NonNull
    @SuppressWarnings("unused")
    private Unit getSpecificUnit() {
        return switch (this) {
            case GRAM -> WeightUnit.GRAM;
            case MILLIGRAM -> WeightUnit.MILLIGRAM;
            case KILOGRAM -> WeightUnit.KILOGRAM;
            case OUNCE -> WeightUnit.OUNCE;
            case POUND -> WeightUnit.POUND;
            case MILLILITER -> VolumeUnit.MILLILITER;
            case LITER -> VolumeUnit.LITER;
            case FLUID_OUNCE -> VolumeUnit.FLUID_OUNCE;
            case TEASPOON -> VolumeUnit.TEASPOON;
            case TABLESPOON -> VolumeUnit.TABLESPOON;
            case CUP -> VolumeUnit.CUP;
        };
    }
}
