import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";
import { Construction } from "../ui/Construction.tsx";

// noinspection JSUnusedGlobalSymbols
vi.mock("@tanstack/react-router", () => ({
	useLocation: () => ({ pathname: "/" }),
	createLink: (Comp: ReactNode) => Comp,
}));

describe("Construction", () => {
	test("renders", () => {
		render(<Construction />);
		expect(screen.getByText("Under construction")).toBeDefined();
	});
});
