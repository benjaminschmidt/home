package net.fuzzyhome.home.database.repositories;

import io.zonky.test.db.AutoConfigureEmbeddedDatabase;
import java.util.List;
import java.util.Optional;
import net.fuzzyhome.home.database.entities.CustomUnit;
import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import org.instancio.Instancio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchException;
import static org.instancio.Select.field;

@AutoConfigureEmbeddedDatabase
@DataJpaTest
class IngredientsDbTest {

    @Autowired
    private CustomUnitRepository customUnitRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private IngredientVariantRepository ingredientVariantRepository;

    @BeforeEach
    void setUp() {
        customUnitRepository.deleteAll();
        ingredientVariantRepository.deleteAll();
        ingredientRepository.deleteAll();
    }

    @Test
    void ingredient_gets_created() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .ignore(field(Ingredient::getIngredientVariants))
            .create();

        // when
        ingredientRepository.save(ingredient);
        final var result = ingredientRepository.findAll();

        // then
        assertThat(result).singleElement()
            .isEqualTo(ingredient);
    }

    @Test
    void custom_unit_gets_created_through_ingredient() {
        // given
        final var customUnit = Instancio.of(CustomUnit.class)
            .ignore(field(CustomUnit::getId))
            .ignore(field(CustomUnit::getIngredient))
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getIngredientVariants))
            .set(field(Ingredient::getCustomUnits), List.of(customUnit))
            .create();
        customUnit.setIngredient(ingredient);

        // when
        ingredientRepository.save(ingredient);
        final var result = customUnitRepository.findAll();

        // then
        assertThat(result).singleElement()
            .isEqualTo(customUnit);
    }

    @Test
    void ingredient_with_ingredient_variants_gets_created() {
        // given
        final var ingredientVariantOne = Instancio.of(IngredientVariant.class)
            .ignore(field(IngredientVariant::getId))
            .ignore(field(IngredientVariant::getIngredient))
            .create();
        final var ingredientVariantTwo = Instancio.of(IngredientVariant.class)
            .ignore(field(IngredientVariant::getId))
            .ignore(field(IngredientVariant::getIngredient))
            .set(field(IngredientVariant::getDefaultVariant), false)
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .set(field(Ingredient::getIngredientVariants), List.of(ingredientVariantOne, ingredientVariantTwo))
            .create();
        ingredientVariantOne.setIngredient(ingredient);
        ingredientVariantTwo.setIngredient(ingredient);

        // when
        ingredientRepository.save(ingredient);
        final var result = ingredientRepository.findAll();

        // then
        assertThat(result).singleElement()
            .isEqualTo(ingredient);

        assertThat(ingredient.getIngredientVariants()).hasSize(2)
            .containsExactlyInAnyOrder(ingredientVariantOne, ingredientVariantTwo);
    }

    @Test
    void duplicate_ingredient_variant_cannot_be_created() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class)
            .ignore(field(IngredientVariant::getId))
            .ignore(field(IngredientVariant::getIngredient))
            .set(field(IngredientVariant::getDescription), "description")
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .set(field(Ingredient::getIngredientVariants), List.of(ingredientVariant))
            .create();
        ingredientVariant.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);
        final var duplicateIngredientVariant = Instancio.of(IngredientVariant.class)
            .ignore(field(IngredientVariant::getId))
            .set(field(IngredientVariant::getDescription), "description")
            .set(field(IngredientVariant::getDefaultVariant), false)
            .set(field(IngredientVariant::getIngredient), ingredient)
            .create();

        // when
        final var exception =
            catchException(() -> ingredientVariantRepository.saveAndFlush(duplicateIngredientVariant));

        // then
        assertThat(exception).isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class)
            .hasMessageContaining("uc_ingredientvariant_description_per_ingredient");
    }

    @Test
    void two_default_ingredient_variants_cannot_be_created() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class)
            .ignore(field(IngredientVariant::getId))
            .ignore(field(IngredientVariant::getIngredient))
            .set(field(IngredientVariant::getDefaultVariant), true)
            .create();
        final var secondIngredientVariant = Instancio.of(IngredientVariant.class)
            .ignore(field(IngredientVariant::getId))
            .ignore(field(IngredientVariant::getIngredient))
            .set(field(IngredientVariant::getDefaultVariant), false)
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .set(field(Ingredient::getIngredientVariants), List.of(ingredientVariant, secondIngredientVariant))
            .create();
        ingredientVariant.setIngredient(ingredient);
        secondIngredientVariant.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        final var thirdIngredientVariant = Instancio.of(IngredientVariant.class)
            .ignore(field(IngredientVariant::getId))
            .set(field(IngredientVariant::getDefaultVariant), true)
            .set(field(IngredientVariant::getIngredient), ingredient)
            .create();

        // when
        final var exception = catchException(() -> ingredientVariantRepository.saveAndFlush(thirdIngredientVariant));

        // then
        assertThat(exception).isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class)
            .hasMessageContaining("idx_ingredientvariant_default_variant");
    }

    @Test
    void retrieve_ingredient_variants_by_ingredient_id() {
        // given
        final var ingredientVariant = Instancio.of(IngredientVariant.class)
            .ignore(field(IngredientVariant::getId))
            .ignore(field(IngredientVariant::getIngredient))
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getCustomUnits))
            .set(field(Ingredient::getIngredientVariants), List.of(ingredientVariant))
            .create();
        ingredientVariant.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        // when
        final var result = Optional.ofNullable(ingredient.getId())
            .map(ingredientVariantRepository::findAllByIngredientId)
            .orElse(List.of());

        // then
        assertThat(result).singleElement()
            .isEqualTo(ingredientVariant);
    }

    @Test
    void retrieve_custom_units_by_ingredient_id() {
        // given
        final var customUnit = Instancio.of(CustomUnit.class)
            .ignore(field(CustomUnit::getId))
            .ignore(field(CustomUnit::getIngredient))
            .create();
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getIngredientVariants))
            .set(field(Ingredient::getCustomUnits), List.of(customUnit))
            .create();
        customUnit.setIngredient(ingredient);
        ingredientRepository.save(ingredient);

        // when
        final var result = Optional.ofNullable(ingredient.getId())
            .map(customUnitRepository::findAllByIngredientId)
            .orElse(List.of());

        // then
        assertThat(result).singleElement()
            .isEqualTo(customUnit);
    }

    @Test
    void retrieve_ingredients_with_search() {
        // given
        final var ingredient = Instancio.of(Ingredient.class)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getIngredientVariants))
            .ignore(field(Ingredient::getCustomUnits))
            .set(field(Ingredient::getName), "testIngredient")
            .create();
        ingredientRepository.saveAndFlush(ingredient);
        ingredientRepository.saveAllAndFlush(Instancio.ofList(Ingredient.class)
            .size(4)
            .ignore(field(Ingredient::getId))
            .ignore(field(Ingredient::getIngredientVariants))
            .ignore(field(Ingredient::getCustomUnits))
            .create());

        // when
        final var result = ingredientRepository.findByNameContainingIgnoreCase(
            "tingredi",
            PageRequest.of(0, 10, Sort.by("name"))
        );

        // then
        assertThat(result.getContent()).singleElement()
            .isEqualTo(ingredient);
    }

}
