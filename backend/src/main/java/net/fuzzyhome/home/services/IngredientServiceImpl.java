package net.fuzzyhome.home.services;

import jakarta.transaction.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import net.fuzzyhome.home.database.repositories.CustomUnitRepository;
import net.fuzzyhome.home.database.repositories.IngredientRepository;
import net.fuzzyhome.home.database.repositories.IngredientVariantRepository;
import net.fuzzyhome.home.services.errors.BadRequestException;
import net.fuzzyhome.home.services.errors.NotFoundException;
import net.fuzzyhome.home.services.mappers.CustomUnitMapper;
import net.fuzzyhome.home.services.mappers.IngredientMapper;
import net.fuzzyhome.home.services.mappers.IngredientVariantMapper;
import org.jspecify.annotations.NonNull;
import org.openapitools.model.CustomUnitDto;
import org.openapitools.model.IngredientDto;
import org.openapitools.model.IngredientVariantDto;
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
    public List<IngredientDto> getAllIngredients() {
        return ingredientRepository.findAll()
            .stream()
            .map(ingredientMapper::mapIngredientToDto)
            .toList();
    }

    @NonNull
    @Override
    public IngredientDto createIngredient(@NonNull final IngredientDto ingredientDto) {
        validateIngredientDto(ingredientDto);
        return ingredientMapper.mapIngredientToDto(
            ingredientRepository.save(ingredientMapper.mapDtoToIngredient(ingredientDto))
        );
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
        @NonNull final IngredientDto ingredientDto
    ) {
        validateIngredientDto(ingredientDto);
        return ingredientRepository.findById(ingredientId)
            .map(ingredient -> ingredientMapper.updateIngredientFromDto(ingredient, ingredientDto))
            .map(ingredientRepository::save)
            .map(ingredientMapper::mapIngredientToDto)
            .orElseThrow(() -> new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId)));
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
        @NonNull final IngredientVariantDto ingredientVariantDto
    ) {
        return ingredientRepository.findById(ingredientId)
            .map(ingredient -> ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient))
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

        return ingredientVariantRepository.findById(variantId)
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
        @NonNull final IngredientVariantDto ingredientVariantDto
    ) {
        if (!ingredientRepository.existsById(ingredientId)) {
            throw new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId));
        }

        return ingredientVariantRepository.findById(variantId)
            .map(ingredientVariant -> ingredientVariantMapper.updateIngredientVariantFromDto(
                ingredientVariant,
                ingredientVariantDto
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

        Optional.ofNullable(ingredient.getIngredientVariants())
            .ifPresent(variants -> variants.removeIf(variant -> Objects.equals(variant.getId(), variantId)));

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
        @NonNull final CustomUnitDto customUnitDto
    ) {
        return ingredientRepository.findById(ingredientId)
            .map(ingredient -> customUnitMapper.mapDtoToCustomUnit(customUnitDto, ingredient))
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

        return customUnitRepository.findById(unitId)
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
        @NonNull final CustomUnitDto customUnitDto
    ) {
        if (!ingredientRepository.existsById(ingredientId)) {
            throw new NotFoundException(String.format("Ingredient not found for id: %s", ingredientId));
        }

        return customUnitRepository.findById(unitId)
            .map(customUnit -> customUnitMapper.updateCustomUnitFromDto(customUnit, customUnitDto))
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

        Optional.ofNullable(ingredient.getCustomUnits())
            .ifPresent(customUnits -> customUnits.removeIf(customUnit -> Objects.equals(customUnit.getId(), unitId)));

        ingredientRepository.save(ingredient);
    }

    private void validateIngredientDto(@NonNull final IngredientDto ingredientDto) {
        final var ingredientVariantDtos = Optional.ofNullable(ingredientDto.getIngredientVariants()).orElse(List.of());
        final var ingredientVariantDescriptions = ingredientVariantDtos.stream()
            .map(IngredientVariantDto::getDescription)
            .toList();
        final var customUnitDescriptions = Optional.ofNullable(ingredientDto.getCustomUnits())
            .orElse(List.of())
            .stream()
            .map(CustomUnitDto::getName)
            .toList();

        if (ingredientVariantDescriptions.size() != (new HashSet<>(ingredientVariantDescriptions)).size()) {
            throw new BadRequestException("Duplicate ingredient variants found");
        }

        if (customUnitDescriptions.size() != (new HashSet<>(customUnitDescriptions)).size()) {
            throw new BadRequestException("Duplicate custom units found");
        }

        if (ingredientVariantDtos.stream()
                .map(IngredientVariantDto::getDefaultVariant)
                .filter(Boolean.TRUE::equals)
                .count() > 1) {
            throw new BadRequestException("More than one default ingredient variant found");
        }
    }
}
