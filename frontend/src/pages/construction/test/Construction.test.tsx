import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Construction from "@/pages/construction/ui/Construction.tsx";

describe("Construction", () => {
	test("renders", () => {
		render(<Construction />);
		expect(screen.getByText("Under construction")).toBeDefined();
	});
});
