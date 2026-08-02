package net.fuzzyhome.home.services;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import net.fuzzyhome.home.database.repositories.CustomUnitRepository;
import net.fuzzyhome.home.database.repositories.IngredientRepository;
import net.fuzzyhome.home.database.repositories.IngredientVariantRepository;
import net.fuzzyhome.home.services.errors.BadRequestException;
import net.fuzzyhome.home.services.errors.NotFoundException;
import net.fuzzyhome.home.services.mappers.CustomUnitMapper;
import net.fuzzyhome.home.services.mappers.IngredientMapper;
import net.fuzzyhome.home.services.mappers.IngredientVariantMapper;
import org.apache.commons.lang3.StringUtils;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.openapitools.model.CustomUnitDto;
import org.openapitools.model.CustomUnitWriteRequest;
import org.openapitools.model.IngredientDto;
import org.openapitools.model.IngredientVariantDto;
import org.openapitools.model.IngredientVariantWriteRequest;
import org.openapitools.model.IngredientWriteRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Transactional
public class IngredientServiceImpl implements IngredientService {

    private final CustomUnitMapper customUnitMapper;
    private final CustomUnitRepository customUnitRepository;
    private final IngredientMapper ingredientMapper;
    private final IngredientRepository ingredientRepository;
    private final IngredientVariantMapper ingredientVariantMapper;
    private final IngredientVariantRepository ingredientVariantRepository;

    @NonNull
    @Override
    public List<IngredientDto> getAllIngredients(
        @NonNull final Integer page,
        @NonNull final Integer size,
        @Nullable final String search
    ) {
        return Optional.ofNullable(StringUtils.trimToNull(search))
            .map(s -> ingredientRepository.findByNameContainingIgnoreCase(
                s,
                PageRequest.of(page, size, Sort.by("name"))
            ))
            .orElseGet(() -> ingredientRepository.findAll(PageRequest.of(page, size, Sort.by("name"))))
            .stream()
            .map(ingredientMapper::mapIngredientToDto)
            .toList();
    }

    @NonNull
    @Override
    public IngredientDto createIngredient(@NonNull final IngredientWriteRequest ingredientWriteRequest) {
        final var savedIngredient = ingredientRepository.save(
            ingredientMapper.mapWriteRequestToIngredient(ingredientWriteRequest)
        );
        reconcileDefaultVariant(savedIngredient, ingredientWriteRequest.getDefaultVariantId());
        return ingredientMapper.mapIngredientToDto(savedIngredient);
    }

    @NonNull
    @Override
    public IngredientDto getIngredientById(@NonNull final UUID ingredientId) {
        return ingredientRepository.findById(ingredientId)
            .map(ingredientMapper::mapIngredientToDto)
            .orElseThrow(() -> new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId)));
    }

    @NonNull
    @Override
    public IngredientDto updateIngredient(
        @NonNull final UUID ingredientId,
        @NonNull final IngredientWriteRequest ingredientWriteRequest
    ) {
        return ingredientRepository.findById(ingredientId)
            .map(ingredient -> ingredientMapper.updateIngredientFromWriteRequest(ingredient, ingredientWriteRequest))
            .map(ingredientRepository::save)
            .map(ingredient -> {
                reconcileDefaultVariant(ingredient, ingredientWriteRequest.getDefaultVariantId());
                return ingredient;
            })
            .map(ingredientMapper::mapIngredientToDto)
            .orElseThrow(() -> new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId)));
    }

    private void reconcileDefaultVariant(
        @NonNull final Ingredient ingredient,
        @Nullable final UUID defaultVariantId
    ) {
        final var variants = Optional.ofNullable(ingredient.getIngredientVariants()).orElse(List.of());

        final IngredientVariant newDefaultVariant;
        if (defaultVariantId == null) {
            newDefaultVariant = null;
        } else {
            newDefaultVariant = variants.stream()
                .filter(variant -> Objects.equals(variant.getId(), defaultVariantId))
                .findFirst()
                .orElseThrow(() -> new BadRequestException(
                    String.format("Ingredient variant not found for id: %s", defaultVariantId)
                ));
        }

        final var previousDefaults = variants.stream()
            .filter(variant -> !Objects.equals(variant, newDefaultVariant))
            .filter(IngredientVariant::getDefaultVariant)
            .toList();
        previousDefaults.forEach(variant -> variant.setDefaultVariant(false));
        ingredientVariantRepository.saveAllAndFlush(previousDefaults);

        if (newDefaultVariant != null) {
            newDefaultVariant.setDefaultVariant(true);
            ingredientVariantRepository.save(newDefaultVariant);
        }
    }

    @Override
    public void deleteIngredient(@NonNull final UUID ingredientId) {
        ingredientRepository.deleteById(ingredientId);
    }

    @NonNull
    @Override
    public List<IngredientVariantDto> getIngredientVariantsByIngredientId(@NonNull final UUID ingredientId) {
        return ingredientVariantRepository.findAllByIngredientId(ingredientId)
            .stream()
            .map(ingredientVariantMapper::mapIngredientVariantToDto)
            .toList();
    }

    @NonNull
    @Override
    public IngredientVariantDto addIngredientVariantToIngredient(
        @NonNull final UUID ingredientId,
        @NonNull final IngredientVariantWriteRequest ingredientVariantWriteRequest
    ) {
        return ingredientRepository.findById(ingredientId)
            .map(ingredient -> ingredientVariantMapper.mapWriteRequestToIngredientVariant(
                ingredientVariantWriteRequest,
                ingredient
            ))
            .map(ingredientVariantRepository::save)
            .map(ingredientVariantMapper::mapIngredientVariantToDto)
            .orElseThrow(() -> new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId)));
    }

    @NonNull
    @Override
    public IngredientVariantDto getIngredientVariantById(
        @NonNull final UUID ingredientId,
        @NonNull final UUID variantId
    ) {
        if (!ingredientRepository.existsById(ingredientId)) {
            throw new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId));
        }

        return ingredientVariantRepository.findByIdAndIngredientId(variantId, ingredientId)
            .map(ingredientVariantMapper::mapIngredientVariantToDto)
            .orElseThrow(() -> new NotFoundException(String.format(
                "Ingredient variant not found for id: %s",
                variantId
            )));
    }

    @NonNull
    @Override
    public IngredientVariantDto updateIngredientVariant(
        @NonNull final UUID ingredientId,
        @NonNull final UUID variantId,
        @NonNull final IngredientVariantWriteRequest ingredientVariantWriteRequest
    ) {
        if (!ingredientRepository.existsById(ingredientId)) {
            throw new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId));
        }

        return ingredientVariantRepository.findByIdAndIngredientId(variantId, ingredientId)
            .map(ingredientVariant -> ingredientVariantMapper.updateIngredientVariantFromWriteRequest(
                ingredientVariant,
                ingredientVariantWriteRequest
            ))
            .map(ingredientVariantRepository::save)
            .map(ingredientVariantMapper::mapIngredientVariantToDto)
            .orElseThrow(() -> new NotFoundException(String.format(
                "Ingredient variant not found for id: %s",
                variantId
            )));
    }

    @Override
    public void deleteIngredientVariant(@NonNull final UUID ingredientId, @NonNull final UUID variantId) {
        final var ingredient = ingredientRepository.findById(ingredientId)
            .orElseThrow(() -> new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId)));

        final var removed = Optional.ofNullable(ingredient.getIngredientVariants())
            .map(variants -> variants.removeIf(variant -> Objects.equals(variant.getId(), variantId)))
            .orElse(false);

        if (!removed) {
            throw new NotFoundException(String.format("Ingredient variant not found for id: %s", variantId));
        }

        ingredientRepository.save(ingredient);
    }

    @NonNull
    @Override
    public List<CustomUnitDto> getCustomUnitsByIngredientId(@NonNull final UUID ingredientId) {
        return customUnitRepository.findAllByIngredientId(ingredientId)
            .stream()
            .map(customUnitMapper::mapCustomUnitToDto)
            .toList();
    }

    @NonNull
    @Override
    public CustomUnitDto addCustomUnitToIngredient(
        @NonNull final UUID ingredientId,
        @NonNull final CustomUnitWriteRequest customUnitWriteRequest
    ) {
        return ingredientRepository.findById(ingredientId)
            .map(ingredient -> customUnitMapper.mapWriteRequestToCustomUnit(customUnitWriteRequest, ingredient))
            .map(customUnitRepository::save)
            .map(customUnitMapper::mapCustomUnitToDto)
            .orElseThrow(() -> new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId)));
    }

    @NonNull
    @Override
    public CustomUnitDto getCustomUnitById(
        @NonNull final UUID ingredientId,
        @NonNull final UUID unitId
    ) {
        if (!ingredientRepository.existsById(ingredientId)) {
            throw new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId));
        }

        return customUnitRepository.findByIdAndIngredientId(unitId, ingredientId)
            .map(customUnitMapper::mapCustomUnitToDto)
            .orElseThrow(() -> new NotFoundException(String.format(
                "Custom unit not found for id: %s",
                unitId
            )));
    }

    @NonNull
    @Override
    public CustomUnitDto updateCustomUnit(
        @NonNull final UUID ingredientId,
        @NonNull final UUID unitId,
        @NonNull final CustomUnitWriteRequest customUnitWriteRequest
    ) {
        if (!ingredientRepository.existsById(ingredientId)) {
            throw new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId));
        }

        return customUnitRepository.findByIdAndIngredientId(unitId, ingredientId)
            .map(customUnit -> customUnitMapper.updateCustomUnitFromWriteRequest(customUnit, customUnitWriteRequest))
            .map(customUnitRepository::save)
            .map(customUnitMapper::mapCustomUnitToDto)
            .orElseThrow(() -> new NotFoundException(String.format(
                "Custom unit not found for id: %s",
                unitId
            )));
    }

    public void deleteCustomUnit(@NonNull final UUID ingredientId, @NonNull final UUID unitId) {
        final var ingredient = ingredientRepository.findById(ingredientId)
            .orElseThrow(() -> new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId)));

        final var removed = Optional.ofNullable(ingredient.getCustomUnits())
            .map(customUnits -> customUnits.removeIf(customUnit -> Objects.equals(customUnit.getId(), unitId)))
            .orElse(false);

        if (!removed) {
            throw new NotFoundException(String.format("Custom unit not found for id: %s", unitId));
        }

        ingredientRepository.save(ingredient);
    }
}
