import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { IngredientDetail } from "@/pages/ingredient-display/ui/IngredientDetail.tsx";
import { ingredientFactory, ingredientVariantFactory } from "@/shared/testing";

describe("IngredientDetail", () => {
	test("renders the selected ingredient detail card", () => {
		// given
		const variant = ingredientVariantFactory.build({
			description: "Cooked breast",
			defaultVariant: true,
			unit: "GRAM",
			servingSize: 100,
			calories: 165,
			carbohydrate: 0,
			protein: 31,
			fat: 3.6,
		});
		const ingredient = ingredientFactory.build({
			name: "Chicken Breast",
			ingredientVariants: [variant],
		});

		// when
		const { container } = render(
			<IngredientDetail ingredientDto={ingredient} rawVariantId={variant.id} />,
		);

		// then
		expect(container.textContent).toContain("Chicken Breast");
		expect(container.textContent).toContain("Cooked breast");
		expect(container.textContent).toContain("100 g");
		expect(container.textContent).toContain("165 kcal");
		expect(container.textContent).toContain("Carbs");
		expect(container.textContent).toContain("31 g");
	});

	test("renders conversion warnings", () => {
		// given
		const ingredient = ingredientFactory.build({
			ingredientVariants: [],
		});

		// when
		const { container } = render(
			<IngredientDetail ingredientDto={ingredient} />,
		);

		// then
		expect(container.textContent).toContain(
			"Ingredient has no variants at all.",
		);
	});

	test("renders selector when ingredient has variants", () => {
		// given
		const ingredient = ingredientFactory.build({
			ingredientVariants: ingredientVariantFactory.buildList(2, {
				defaultVariant: false,
			}),
		});

		// when
		const { container } = render(
			<IngredientDetail ingredientDto={ingredient} />,
		);

		// then
		expect(container.querySelector("input")).not.toBeNull();
	});
});
