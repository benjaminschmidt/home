import { render, screen } from "@testing-library/react";
import type { IngredientDtoRoot } from "home-api/dist/src";
import type { ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";
import { IngredientList } from "../ui/IngredientList.tsx";

// noinspection JSUnusedGlobalSymbols
vi.mock("@tanstack/react-router", () => ({
	useLocation: () => ({ pathname: "/ingredients" }),
	createLink: (Comp: ReactNode) => Comp,
}));

describe("IngredientList", () => {
	test("renders", () => {
		const ingredients: IngredientDtoRoot[] = [
			{
				name: "Ingredient 1",
			},
			{
				name: "Ingredient 2",
			},
		];

		render(<IngredientList ingredients={ingredients} />);
		expect(screen.getByText("Ingredient 1")).toBeDefined();
		expect(screen.getByText("Ingredient 2")).toBeDefined();
	});
});
