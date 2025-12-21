package net.fuzzyhome.home.database.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.fuzzyhome.home.database.enums.GenericUnit;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;

@AllArgsConstructor
@Builder
@Entity
@Getter
@NoArgsConstructor
@Setter
@Table(
    uniqueConstraints = @UniqueConstraint(
        name = "uc_customunit_name_per_ingredient", columnNames = {"ingredient_id", "name"}
    ), indexes = {
    @Index(name = "idx_customunit_ingredient", columnList = "ingredient_id")
}
)
public class CustomUnit {
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    @Nullable
    private UUID id;

    @Column(nullable = false)
    @NonNull
    private String name;

    @Nullable
    private Double conversionUnitToCustomUnitFactor;

    @Enumerated(EnumType.STRING)
    @Nullable
    private GenericUnit conversionUnit;

    @JoinColumn(nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @Nullable
    private Ingredient ingredient;

    @Override
    public boolean equals(@Nullable final Object other) {
        if (other instanceof final CustomUnit customUnit) {
            return Objects.equals(this.getId(), customUnit.getId());
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
