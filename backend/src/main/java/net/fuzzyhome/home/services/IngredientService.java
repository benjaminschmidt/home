package net.fuzzyhome.home.services;

import java.util.List;
import java.util.UUID;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.openapitools.model.CustomUnitDto;
import org.openapitools.model.IngredientDto;
import org.openapitools.model.IngredientVariantDto;

public interface IngredientService {
    @NonNull
    List<IngredientDto> getAllIngredients(
        @NonNull final Integer page,
        @NonNull final Integer size,
        @Nullable final String search
    );

    @NonNull
    IngredientDto createIngredient(@NonNull final IngredientDto ingredientDto);

    @NonNull
    IngredientDto getIngredientById(@NonNull final UUID ingredientId);

    @NonNull
    IngredientDto updateIngredient(@NonNull final UUID ingredientId, @NonNull final IngredientDto ingredientDto);

    void deleteIngredient(@NonNull final UUID ingredientId);

    @NonNull
    List<IngredientVariantDto> getIngredientVariantsByIngredientId(@NonNull final UUID ingredientId);

    @NonNull
    IngredientVariantDto addIngredientVariantToIngredient(
        @NonNull final UUID ingredientId,
        @NonNull final IngredientVariantDto ingredientVariantDto
    );

    @NonNull
    IngredientVariantDto getIngredientVariantById(@NonNull final UUID ingredientId, @NonNull final UUID variantId);

    @NonNull
    IngredientVariantDto updateIngredientVariant(
        @NonNull final UUID ingredientId,
        @NonNull final UUID variantId,
        @NonNull final IngredientVariantDto ingredientVariantDto
    );

    void deleteIngredientVariant(@NonNull final UUID ingredientId, @NonNull final UUID variantId);

    @NonNull
    List<CustomUnitDto> getCustomUnitsByIngredientId(@NonNull final UUID ingredientId);

    @NonNull
    CustomUnitDto addCustomUnitToIngredient(
        @NonNull final UUID ingredientId,
        @NonNull final CustomUnitDto customUnitDto
    );

    @NonNull CustomUnitDto getCustomUnitById(@NonNull final UUID ingredientId, @NonNull final UUID unitId);

    @NonNull
    CustomUnitDto updateCustomUnit(
        @NonNull final UUID ingredientId,
        @NonNull final UUID unitId,
        @NonNull final CustomUnitDto customUnitDto
    );

    void deleteCustomUnit(@NonNull final UUID ingredientId, @NonNull final UUID unitId);
}
