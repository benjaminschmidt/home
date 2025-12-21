package net.fuzzyhome.home.services.mappers;

import lombok.RequiredArgsConstructor;
import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import org.jspecify.annotations.NonNull;
import org.openapitools.model.IngredientVariantDto;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class IngredientVariantMapper {

    @NonNull
    public IngredientVariantDto mapIngredientVariantToDto(@NonNull final IngredientVariant ingredientVariant) {
        return IngredientVariantDto.builder()
            .id(ingredientVariant.getId())
            .description(ingredientVariant.getDescription())
            .defaultVariant(ingredientVariant.getDefaultVariant())
            .unit(UnitUtils.mapGenericUnitToDto(ingredientVariant.getUnit()))
            .servingSize(ingredientVariant.getServingSize())
            .calories(ingredientVariant.getCalories())
            .carbohydrate(ingredientVariant.getCarbohydrate())
            .fat(ingredientVariant.getFat())
            .protein(ingredientVariant.getProtein())
            .saturatedFat(ingredientVariant.getSaturatedFat())
            .sodium(ingredientVariant.getSodium())
            .sugar(ingredientVariant.getSugar())
            .build();
    }

    @NonNull
    public IngredientVariant mapDtoToIngredientVariant(
        @NonNull final IngredientVariantDto ingredientVariantDto,
        @NonNull final Ingredient ingredient
    ) {
        return IngredientVariant.builder()
            .description(ingredientVariantDto.getDescription())
            .defaultVariant(ingredientVariantDto.getDefaultVariant())
            .unit(UnitUtils.mapDtoToGenericUnit(ingredientVariantDto.getUnit()))
            .servingSize(ingredientVariantDto.getServingSize())
            .calories(ingredientVariantDto.getCalories())
            .carbohydrate(ingredientVariantDto.getCarbohydrate())
            .fat(ingredientVariantDto.getFat())
            .protein(ingredientVariantDto.getProtein())
            .saturatedFat(ingredientVariantDto.getSaturatedFat())
            .sodium(ingredientVariantDto.getSodium())
            .sugar(ingredientVariantDto.getSugar())
            .ingredient(ingredient)
            .build();
    }

    @NonNull
    public IngredientVariant updateIngredientVariantFromDto(
        @NonNull final IngredientVariant ingredientVariant,
        @NonNull final IngredientVariantDto ingredientVariantDto
    ) {
        ingredientVariant.setDescription(ingredientVariantDto.getDescription());
        ingredientVariant.setDefaultVariant(ingredientVariantDto.getDefaultVariant());
        ingredientVariant.setUnit(UnitUtils.mapDtoToGenericUnit(ingredientVariantDto.getUnit()));
        ingredientVariant.setServingSize(ingredientVariantDto.getServingSize());
        ingredientVariant.setCalories(ingredientVariantDto.getCalories());
        ingredientVariant.setCarbohydrate(ingredientVariantDto.getCarbohydrate());
        ingredientVariant.setFat(ingredientVariantDto.getFat());
        ingredientVariant.setProtein(ingredientVariantDto.getProtein());
        ingredientVariant.setSaturatedFat(ingredientVariantDto.getSaturatedFat());
        ingredientVariant.setSodium(ingredientVariantDto.getSodium());
        ingredientVariant.setSugar(ingredientVariantDto.getSugar());

        return ingredientVariant;
    }
}
