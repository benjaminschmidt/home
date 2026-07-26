package net.fuzzyhome.home.database.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import net.fuzzyhome.home.database.entities.CustomUnit;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomUnitRepository extends JpaRepository<@NonNull CustomUnit, @NonNull UUID> {
    @NonNull List<CustomUnit> findAllByIngredientId(@NonNull UUID ingredientId);

    @NonNull Optional<CustomUnit> findByIdAndIngredientId(
        @NonNull UUID id,
        @NonNull UUID ingredientId
    );
}
