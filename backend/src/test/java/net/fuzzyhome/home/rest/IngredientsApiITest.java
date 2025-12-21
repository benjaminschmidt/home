package net.fuzzyhome.home.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.zonky.test.db.AutoConfigureEmbeddedDatabase;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.SneakyThrows;
import net.fuzzyhome.home.database.entities.CustomUnit;
import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import net.fuzzyhome.home.database.repositories.CustomUnitRepository;
import net.fuzzyhome.home.database.repositories.IngredientRepository;
import net.fuzzyhome.home.database.repositories.IngredientVariantRepository;
import org.instancio.Instancio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openapitools.model.CustomUnitDto;
import org.openapitools.model.IngredientDto;
import org.openapitools.model.IngredientVariantDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.instancio.Select.field;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureEmbeddedDatabase
class IngredientsApiITest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private IngredientVariantRepository ingredientVariantRepository;

    @Autowired
    private CustomUnitRepository customUnitRepository;

    @BeforeEach
    void setUp() {
        customUnitRepository.deleteAll();
        ingredientVariantRepository.deleteAll();
        ingredientRepository.deleteAll();
    }

    @SneakyThrows
    @Test
    void listIngredients() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(IngredientVariant::getId))
            .ignore(field(CustomUnit::getId))
            .set(field(IngredientVariant::getDefaultVariant), false)
            .create();
        Optional.ofNullable(ingredient.getIngredientVariants())
            .ifPresent(ingredientVariants -> ingredientVariants.forEach(variant -> variant.setIngredient(ingredient)));
        Optional.ofNullable(ingredient.getCustomUnits())
            .ifPresent(customUnits -> customUnits.forEach(customUnit -> customUnit.setIngredient(ingredient)));
        ingredientRepository.saveAndFlush(ingredient);

        // when
        final var result = mockMvc.perform(get("/ingredients"))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            new TypeReference<List<IngredientDto>>() {
            }
        );
        assertThat(response).singleElement()
            .extracting(IngredientDto::getId)
            .isEqualTo(ingredient.getId());
    }

    @SneakyThrows
    @Test
    void createIngredient() {
        // given
        final var ingredientDto = Instancio.of(IngredientDto.class)
            .ignore(field(IngredientDto::getId))
            .set(field(IngredientVariantDto::getDefaultVariant), false)
            .create();

        // when
        mockMvc.perform(post("/ingredients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientDto)))
            .andExpect(status().isCreated());

        // then
        assertThat(ingredientRepository.findAll()).singleElement()
            .extracting(Ingredient::getName)
            .isEqualTo(ingredientDto.getName());
    }

    @SneakyThrows
    @Test
    void getIngredient() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(IngredientVariant::getId))
            .ignore(field(CustomUnit::getId))
            .set(field(IngredientVariant::getDefaultVariant), false)
            .create();
        Optional.ofNullable(ingredient.getIngredientVariants())
            .ifPresent(ingredientVariants -> ingredientVariants.forEach(variant -> variant.setIngredient(ingredient)));
        Optional.ofNullable(ingredient.getCustomUnits())
            .ifPresent(customUnits -> customUnits.forEach(customUnit -> customUnit.setIngredient(ingredient)));
        ingredientRepository.saveAndFlush(ingredient);

        // when
        final var result = mockMvc.perform(get("/ingredients/{ingredientId}", ingredient.getId()))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            IngredientDto.class
        );
        assertThat(response)
            .extracting(IngredientDto::getId)
            .isEqualTo(ingredient.getId());
    }

    @SneakyThrows
    @Test
    void updateIngredient() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(IngredientVariant::getId))
            .ignore(field(CustomUnit::getId))
            .set(field(IngredientVariant::getDefaultVariant), false)
            .create();
        Optional.ofNullable(ingredient.getIngredientVariants())
            .ifPresent(ingredientVariants -> ingredientVariants.forEach(variant -> variant.setIngredient(ingredient)));
        Optional.ofNullable(ingredient.getCustomUnits())
            .ifPresent(customUnits -> customUnits.forEach(customUnit -> customUnit.setIngredient(ingredient)));
        ingredientRepository.saveAndFlush(ingredient);

        final var ingredientDto = Instancio.of(IngredientDto.class)
            .ignore(field(IngredientDto::getId))
            .ignore(field(IngredientVariantDto::getId))
            .ignore(field(CustomUnitDto::getId))
            .set(field(IngredientVariantDto::getDefaultVariant), false)
            .create();

        // when
        mockMvc.perform(put("/ingredients/{ingredientId}", ingredient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientDto)))
            .andExpect(status().isOk());

        // then
        assertThat(ingredientRepository.findAll()).singleElement()
            .extracting(Ingredient::getName)
            .isEqualTo(ingredientDto.getName());
    }

    @SneakyThrows
    @Test
    void deleteIngredient() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(IngredientVariant::getId))
            .ignore(field(CustomUnit::getId))
            .set(field(IngredientVariant::getDefaultVariant), false)
            .create();
        Optional.ofNullable(ingredient.getIngredientVariants())
            .ifPresent(ingredientVariants -> ingredientVariants.forEach(variant -> variant.setIngredient(ingredient)));
        Optional.ofNullable(ingredient.getCustomUnits())
            .ifPresent(customUnits -> customUnits.forEach(customUnit -> customUnit.setIngredient(ingredient)));
        ingredientRepository.saveAndFlush(ingredient);

        // when
        mockMvc.perform(delete("/ingredients/{ingredientId}", ingredient.getId()))
            .andExpect(status().isNoContent());

        // then
        assertThat(ingredientRepository.findAll()).isEmpty();
    }

    @SneakyThrows
    @Test
    void listIngredientVariants() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .ignore(field(IngredientVariant::getId))
            .set(field(IngredientVariant::getDefaultVariant), false)
            .create();
        Optional.ofNullable(ingredient.getIngredientVariants())
            .ifPresent(ingredientVariants -> ingredientVariants.forEach(variant -> variant.setIngredient(ingredient)));
        ingredientRepository.saveAndFlush(ingredient);

        // when
        final var result = mockMvc.perform(get("/ingredients/{ingredientId}/variants", ingredient.getId()))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            new TypeReference<List<IngredientVariantDto>>() {
            }
        );
        assertThat(response).hasSize(ingredient.getIngredientVariants().size());
    }

    @SneakyThrows
    @Test
    void addIngredientVariant() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .ignore(field(IngredientVariant::getId))
            .set(field(IngredientVariant::getDefaultVariant), false)
            .create();
        Optional.ofNullable(ingredient.getIngredientVariants())
            .ifPresent(ingredientVariants -> ingredientVariants.forEach(variant -> variant.setIngredient(ingredient)));
        ingredientRepository.saveAndFlush(ingredient);

        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class)
            .ignore(field(IngredientVariantDto::getId))
            .create();

        // when
        final var result = mockMvc.perform(post("/ingredients/{ingredientId}/variants", ingredient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientVariantDto)))
            .andExpect(status().isCreated())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            IngredientVariantDto.class
        );
        assertThat(response).extracting(IngredientVariantDto::getDescription)
            .isEqualTo(ingredientVariantDto.getDescription());
    }

    @Test
    void getIngredientVariant() throws Exception {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class)
            .ignore(field(IngredientVariant::getId))
            .ignore(field(IngredientVariant::getIngredient))
            .set(field(IngredientVariant::getDescription), "description")
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .ignore(field(IngredientVariant::getId))
            .set(field(Ingredient::getIngredientVariants), List.of(ingredientVariant))
            .create();
        ingredientVariant.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        // when
        final var result = mockMvc.perform(get(
                "/ingredients/{ingredientId}/variants/{variantId}",
                ingredient.getId(),
                ingredientVariant.getId()
            ))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            IngredientVariantDto.class
        );
        assertThat(response).extracting(IngredientVariantDto::getDescription)
            .isEqualTo(ingredientVariant.getDescription());
    }

    @SneakyThrows
    @Test
    void updateIngredientVariant() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class)
            .ignore(field(IngredientVariant::getId))
            .ignore(field(IngredientVariant::getIngredient))
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .ignore(field(IngredientVariant::getId))
            .set(field(Ingredient::getIngredientVariants), List.of(ingredientVariant))
            .create();
        ingredientVariant.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        final var ingredientVariantDto = Instancio.of(IngredientVariantDto.class)
            .ignore(field(IngredientVariantDto::getId))
            .create();

        // when
        final var result = mockMvc.perform(put(
                "/ingredients/{ingredientId}/variants/{variantId}",
                ingredient.getId(),
                ingredientVariant.getId()
            ).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientVariantDto)))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            IngredientVariantDto.class
        );
        assertThat(response).extracting(IngredientVariantDto::getDescription)
            .isEqualTo(ingredientVariantDto.getDescription());
    }

    @SneakyThrows
    @Test
    void deleteIngredientVariant() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class)
            .ignore(field(IngredientVariant::getId))
            .ignore(field(IngredientVariant::getIngredient))
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .ignore(field(IngredientVariant::getId))
            .set(field(Ingredient::getIngredientVariants), List.of(ingredientVariant))
            .create();
        ingredientVariant.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        // when
        mockMvc.perform(delete(
                "/ingredients/{ingredientId}/variants/{variantId}",
                ingredient.getId(),
                ingredientVariant.getId()
            ))
            .andExpect(status().isNoContent());

        // then
        assertThat(ingredientVariantRepository.findAllByIngredientId(
            Objects.requireNonNull(ingredient.getId()))
        ).isEmpty();
    }

    @SneakyThrows
    @Test
    void listCustomUnits() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getIngredientVariants))
            .ignore(field(CustomUnit::getId))
            .create();
        Optional.ofNullable(ingredient.getCustomUnits())
            .ifPresent(customUnits -> customUnits.forEach(customUnit -> customUnit.setIngredient(ingredient)));
        ingredientRepository.saveAndFlush(ingredient);

        // when
        final var result = mockMvc.perform(get("/ingredients/{ingredientId}/custom-units", ingredient.getId()))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            new TypeReference<List<CustomUnitDto>>() {
            }
        );
        assertThat(response).hasSize(ingredient.getCustomUnits().size());
    }

    @SneakyThrows
    @Test
    void addCustomUnit() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getIngredientVariants))
            .ignore(field(CustomUnit::getId))
            .create();
        Optional.ofNullable(ingredient.getCustomUnits())
            .ifPresent(customUnits -> customUnits.forEach(customUnit -> customUnit.setIngredient(ingredient)));
        ingredientRepository.saveAndFlush(ingredient);

        final var customUnitDto = Instancio.of(CustomUnitDto.class)
            .ignore(field(CustomUnitDto::getId))
            .create();

        // when
        final var result = mockMvc.perform(post("/ingredients/{ingredientId}/custom-units", ingredient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customUnitDto)))
            .andExpect(status().isCreated())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            CustomUnitDto.class
        );
        assertThat(response).extracting(CustomUnitDto::getName)
            .isEqualTo(customUnitDto.getName());
    }

    @Test
    void getCustomUnit() throws Exception {
        // given
        final var customUnit = Instancio.of(CustomUnit.class)
            .ignore(field(CustomUnit::getId))
            .ignore(field(CustomUnit::getIngredient))
            .set(field(CustomUnit::getName), "name")
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getIngredientVariants))
            .ignore(field(CustomUnit::getId))
            .set(field(Ingredient::getCustomUnits), List.of(customUnit))
            .create();
        customUnit.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        // when
        final var result = mockMvc.perform(get(
                "/ingredients/{ingredientId}/custom-units/{unitId}",
                ingredient.getId(),
                customUnit.getId()
            ))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            CustomUnitDto.class
        );
        assertThat(response).extracting(CustomUnitDto::getName)
            .isEqualTo(customUnit.getName());
    }

    @SneakyThrows
    @Test
    void updateCustomUnit() {
        // given
        final var customUnit = Instancio.of(CustomUnit.class)
            .ignore(field(CustomUnit::getId))
            .ignore(field(CustomUnit::getIngredient))
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getIngredientVariants))
            .ignore(field(CustomUnit::getId))
            .set(field(Ingredient::getCustomUnits), List.of(customUnit))
            .create();
        customUnit.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        final var customUnitDto = Instancio.of(CustomUnitDto.class)
            .ignore(field(CustomUnitDto::getId))
            .create();

        // when
        final var result = mockMvc.perform(put(
                "/ingredients/{ingredientId}/custom-units/{unitId}",
                ingredient.getId(),
                customUnit.getId()
            ).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customUnitDto)))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            CustomUnitDto.class
        );
        assertThat(response).extracting(CustomUnitDto::getName)
            .isEqualTo(customUnitDto.getName());
    }

    @SneakyThrows
    @Test
    void deleteCustomUnit() {
        // given
        final var customUnit = Instancio.of(CustomUnit.class)
            .ignore(field(CustomUnit::getId))
            .ignore(field(CustomUnit::getIngredient))
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getIngredientVariants))
            .ignore(field(CustomUnit::getId))
            .set(field(Ingredient::getCustomUnits), List.of(customUnit))
            .create();
        customUnit.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        // when
        mockMvc.perform(delete(
                "/ingredients/{ingredientId}/custom-units/{unitId}",
                ingredient.getId(),
                customUnit.getId()
            ))
            .andExpect(status().isNoContent());

        // then
        assertThat(customUnitRepository.findAllByIngredientId(
            Objects.requireNonNull(ingredient.getId()))
        ).isEmpty();
    }

}
