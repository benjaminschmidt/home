package net.fuzzyhome.home.services.mappers;

import lombok.RequiredArgsConstructor;
import net.fuzzyhome.home.database.entities.CustomUnit;
import net.fuzzyhome.home.database.entities.Ingredient;
import org.jspecify.annotations.NonNull;
import org.openapitools.model.CustomUnitDto;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomUnitMapper {

    @NonNull
    public CustomUnitDto mapCustomUnitToDto(@NonNull final CustomUnit customUnit) {
        return CustomUnitDto.builder()
            .id(customUnit.getId())
            .name(customUnit.getName())
            .conversionUnitToCustomUnitFactor(customUnit.getConversionUnitToCustomUnitFactor())
            .conversionUnit(UnitUtils.mapGenericUnitToDto(customUnit.getConversionUnit()))
            .build();
    }

    @NonNull
    public CustomUnit mapDtoToCustomUnit(
        @NonNull final CustomUnitDto customUnitDto,
        @NonNull final Ingredient ingredient
    ) {
        return CustomUnit.builder()
            .name(customUnitDto.getName())
            .conversionUnitToCustomUnitFactor(customUnitDto.getConversionUnitToCustomUnitFactor())
            .conversionUnit(UnitUtils.mapDtoToGenericUnit(customUnitDto.getConversionUnit()))
            .ingredient(ingredient)
            .build();
    }

    @NonNull
    public CustomUnit updateCustomUnitFromDto(
        @NonNull final CustomUnit customUnit,
        @NonNull final CustomUnitDto customUnitDto
    ) {
        customUnit.setName(customUnitDto.getName());
        customUnit.setConversionUnitToCustomUnitFactor(customUnitDto.getConversionUnitToCustomUnitFactor());
        customUnit.setConversionUnit(UnitUtils.mapDtoToGenericUnit(customUnitDto.getConversionUnit()));
        return customUnit;
    }
}
