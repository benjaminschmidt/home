package net.fuzzyhome.home.database.repositories;

import java.util.UUID;
import net.fuzzyhome.home.database.entities.Ingredient;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientRepository extends JpaRepository<@NonNull Ingredient, @NonNull UUID> {
    @NonNull
    Page<Ingredient> findByNameContainingIgnoreCase(@NonNull final String search, @NonNull final Pageable pageable);
}
