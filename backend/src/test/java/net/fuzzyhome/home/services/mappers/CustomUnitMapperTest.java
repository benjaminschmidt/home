package net.fuzzyhome.home.services.mappers;

import net.fuzzyhome.home.database.entities.CustomUnit;
import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.enums.GenericUnit;
import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openapitools.model.CustomUnitDto;
import org.openapitools.model.CustomUnitWriteRequest;
import org.openapitools.model.GenericUnitDto;

import static org.assertj.core.api.Assertions.assertThat;
import static org.instancio.Select.field;

@ExtendWith(MockitoExtension.class)
class CustomUnitMapperTest {

    @InjectMocks
    private CustomUnitMapper customUnitMapper;

    @Test
    void maps_to_dto_field_id() {
        // given
        final var customUnit = Instancio.of(CustomUnit.class).create();

        // when
        final var result = customUnitMapper.mapCustomUnitToDto(customUnit);

        // then
        assertThat(result).extracting(CustomUnitDto::getId)
            .isEqualTo(customUnit.getId());
    }

    @Test
    void maps_to_dto_field_name() {
        // given
        final var customUnit = Instancio.of(CustomUnit.class).create();

        // when
        final var result = customUnitMapper.mapCustomUnitToDto(customUnit);

        // then
        assertThat(result).extracting(CustomUnitDto::getName)
            .isEqualTo(customUnit.getName());
    }

    @Test
    void maps_to_dto_field_conversionUnitToCustomUnitFactor() {
        // given
        final var customUnit = Instancio.of(CustomUnit.class).create();

        // when
        final var result = customUnitMapper.mapCustomUnitToDto(customUnit);

        // then
        assertThat(result).extracting(CustomUnitDto::getCustomUnitToConversionUnitFactor)
            .isEqualTo(customUnit.getCustomUnitToConversionUnitFactor());
    }

    @Test
    void maps_to_dto_field_conversionUnit() {
        // given
        final var customUnit = Instancio.of(CustomUnit.class)
            .set(field(CustomUnit::getConversionUnit), GenericUnit.GRAM)
            .create();

        // when
        final var result = customUnitMapper.mapCustomUnitToDto(customUnit);

        // then
        assertThat(result).extracting(CustomUnitDto::getConversionUnit)
            .isEqualTo(GenericUnitDto.GRAM);
    }

    @Test
    void maps_to_entity_field_id() {
        // given
        final var customUnitWriteRequest = Instancio.of(CustomUnitWriteRequest.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = customUnitMapper.mapWriteRequestToCustomUnit(customUnitWriteRequest, ingredient);

        // then
        assertThat(result).extracting(CustomUnit::getId)
            .isNull();
    }

    @Test
    void maps_to_entity_field_name() {
        // given
        final var customUnitWriteRequest = Instancio.of(CustomUnitWriteRequest.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = customUnitMapper.mapWriteRequestToCustomUnit(customUnitWriteRequest, ingredient);

        // then
        assertThat(result).extracting(CustomUnit::getName)
            .isEqualTo(customUnitWriteRequest.getName());
    }

    @Test
    void maps_to_entity_field_conversionUnitToCustomUnitFactor() {
        // given
        final var customUnitWriteRequest = Instancio.of(CustomUnitWriteRequest.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = customUnitMapper.mapWriteRequestToCustomUnit(customUnitWriteRequest, ingredient);

        // then
        assertThat(result).extracting(CustomUnit::getCustomUnitToConversionUnitFactor)
            .isEqualTo(customUnitWriteRequest.getCustomUnitToConversionUnitFactor());
    }

    @Test
    void maps_to_entity_field_conversionUnit() {
        // given
        final var customUnitWriteRequest = Instancio.of(CustomUnitWriteRequest.class)
            .set(field(CustomUnitWriteRequest::getConversionUnit), GenericUnitDto.MILLILITER)
            .create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = customUnitMapper.mapWriteRequestToCustomUnit(customUnitWriteRequest, ingredient);

        // then
        assertThat(result).extracting(CustomUnit::getConversionUnit)
            .isEqualTo(GenericUnit.MILLILITER);
    }

    @Test
    void maps_to_entity_field_ingredient() {
        // given
        final var customUnitWriteRequest = Instancio.of(CustomUnitWriteRequest.class).create();
        final var ingredient = Instancio.of(Ingredient.class).create();

        // when
        final var result = customUnitMapper.mapWriteRequestToCustomUnit(customUnitWriteRequest, ingredient);

        // then
        assertThat(result).extracting(CustomUnit::getIngredient)
            .isEqualTo(ingredient);
    }

    @Test
    void updates_entity_field_name() {
        // given
        final var customUnit = Instancio.of(CustomUnit.class).create();
        final var customUnitWriteRequest = Instancio.of(CustomUnitWriteRequest.class).create();

        // when
        final var result = customUnitMapper.updateCustomUnitFromWriteRequest(customUnit, customUnitWriteRequest);

        // then
        assertThat(result).extracting(CustomUnit::getName)
            .isEqualTo(customUnitWriteRequest.getName());
    }

    @Test
    void updates_entity_field_conversionUnitToCustomUnitFactor() {
        // given
        final var customUnit = Instancio.of(CustomUnit.class).create();
        final var customUnitWriteRequest = Instancio.of(CustomUnitWriteRequest.class).create();

        // when
        final var result = customUnitMapper.updateCustomUnitFromWriteRequest(customUnit, customUnitWriteRequest);

        // then
        assertThat(result).extracting(CustomUnit::getCustomUnitToConversionUnitFactor)
            .isEqualTo(customUnitWriteRequest.getCustomUnitToConversionUnitFactor());
    }

    @Test
    void updates_entity_field_conversionUnit() {
        // given
        final var customUnit = Instancio.of(CustomUnit.class)
            .set(field(CustomUnit::getConversionUnit), GenericUnit.CUP)
            .create();
        final var customUnitWriteRequest = Instancio.of(CustomUnitWriteRequest.class)
            .set(field(CustomUnitWriteRequest::getConversionUnit), GenericUnitDto.KILOGRAM)
            .create();

        // when
        final var result = customUnitMapper.updateCustomUnitFromWriteRequest(customUnit, customUnitWriteRequest);

        // then
        assertThat(result).extracting(CustomUnit::getConversionUnit)
            .isEqualTo(GenericUnit.KILOGRAM);
    }
}
