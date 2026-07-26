package net.fuzzyhome.home.services.mappers;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import net.fuzzyhome.home.database.entities.Ingredient;
import org.jspecify.annotations.NonNull;
import org.openapitools.model.IngredientDto;
import org.openapitools.model.IngredientWriteRequest;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class IngredientMapper {

    private final CustomUnitMapper customUnitMapper;
    private final IngredientVariantMapper ingredientVariantMapper;

    @NonNull
    public IngredientDto mapIngredientToDto(@NonNull final Ingredient ingredient) {
        return IngredientDto.builder()
            .id(ingredient.getId())
            .name(ingredient.getName())
            .weightToVolumeConversionFactor(ingredient.getWeightToVolumeConversionFactor())
            .conversionWeightUnit(UnitUtils.mapWeightUnitToDto(ingredient.getConversionWeightUnit()))
            .conversionVolumeUnit(UnitUtils.mapVolumeUnitToDto(ingredient.getConversionVolumeUnit()))
            .ingredientVariants(Optional.ofNullable(ingredient.getIngredientVariants())
                .orElse(List.of())
                .stream()
                .map(ingredientVariantMapper::mapIngredientVariantToDto)
                .toList())
            .customUnits(Optional.ofNullable(ingredient.getCustomUnits())
                .orElse(List.of())
                .stream()
                .map(customUnitMapper::mapCustomUnitToDto)
                .toList())
            .build();
    }

    @NonNull
    public Ingredient mapWriteRequestToIngredient(@NonNull final IngredientWriteRequest ingredientWriteRequest) {
        return Ingredient.builder()
            .name(ingredientWriteRequest.getName())
            .weightToVolumeConversionFactor(ingredientWriteRequest.getWeightToVolumeConversionFactor())
            .conversionWeightUnit(UnitUtils.mapDtoToWeightUnit(ingredientWriteRequest.getConversionWeightUnit()))
            .conversionVolumeUnit(UnitUtils.mapDtoToVolumeUnit(ingredientWriteRequest.getConversionVolumeUnit()))
            .build();
    }

    @NonNull
    public Ingredient updateIngredientFromWriteRequest(
        @NonNull final Ingredient ingredient,
        @NonNull final IngredientWriteRequest ingredientWriteRequest
    ) {
        ingredient.setName(ingredientWriteRequest.getName());
        ingredient.setWeightToVolumeConversionFactor(ingredientWriteRequest.getWeightToVolumeConversionFactor());
        ingredient.setConversionWeightUnit(
            UnitUtils.mapDtoToWeightUnit(ingredientWriteRequest.getConversionWeightUnit())
        );
        ingredient.setConversionVolumeUnit(
            UnitUtils.mapDtoToVolumeUnit(ingredientWriteRequest.getConversionVolumeUnit())
        );
        return ingredient;
    }
}
