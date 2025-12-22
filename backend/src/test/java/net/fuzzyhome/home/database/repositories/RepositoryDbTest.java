package net.fuzzyhome.home.database.repositories;

import io.zonky.test.db.AutoConfigureEmbeddedDatabase;
import java.util.List;
import net.fuzzyhome.home.constants.GenericUnit;
import net.fuzzyhome.home.database.entities.CustomUnit;
import net.fuzzyhome.home.database.entities.Ingredient;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchException;

@AutoConfigureEmbeddedDatabase
@DataJpaTest
class RepositoryDbTest {

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
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .build();

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
        final var customUnit = CustomUnit.builder()
            .name("unit")
            .conversionUnit(GenericUnit.GRAM)
            .conversionUnitToCustomUnitFactor(1.0)
            .build();
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .customUnits(List.of(customUnit))
            .build();
        customUnit.setIngredient(ingredient);

        // when
        ingredientRepository.save(ingredient);
        final var result = customUnitRepository.findAll();

        // then
        assertThat(result).singleElement()
            .isEqualTo(ingredient.getCustomUnits()
                           .getFirst());
    }

    @Test
    void ingredient_with_ingredient_variants_gets_created() {
        // given
        final var ingredientVariantOne = IngredientVariant.builder()
            .description("description")
            .defaultVariant(false)
            .build();
        final var ingredientVariantTwo = IngredientVariant.builder()
            .description("description2")
            .defaultVariant(false)
            .build();
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .ingredientVariants(List.of(ingredientVariantOne, ingredientVariantTwo))
            .build();
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
        final var ingredientVariant = IngredientVariant.builder()
            .description("description")
            .defaultVariant(true)
            .build();
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .ingredientVariants(List.of(ingredientVariant))
            .build();
        ingredientVariant.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);
        final var duplicateIngredientVariant = IngredientVariant.builder()
            .description("description")
            .defaultVariant(false)
            .build();
        duplicateIngredientVariant.setIngredient(ingredient);

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
        final var ingredientVariant = IngredientVariant.builder()
            .description("description")
            .defaultVariant(true)
            .build();
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .ingredientVariants(List.of(ingredientVariant))
            .build();
        ingredientVariant.setIngredient(ingredient);
        ingredientRepository.saveAndFlush(ingredient);

        final var secondIngredientVariant = IngredientVariant.builder()
            .description("description2")
            .defaultVariant(false)
            .build();
        secondIngredientVariant.setIngredient(ingredient);
        ingredientVariantRepository.saveAndFlush(secondIngredientVariant);

        final var thirdIngredientVariant = IngredientVariant.builder()
            .description("description3")
            .defaultVariant(true)
            .build();
        thirdIngredientVariant.setIngredient(ingredient);

        // when
        final var exception = catchException(() -> ingredientVariantRepository.saveAndFlush(thirdIngredientVariant));

        // then
        assertThat(exception).isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class)
            .hasMessageContaining("idx_ingredientvariant_default_variant");
    }

}
