package net.fuzzyhome.home.services.mappers;

import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import net.fuzzyhome.home.database.enums.GenericUnit;
import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openapitools.model.GenericUnitDto;
import org.openapitools.model.IngredientVariantDto;

import static org.assertj.core.api.Assertions.assertThat;
import static org.instancio.Select.field;

@ExtendWith(MockitoExtension.class)
class IngredientVariantMapperTest {

    @InjectMocks
    private IngredientVariantMapper ingredientVariantMapper;

    @Test
    void maps_to_dto_field_id() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();

        // when
        final var result = ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant);

        // then
        assertThat(result).extracting(IngredientVariantDto::getId)
            .isEqualTo(ingredientVariant.getId());
    }

    @Test
    void maps_to_dto_field_description() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();

        // when
        final var result = ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant);

        // then
        assertThat(result).extracting(IngredientVariantDto::getDescription)
            .isEqualTo(ingredientVariant.getDescription());
    }

    @Test
    void maps_to_dto_field_defaultVariant() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();

        // when
        final var result = ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant);

        // then
        assertThat(result).extracting(IngredientVariantDto::getDefaultVariant)
            .isEqualTo(ingredientVariant.getDefaultVariant());
    }

    @Test
    void maps_to_dto_field_unit() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class)
            .set(field(IngredientVariant::getUnit), GenericUnit.LITER)
            .create();

        // when
        final var result = ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant);

        // then
        assertThat(result).extracting(IngredientVariantDto::getUnit)
            .isEqualTo(GenericUnitDto.LITER);
    }

    @Test
    void maps_to_dto_field_servingSize() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();

        // when
        final var result = ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant);

        // then
        assertThat(result).extracting(IngredientVariantDto::getServingSize)
            .isEqualTo(ingredientVariant.getServingSize());
    }

    @Test
    void maps_to_dto_field_calories() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();

        // when
        final var result = ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant);

        // then
        assertThat(result).extracting(IngredientVariantDto::getCalories)
            .isEqualTo(ingredientVariant.getCalories());
    }

    @Test
    void maps_to_dto_field_carbohydrate() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();

        // when
        final var result = ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant);

        // then
        assertThat(result).extracting(IngredientVariantDto::getCarbohydrate)
            .isEqualTo(ingredientVariant.getCarbohydrate());
    }

    @Test
    void maps_to_dto_field_fat() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();

        // when
        final var result = ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant);

        // then
        assertThat(result).extracting(IngredientVariantDto::getFat)
            .isEqualTo(ingredientVariant.getFat());
    }

    @Test
    void maps_to_dto_field_protein() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();

        // when
        final var result = ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant);

        // then
        assertThat(result).extracting(IngredientVariantDto::getProtein)
            .isEqualTo(ingredientVariant.getProtein());
    }

    @Test
    void maps_to_dto_field_saturatedFat() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();

        // when
        final var result = ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant);

        // then
        assertThat(result).extracting(IngredientVariantDto::getSaturatedFat)
            .isEqualTo(ingredientVariant.getSaturatedFat());
    }

    @Test
    void maps_to_dto_field_sodium() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();

        // when
        final var result = ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant);

        // then
        assertThat(result).extracting(IngredientVariantDto::getSodium)
            .isEqualTo(ingredientVariant.getSodium());
    }

    @Test
    void maps_to_dto_field_sugar() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();

        // when
        final var result = ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant);

        // then
        assertThat(result).extracting(IngredientVariantDto::getSugar)
            .isEqualTo(ingredientVariant.getSugar());
    }

    @Test
    void maps_to_entity_field_id() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getId)
            .isNull();
    }

    @Test
    void maps_to_entity_field_description() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getDescription)
            .isEqualTo(ingredientVariantDto.getDescription());
    }

    @Test
    void maps_to_entity_field_defaultVariant() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getDefaultVariant)
            .isEqualTo(ingredientVariantDto.getDefaultVariant());
    }

    @Test
    void maps_to_entity_field_unit() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class)
            .set(field(IngredientVariantDto::getUnit), GenericUnitDto.FLUID_OUNCE)
            .create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getUnit)
            .isEqualTo(GenericUnit.FLUID_OUNCE);
    }

    @Test
    void maps_to_entity_field_servingSize() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getServingSize)
            .isEqualTo(ingredientVariantDto.getServingSize());
    }

    @Test
    void maps_to_entity_field_calories() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getCalories)
            .isEqualTo(ingredientVariantDto.getCalories());
    }

    @Test
    void maps_to_entity_field_carbohydrate() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getCarbohydrate)
            .isEqualTo(ingredientVariantDto.getCarbohydrate());
    }

    @Test
    void maps_to_entity_field_fat() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getFat)
            .isEqualTo(ingredientVariantDto.getFat());
    }

    @Test
    void maps_to_entity_field_protein() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getProtein)
            .isEqualTo(ingredientVariantDto.getProtein());
    }

    @Test
    void maps_to_entity_field_saturatedFat() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getSaturatedFat)
            .isEqualTo(ingredientVariantDto.getSaturatedFat());
    }

    @Test
    void maps_to_entity_field_sodium() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getSodium)
            .isEqualTo(ingredientVariantDto.getSodium());
    }

    @Test
    void maps_to_entity_field_sugar() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getSugar)
            .isEqualTo(ingredientVariantDto.getSugar());
    }

    @Test
    void maps_to_entity_field_ingredient() {
        // given
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient);

        // then
        assertThat(result).extracting(IngredientVariant::getIngredient)
            .isEqualTo(ingredient);
    }

    @Test
    void updates_entity_field_description() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        // when
        final var result = ingredientVariantMapper.updateIngredientVariantFromDto(
            ingredientVariant,
            ingredientVariantDto
        );

        // then
        assertThat(result).extracting(IngredientVariant::getDescription)
            .isEqualTo(ingredientVariantDto.getDescription());
    }

    @Test
    void updates_entity_field_defaultVariant() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        // when
        final var result = ingredientVariantMapper.updateIngredientVariantFromDto(
            ingredientVariant,
            ingredientVariantDto
        );

        // then
        assertThat(result).extracting(IngredientVariant::getDefaultVariant)
            .isEqualTo(ingredientVariantDto.getDefaultVariant());
    }

    @Test
    void updates_entity_field_unit() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class)
            .set(field(IngredientVariant::getUnit), GenericUnit.POUND)
            .create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class)
            .set(field(IngredientVariantDto::getUnit), GenericUnitDto.TABLESPOON)
            .create();

        // when
        final var result = ingredientVariantMapper.updateIngredientVariantFromDto(
            ingredientVariant,
            ingredientVariantDto
        );

        // then
        assertThat(result).extracting(IngredientVariant::getUnit)
            .isEqualTo(GenericUnit.TABLESPOON);
    }

    @Test
    void updates_entity_field_servingSize() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        // when
        final var result = ingredientVariantMapper.updateIngredientVariantFromDto(
            ingredientVariant,
            ingredientVariantDto
        );

        // then
        assertThat(result).extracting(IngredientVariant::getServingSize)
            .isEqualTo(ingredientVariantDto.getServingSize());
    }

    @Test
    void updates_entity_field_calories() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        // when
        final var result = ingredientVariantMapper.updateIngredientVariantFromDto(
            ingredientVariant,
            ingredientVariantDto
        );

        // then
        assertThat(result).extracting(IngredientVariant::getCalories)
            .isEqualTo(ingredientVariantDto.getCalories());
    }

    @Test
    void updates_entity_field_carbohydrate() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        // when
        final var result = ingredientVariantMapper.updateIngredientVariantFromDto(
            ingredientVariant,
            ingredientVariantDto
        );

        // then
        assertThat(result).extracting(IngredientVariant::getCarbohydrate)
            .isEqualTo(ingredientVariantDto.getCarbohydrate());
    }

    @Test
    void updates_entity_field_fat() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        // when
        final var result = ingredientVariantMapper.updateIngredientVariantFromDto(
            ingredientVariant,
            ingredientVariantDto
        );

        // then
        assertThat(result).extracting(IngredientVariant::getFat)
            .isEqualTo(ingredientVariantDto.getFat());
    }

    @Test
    void updates_entity_field_protein() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        // when
        final var result = ingredientVariantMapper.updateIngredientVariantFromDto(
            ingredientVariant,
            ingredientVariantDto
        );

        // then
        assertThat(result).extracting(IngredientVariant::getProtein)
            .isEqualTo(ingredientVariantDto.getProtein());
    }

    @Test
    void updates_entity_field_saturatedFat() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        // when
        final var result = ingredientVariantMapper.updateIngredientVariantFromDto(
            ingredientVariant,
            ingredientVariantDto
        );

        // then
        assertThat(result).extracting(IngredientVariant::getSaturatedFat)
            .isEqualTo(ingredientVariantDto.getSaturatedFat());
    }

    @Test
    void updates_entity_field_sodium() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        // when
        final var result = ingredientVariantMapper.updateIngredientVariantFromDto(
            ingredientVariant,
            ingredientVariantDto
        );

        // then
        assertThat(result).extracting(IngredientVariant::getSodium)
            .isEqualTo(ingredientVariantDto.getSodium());
    }

    @Test
    void updates_entity_field_sugar() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        // when
        final var result = ingredientVariantMapper.updateIngredientVariantFromDto(
            ingredientVariant,
            ingredientVariantDto
        );

        // then
        assertThat(result).extracting(IngredientVariant::getSugar)
            .isEqualTo(ingredientVariantDto.getSugar());
    }

}
