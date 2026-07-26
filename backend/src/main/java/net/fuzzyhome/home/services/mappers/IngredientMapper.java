package net.fuzzyhome.home.services.mappers;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import net.fuzzyhome.home.database.entities.CustomUnit;
import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import net.fuzzyhome.home.services.EntityToDtoMatcher;
import org.jspecify.annotations.NonNull;
import org.openapitools.model.CustomUnitWriteRequest;
import org.openapitools.model.IngredientDto;
import org.openapitools.model.IngredientVariantWriteRequest;
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
        final var ingredient = Ingredient.builder()
            .name(ingredientWriteRequest.getName())
            .weightToVolumeConversionFactor(ingredientWriteRequest.getWeightToVolumeConversionFactor())
            .conversionWeightUnit(UnitUtils.mapDtoToWeightUnit(ingredientWriteRequest.getConversionWeightUnit()))
            .conversionVolumeUnit(UnitUtils.mapDtoToVolumeUnit(ingredientWriteRequest.getConversionVolumeUnit()))
            .build();
        ingredient.setIngredientVariants(ingredientWriteRequest.getIngredientVariants()
            .stream()
            .map(ingredientVariantWriteRequest -> ingredientVariantMapper.mapWriteRequestToIngredientVariant(
                ingredientVariantWriteRequest,
                ingredient
            ))
            .toList());
        ingredient.setCustomUnits(ingredientWriteRequest.getCustomUnits()
            .stream()
            .map(customUnitWriteRequest -> customUnitMapper.mapWriteRequestToCustomUnit(
                customUnitWriteRequest,
                ingredient
            ))
            .toList());
        return ingredient;
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

        final var matchedIngredients = new EntityToDtoMatcher<>(
            Optional.ofNullable(ingredient.getIngredientVariants()).orElse(List.of()),
            IngredientVariant::getDescription,
            ingredientWriteRequest.getIngredientVariants(),
            IngredientVariantWriteRequest::getDescription
        );
        ingredient.getIngredientVariants().removeAll(matchedIngredients.getEntitiesToDelete());
        matchedIngredients.getEntitiesToUpdate()
            .forEach(pair -> ingredientVariantMapper.updateIngredientVariantFromWriteRequest(
                pair.getFirst(),
                pair.getSecond()
            ));
        matchedIngredients.getDtosToCreate()
            .stream()
            .map(variantWriteRequest -> ingredientVariantMapper.mapWriteRequestToIngredientVariant(
                variantWriteRequest,
                ingredient
            ))
            .forEach(ingredient.getIngredientVariants()::add);

        final var matchedUnits = new EntityToDtoMatcher<>(
            Optional.ofNullable(ingredient.getCustomUnits()).orElse(List.of()),
            CustomUnit::getName,
            ingredientWriteRequest.getCustomUnits(),
            CustomUnitWriteRequest::getName
        );
        ingredient.getCustomUnits().removeAll(matchedUnits.getEntitiesToDelete());
        matchedUnits.getEntitiesToUpdate()
            .forEach(pair -> customUnitMapper.updateCustomUnitFromWriteRequest(pair.getFirst(), pair.getSecond()));
        matchedUnits.getDtosToCreate()
            .stream()
            .map(unitWriteRequest -> customUnitMapper.mapWriteRequestToCustomUnit(unitWriteRequest, ingredient))
            .forEach(ingredient.getCustomUnits()::add);

        return ingredient;
    }
}
