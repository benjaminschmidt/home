import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { ReactNode } from "react";
import { MenuDrawerContent } from "@/widgets/layout/ui/MenuDrawerContent.tsx";

let mockPathname: string;

// noinspection JSUnusedGlobalSymbols
vi.mock("@tanstack/react-router", () => ({
	useLocation: () => ({ pathname: mockPathname }),
	createLink: (Comp: ReactNode) => Comp,
}));

describe("MenuDrawerContent", () => {
	beforeEach(() => {
		cleanup();
		mockPathname = "/";
	});

	it('selects the Recipes tab for "/recipes"', async () => {
		// given
		mockPathname = "/recipes";

		// when
		render(<MenuDrawerContent />);

		// then
		expect(screen.getByRole("link", { name: /recipes/i })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		expect(screen.getByRole("link", { name: /ingredients/i })).toHaveAttribute(
			"aria-selected",
			"false",
		);
	});

	it('selects the Recipes tab for "/"', async () => {
		// given
		mockPathname = "/";

		// when
		render(<MenuDrawerContent />);

		// then
		expect(screen.getByRole("link", { name: /recipes/i })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		expect(screen.getByRole("link", { name: /ingredients/i })).toHaveAttribute(
			"aria-selected",
			"false",
		);
	});

	it('selects the Ingredients tab for "/ingredients"', async () => {
		// given
		mockPathname = "/ingredients";

		// when
		render(<MenuDrawerContent />);

		// then
		expect(screen.getByRole("link", { name: /recipes/i })).toHaveAttribute(
			"aria-selected",
			"false",
		);
		expect(screen.getByRole("link", { name: /ingredients/i })).toHaveAttribute(
			"aria-selected",
			"true",
		);
	});
});
