package net.fuzzyhome.home.services.mappers;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import net.fuzzyhome.home.database.entities.CustomUnit;
import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import net.fuzzyhome.home.services.EntityToDtoMatcher;
import org.jspecify.annotations.NonNull;
import org.openapitools.model.CustomUnitDto;
import org.openapitools.model.IngredientDto;
import org.openapitools.model.IngredientVariantDto;
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
    public Ingredient mapDtoToIngredient(@NonNull final IngredientDto ingredientDto) {
        final var ingredient = Ingredient.builder()
            .name(ingredientDto.getName())
            .weightToVolumeConversionFactor(ingredientDto.getWeightToVolumeConversionFactor())
            .conversionWeightUnit(UnitUtils.mapDtoToWeightUnit(ingredientDto.getConversionWeightUnit()))
            .conversionVolumeUnit(UnitUtils.mapDtoToVolumeUnit(ingredientDto.getConversionVolumeUnit()))
            .build();
        ingredient.setIngredientVariants(Optional.ofNullable(ingredientDto.getIngredientVariants())
            .orElse(List.of())
            .stream()
            .map(ingredientVariantDto -> ingredientVariantMapper.mapDtoToIngredientVariant(
                ingredientVariantDto,
                ingredient
            ))
            .toList());
        ingredient.setCustomUnits(Optional.ofNullable(ingredientDto.getCustomUnits())
            .orElse(List.of())
            .stream()
            .map(customUnitDto -> customUnitMapper.mapDtoToCustomUnit(customUnitDto, ingredient))
            .toList());
        return ingredient;
    }

    @NonNull
    public Ingredient updateIngredientFromDto(
        @NonNull final Ingredient ingredient,
        @NonNull final IngredientDto ingredientDto
    ) {
        ingredient.setName(ingredientDto.getName());
        ingredient.setWeightToVolumeConversionFactor(ingredientDto.getWeightToVolumeConversionFactor());
        ingredient.setConversionWeightUnit(UnitUtils.mapDtoToWeightUnit(ingredientDto.getConversionWeightUnit()));
        ingredient.setConversionVolumeUnit(UnitUtils.mapDtoToVolumeUnit(ingredientDto.getConversionVolumeUnit()));

        final var matchedIngredients = new EntityToDtoMatcher<>(
            Optional.ofNullable(ingredient.getIngredientVariants()).orElse(List.of()),
            IngredientVariant::getDescription,
            Optional.ofNullable(ingredientDto.getIngredientVariants()).orElse(List.of()),
            IngredientVariantDto::getDescription
        );
        ingredient.getIngredientVariants().removeAll(matchedIngredients.getEntitiesToDelete());
        matchedIngredients.getEntitiesToUpdate()
            .forEach(pair -> ingredientVariantMapper.updateIngredientVariantFromDto(pair.getFirst(), pair.getSecond()));
        matchedIngredients.getDtosToCreate()
            .stream()
            .map(ingredientVariantDto -> ingredientVariantMapper.mapDtoToIngredientVariant(
                ingredientVariantDto,
                ingredient
            ))
            .forEach(ingredient.getIngredientVariants()::add);

        final var matchedUnits = new EntityToDtoMatcher<>(
            Optional.ofNullable(ingredient.getCustomUnits()).orElse(List.of()),
            CustomUnit::getName,
            Optional.ofNullable(ingredientDto.getCustomUnits()).orElse(List.of()),
            CustomUnitDto::getName
        );
        ingredient.getCustomUnits().removeAll(matchedUnits.getEntitiesToDelete());
        matchedUnits.getEntitiesToUpdate()
            .forEach(pair -> customUnitMapper.updateCustomUnitFromDto(pair.getFirst(), pair.getSecond()));
        matchedUnits.getDtosToCreate()
            .stream()
            .map(customUnitDto -> customUnitMapper.mapDtoToCustomUnit(customUnitDto, ingredient))
            .forEach(ingredient.getCustomUnits()::add);

        return ingredient;
    }
}
