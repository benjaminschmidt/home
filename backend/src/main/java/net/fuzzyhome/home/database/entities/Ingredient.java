package net.fuzzyhome.home.database.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.fuzzyhome.home.database.enums.VolumeUnit;
import net.fuzzyhome.home.database.enums.WeightUnit;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;

@AllArgsConstructor
@Builder
@Entity
@Getter
@NoArgsConstructor
@Setter
@Table
public class Ingredient {
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    @Nullable
    private UUID id;

    @NonNull
    @Column(nullable = false, unique = true)
    private String name;

    @Nullable
    private Double weightToVolumeConversionFactor;

    @Enumerated(EnumType.STRING)
    @Nullable
    private WeightUnit conversionWeightUnit;

    @Enumerated(EnumType.STRING)
    @Nullable
    private VolumeUnit conversionVolumeUnit;

    @Nullable
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "ingredient", orphanRemoval = true)
    private List<IngredientVariant> ingredientVariants;

    @Nullable
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "ingredient", orphanRemoval = true)
    private List<CustomUnit> customUnits;

    @Override
    public boolean equals(@Nullable final Object other) {
        if (other instanceof final Ingredient ingredient) {
            return Objects.equals(this.getId(), ingredient.getId());
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
