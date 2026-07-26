package net.fuzzyhome.home.services.mappers;

import lombok.RequiredArgsConstructor;
import net.fuzzyhome.home.database.entities.CustomUnit;
import net.fuzzyhome.home.database.entities.Ingredient;
import org.jspecify.annotations.NonNull;
import org.openapitools.model.CustomUnitDto;
import org.openapitools.model.CustomUnitWriteRequest;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomUnitMapper {

    @NonNull
    public CustomUnitDto mapCustomUnitToDto(@NonNull final CustomUnit customUnit) {
        return CustomUnitDto.builder()
            .id(customUnit.getId())
            .name(customUnit.getName())
            .customUnitToConversionUnitFactor(customUnit.getCustomUnitToConversionUnitFactor())
            .conversionUnit(UnitUtils.mapGenericUnitToDto(customUnit.getConversionUnit()))
            .build();
    }

    @NonNull
    public CustomUnit mapWriteRequestToCustomUnit(
        @NonNull final CustomUnitWriteRequest customUnitWriteRequest,
        @NonNull final Ingredient ingredient
    ) {
        return CustomUnit.builder()
            .name(customUnitWriteRequest.getName())
            .customUnitToConversionUnitFactor(customUnitWriteRequest.getCustomUnitToConversionUnitFactor())
            .conversionUnit(UnitUtils.mapDtoToGenericUnit(customUnitWriteRequest.getConversionUnit()))
            .ingredient(ingredient)
            .build();
    }

    @NonNull
    public CustomUnit updateCustomUnitFromWriteRequest(
        @NonNull final CustomUnit customUnit,
        @NonNull final CustomUnitWriteRequest customUnitWriteRequest
    ) {
        customUnit.setName(customUnitWriteRequest.getName());
        customUnit.setCustomUnitToConversionUnitFactor(customUnitWriteRequest.getCustomUnitToConversionUnitFactor());
        customUnit.setConversionUnit(UnitUtils.mapDtoToGenericUnit(customUnitWriteRequest.getConversionUnit()));
        return customUnit;
    }
}
