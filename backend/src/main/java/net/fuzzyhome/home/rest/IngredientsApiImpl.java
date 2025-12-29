package net.fuzzyhome.home.rest;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import net.fuzzyhome.home.services.IngredientService;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.openapitools.api.IngredientsApi;
import org.openapitools.model.CustomUnitDto;
import org.openapitools.model.IngredientDto;
import org.openapitools.model.IngredientVariantDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class IngredientsApiImpl implements IngredientsApi {

    private final IngredientService ingredientService;

    @NonNull
    @Override
    public ResponseEntity<@NonNull List<IngredientDto>> listIngredients(
        @NonNull final Integer page,
        @NonNull final Integer size,
        @Nullable final String search
    ) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ingredientService.getAllIngredients(page, size, search));
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull IngredientDto> createIngredient(@NonNull final IngredientDto ingredientDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ingredientService.createIngredient(ingredientDto));
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull IngredientDto> getIngredient(@NonNull final UUID ingredientId) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ingredientService.getIngredientById(ingredientId));
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull IngredientDto> updateIngredient(
        @NonNull final UUID ingredientId,
        @NonNull final IngredientDto ingredientDto
    ) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ingredientService.updateIngredient(ingredientId, ingredientDto));
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull Void> deleteIngredient(@NonNull final UUID ingredientId) {
        ingredientService.deleteIngredient(ingredientId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build();
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull List<IngredientVariantDto>> listIngredientVariants(
        @NonNull final UUID ingredientId
    ) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ingredientService.getIngredientVariantsByIngredientId(ingredientId));
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull IngredientVariantDto> addIngredientVariant(
        @NonNull final UUID ingredientId,
        @NonNull final IngredientVariantDto ingredientVariantDto
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ingredientService.addIngredientVariantToIngredient(ingredientId, ingredientVariantDto));
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull IngredientVariantDto> getIngredientVariant(
        @NonNull final UUID ingredientId,
        @NonNull final UUID variantId
    ) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ingredientService.getIngredientVariantById(ingredientId, variantId));
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull IngredientVariantDto> updateIngredientVariant(
        @NonNull final UUID ingredientId,
        @NonNull final UUID variantId,
        @NonNull final IngredientVariantDto ingredientVariantDto
    ) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ingredientService.updateIngredientVariant(ingredientId, variantId, ingredientVariantDto));
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull Void> deleteIngredientVariant(
        @NonNull final UUID ingredientId,
        @NonNull final UUID variantId
    ) {
        ingredientService.deleteIngredientVariant(ingredientId, variantId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build();
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull List<CustomUnitDto>> listCustomUnits(@NonNull final UUID ingredientId) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ingredientService.getCustomUnitsByIngredientId(ingredientId));
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull CustomUnitDto> addCustomUnit(
        @NonNull final UUID ingredientId,
        @NonNull final CustomUnitDto customUnitDto
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ingredientService.addCustomUnitToIngredient(ingredientId, customUnitDto));
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull CustomUnitDto> getCustomUnit(
        @NonNull final UUID ingredientId,
        @NonNull final UUID unitId
    ) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ingredientService.getCustomUnitById(ingredientId, unitId));
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull CustomUnitDto> updateCustomUnit(
        @NonNull final UUID ingredientId,
        @NonNull final UUID unitId,
        @NonNull final CustomUnitDto customUnitDto
    ) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ingredientService.updateCustomUnit(ingredientId, unitId, customUnitDto));
    }

    @NonNull
    @Override
    public ResponseEntity<@NonNull Void> deleteCustomUnit(
        @NonNull final UUID ingredientId,
        @NonNull final UUID unitId
    ) {
        ingredientService.deleteCustomUnit(ingredientId, unitId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build();
    }

}
