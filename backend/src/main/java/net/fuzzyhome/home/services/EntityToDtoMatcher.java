package net.fuzzyhome.home.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import lombok.Getter;
import org.jspecify.annotations.NonNull;
import org.springframework.data.util.Pair;

@Getter
public class EntityToDtoMatcher<S, T> {

    private final List<S> entitiesToDelete;
    private final List<T> dtosToCreate;
    private final List<Pair<S, T>> entitiesToUpdate;

    public EntityToDtoMatcher(
        @NonNull final List<S> entities,
        @NonNull final Function<S, String> entityIdentifier,
        @NonNull final List<T> dtos,
        @NonNull final Function<T, String> dtoIdentifier
    ) {
        final var entitySet = new HashSet<>(entities);
        final var dtoSet = new HashSet<>(dtos);
        entitiesToUpdate = new ArrayList<>();

        for (final var entity : entities) {
            for (final var dto : dtos) {
                if (Objects.equals(
                    entityIdentifier.apply(entity),
                    dtoIdentifier.apply(dto)
                )) {
                    entitiesToUpdate.add(Pair.of(entity, dto));
                    entitySet.remove(entity);
                    dtoSet.remove(dto);
                }
            }
        }

        entitiesToDelete = new ArrayList<>(entitySet);
        dtosToCreate = new ArrayList<>(dtoSet);
    }
}
