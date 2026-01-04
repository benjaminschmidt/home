import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { ReactNode } from "react";
import { MenuDrawer } from "../ui/MenuDrawer.tsx";

// noinspection JSUnusedGlobalSymbols
vi.mock("@tanstack/react-router", () => ({
	useLocation: () => ({ pathname: "/" }),
	createLink: (Comp: ReactNode) => Comp,
}));

describe("MenuDrawer", () => {
	beforeEach(() => {
		cleanup();
	});

	it("renders mobile drawer", async () => {
		render(
			<MenuDrawer
				mobileOpen={true}
				setMobileOpen={() => {}}
				setIsClosing={() => {}}
			/>,
		);

		expect(await screen.findByLabelText("mobile-navigation")).toBeVisible();
	});

	it("mobile drawer is hidden", async () => {
		render(
			<MenuDrawer
				mobileOpen={false}
				setMobileOpen={() => {}}
				setIsClosing={() => {}}
			/>,
		);

		expect(await screen.findByLabelText("mobile-navigation")).toHaveAttribute(
			"aria-hidden",
			"true",
		);
	});

	it("desktop drawer is visible", async () => {
		render(
			<MenuDrawer
				mobileOpen={false}
				setMobileOpen={() => {}}
				setIsClosing={() => {}}
			/>,
		);

		expect(await screen.findByLabelText("desktop-navigation")).toBeVisible();
	});
});
