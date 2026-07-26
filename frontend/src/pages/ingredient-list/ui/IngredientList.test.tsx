import { render, screen } from "@testing-library/react";
import type { IngredientDto } from "home-api";
import type { ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";
import { IngredientList } from "@/pages/ingredient-list/ui/IngredientList.tsx";

// noinspection JSUnusedGlobalSymbols
vi.mock("@tanstack/react-router", () => ({
	useLocation: () => ({ pathname: "/ingredients" }),
	createLink: (Comp: ReactNode) => Comp,
}));

describe("IngredientList", () => {
	test("renders", () => {
		// given
		const ingredients: IngredientDto[] = [
			{
				id: "ingredient-1-id",
				name: "Ingredient 1",
				ingredientVariants: [],
				customUnits: [],
			},
			{
				id: "ingredient-2-id",
				name: "Ingredient 2",
				ingredientVariants: [],
				customUnits: [],
			},
		];

		// when
		render(<IngredientList ingredients={ingredients} />);

		// then
		expect(screen.getByText("Ingredient 1")).toBeDefined();
		expect(screen.getByText("Ingredient 2")).toBeDefined();
	});
});
