package net.fuzzyhome.home.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.zonky.test.db.AutoConfigureEmbeddedDatabase;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import lombok.SneakyThrows;
import net.fuzzyhome.home.database.entities.CustomUnit;
import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import net.fuzzyhome.home.database.enums.VolumeUnit;
import net.fuzzyhome.home.database.enums.WeightUnit;
import net.fuzzyhome.home.database.repositories.CustomUnitRepository;
import net.fuzzyhome.home.database.repositories.IngredientRepository;
import net.fuzzyhome.home.database.repositories.IngredientVariantRepository;
import org.instancio.Instancio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openapitools.model.CustomUnitDto;
import org.openapitools.model.CustomUnitWriteRequest;
import org.openapitools.model.IngredientDto;
import org.openapitools.model.IngredientVariantDto;
import org.openapitools.model.IngredientVariantWriteRequest;
import org.openapitools.model.IngredientWriteRequest;
import org.openapitools.model.VolumeUnitDto;
import org.openapitools.model.WeightUnitDto;
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

    private IngredientWriteRequest noConversionRequest(final UUID defaultVariantId) {
        return Instancio.of(IngredientWriteRequest.class)
            .set(field(IngredientWriteRequest::getConversionWeightAmount), null)
            .set(field(IngredientWriteRequest::getConversionVolumeAmount), null)
            .set(field(IngredientWriteRequest::getConversionWeightUnit), null)
            .set(field(IngredientWriteRequest::getConversionVolumeUnit), null)
            .set(field(IngredientWriteRequest::getDefaultVariantId), defaultVariantId)
            .create();
    }

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
    void listIngredients_second_page_with_search() {
        // given
        final var ingredients = Instancio.ofList(Ingredient.class)
            .size(3)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .ignore(field(Ingredient::getIngredientVariants))
            .create();

        ingredients.get(0).setName("name");
        ingredients.get(1).setName("test1");
        ingredients.get(2).setName("test2");

        ingredientRepository.saveAllAndFlush(ingredients);

        // when
        final var result = mockMvc.perform(get("/ingredients")
                .queryParam("page", "1")
                .queryParam("size", "1")
                .queryParam("search", "test"))
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
            .isEqualTo(ingredients.get(2).getId());
    }

    @SneakyThrows
    @Test
    void createIngredientWithoutChildren() {
        // given
        final var ingredientWriteRequest = noConversionRequest(null);

        // when
        final var result = mockMvc.perform(post("/ingredients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientWriteRequest)))
            .andExpect(status().isCreated())
            .andReturn();

        // then
        final var response = objectMapper.readValue(result.getResponse().getContentAsString(), IngredientDto.class);
        assertThat(response.getIngredientVariants()).isEmpty();
        assertThat(response.getCustomUnits()).isEmpty();
        assertThat(ingredientRepository.findAll()).singleElement()
            .extracting(Ingredient::getName)
            .isEqualTo(ingredientWriteRequest.getName());
        assertThat(ingredientVariantRepository.findAll()).isEmpty();
        assertThat(customUnitRepository.findAll()).isEmpty();
    }

    @SneakyThrows
    @Test
    void createIngredientWithConversionAmounts() {
        // given
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class)
            .set(field(IngredientWriteRequest::getName), "Olive oil")
            .set(field(IngredientWriteRequest::getConversionWeightAmount), 100.0)
            .set(field(IngredientWriteRequest::getConversionVolumeAmount), 92.0)
            .set(field(IngredientWriteRequest::getConversionWeightUnit), WeightUnitDto.GRAM)
            .set(field(IngredientWriteRequest::getConversionVolumeUnit), VolumeUnitDto.MILLILITER)
            .set(field(IngredientWriteRequest::getDefaultVariantId), null)
            .create();

        // when
        final var result = mockMvc.perform(post("/ingredients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientWriteRequest)))
            .andExpect(status().isCreated())
            .andReturn();

        // then
        final var response = objectMapper.readValue(result.getResponse().getContentAsString(), IngredientDto.class);
        assertThat(response.getConversionWeightAmount()).isEqualTo(100.0);
        assertThat(response.getConversionVolumeAmount()).isEqualTo(92.0);
        assertThat(response.getConversionWeightUnit()).isEqualTo(WeightUnitDto.GRAM);
        assertThat(response.getConversionVolumeUnit()).isEqualTo(VolumeUnitDto.MILLILITER);

        final var getResult = mockMvc.perform(get("/ingredients/{ingredientId}", response.getId()))
            .andExpect(status().isOk())
            .andReturn();
        final var fetchedIngredient = objectMapper.readValue(
            getResult.getResponse().getContentAsString(),
            IngredientDto.class
        );
        assertThat(fetchedIngredient.getConversionWeightAmount()).isEqualTo(100.0);
        assertThat(fetchedIngredient.getConversionVolumeAmount()).isEqualTo(92.0);
    }

    @SneakyThrows
    @Test
    void createIngredientRejectsIncompleteConversion() {
        mockMvc.perform(post("/ingredients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "name", "Olive oil",
                    "conversionWeightAmount", 100.0,
                    "conversionVolumeAmount", 92.0,
                    "conversionWeightUnit", "GRAM"
                ))))
            .andExpect(status().isBadRequest());
    }

    @SneakyThrows
    @Test
    void createIngredientRejectsPartialAmounts() {
        mockMvc.perform(post("/ingredients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "name", "Olive oil",
                    "conversionWeightAmount", 100.0,
                    "conversionWeightUnit", "GRAM",
                    "conversionVolumeUnit", "MILLILITER"
                ))))
            .andExpect(status().isBadRequest());
    }

    @SneakyThrows
    @Test
    void createIngredientRejectsNonPositiveConversionAmounts() {
        mockMvc.perform(post("/ingredients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "name", "Olive oil",
                    "conversionWeightAmount", 0.0,
                    "conversionVolumeAmount", 92.0,
                    "conversionWeightUnit", "GRAM",
                    "conversionVolumeUnit", "MILLILITER"
                ))))
            .andExpect(status().isBadRequest());
    }

    @SneakyThrows
    @Test
    void updateIngredientWithConversionAmounts() {
        // given
        final var ingredient = Ingredient.builder()
            .name("Olive oil")
            .build();
        ingredientRepository.saveAndFlush(ingredient);
        final var ingredientWriteRequest = Instancio.of(IngredientWriteRequest.class)
            .set(field(IngredientWriteRequest::getName), "Olive oil")
            .set(field(IngredientWriteRequest::getConversionWeightAmount), 100.0)
            .set(field(IngredientWriteRequest::getConversionVolumeAmount), 92.0)
            .set(field(IngredientWriteRequest::getConversionWeightUnit), WeightUnitDto.GRAM)
            .set(field(IngredientWriteRequest::getConversionVolumeUnit), VolumeUnitDto.MILLILITER)
            .set(field(IngredientWriteRequest::getDefaultVariantId), null)
            .create();

        // when
        final var result = mockMvc.perform(put("/ingredients/{ingredientId}", ingredient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientWriteRequest)))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(result.getResponse().getContentAsString(), IngredientDto.class);
        assertThat(response.getConversionWeightAmount()).isEqualTo(100.0);
        assertThat(response.getConversionVolumeAmount()).isEqualTo(92.0);
        assertThat(ingredientRepository.findById(ingredient.getId()))
            .get()
            .extracting(Ingredient::getConversionWeightAmount, Ingredient::getConversionVolumeAmount)
            .containsExactly(100.0, 92.0);
    }

    @SneakyThrows
    @Test
    void updateIngredientRejectsIncompleteConversion() {
        // given
        final var ingredient = Ingredient.builder()
            .name("Olive oil")
            .build();
        ingredientRepository.saveAndFlush(ingredient);

        // when
        mockMvc.perform(put("/ingredients/{ingredientId}", ingredient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "name", "Olive oil",
                    "conversionWeightAmount", 100.0,
                    "conversionVolumeAmount", 92.0,
                    "conversionWeightUnit", "GRAM"
                ))))
            .andExpect(status().isBadRequest());

        // then
        final var unchangedIngredient = ingredientRepository.findById(ingredient.getId()).orElseThrow();
        assertThat(unchangedIngredient.getConversionWeightAmount()).isNull();
        assertThat(unchangedIngredient.getConversionVolumeAmount()).isNull();
    }

    @SneakyThrows
    @Test
    void updateIngredientClearsConversionWhenAllFieldsAreOmitted() {
        // given
        final var ingredient = Ingredient.builder()
            .name("Olive oil")
            .conversionWeightAmount(100.0)
            .conversionVolumeAmount(92.0)
            .conversionWeightUnit(WeightUnit.GRAM)
            .conversionVolumeUnit(VolumeUnit.MILLILITER)
            .build();
        ingredientRepository.saveAndFlush(ingredient);

        // when
        mockMvc.perform(put("/ingredients/{ingredientId}", ingredient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(noConversionRequest(null))))
            .andExpect(status().isOk());

        // then
        final var clearedIngredient = ingredientRepository.findById(ingredient.getId()).orElseThrow();
        assertThat(clearedIngredient.getConversionWeightAmount()).isNull();
        assertThat(clearedIngredient.getConversionVolumeAmount()).isNull();
        assertThat(clearedIngredient.getConversionWeightUnit()).isNull();
        assertThat(clearedIngredient.getConversionVolumeUnit()).isNull();
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
    void getIngredient_sortsVariantsByDescription() {
        // given
        final var wholeVariant = IngredientVariant.builder()
            .description("Whole")
            .defaultVariant(false)
            .build();
        final var slicedVariant = IngredientVariant.builder()
            .description("Sliced")
            .defaultVariant(false)
            .build();
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .ingredientVariants(List.of(wholeVariant, slicedVariant))
            .build();
        wholeVariant.setIngredient(ingredient);
        slicedVariant.setIngredient(ingredient);
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
        assertThat(response.getIngredientVariants()).extracting(IngredientVariantDto::getDescription)
            .containsExactly("Sliced", "Whole");
    }

    @SneakyThrows
    @Test
    void getIngredient_omitsNullValues() {
        // given
        final var ingredientVariant = IngredientVariant.builder()
            .description("variant")
            .defaultVariant(false)
            .build();
        final var customUnit = CustomUnit.builder()
            .name("custom")
            .build();
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .ingredientVariants(List.of(ingredientVariant))
            .customUnits(List.of(customUnit))
            .build();
        ingredientVariant.setIngredient(ingredient);
        customUnit.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        // when
        final var result = mockMvc.perform(get("/ingredients/{ingredientId}", ingredient.getId()))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(response.has("conversionWeightAmount")).isFalse();
        assertThat(response.has("conversionVolumeAmount")).isFalse();
        assertThat(response.has("conversionWeightUnit")).isFalse();
        assertThat(response.has("conversionVolumeUnit")).isFalse();
        assertThat(response.get("ingredientVariants").get(0).has("unit")).isFalse();
        assertThat(response.get("ingredientVariants").get(0).has("servingSize")).isFalse();
        assertThat(response.get("customUnits").get(0).has("customUnitToConversionUnitFactor")).isFalse();
        assertThat(response.get("customUnits").get(0).has("conversionUnit")).isFalse();
    }

    @SneakyThrows
    @Test
    void updateIngredientPreservesChildren() {
        // given
        final var ingredientVariant = IngredientVariant.builder()
            .description("variant")
            .defaultVariant(true)
            .build();
        final var customUnit = CustomUnit.builder()
            .name("custom unit")
            .build();
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .ingredientVariants(List.of(ingredientVariant))
            .customUnits(List.of(customUnit))
            .build();
        ingredientVariant.setIngredient(ingredient);
        customUnit.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        final var ingredientWriteRequest = noConversionRequest(null);

        // when
        final var result = mockMvc.perform(put("/ingredients/{ingredientId}", ingredient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientWriteRequest)))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(result.getResponse().getContentAsString(), IngredientDto.class);
        assertThat(response.getIngredientVariants())
            .extracting(IngredientVariantDto::getId)
            .containsExactly(ingredientVariant.getId());
        assertThat(response.getCustomUnits())
            .extracting(CustomUnitDto::getId)
            .containsExactly(customUnit.getId());
        assertThat(ingredientRepository.findAll()).singleElement()
            .extracting(Ingredient::getName)
            .isEqualTo(ingredientWriteRequest.getName());
    }

    @SneakyThrows
    @Test
    void updateIngredientSetsDefaultVariant() {
        // given
        final var variantA = IngredientVariant.builder()
            .description("variant A")
            .defaultVariant(true)
            .build();
        final var variantB = IngredientVariant.builder()
            .description("variant B")
            .defaultVariant(false)
            .build();
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .ingredientVariants(List.of(variantA, variantB))
            .build();
        variantA.setIngredient(ingredient);
        variantB.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        final var ingredientWriteRequest = noConversionRequest(variantB.getId());

        // when
        final var result = mockMvc.perform(put("/ingredients/{ingredientId}", ingredient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientWriteRequest)))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(result.getResponse().getContentAsString(), IngredientDto.class);
        assertThat(response.getIngredientVariants())
            .filteredOn(IngredientVariantDto::getDefaultVariant)
            .extracting(IngredientVariantDto::getId)
            .containsExactly(variantB.getId());
        assertThat(ingredientVariantRepository.findById(Objects.requireNonNull(variantA.getId())))
            .get()
            .extracting(IngredientVariant::getDefaultVariant)
            .isEqualTo(false);
        assertThat(ingredientVariantRepository.findById(Objects.requireNonNull(variantB.getId())))
            .get()
            .extracting(IngredientVariant::getDefaultVariant)
            .isEqualTo(true);
    }

    @SneakyThrows
    @Test
    void updateIngredientClearsDefaultVariantWhenOmitted() {
        // given
        final var ingredientVariant = IngredientVariant.builder()
            .description("variant")
            .defaultVariant(true)
            .build();
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .ingredientVariants(List.of(ingredientVariant))
            .build();
        ingredientVariant.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        final var ingredientWriteRequest = noConversionRequest(null);

        // when
        mockMvc.perform(put("/ingredients/{ingredientId}", ingredient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientWriteRequest)))
            .andExpect(status().isOk());

        // then
        assertThat(ingredientVariantRepository.findById(Objects.requireNonNull(ingredientVariant.getId())))
            .get()
            .extracting(IngredientVariant::getDefaultVariant)
            .isEqualTo(false);
    }

    @SneakyThrows
    @Test
    void updateIngredientFailsForUnknownDefaultVariantId() {
        // given
        final var ingredientVariant = IngredientVariant.builder()
            .description("variant")
            .defaultVariant(true)
            .build();
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .ingredientVariants(List.of(ingredientVariant))
            .build();
        ingredientVariant.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        final var ingredientWriteRequest = noConversionRequest(UUID.randomUUID());

        // when
        mockMvc.perform(put("/ingredients/{ingredientId}", ingredient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientWriteRequest)))
            .andExpect(status().isBadRequest());

        // then
        assertThat(ingredientVariantRepository.findById(Objects.requireNonNull(ingredientVariant.getId())))
            .get()
            .extracting(IngredientVariant::getDefaultVariant)
            .isEqualTo(true);
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
            .ignore(field(Ingredient::getIngredientVariants))
            .create();
        final var wholeVariant = IngredientVariant.builder()
            .description("Whole")
            .defaultVariant(false)
            .ingredient(ingredient)
            .build();
        final var slicedVariant = IngredientVariant.builder()
            .description("Sliced")
            .defaultVariant(false)
            .ingredient(ingredient)
            .build();
        ingredient.setIngredientVariants(List.of(wholeVariant, slicedVariant));
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
        assertThat(response).extracting(IngredientVariantDto::getDescription)
            .containsExactly("Sliced", "Whole");
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

        final var ingredientVariantWriteRequest = Instancio.of(IngredientVariantWriteRequest.class).create();

        // when
        final var result = mockMvc.perform(post("/ingredients/{ingredientId}/variants", ingredient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientVariantWriteRequest)))
            .andExpect(status().isCreated())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            IngredientVariantDto.class
        );
        assertThat(response).extracting(IngredientVariantDto::getDescription)
            .isEqualTo(ingredientVariantWriteRequest.getDescription());
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
    void ingredientVariantCannotBeAccessedThroughDifferentIngredient() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class)
            .ignore(field(IngredientVariant::getId))
            .ignore(field(IngredientVariant::getIngredient))
            .set(field(IngredientVariant::getDescription), "original description")
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .set(field(Ingredient::getName), "variant owner")
            .set(field(Ingredient::getIngredientVariants), List.of(ingredientVariant))
            .create();
        ingredientVariant.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        final var otherIngredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .ignore(field(Ingredient::getIngredientVariants))
            .set(field(Ingredient::getName), "other variant ingredient")
            .create();
        ingredientRepository.saveAndFlush(otherIngredient);

        final var ingredientVariantWriteRequest = Instancio.of(IngredientVariantWriteRequest.class)
            .set(field(IngredientVariantWriteRequest::getDescription), "changed description")
            .create();

        // when / then
        mockMvc.perform(get(
                "/ingredients/{ingredientId}/variants/{variantId}",
                otherIngredient.getId(),
                ingredientVariant.getId()
            ))
            .andExpect(status().isNotFound());

        mockMvc.perform(put(
                "/ingredients/{ingredientId}/variants/{variantId}",
                otherIngredient.getId(),
                ingredientVariant.getId()
            ).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientVariantWriteRequest)))
            .andExpect(status().isNotFound());

        mockMvc.perform(delete(
                "/ingredients/{ingredientId}/variants/{variantId}",
                otherIngredient.getId(),
                ingredientVariant.getId()
            ))
            .andExpect(status().isNotFound());

        assertThat(ingredientVariantRepository.findById(
            Objects.requireNonNull(ingredientVariant.getId())
        )).get()
            .extracting(IngredientVariant::getDescription)
            .isEqualTo("original description");
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

        final var ingredientVariantWriteRequest = Instancio.of(IngredientVariantWriteRequest.class)
            .set(field(IngredientVariantWriteRequest::getDescription), "renamed variant")
            .create();

        // when
        final var result = mockMvc.perform(put(
                "/ingredients/{ingredientId}/variants/{variantId}",
                ingredient.getId(),
                ingredientVariant.getId()
            ).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredientVariantWriteRequest)))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            IngredientVariantDto.class
        );
        assertThat(response).extracting(IngredientVariantDto::getDescription)
            .isEqualTo(ingredientVariantWriteRequest.getDescription());
        assertThat(response.getId()).isEqualTo(ingredientVariant.getId());
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
        assertThat(ingredientVariantRepository.findAllByIngredientIdOrderByDescriptionAsc(
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

        final var customUnitWriteRequest = Instancio.of(CustomUnitWriteRequest.class).create();

        // when
        final var result = mockMvc.perform(post("/ingredients/{ingredientId}/custom-units", ingredient.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customUnitWriteRequest)))
            .andExpect(status().isCreated())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            CustomUnitDto.class
        );
        assertThat(response).extracting(CustomUnitDto::getName)
            .isEqualTo(customUnitWriteRequest.getName());
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
    void customUnitCannotBeAccessedThroughDifferentIngredient() {
        // given
        final var customUnit = Instancio.of(CustomUnit.class)
            .ignore(field(CustomUnit::getId))
            .ignore(field(CustomUnit::getIngredient))
            .set(field(CustomUnit::getName), "original unit")
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getIngredientVariants))
            .set(field(Ingredient::getName), "custom unit owner")
            .set(field(Ingredient::getCustomUnits), List.of(customUnit))
            .create();
        customUnit.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        final var otherIngredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .ignore(field(Ingredient::getIngredientVariants))
            .set(field(Ingredient::getName), "other custom unit ingredient")
            .create();
        ingredientRepository.saveAndFlush(otherIngredient);

        final var customUnitWriteRequest = Instancio.of(CustomUnitWriteRequest.class)
            .set(field(CustomUnitWriteRequest::getName), "changed unit")
            .create();

        // when / then
        mockMvc.perform(get(
                "/ingredients/{ingredientId}/custom-units/{unitId}",
                otherIngredient.getId(),
                customUnit.getId()
            ))
            .andExpect(status().isNotFound());

        mockMvc.perform(put(
                "/ingredients/{ingredientId}/custom-units/{unitId}",
                otherIngredient.getId(),
                customUnit.getId()
            ).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customUnitWriteRequest)))
            .andExpect(status().isNotFound());

        mockMvc.perform(delete(
                "/ingredients/{ingredientId}/custom-units/{unitId}",
                otherIngredient.getId(),
                customUnit.getId()
            ))
            .andExpect(status().isNotFound());

        assertThat(customUnitRepository.findById(
            Objects.requireNonNull(customUnit.getId())
        )).get()
            .extracting(CustomUnit::getName)
            .isEqualTo("original unit");
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

        final var customUnitWriteRequest = Instancio.of(CustomUnitWriteRequest.class)
            .set(field(CustomUnitWriteRequest::getName), "renamed custom unit")
            .create();

        // when
        final var result = mockMvc.perform(put(
                "/ingredients/{ingredientId}/custom-units/{unitId}",
                ingredient.getId(),
                customUnit.getId()
            ).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customUnitWriteRequest)))
            .andExpect(status().isOk())
            .andReturn();

        // then
        final var response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            CustomUnitDto.class
        );
        assertThat(response).extracting(CustomUnitDto::getName)
            .isEqualTo(customUnitWriteRequest.getName());
        assertThat(response.getId()).isEqualTo(customUnit.getId());
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
