package net.fuzzyhome.home.constants;

import org.jspecify.annotations.NonNull;

public enum VolumeUnit implements Unit {
    MILLILITER,
    LITER,
    FLUID_OUNCE,
    TEASPOON,
    TABLESPOON,
    CUP;

    /**
     * This method ensures that any VolumeUnit exists as a GenericUnit. If not, this leads to a compilation error.
     */
    @NonNull
    @SuppressWarnings("unused")
    private GenericUnit getGenericUnit() {
        return switch (this) {
            case MILLILITER -> GenericUnit.MILLILITER;
            case LITER -> GenericUnit.LITER;
            case FLUID_OUNCE -> GenericUnit.FLUID_OUNCE;
            case TEASPOON -> GenericUnit.TEASPOON;
            case TABLESPOON -> GenericUnit.TABLESPOON;
            case CUP -> GenericUnit.CUP;
        };
    }
}
