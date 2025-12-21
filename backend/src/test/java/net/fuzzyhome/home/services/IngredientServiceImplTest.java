package net.fuzzyhome.home.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import net.fuzzyhome.home.database.entities.CustomUnit;
import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import net.fuzzyhome.home.database.repositories.CustomUnitRepository;
import net.fuzzyhome.home.database.repositories.IngredientRepository;
import net.fuzzyhome.home.database.repositories.IngredientVariantRepository;
import net.fuzzyhome.home.services.errors.NotFoundException;
import net.fuzzyhome.home.services.mappers.CustomUnitMapper;
import net.fuzzyhome.home.services.mappers.IngredientMapper;
import net.fuzzyhome.home.services.mappers.IngredientVariantMapper;
import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openapitools.model.CustomUnitDto;
import org.openapitools.model.IngredientDto;
import org.openapitools.model.IngredientVariantDto;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchException;
import static org.instancio.Select.field;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IngredientServiceImplTest {

    @InjectMocks
    private IngredientServiceImpl ingredientServiceImpl;

    @Mock
    private CustomUnitMapper customUnitMapper;

    @Mock
    private CustomUnitRepository customUnitRepository;

    @Mock
    private IngredientMapper ingredientMapper;

    @Mock
    private IngredientRepository ingredientRepository;

    @Mock
    private IngredientVariantMapper ingredientVariantMapper;

    @Mock
    private IngredientVariantRepository ingredientVariantRepository;

    @Test
    void retrieves_ingredients() {
        // given
        final var ingredients = Instancio.ofList(Ingredient.class)
            .size(2)
            .create();
        final var ingredientDtos = Instancio.ofList(IngredientDto.class)
            .size(2)
            .create();
        when(ingredientRepository.findAll()).thenReturn(ingredients);
        when(ingredientMapper.mapIngredientToDto(any(Ingredient.class)))
            .thenReturn(ingredientDtos.get(0))
            .thenReturn(ingredientDtos.get(1));

        // when
        final var result = ingredientServiceImpl.getAllIngredients();

        // then
        verify(ingredientRepository).findAll();
        assertThat(result).containsExactlyElementsOf(ingredientDtos);
    }

    @Test
    void creates_ingredients() {
        // given
        final var ingredient = Instancio.of(Ingredient.class).create();
        final var ingredientDto = Instancio.of(IngredientDto.class).create();

        when(ingredientRepository.save(any())).thenReturn(ingredient);
        when(ingredientMapper.mapDtoToIngredient(any())).thenReturn(ingredient);
        when(ingredientMapper.mapIngredientToDto(any())).thenReturn(ingredientDto);

        // when
        final var result = ingredientServiceImpl.createIngredient(ingredientDto);

        // then
        assertThat(result).isEqualTo(ingredientDto);
        verify(ingredientRepository).save(ingredient);
    }

    @Test
    void retrieves_ingredient() {
        // given
        final var id = UUID.randomUUID();
        final var ingredient = Instancio.of(Ingredient.class)
            .set(field(Ingredient::getId), id)
            .create();
        final var ingredientDto = Instancio.of(IngredientDto.class)
            .set(field(IngredientDto::getId), id)
            .create();
        when(ingredientRepository.findById(any())).thenReturn(Optional.of(ingredient));
        when(ingredientMapper.mapIngredientToDto(ingredient))
            .thenReturn(ingredientDto);

        // when
        final var result = ingredientServiceImpl.getIngredientById(id);

        // then
        verify(ingredientRepository).findById(id);
        assertThat(result).isEqualTo(ingredientDto);
    }

    @Test
    void fails_to_retrieve_ingredient_since_missing() {
        // given
        final var id = UUID.randomUUID();
        when(ingredientRepository.findById(id)).thenReturn(Optional.empty());

        // when
        final var exception = catchException(() -> ingredientServiceImpl.getIngredientById(id));

        // then
        assertThat(exception).isInstanceOf(NotFoundException.class)
            .hasMessageContaining(String.format("Ingredient not found for id: %s", id));
    }

    @Test
    void updates_ingredient() {
        // given
        final var id = UUID.randomUUID();
        final var ingredient = Instancio.of(Ingredient.class)
            .set(field(Ingredient::getId), id)
            .create();
        final var updatedIngredient = Instancio.of(Ingredient.class)
            .set(field(Ingredient::getId), id)
            .create();
        final var ingredientDto = Instancio.of(IngredientDto.class)
            .set(field(IngredientDto::getId), id)
            .create();
        when(ingredientRepository.findById(any())).thenReturn(Optional.of(ingredient));
        when(ingredientRepository.save(any())).thenReturn(ingredient);
        when(ingredientMapper.updateIngredientFromDto(ingredient, ingredientDto)).thenReturn(updatedIngredient);
        when(ingredientMapper.mapIngredientToDto(updatedIngredient)).thenReturn(ingredientDto);

        // when
        final var result = ingredientServiceImpl.updateIngredient(id, ingredientDto);

        // then
        verify(ingredientRepository).findById(id);
        verify(ingredientRepository).save(updatedIngredient);
        assertThat(result).isEqualTo(ingredientDto);
    }

    @Test
    void deletes_ingredient() {
        // given
        final var id = UUID.randomUUID();

        // when
        ingredientServiceImpl.deleteIngredient(id);

        // then
        verify(ingredientRepository).deleteById(id);
    }

    @Test
    void retrieves_ingredient_variants() {
        // given
        final var id = UUID.randomUUID();
        final var ingredientVariants = Instancio.ofList(IngredientVariant.class)
            .size(2)
            .create();
        final var ingredientVariantDtos = Instancio.ofList(IngredientVariantDto.class)
            .size(2)
            .create();
        when(ingredientVariantRepository.findAllByIngredientId(any())).thenReturn(ingredientVariants);
        when(ingredientVariantMapper.mapIngredientVariantToDto(any(IngredientVariant.class)))
            .thenReturn(ingredientVariantDtos.get(0))
            .thenReturn(ingredientVariantDtos.get(1));

        // when
        final var result = ingredientServiceImpl.getIngredientVariantsByIngredientId(id);

        // then
        verify(ingredientVariantRepository).findAllByIngredientId(id);
        assertThat(result).containsExactlyElementsOf(ingredientVariantDtos);
    }

    @Test
    void adds_ingredient_variant() {
        // given
        final var id = UUID.randomUUID();
        final var ingredient = Instancio.of(Ingredient.class).create();
        final var ingredientVariant = Instancio.of(IngredientVariant.class)
            .set(field(IngredientVariant::getIngredient), ingredient)
            .create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        when(ingredientRepository.findById(any())).thenReturn(Optional.of(ingredient));
        when(ingredientVariantRepository.save(any())).thenReturn(ingredientVariant);
        when(ingredientVariantMapper.mapDtoToIngredientVariant(ingredientVariantDto, ingredient))
            .thenReturn(ingredientVariant);
        when(ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant)).thenReturn(ingredientVariantDto);

        // when
        final var result = ingredientServiceImpl.addIngredientVariantToIngredient(id, ingredientVariantDto);

        // then
        verify(ingredientRepository).findById(id);
        verify(ingredientVariantRepository).save(ingredientVariant);
        assertThat(result).isEqualTo(ingredientVariantDto);
    }

    @Test
    void retrieves_ingredient_variant() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var ingredientVariantId = UUID.randomUUID();
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        when(ingredientRepository.existsById(any())).thenReturn(true);
        when(ingredientVariantRepository.findById(any())).thenReturn(Optional.of(ingredientVariant));
        when(ingredientVariantMapper.mapIngredientVariantToDto(ingredientVariant)).thenReturn(ingredientVariantDto);

        // when
        final var result = ingredientServiceImpl.getIngredientVariantById(ingredientId, ingredientVariantId);

        // then
        verify(ingredientRepository).existsById(ingredientId);
        verify(ingredientVariantRepository).findById(ingredientVariantId);
        assertThat(result).isEqualTo(ingredientVariantDto);
    }

    @Test
    void fails_to_retrieve_ingredient_variant_since_ingredient_missing() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var ingredientVariantId = UUID.randomUUID();
        when(ingredientRepository.existsById(ingredientId)).thenReturn(false);

        // when
        final var exception = catchException(
            () -> ingredientServiceImpl.getIngredientVariantById(ingredientId, ingredientVariantId)
        );

        // then
        assertThat(exception).isInstanceOf(NotFoundException.class)
            .hasMessageContaining(String.format("Ingredient not found for id: %s", ingredientId));
    }

    @Test
    void fails_to_retrieve_ingredient_variant_since_missing() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var ingredientVariantId = UUID.randomUUID();
        when(ingredientRepository.existsById(ingredientId)).thenReturn(true);
        when(ingredientVariantRepository.findById(ingredientVariantId)).thenReturn(Optional.empty());

        // when
        final var exception = catchException(
            () -> ingredientServiceImpl.getIngredientVariantById(ingredientId, ingredientVariantId)
        );

        // then
        assertThat(exception).isInstanceOf(NotFoundException.class)
            .hasMessageContaining(String.format("Ingredient variant not found for id: %s", ingredientVariantId));
    }

    @Test
    void updates_ingredient_variant() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var ingredientVariantId = UUID.randomUUID();
        final var ingredientVariant = Instancio.of(IngredientVariant.class).create();
        final var updatedIngredientVariant = Instancio.of(IngredientVariant.class).create();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        when(ingredientRepository.existsById(any())).thenReturn(true);
        when(ingredientVariantRepository.findById(any())).thenReturn(Optional.of(ingredientVariant));
        when(ingredientVariantRepository.save(any())).thenReturn(updatedIngredientVariant);
        when(ingredientVariantMapper.updateIngredientVariantFromDto(
            ingredientVariant,
            ingredientVariantDto
        )).thenReturn(updatedIngredientVariant);
        when(ingredientVariantMapper.mapIngredientVariantToDto(updatedIngredientVariant))
            .thenReturn(ingredientVariantDto);

        // when
        final var result = ingredientServiceImpl.updateIngredientVariant(
            ingredientId,
            ingredientVariantId,
            ingredientVariantDto
        );

        // then
        verify(ingredientRepository).existsById(ingredientId);
        verify(ingredientVariantRepository).findById(ingredientVariantId);
        verify(ingredientVariantRepository).save(updatedIngredientVariant);
        assertThat(result).isEqualTo(ingredientVariantDto);
    }

    @Test
    void fails_to_update_ingredient_variant_since_ingredient_missing() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var ingredientVariantId = UUID.randomUUID();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        when(ingredientRepository.existsById(ingredientId)).thenReturn(false);

        // when
        final var exception = catchException(() -> ingredientServiceImpl.updateIngredientVariant(
            ingredientId,
            ingredientVariantId,
            ingredientVariantDto
        ));

        // then
        assertThat(exception).isInstanceOf(NotFoundException.class)
            .hasMessageContaining(String.format("Ingredient not found for id: %s", ingredientId));
    }

    @Test
    void fails_to_update_ingredient_variant_since_missing() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var ingredientVariantId = UUID.randomUUID();
        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class).create();

        when(ingredientRepository.existsById(ingredientId)).thenReturn(true);
        when(ingredientVariantRepository.findById(ingredientVariantId)).thenReturn(Optional.empty());

        // when
        final var exception = catchException(() -> ingredientServiceImpl.updateIngredientVariant(
            ingredientId,
            ingredientVariantId,
            ingredientVariantDto
        ));

        // then
        assertThat(exception).isInstanceOf(NotFoundException.class)
            .hasMessageContaining(String.format("Ingredient variant not found for id: %s", ingredientVariantId));
    }

    @Test
    void deletes_ingredient_variant() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var ingredientVariantId = UUID.randomUUID();
        final var ingredient = Instancio.of(Ingredient.class)
            .set(field(Ingredient::getId), ingredientId)
            .set(
                field(Ingredient::getIngredientVariants),
                new ArrayList<>(List.of(Instancio.of(IngredientVariant.class)
                    .set(field(IngredientVariant::getId), ingredientVariantId)
                    .create()))
            ).create();

        when(ingredientRepository.findById(any())).thenReturn(Optional.of(ingredient));
        when(ingredientRepository.save(any())).thenReturn(ingredient);

        // when
        ingredientServiceImpl.deleteIngredientVariant(ingredientId, ingredientVariantId);

        // then
        verify(ingredientRepository).findById(ingredientId);
        verify(ingredientRepository).save(ingredient);
        assertThat(ingredient.getIngredientVariants()).isEmpty();
    }

    @Test
    void fails_to_delete_ingredient_variant_since_ingredient_missing() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var ingredientVariantId = UUID.randomUUID();

        when(ingredientRepository.findById(any())).thenReturn(Optional.empty());

        // when
        final var exception = catchException(() -> ingredientServiceImpl.deleteIngredientVariant(
            ingredientId,
            ingredientVariantId
        ));

        // then
        assertThat(exception).isInstanceOf(NotFoundException.class)
            .hasMessageContaining(String.format("Ingredient not found for id: %s", ingredientId));
    }

    @Test
    void retrieves_custom_units() {
        // given
        final var id = UUID.randomUUID();
        final var customUnits = Instancio.ofList(CustomUnit.class)
            .size(2)
            .create();
        final var customUnitDtos = Instancio.ofList(CustomUnitDto.class)
            .size(2)
            .create();
        when(customUnitRepository.findAllByIngredientId(any())).thenReturn(customUnits);
        when(customUnitMapper.mapCustomUnitToDto(any(CustomUnit.class)))
            .thenReturn(customUnitDtos.get(0))
            .thenReturn(customUnitDtos.get(1));

        // when
        final var result = ingredientServiceImpl.getCustomUnitsByIngredientId(id);

        // then
        verify(customUnitRepository).findAllByIngredientId(id);
        assertThat(result).containsExactlyElementsOf(customUnitDtos);
    }

    @Test
    void adds_custom_unit() {
        // given
        final var id = UUID.randomUUID();
        final var ingredient = Instancio.of(Ingredient.class).create();
        final var customUnit = Instancio.of(CustomUnit.class)
            .set(field(CustomUnit::getIngredient), ingredient)
            .create();
        final var customUnitDto = Instancio.of(CustomUnitDto.class).create();

        when(ingredientRepository.findById(any())).thenReturn(Optional.of(ingredient));
        when(customUnitRepository.save(any())).thenReturn(customUnit);
        when(customUnitMapper.mapDtoToCustomUnit(customUnitDto, ingredient))
            .thenReturn(customUnit);
        when(customUnitMapper.mapCustomUnitToDto(customUnit)).thenReturn(customUnitDto);

        // when
        final var result = ingredientServiceImpl.addCustomUnitToIngredient(id, customUnitDto);

        // then
        verify(ingredientRepository).findById(id);
        verify(customUnitRepository).save(customUnit);
        assertThat(result).isEqualTo(customUnitDto);
    }

    @Test
    void retrieves_custom_unit() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var customUnitId = UUID.randomUUID();
        final var customUnit = Instancio.of(CustomUnit.class).create();
        final var customUnitDto = Instancio.of(CustomUnitDto.class).create();

        when(ingredientRepository.existsById(any())).thenReturn(true);
        when(customUnitRepository.findById(any())).thenReturn(Optional.of(customUnit));
        when(customUnitMapper.mapCustomUnitToDto(customUnit)).thenReturn(customUnitDto);

        // when
        final var result = ingredientServiceImpl.getCustomUnitById(ingredientId, customUnitId);

        // then
        verify(ingredientRepository).existsById(ingredientId);
        verify(customUnitRepository).findById(customUnitId);
        assertThat(result).isEqualTo(customUnitDto);
    }

    @Test
    void fails_to_retrieve_custom_unit_since_ingredient_missing() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var customUnitId = UUID.randomUUID();
        when(ingredientRepository.existsById(ingredientId)).thenReturn(false);

        // when
        final var exception = catchException(
            () -> ingredientServiceImpl.getCustomUnitById(ingredientId, customUnitId)
        );

        // then
        assertThat(exception).isInstanceOf(NotFoundException.class)
            .hasMessageContaining(String.format("Ingredient not found for id: %s", ingredientId));
    }

    @Test
    void fails_to_retrieve_custom_unit_since_missing() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var customUnitId = UUID.randomUUID();
        when(ingredientRepository.existsById(ingredientId)).thenReturn(true);
        when(customUnitRepository.findById(customUnitId)).thenReturn(Optional.empty());

        // when
        final var exception = catchException(
            () -> ingredientServiceImpl.getCustomUnitById(ingredientId, customUnitId)
        );

        // then
        assertThat(exception).isInstanceOf(NotFoundException.class)
            .hasMessageContaining(String.format("Custom unit not found for id: %s", customUnitId));
    }

    @Test
    void updates_custom_unit() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var customUnitId = UUID.randomUUID();
        final var customUnit = Instancio.of(CustomUnit.class).create();
        final var updatedCustomUnit = Instancio.of(CustomUnit.class).create();
        final var customUnitDto = Instancio.of(CustomUnitDto.class).create();

        when(ingredientRepository.existsById(any())).thenReturn(true);
        when(customUnitRepository.findById(any())).thenReturn(Optional.of(customUnit));
        when(customUnitRepository.save(any())).thenReturn(updatedCustomUnit);
        when(customUnitMapper.updateCustomUnitFromDto(
            customUnit,
            customUnitDto
        )).thenReturn(updatedCustomUnit);
        when(customUnitMapper.mapCustomUnitToDto(updatedCustomUnit))
            .thenReturn(customUnitDto);

        // when
        final var result = ingredientServiceImpl.updateCustomUnit(
            ingredientId,
            customUnitId,
            customUnitDto
        );

        // then
        verify(ingredientRepository).existsById(ingredientId);
        verify(customUnitRepository).findById(customUnitId);
        verify(customUnitRepository).save(updatedCustomUnit);
        assertThat(result).isEqualTo(customUnitDto);
    }

    @Test
    void fails_to_update_custom_unit_since_ingredient_missing() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var customUnitId = UUID.randomUUID();
        final var customUnitDto = Instancio.of(CustomUnitDto.class).create();

        when(ingredientRepository.existsById(ingredientId)).thenReturn(false);

        // when
        final var exception = catchException(() -> ingredientServiceImpl.updateCustomUnit(
            ingredientId,
            customUnitId,
            customUnitDto
        ));

        // then
        assertThat(exception).isInstanceOf(NotFoundException.class)
            .hasMessageContaining(String.format("Ingredient not found for id: %s", ingredientId));
    }

    @Test
    void fails_to_update_custom_unit_since_missing() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var customUnitId = UUID.randomUUID();
        final var customUnitDto = Instancio.of(CustomUnitDto.class).create();

        when(ingredientRepository.existsById(ingredientId)).thenReturn(true);
        when(customUnitRepository.findById(customUnitId)).thenReturn(Optional.empty());

        // when
        final var exception = catchException(() -> ingredientServiceImpl.updateCustomUnit(
            ingredientId,
            customUnitId,
            customUnitDto
        ));

        // then
        assertThat(exception).isInstanceOf(NotFoundException.class)
            .hasMessageContaining(String.format("Custom unit not found for id: %s", customUnitId));
    }

    @Test
    void deletes_custom_unit() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var customUnitId = UUID.randomUUID();
        final var ingredient = Instancio.of(Ingredient.class)
            .set(field(Ingredient::getId), ingredientId)
            .set(
                field(Ingredient::getCustomUnits),
                new ArrayList<>(List.of(Instancio.of(CustomUnit.class)
                    .set(field(CustomUnit::getId), customUnitId)
                    .create()))
            ).create();

        when(ingredientRepository.findById(any())).thenReturn(Optional.of(ingredient));
        when(ingredientRepository.save(any())).thenReturn(ingredient);

        // when
        ingredientServiceImpl.deleteCustomUnit(ingredientId, customUnitId);

        // then
        verify(ingredientRepository).findById(ingredientId);
        verify(ingredientRepository).save(ingredient);
        assertThat(ingredient.getCustomUnits()).isEmpty();
    }

    @Test
    void fails_to_delete_custom_unit_since_ingredient_missing() {
        // given
        final var ingredientId = UUID.randomUUID();
        final var customUnitId = UUID.randomUUID();

        when(ingredientRepository.findById(any())).thenReturn(Optional.empty());

        // when
        final var exception = catchException(() -> ingredientServiceImpl.deleteCustomUnit(
            ingredientId,
            customUnitId
        ));

        // then
        assertThat(exception).isInstanceOf(NotFoundException.class)
            .hasMessageContaining(String.format("Ingredient not found for id: %s", ingredientId));
    }
}
