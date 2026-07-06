import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { IngredientListPage } from "@/pages/ingredient-list/ui/IngredientListPage.tsx";
import { ingredientFactory } from "@/shared/testing";

vi.mock("@tanstack/react-router", () => ({
	useLocation: () => ({ pathname: "/ingredients" }),
	createLink: (Comp: ReactNode) => Comp,
}));

describe("IngredientListPage", () => {
	afterEach(() => {
		cleanup();
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	test("renders the search field and ingredients", () => {
		// given
		const ingredients = [
			ingredientFactory.build({ name: "Chicken Breast" }),
			ingredientFactory.build({ name: "Almonds" }),
		];

		// when
		render(
			<IngredientListPage
				ingredients={ingredients}
				search="chicken"
				onSearchChange={vi.fn()}
			/>,
		);

		// then
		expect((screen.getByLabelText("Search") as HTMLInputElement).value).toBe(
			"chicken",
		);
		expect(screen.getByText("Chicken Breast")).toBeDefined();
		expect(screen.getByText("Almonds")).toBeDefined();
	});

	test("forwards search changes", () => {
		// given
		vi.useFakeTimers();
		const onSearchChange = vi.fn();
		render(
			<IngredientListPage
				ingredients={[]}
				search=""
				onSearchChange={onSearchChange}
			/>,
		);

		// when
		fireEvent.change(screen.getByLabelText("Search"), {
			target: { value: "rice" },
		});
		act(() => {
			vi.advanceTimersByTime(300);
		});

		// then
		expect(onSearchChange).toHaveBeenCalledWith("rice");
	});
});
