import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { StyledCardHeader } from "@/pages/ingredient-list/ui/StyledCardHeader.tsx";

describe("StyledCardHeader", () => {
	test("renders the title text", () => {
		const { container } = render(<StyledCardHeader title="Chicken Breast" />);
		expect(container.textContent).toContain("Chicken Breast");
	});
});
