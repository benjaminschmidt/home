import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { act, render } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, test } from "vitest";
import { IngredientListItem } from "@/pages/ingredient-list/ui/IngredientListItem.tsx";
import { ingredientFactory, ingredientVariantFactory } from "@/shared/testing";

const createTestRouter = (ui: React.ReactNode) => {
	const rootRoute = createRootRoute({ component: () => ui });
	return createRouter({
		routeTree: rootRoute,
		history: createMemoryHistory(),
	});
};

const renderWithRouter = async (ui: React.ReactNode) => {
	const router = createTestRouter(ui);
	const result = render(<RouterProvider router={router} />);
	await act(() => router.load());
	return result;
};

describe("IngredientListItem", () => {
	test("renders the ingredient name", async () => {
		// given
		const ingredient = ingredientFactory.build({ name: "Chicken Breast" });

		// when
		const { container } = await renderWithRouter(
			<IngredientListItem ingredient={ingredient} />,
		);

		// then
		expect(container.textContent).toContain("Chicken Breast");
	});

	test("renders no selector when ingredient has no variants", async () => {
		// given
		const ingredient = ingredientFactory.build({ ingredientVariants: [] });

		// when
		const { container } = await renderWithRouter(
			<IngredientListItem ingredient={ingredient} />,
		);

		// then
		expect(container.querySelector("input")).toBeNull();
	});

	test("renders selector when ingredient has variants", async () => {
		// given
		const ingredient = ingredientFactory.build({
			ingredientVariants: ingredientVariantFactory.buildList(2, {
				defaultVariant: false,
			}),
		});

		// when
		const { container } = await renderWithRouter(
			<IngredientListItem ingredient={ingredient} />,
		);

		// then
		expect(container.querySelector("input")).not.toBeNull();
	});

	test("selects the defaultVariant as the initial selection", async () => {
		// given
		const ingredient = ingredientFactory.build({
			ingredientVariants: [
				ingredientVariantFactory.build({
					defaultVariant: false,
					calories: 100,
				}),
				ingredientVariantFactory.build({ defaultVariant: true, calories: 165 }),
			],
		});

		// when
		const { container } = await renderWithRouter(
			<IngredientListItem ingredient={ingredient} />,
		);

		// then
		expect(container.textContent).toContain("165 kcal");
	});
});
