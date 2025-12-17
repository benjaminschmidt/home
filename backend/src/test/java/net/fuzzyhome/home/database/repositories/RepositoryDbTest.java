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
        final var ingredient = getIngredient();

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
        final var ingredient = getIngredientWithCustomUnit();

        // when
        ingredientRepository.save(ingredient);
        final var result = customUnitRepository.findAll();

        // then
        assertThat(result).singleElement()
            .isEqualTo(ingredient.getCustomUnits()
                           .getFirst());
    }

    @Test
    void ingredient_with_default_ingredient_variant_gets_created() {
        // given
        final var ingredient = getIngredientWithDefaultIngredientVariant();

        // when
        ingredientRepository.save(ingredient);
        final var result = ingredientRepository.findAll();

        // then
        assertThat(result).singleElement()
            .isEqualTo(ingredient);
        assertThat(ingredient.getDefaultIngredientVariant()).isEqualTo(ingredient.getIngredientVariants()
                                                                           .getFirst());
        assertThat(ingredient.getIngredientVariants()
                       .getFirst()
                       .getIngredient()).isEqualTo(ingredient);
    }

    @Test
    void duplicate_ingredient_variant_cannot_be_created() {
        // given
        final var ingredient = getIngredientWithDefaultIngredientVariant();
        ingredientRepository.saveAndFlush(ingredient);
        final var duplicateIngredientVariant = getIngredientVariant();
        duplicateIngredientVariant.setIngredient(ingredient);

        // when
        final var exception =
            catchException(() -> ingredientVariantRepository.saveAndFlush(duplicateIngredientVariant));

        // then
        assertThat(exception).isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class)
            .hasMessageContaining("uc_ingredientvariant_description_per_ingredient");

    }

    private Ingredient getIngredient() {
        return Ingredient.builder()
            .name("ingredient")
            .build();
    }

    private Ingredient getIngredientWithCustomUnit() {
        final var customUnit = getCustomUnit();
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .customUnits(List.of(customUnit))
            .build();
        customUnit.setIngredient(ingredient);
        return ingredient;
    }

    private CustomUnit getCustomUnit() {
        return CustomUnit.builder()
            .name("unit")
            .conversionUnit(GenericUnit.GRAM)
            .conversionUnitToCustomUnitFactor(1.0)
            .build();
    }

    private Ingredient getIngredientWithDefaultIngredientVariant() {
        final var ingredientVariant = getIngredientVariant();
        final var ingredient = Ingredient.builder()
            .name("ingredient")
            .defaultIngredientVariant(ingredientVariant)
            .ingredientVariants(List.of(ingredientVariant))
            .build();
        ingredientVariant.setIngredient(ingredient);

        return ingredient;
    }

    private IngredientVariant getIngredientVariant() {
        return IngredientVariant.builder()
            .description("description")
            .build();
    }

}
