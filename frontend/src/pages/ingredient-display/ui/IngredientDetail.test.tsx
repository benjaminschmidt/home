import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { IngredientDetail } from "@/pages/ingredient-display/ui/IngredientDetail.tsx";
import { ingredientFactory, ingredientVariantFactory } from "@/shared/testing";

afterEach(cleanup);

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

	test("applies serving changes", async () => {
		// given
		const onServingChange = vi.fn();
		const variant = ingredientVariantFactory.build({
			defaultVariant: true,
			unit: "GRAM",
			servingSize: 100,
		});
		const ingredient = ingredientFactory.build({
			ingredientVariants: [variant],
		});

		// when
		render(
			<IngredientDetail
				ingredientDto={ingredient}
				rawVariantId={variant.id}
				onServingChange={onServingChange}
			/>,
		);
		fireEvent.click(screen.getByLabelText("Change serving"));
		fireEvent.change(screen.getByLabelText("Amount"), {
			target: { value: "250" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Apply" }));

		// then
		expect(onServingChange).toHaveBeenCalledWith({
			servingSize: 250,
			unit: "GRAM",
		});
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
	});
});
