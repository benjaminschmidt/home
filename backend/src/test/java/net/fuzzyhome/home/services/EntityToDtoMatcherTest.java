package net.fuzzyhome.home.services;

import net.fuzzyhome.home.database.entities.IngredientVariant;
import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.openapitools.model.IngredientVariantDto;
import org.springframework.data.util.Pair;

import static org.assertj.core.api.Assertions.assertThat;
import static org.instancio.Select.field;

class EntityToDtoMatcherTest {

    @Test
    void sorts_entities_and_dtos_into_correct_buckets() {
        // given
        final var entities = Instancio.ofList(IngredientVariant.class)
            .size(3)
            .set(field(IngredientVariant::getDefaultVariant), false)
            .create();
        final var dtos = Instancio.ofList(IngredientVariantDto.class)
            .size(3)
            .set(field(IngredientVariantDto::getDefaultVariant), false)
            .create();
        dtos.getFirst().setDescription(entities.get(2).getDescription());

        // when
        final var result = new EntityToDtoMatcher<>(
            entities,
            IngredientVariant::getDescription,
            dtos,
            IngredientVariantDto::getDescription
        );

        // then
        assertThat(result.getEntitiesToDelete()).containsExactlyInAnyOrder(entities.get(1), entities.get(0));
        assertThat(result.getDtosToCreate()).containsExactlyInAnyOrder(dtos.get(2), dtos.get(1));
        assertThat(result.getEntitiesToUpdate()).singleElement()
            .extracting(Pair::getFirst, Pair::getSecond)
            .containsExactly(entities.get(2), dtos.get(0));
    }

}
