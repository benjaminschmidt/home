package net.fuzzyhome.home.database.entities;

import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.*;
import net.fuzzyhome.home.constants.VolumeUnit;
import net.fuzzyhome.home.constants.WeightUnit;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import org.jspecify.annotations.Nullable;

@AllArgsConstructor
@Builder
@Entity
@Getter
@NoArgsConstructor
@Setter
@Table(
    indexes = {
        @Index(name = "idx_ingredient_default_variant", columnList = "default_ingredient_variant_id")
    }
)
public class Ingredient {
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    private Double weightToVolumeConversionFactor;

    @Enumerated(EnumType.STRING)
    private WeightUnit conversionWeightUnit;

    @Enumerated(EnumType.STRING)
    private VolumeUnit conversionVolumeUnit;

    @OneToOne
    @JoinColumn(name = "default_ingredient_variant_id", referencedColumnName = "id", unique = true)
    @NotFound(action = NotFoundAction.IGNORE)
    private IngredientVariant defaultIngredientVariant;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ingredient", orphanRemoval = true)
    private List<IngredientVariant> ingredientVariants;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ingredient", orphanRemoval = true)
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
