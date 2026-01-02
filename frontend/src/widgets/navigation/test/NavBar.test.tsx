import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NavBar from "@/widgets/navigation/ui/NavBar";
import "@testing-library/jest-dom/vitest";
import type { ReactNode } from "react";

let mockPathname: string;

// noinspection JSUnusedGlobalSymbols
vi.mock("@tanstack/react-router", () => ({
	useLocation: () => ({ pathname: mockPathname }),
	createLink: (Comp: ReactNode) => Comp,
}));

describe("NavBar", () => {
	beforeEach(() => {
		cleanup();
		mockPathname = "/recipes";
	});

	it("renders three navigation actions and two labeled tabs", async () => {
		render(<NavBar />);

		expect(
			await screen.findByRole("link", { name: /recipes/i }),
		).toBeInTheDocument();
		expect(
			await screen.findByRole("link", { name: /ingredients/i }),
		).toBeInTheDocument();
		expect(
			await screen.findByRole("link", { name: /navigate/i }),
		).toBeInTheDocument();

		expect(await screen.findAllByRole("link")).toHaveLength(3);
	});

	it('selects the Recipes tab for "/recipes"', async () => {
		mockPathname = "/recipes";
		render(<NavBar />);

		const recipesLink = await screen.findByRole("link", { name: /recipes/i });
		const ingredientsLink = await screen.findByRole("link", {
			name: /ingredients/i,
		});

		expect(recipesLink).toHaveAttribute("aria-selected", "true");
		expect(ingredientsLink).toHaveAttribute("aria-selected", "false");
	});

	it('selects the Recipes tab for "/"', async () => {
		mockPathname = "/";
		render(<NavBar />);

		const recipesLink = await screen.findByRole("link", { name: /recipes/i });
		const ingredientsLink = await screen.findByRole("link", {
			name: /ingredients/i,
		});

		expect(recipesLink).toHaveAttribute("aria-selected", "true");
		expect(ingredientsLink).toHaveAttribute("aria-selected", "false");
	});

	it('selects the Ingredients tab for "/ingredients"', async () => {
		mockPathname = "/ingredients";
		render(<NavBar />);

		const recipesLink = await screen.findByRole("link", { name: /recipes/i });
		const ingredientsLink = await screen.findByRole("link", {
			name: /ingredients/i,
		});

		expect(recipesLink).toHaveAttribute("aria-selected", "false");
		expect(ingredientsLink).toHaveAttribute("aria-selected", "true");
	});
});
