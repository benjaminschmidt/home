package net.fuzzyhome.home.services.mappers;

import lombok.RequiredArgsConstructor;
import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import org.jspecify.annotations.NonNull;
import org.openapitools.model.IngredientVariantDto;
import org.openapitools.model.IngredientVariantWriteRequest;
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
    public IngredientVariant mapWriteRequestToIngredientVariant(
        @NonNull final IngredientVariantWriteRequest ingredientVariantWriteRequest,
        @NonNull final Ingredient ingredient
    ) {
        return IngredientVariant.builder()
            .description(ingredientVariantWriteRequest.getDescription())
            .defaultVariant(ingredientVariantWriteRequest.getDefaultVariant())
            .unit(UnitUtils.mapDtoToGenericUnit(ingredientVariantWriteRequest.getUnit()))
            .servingSize(ingredientVariantWriteRequest.getServingSize())
            .calories(ingredientVariantWriteRequest.getCalories())
            .carbohydrate(ingredientVariantWriteRequest.getCarbohydrate())
            .fat(ingredientVariantWriteRequest.getFat())
            .protein(ingredientVariantWriteRequest.getProtein())
            .saturatedFat(ingredientVariantWriteRequest.getSaturatedFat())
            .sodium(ingredientVariantWriteRequest.getSodium())
            .sugar(ingredientVariantWriteRequest.getSugar())
            .ingredient(ingredient)
            .build();
    }

    @NonNull
    public IngredientVariant updateIngredientVariantFromWriteRequest(
        @NonNull final IngredientVariant ingredientVariant,
        @NonNull final IngredientVariantWriteRequest ingredientVariantWriteRequest
    ) {
        ingredientVariant.setDescription(ingredientVariantWriteRequest.getDescription());
        ingredientVariant.setDefaultVariant(ingredientVariantWriteRequest.getDefaultVariant());
        ingredientVariant.setUnit(UnitUtils.mapDtoToGenericUnit(ingredientVariantWriteRequest.getUnit()));
        ingredientVariant.setServingSize(ingredientVariantWriteRequest.getServingSize());
        ingredientVariant.setCalories(ingredientVariantWriteRequest.getCalories());
        ingredientVariant.setCarbohydrate(ingredientVariantWriteRequest.getCarbohydrate());
        ingredientVariant.setFat(ingredientVariantWriteRequest.getFat());
        ingredientVariant.setProtein(ingredientVariantWriteRequest.getProtein());
        ingredientVariant.setSaturatedFat(ingredientVariantWriteRequest.getSaturatedFat());
        ingredientVariant.setSodium(ingredientVariantWriteRequest.getSodium());
        ingredientVariant.setSugar(ingredientVariantWriteRequest.getSugar());

        return ingredientVariant;
    }
}
