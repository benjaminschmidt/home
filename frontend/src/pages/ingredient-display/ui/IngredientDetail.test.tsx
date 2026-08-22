import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { IngredientDetail } from "@/pages/ingredient-display/ui/IngredientDetail.tsx";
import { ingredientFactory, ingredientVariantFactory } from "@/shared/testing";

afterEach(cleanup);

const createTestRouter = (ui: ReactNode) => {
	const rootRoute = createRootRoute({ component: () => ui });
	return createRouter({
		routeTree: rootRoute,
		history: createMemoryHistory(),
	});
};

const renderWithRouter = async (ui: ReactNode) => {
	const router = createTestRouter(ui);
	const result = render(<RouterProvider router={router} />);
	await act(() => router.load());
	return result;
};

describe("IngredientDetail", () => {
	test("renders the selected ingredient detail card", async () => {
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
		const { container } = await renderWithRouter(
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

	test("renders conversion warnings", async () => {
		// given
		const ingredient = ingredientFactory.build({
			ingredientVariants: [],
		});

		// when
		const { container } = await renderWithRouter(
			<IngredientDetail ingredientDto={ingredient} />,
		);

		// then
		expect(container.textContent).toContain(
			"Ingredient has no variants at all.",
		);
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
		await renderWithRouter(
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
		await waitFor(() => {
			expect(onServingChange).toHaveBeenCalledWith({
				servingSize: 250,
				unit: "GRAM",
			});
			expect(screen.queryByRole("dialog")).toBeNull();
		});
	});

	test("renders an edit link to the ingredient's edit route", async () => {
		// given
		const ingredient = ingredientFactory.build({ ingredientVariants: [] });

		// when
		await renderWithRouter(<IngredientDetail ingredientDto={ingredient} />);

		// then
		expect(
			screen.getByRole("link", { name: "Edit ingredient" }),
		).toHaveProperty(
			"href",
			expect.stringContaining(`/ingredients/${ingredient.id}/edit`),
		);
	});
});
