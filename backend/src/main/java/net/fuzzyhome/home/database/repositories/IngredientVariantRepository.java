package net.fuzzyhome.home.database.repositories;

import java.util.List;
import java.util.UUID;
import net.fuzzyhome.home.database.entities.IngredientVariant;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientVariantRepository extends JpaRepository<@NonNull IngredientVariant, @NonNull UUID> {
    @NonNull List<IngredientVariant> findAllByIngredientId(@NonNull UUID ingredientId);
}
