CREATE TABLE custom_unit
(
    id                                    UUID         NOT NULL,
    name                                  VARCHAR(255) NOT NULL,
    conversion_unit_to_custom_unit_factor DOUBLE PRECISION,
    conversion_unit                       VARCHAR(255),
    ingredient_id                         UUID         NOT NULL,
    CONSTRAINT pk_customunit PRIMARY KEY (id)
);

CREATE TABLE ingredient
(
    id                                 UUID         NOT NULL,
    name                               VARCHAR(255) NOT NULL,
    weight_to_volume_conversion_factor DOUBLE PRECISION,
    conversion_weight_unit             VARCHAR(255),
    conversion_volume_unit             VARCHAR(255),
    CONSTRAINT pk_ingredient PRIMARY KEY (id)
);

CREATE TABLE ingredient_variant
(
    id              UUID         NOT NULL,
    description     VARCHAR(255) NOT NULL,
    default_variant BOOLEAN      NOT NULL,
    unit            VARCHAR(255),
    serving_size    DOUBLE PRECISION,
    calories        DOUBLE PRECISION,
    carbohydrate    DOUBLE PRECISION,
    fat             DOUBLE PRECISION,
    protein         DOUBLE PRECISION,
    saturated_fat   DOUBLE PRECISION,
    sodium          DOUBLE PRECISION,
    sugar           DOUBLE PRECISION,
    ingredient_id   UUID         NOT NULL,
    CONSTRAINT pk_ingredientvariant PRIMARY KEY (id)
);

ALTER TABLE custom_unit
    ADD CONSTRAINT uc_customunit_name_per_ingredient UNIQUE (ingredient_id, name);

ALTER TABLE ingredient
    ADD CONSTRAINT uc_ingredient_name UNIQUE (name);

ALTER TABLE ingredient_variant
    ADD CONSTRAINT uc_ingredientvariant_description_per_ingredient UNIQUE (ingredient_id, description);

CREATE INDEX idx_ingredient_name ON ingredient (name);

CREATE UNIQUE INDEX idx_ingredientvariant_default_variant ON ingredient_variant (ingredient_id, default_variant)
    WHERE ("default_variant" IS true);

ALTER TABLE custom_unit
    ADD CONSTRAINT FK_CUSTOMUNIT_ON_INGREDIENT FOREIGN KEY (ingredient_id) REFERENCES ingredient (id);

CREATE INDEX idx_customunit_ingredient ON custom_unit (ingredient_id);

ALTER TABLE ingredient_variant
    ADD CONSTRAINT FK_INGREDIENTVARIANT_ON_INGREDIENT FOREIGN KEY (ingredient_id) REFERENCES ingredient (id);

CREATE INDEX idx_ingredientvariant_ingredient ON ingredient_variant (ingredient_id);
