-- Clear existing data (optional, use with caution)
-- TRUNCATE TABLE ingredient_variant, custom_unit, ingredient CASCADE;

DO $$
DECLARE
    ing_id UUID;
BEGIN
    -- 1. Chicken Breast
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name, weight_to_volume_conversion_factor, conversion_weight_unit, conversion_volume_unit)
    VALUES (ing_id, 'Chicken Breast', 1.04, 'GRAM', 'MILLILITER');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, fat, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'Raw, Skinless', true, 'GRAM', 100, 165, 0, 3.6, 31, ing_id);

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, fat, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'Cooked, Grilled', false, 'GRAM', 100, 151, 3.1, 29, ing_id);

    -- 2. Olive Oil
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name, weight_to_volume_conversion_factor, conversion_weight_unit, conversion_volume_unit)
    VALUES (ing_id, 'Olive Oil', 0.92, 'GRAM', 'MILLILITER');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, fat, saturated_fat, ingredient_id)
    VALUES (gen_random_uuid(), 'Extra Virgin', true, 'TABLESPOON', 1, 119, 13.5, 1.9, ing_id);

    -- 3. Whole Milk
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name, weight_to_volume_conversion_factor, conversion_weight_unit, conversion_volume_unit)
    VALUES (ing_id, 'Whole Milk', 1.03, 'GRAM', 'MILLILITER');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, fat, protein, sugar, sodium, ingredient_id)
    VALUES (gen_random_uuid(), 'Standard 3.5%', true, 'CUP', 1, 149, 12, 8, 8, 12, 105, ing_id);

    -- 4. Brown Rice
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Brown Rice');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'Long Grain, Dry', true, 'GRAM', 100, 367, 77, 7.5, ing_id);

    -- 5. Broccoli
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Broccoli');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'Fresh, Raw', true, 'GRAM', 100, 34, 6.6, 2.8, ing_id);

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, ingredient_id)
    VALUES (gen_random_uuid(), 'Steamed (Minimal info)', false, 'GRAM', 100, ing_id);

    -- 6. Salt
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Sea Salt');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, sodium, ingredient_id)
    VALUES (gen_random_uuid(), 'Fine Grain', true, 'TEASPOON', 1, 2325, ing_id);

    -- 7. Black Beans
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Black Beans');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'Canned, Drained', true, 'GRAM', 130, 114, 20, 7.6, ing_id);

    -- 8. Egg
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Chicken Egg');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, fat, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'Large', true, 'GRAM', 50, 72, 4.8, 6.3, ing_id);

    -- 9. Greek Yogurt
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Greek Yogurt');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, protein, sugar, ingredient_id)
    VALUES (gen_random_uuid(), 'Non-Fat, Plain', true, 'GRAM', 170, 100, 18, 6, ing_id);

    -- 10. Honey
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name, weight_to_volume_conversion_factor, conversion_weight_unit, conversion_volume_unit)
    VALUES (ing_id, 'Honey', 1.42, 'GRAM', 'MILLILITER');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, sugar, ingredient_id)
    VALUES (gen_random_uuid(), 'Raw Wildflower', true, 'TABLESPOON', 1, 64, 17, 17, ing_id);

    -- 11. Salmon
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Salmon');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, fat, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'Atlantic, Farmed', true, 'GRAM', 100, 208, 13, 20, ing_id);

    -- 12. Spinach
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Spinach');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'Baby Spinach', true, 'GRAM', 100, 23, 3.6, 2.9, ing_id);

    -- 13. Almonds
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Almonds');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, fat, protein, carbohydrate, ingredient_id)
    VALUES (gen_random_uuid(), 'Whole, Raw', true, 'GRAM', 28, 164, 14, 6, 6, ing_id);

    -- 14. Garlic
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Garlic');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, ingredient_id)
    VALUES (gen_random_uuid(), 'Fresh Clove', true, 'GRAM', 3, 4, ing_id);

    -- 15. Banana
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Banana');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, sugar, ingredient_id)
    VALUES (gen_random_uuid(), 'Medium', true, 'GRAM', 118, 105, 27, 14, ing_id);

    -- 16. Butter
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Butter');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, fat, saturated_fat, ingredient_id)
    VALUES (gen_random_uuid(), 'Unsalted', true, 'TABLESPOON', 1, 102, 11.5, 7.3, ing_id);

    -- 17. Onion
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Yellow Onion');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, ingredient_id)
    VALUES (gen_random_uuid(), 'Raw, Chopped', true, 'GRAM', 100, 40, 9, ing_id);

    -- 18. Flour
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'All-Purpose Flour');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'White, Bleached', true, 'CUP', 1, 455, 95, 13, ing_id);

    -- 19. Soy Sauce
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Soy Sauce');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, protein, sodium, ingredient_id)
    VALUES (gen_random_uuid(), 'Regular', true, 'TABLESPOON', 1, 9, 1.3, 879, ing_id);

    -- 20. Quinoa
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Quinoa');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, protein, fat, ingredient_id)
    VALUES (gen_random_uuid(), 'White, Cooked', true, 'CUP', 1, 222, 39, 8, 3.6, ing_id);

    -- 21. Red Lentils
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Red Lentils');
    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'Dry', true, 'GRAM', 100, 358, 63, 24, ing_id);

    -- 22. Coconut Milk (With Custom Unit)
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name, weight_to_volume_conversion_factor, conversion_weight_unit, conversion_volume_unit)
    VALUES (ing_id, 'Coconut Milk', 1.01, 'GRAM', 'MILLILITER');

    INSERT INTO custom_unit (id, name, custom_unit_to_conversion_unit_factor, conversion_unit, ingredient_id)
    VALUES (gen_random_uuid(), 'Can', 400, 'MILLILITER', ing_id);

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, fat, ingredient_id)
    VALUES (gen_random_uuid(), 'Full Fat', true, 'MILLILITER', 100, 197, 21, ing_id);

    -- 23. Pasta (Missing Serving Size/Unit)
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Fusilli Pasta');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, ingredient_id)
    VALUES (gen_random_uuid(), 'Dry, Standard', true, 'GRAM', 100, 352, 71, ing_id);

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, ingredient_id)
    VALUES (gen_random_uuid(), 'Unknown Prep (Missing Unit/Size)', false, NULL, NULL, ing_id);

    -- 24. Avocado (With Custom Unit)
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Avocado');

    INSERT INTO custom_unit (id, name, custom_unit_to_conversion_unit_factor, conversion_unit, ingredient_id)
    VALUES (gen_random_uuid(), 'Medium Fruit', 150, 'GRAM', ing_id);

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, fat, ingredient_id)
    VALUES (gen_random_uuid(), 'Hass, Raw', true, 'GRAM', 100, 160, 15, ing_id);

    -- 25. Tomato (Missing Unit)
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Tomato');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, ingredient_id)
    VALUES (gen_random_uuid(), 'Roma', true, NULL, 120, 22, ing_id);

    -- 26. Peanut Butter (With Custom Unit)
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Peanut Butter');

    INSERT INTO custom_unit (id, name, custom_unit_to_conversion_unit_factor, conversion_unit, ingredient_id)
    VALUES (gen_random_uuid(), 'Small Jar', 340, 'GRAM', ing_id);

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, fat, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'Creamy', true, 'TABLESPOON', 2, 188, 16, 8, ing_id);

    -- 27. Rolled Oats
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Rolled Oats');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'Old Fashioned', true, 'CUP', 0.5, 150, 27, 5, ing_id);

    -- 28. Chicken Thigh
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Chicken Thigh');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, fat, protein, ingredient_id)
    VALUES (gen_random_uuid(), 'Skin-on, Bone-in', true, 'GRAM', 100, 229, 15, 22, ing_id);

    -- 29. Maple Syrup (With Custom Unit)
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name, weight_to_volume_conversion_factor, conversion_weight_unit, conversion_volume_unit)
    VALUES (ing_id, 'Maple Syrup', 1.32, 'GRAM', 'MILLILITER');

    INSERT INTO custom_unit (id, name, custom_unit_to_conversion_unit_factor, conversion_unit, ingredient_id)
    VALUES (gen_random_uuid(), 'Shot', 30, 'MILLILITER', ing_id);

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, carbohydrate, sugar, ingredient_id)
    VALUES (gen_random_uuid(), 'Grade A Amber', true, 'TABLESPOON', 1, 52, 13.4, 12.1, ing_id);

    -- 30. Cucumber (Missing Serving Size)
    ing_id := gen_random_uuid();
    INSERT INTO ingredient (id, name) VALUES (ing_id, 'Cucumber');

    INSERT INTO ingredient_variant (id, description, default_variant, unit, serving_size, calories, ingredient_id)
    VALUES (gen_random_uuid(), 'English, Seedless', true, 'GRAM', NULL, 15, ing_id);

END $$;
