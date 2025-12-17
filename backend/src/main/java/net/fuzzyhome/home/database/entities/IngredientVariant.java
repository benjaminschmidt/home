package net.fuzzyhome.home.database.entities;

import jakarta.persistence.*;
import java.util.Objects;
import java.util.UUID;
import lombok.*;
import net.fuzzyhome.home.constants.GenericUnit;
import org.jspecify.annotations.Nullable;

@AllArgsConstructor
@Builder
@Entity
@Getter
@NoArgsConstructor
@Setter
@Table(
    uniqueConstraints = @UniqueConstraint(
        name = "uc_ingredientvariant_description_per_ingredient", columnNames = {"ingredient_id", "description"}
    ), indexes = {
    @Index(
        name = "idx_ingredientvariant_ingredient", columnList = "ingredient_id"
    )
}
)
public class IngredientVariant {
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    private UUID id;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    private GenericUnit unit;

    private Double servingSize;

    private Double calories;

    private Double carbohydrate;

    private Double fat;

    private Double protein;

    private Double saturatedFat;

    private Double sodium;

    private Double sugar;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Ingredient ingredient;

    @Override
    public boolean equals(@Nullable final Object other) {
        if (other instanceof final IngredientVariant ingredientVariant) {
            return Objects.equals(this.getId(), ingredientVariant.getId());
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
