import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { IngredientListItem } from "@/pages/ingredient-list/ui/IngredientListItem.tsx";

describe("IngredientListItem", () => {
	test("renders the ingredient name", () => {
		const { container } = render(
			<IngredientListItem ingredient={{ name: "Chicken Breast" }} />,
		);
		expect(container.textContent).toContain("Chicken Breast");
	});

	test("renders no selector when ingredient has no variants", () => {
		const { container } = render(
			<IngredientListItem ingredient={{ name: "Chicken Breast" }} />,
		);
		expect(container.querySelector("input")).toBeNull();
	});

	test("renders selector when ingredient has variants", () => {
		const { container } = render(
			<IngredientListItem
				ingredient={{
					name: "Chicken Breast",
					ingredientVariants: [
						{ description: "Raw", defaultVariant: false },
						{ description: "Cooked", defaultVariant: false },
					],
				}}
			/>,
		);
		expect(container.querySelector("input")).not.toBeNull();
	});

	test("selects the defaultVariant as the initial selection", () => {
		const { container } = render(
			<IngredientListItem
				ingredient={{
					name: "Chicken Breast",
					ingredientVariants: [
						{ description: "Raw", defaultVariant: false, calories: 100 },
						{ description: "Cooked", defaultVariant: true, calories: 165 },
					],
				}}
			/>,
		);
		expect(container.textContent).toContain("165 kcal");
	});
});
