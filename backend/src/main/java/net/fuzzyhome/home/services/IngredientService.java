package net.fuzzyhome.home.services;

import java.util.List;
import java.util.UUID;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.openapitools.model.CustomUnitDto;
import org.openapitools.model.CustomUnitWriteRequest;
import org.openapitools.model.IngredientDto;
import org.openapitools.model.IngredientVariantDto;
import org.openapitools.model.IngredientVariantWriteRequest;
import org.openapitools.model.IngredientWriteRequest;

public interface IngredientService {
    @NonNull
    List<IngredientDto> getAllIngredients(
        @NonNull final Integer page,
        @NonNull final Integer size,
        @Nullable final String search
    );

    @NonNull
    IngredientDto createIngredient(@NonNull final IngredientWriteRequest ingredientWriteRequest);

    @NonNull
    IngredientDto getIngredientById(@NonNull final UUID ingredientId);

    @NonNull
    IngredientDto updateIngredient(
        @NonNull final UUID ingredientId,
        @NonNull final IngredientWriteRequest ingredientWriteRequest
    );

    void deleteIngredient(@NonNull final UUID ingredientId);

    @NonNull
    List<IngredientVariantDto> getIngredientVariantsByIngredientId(@NonNull final UUID ingredientId);

    @NonNull
    IngredientVariantDto addIngredientVariantToIngredient(
        @NonNull final UUID ingredientId,
        @NonNull final IngredientVariantWriteRequest ingredientVariantWriteRequest
    );

    @NonNull
    IngredientVariantDto getIngredientVariantById(@NonNull final UUID ingredientId, @NonNull final UUID variantId);

    @NonNull
    IngredientVariantDto updateIngredientVariant(
        @NonNull final UUID ingredientId,
        @NonNull final UUID variantId,
        @NonNull final IngredientVariantWriteRequest ingredientVariantWriteRequest
    );

    void deleteIngredientVariant(@NonNull final UUID ingredientId, @NonNull final UUID variantId);

    @NonNull
    List<CustomUnitDto> getCustomUnitsByIngredientId(@NonNull final UUID ingredientId);

    @NonNull
    CustomUnitDto addCustomUnitToIngredient(
        @NonNull final UUID ingredientId,
        @NonNull final CustomUnitWriteRequest customUnitWriteRequest
    );

    @NonNull CustomUnitDto getCustomUnitById(@NonNull final UUID ingredientId, @NonNull final UUID unitId);

    @NonNull
    CustomUnitDto updateCustomUnit(
        @NonNull final UUID ingredientId,
        @NonNull final UUID unitId,
        @NonNull final CustomUnitWriteRequest customUnitWriteRequest
    );

    void deleteCustomUnit(@NonNull final UUID ingredientId, @NonNull final UUID unitId);
}
