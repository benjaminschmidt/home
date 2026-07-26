package net.fuzzyhome.home.services.mappers;

import java.util.List;
import net.fuzzyhome.home.database.entities.CustomUnit;
import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import net.fuzzyhome.home.database.enums.VolumeUnit;
import net.fuzzyhome.home.database.enums.WeightUnit;
import org.assertj.core.api.InstanceOfAssertFactories;
import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openapitools.model.CustomUnitDto;
import org.openapitools.model.CustomUnitWriteRequest;
import org.openapitools.model.IngredientDto;
import org.openapitools.model.IngredientVariantDto;
import org.openapitools.model.IngredientVariantWriteRequest;
import org.openapitools.model.IngredientWriteRequest;
import org.openapitools.model.VolumeUnitDto;
import org.openapitools.model.WeightUnitDto;

import static org.assertj.core.api.Assertions.assertThat;
import static org.instancio.Select.field;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IngredientMapperTest {

    @InjectMocks
    private IngredientMapper ingredientMapper;

    @Mock
    private CustomUnitMapper customUnitMapper;

    @Mock
    private IngredientVariantMapper ingredientVariantMapper;

    @Test
    void maps_to_dto_field_id() {
        // given
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientMapper.mapIngredientToDto(ingredient);

        // then
        assertThat(result).extracting(IngredientDto::getId)
            .isEqualTo(ingredient.getId());
    }

    @Test
    void maps_to_dto_field_name() {
        // given
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientMapper.mapIngredientToDto(ingredient);

        // then
        assertThat(result).extracting(IngredientDto::getName)
            .isEqualTo(ingredient.getName());
    }

    @Test
    void maps_to_dto_field_weightToVolumeConversionFactor() {
        // given
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = ingredientMapper.mapIngredientToDto(ingredient);

        // then
        assertThat(result).extracting(IngredientDto::getWeightToVolumeConversionFactor)
            .isEqualTo(ingredient.getWeightToVolumeConversionFactor());
    }

    @Test
    void maps_to_dto_field_conversionWeightUnit() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .set(field(Ingredient::getConversionWeightUnit), WeightUnit.OUNCE)
            .create();

        // when
        final var result = ingredientMapper.mapIngredientToDto(ingredient);

        // then
        assertThat(result).extracting(IngredientDto::getConversionWeightUnit)
            .isEqualTo(WeightUnitDto.OUNCE);
    }

    @Test
    void maps_to_dto_field_conversionVolumeUnit() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .set(field(Ingredient::getConversionVolumeUnit), VolumeUnit.TEASPOON)
            .create();

        // when
        final var result = ingredientMapper.mapIngredientToDto(ingredient);

        // then
        assertThat(result).extracting(IngredientDto::getConversionVolumeUnit)
            .isEqualTo(VolumeUnitDto.TEASPOON);
    }

    @Test
    void maps_to_dto_field_ingredientVariants() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .set(
                field(Ingredient::getIngredientVariants),
                Instancio.ofList(IngredientVariant.class)
                    .size(2)
                    .create()
            )
            .create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();
        when(ingredientVariantMapper.mapIngredientVariantToDto(any())).thenReturn(ingredientVariantDto);

        // when
        final var result = ingredientMapper.mapIngredientToDto(ingredient);

        // then
        assertThat(result).extracting(
                IngredientDto::getIngredientVariants,
                InstanceOfAssertFactories.list(IngredientVariantDto.class)
            )
            .containsExactly(ingredientVariantDto, ingredientVariantDto);
    }

    @Test
    void maps_to_dto_field_customUnits() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .set(
                field(Ingredient::getCustomUnits),
                Instancio.ofList(CustomUnit.class)
                    .size(2)
                    .create()
            )
            .create();
        final var customUnitDto = Instancio.of(CustomUnitDto.class).create();
        when(customUnitMapper.mapCustomUnitToDto(any())).thenReturn(customUnitDto);

        // when
        final var result = ingredientMapper.mapIngredientToDto(ingredient);

        // then
        assertThat(result).extracting(
                IngredientDto::getCustomUnits,
                InstanceOfAssertFactories.list(CustomUnitDto.class)
            )
            .containsExactly(customUnitDto, customUnitDto);
    }

    @Test
    void maps_to_entity_field_id() {
        // given
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class).create();

        // when
        final var result = ingredientMapper.mapWriteRequestToIngredient(ingredientWriteRequest);

        // then
        assertThat(result).extracting(Ingredient::getId)
            .isNull();
    }

    @Test
    void maps_to_entity_field_name() {
        // given
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class).create();

        // when
        final var result = ingredientMapper.mapWriteRequestToIngredient(ingredientWriteRequest);

        // then
        assertThat(result).extracting(Ingredient::getName)
            .isEqualTo(ingredientWriteRequest.getName());
    }

    @Test
    void maps_to_entity_field_weightToVolumeConversionFactor() {
        // given
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class).create();

        // when
        final var result = ingredientMapper.mapWriteRequestToIngredient(ingredientWriteRequest);

        // then
        assertThat(result).extracting(Ingredient::getWeightToVolumeConversionFactor)
            .isEqualTo(ingredientWriteRequest.getWeightToVolumeConversionFactor());
    }

    @Test
    void maps_to_entity_field_conversionWeightUnit() {
        // given
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class)
            .set(field(IngredientWriteRequest::getConversionWeightUnit), WeightUnitDto.MILLIGRAM)
            .create();

        // when
        final var result = ingredientMapper.mapWriteRequestToIngredient(ingredientWriteRequest);

        // then
        assertThat(result).extracting(Ingredient::getConversionWeightUnit)
            .isEqualTo(WeightUnit.MILLIGRAM);
    }

    @Test
    void maps_to_entity_field_conversionVolumeUnit() {
        // given
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class)
            .set(field(IngredientWriteRequest::getConversionVolumeUnit), VolumeUnitDto.LITER)
            .create();

        // when
        final var result = ingredientMapper.mapWriteRequestToIngredient(ingredientWriteRequest);

        // then
        assertThat(result).extracting(Ingredient::getConversionVolumeUnit)
            .isEqualTo(VolumeUnit.LITER);
    }

    @Test
    void maps_to_entity_field_ingredientVariants() {
        // given
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class)
            .set(
                field(IngredientWriteRequest::getIngredientVariants),
                Instancio.ofList(IngredientVariantWriteRequest.class)
                    .size(2)
                    .create()
            )
            .create();
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        when(ingredientVariantMapper.mapWriteRequestToIngredientVariant(any(), any())).thenReturn(ingredientVariant);

        // when
        final var result = ingredientMapper.mapWriteRequestToIngredient(ingredientWriteRequest);

        // then
        assertThat(result).extracting(
                Ingredient::getIngredientVariants,
                InstanceOfAssertFactories.list(IngredientVariant.class)
            )
            .containsExactly(ingredientVariant, ingredientVariant);
    }

    @Test
    void maps_to_entity_field_customUnits() {
        // given
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class)
            .set(
                field(IngredientWriteRequest::getCustomUnits),
                Instancio.ofList(CustomUnitWriteRequest.class)
                    .size(2)
                    .create()
            )
            .create();
        final var customUnit = Instancio.of(CustomUnit.class).create();
        when(customUnitMapper.mapWriteRequestToCustomUnit(any(), any())).thenReturn(customUnit);

        // when
        final var result = ingredientMapper.mapWriteRequestToIngredient(ingredientWriteRequest);

        // then
        assertThat(result).extracting(
                Ingredient::getCustomUnits,
                InstanceOfAssertFactories.list(CustomUnit.class)
            )
            .containsExactly(customUnit, customUnit);
    }

    @Test
    void updates_entity_field_name() {
        // given
        final var ingredient = Instancio.of(Ingredient.class).create();
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class).create();

        // when
        final var result = ingredientMapper.updateIngredientFromWriteRequest(ingredient, ingredientWriteRequest);

        // then
        assertThat(result).extracting(Ingredient::getName)
            .isEqualTo(ingredientWriteRequest.getName());
    }

    @Test
    void updates_entity_field_weightToVolumeConversionFactor() {
        // given
        final var ingredient = Instancio.of(Ingredient.class).create();
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class).create();

        // when
        final var result = ingredientMapper.updateIngredientFromWriteRequest(ingredient, ingredientWriteRequest);

        // then
        assertThat(result).extracting(Ingredient::getWeightToVolumeConversionFactor)
            .isEqualTo(ingredientWriteRequest.getWeightToVolumeConversionFactor());
    }

    @Test
    void updates_entity_field_conversionWeightUnit() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .set(field(Ingredient::getConversionWeightUnit), WeightUnit.GRAM)
            .create();
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class)
            .set(field(IngredientWriteRequest::getConversionWeightUnit), WeightUnitDto.MILLIGRAM)
            .create();

        // when
        final var result = ingredientMapper.updateIngredientFromWriteRequest(ingredient, ingredientWriteRequest);

        // then
        assertThat(result).extracting(Ingredient::getConversionWeightUnit)
            .isEqualTo(WeightUnit.MILLIGRAM);
    }

    @Test
    void updates_entity_field_conversionVolumeUnit() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .set(field(Ingredient::getConversionVolumeUnit), VolumeUnit.FLUID_OUNCE)
            .create();
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class)
            .set(field(IngredientWriteRequest::getConversionVolumeUnit), VolumeUnitDto.TEASPOON)
            .create();

        // when
        final var result = ingredientMapper.updateIngredientFromWriteRequest(ingredient, ingredientWriteRequest);

        // then
        assertThat(result).extracting(Ingredient::getConversionVolumeUnit)
            .isEqualTo(VolumeUnit.TEASPOON);
    }

    @Test
    void updates_entity_field_ingredientVariants() {
        // given
        final var ingredientVariants = Instancio.ofList(IngredientVariant.class).size(3).create();
        final var ingredient = Instancio.of(Ingredient.class)
            .set(field(Ingredient::getIngredientVariants), ingredientVariants)
            .create();

        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class)
            .set(
                field(IngredientWriteRequest::getIngredientVariants),
                List.of(
                    Instancio.of(IngredientVariantWriteRequest.class)
                        .set(
                            field(IngredientVariantWriteRequest::getDescription),
                            ingredientVariants.getFirst().getDescription()
                        )
                        .create(),
                    Instancio.of(IngredientVariantWriteRequest.class)
                        .create()
                )
            )
            .create();

        final var ingredientVariantNew = Instancio.of(IngredientVariant.class).create();
        when(ingredientVariantMapper.updateIngredientVariantFromWriteRequest(
            any(),
            any()
        )).thenReturn(ingredientVariants.getFirst());
        when(ingredientVariantMapper.mapWriteRequestToIngredientVariant(any(), any())).thenReturn(ingredientVariantNew);

        // when
        final var result = ingredientMapper.updateIngredientFromWriteRequest(ingredient, ingredientWriteRequest);

        // then
        assertThat(result).extracting(
            Ingredient::getIngredientVariants,
            InstanceOfAssertFactories.list(IngredientVariant.class)
        ).containsExactlyInAnyOrder(ingredientVariantNew, ingredientVariants.getFirst());
    }

    @Test
    void updates_entity_field_customUnits() {
        // given
        final var customUnits = Instancio.ofList(CustomUnit.class).size(3).create();
        final var ingredient = Instancio.of(Ingredient.class)
            .set(field(Ingredient::getCustomUnits), customUnits)
            .create();

        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class)
            .set(
                field(IngredientWriteRequest::getCustomUnits),
                List.of(
                    Instancio.of(CustomUnitWriteRequest.class)
                        .set(
                            field(CustomUnitWriteRequest::getName),
                            customUnits.getFirst().getName()
                        )
                        .create(),
                    Instancio.of(CustomUnitWriteRequest.class)
                        .create()
                )
            )
            .create();

        final var customUnit = Instancio.of(CustomUnit.class).create();
        when(customUnitMapper.updateCustomUnitFromWriteRequest(
            any(),
            any()
        )).thenReturn(customUnits.getFirst());
        when(customUnitMapper.mapWriteRequestToCustomUnit(any(), any())).thenReturn(customUnit);

        // when
        final var result = ingredientMapper.updateIngredientFromWriteRequest(ingredient, ingredientWriteRequest);

        // then
        assertThat(result).extracting(
            Ingredient::getCustomUnits,
            InstanceOfAssertFactories.list(CustomUnit.class)
        ).containsExactlyInAnyOrder(customUnit, customUnits.getFirst());
    }
}
