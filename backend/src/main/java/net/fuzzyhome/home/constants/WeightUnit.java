package net.fuzzyhome.home.constants;

import org.jspecify.annotations.NonNull;

public enum WeightUnit implements Unit {
    GRAM,
    MILLIGRAM,
    KILOGRAM,
    OUNCE,
    POUND;

    /**
     * This method ensures that any WeightUnit exists as a GenericUnit. If not, this leads to a compilation error.
     */
    @NonNull
    @SuppressWarnings("unused")
    private GenericUnit getGenericUnit() {
        return switch (this) {
            case GRAM -> GenericUnit.GRAM;
            case MILLIGRAM -> GenericUnit.MILLIGRAM;
            case KILOGRAM -> GenericUnit.KILOGRAM;
            case OUNCE -> GenericUnit.OUNCE;
            case POUND -> GenericUnit.POUND;
        };
    }
}
