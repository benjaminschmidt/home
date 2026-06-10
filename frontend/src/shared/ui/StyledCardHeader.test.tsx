import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { StyledCardHeader } from "@/shared/ui/StyledCardHeader.tsx";

describe("StyledCardHeader", () => {
	test("renders the title text", () => {
		// when
		const { container } = render(
			<StyledCardHeader title="Chicken Breast" forceCompact />,
		);

		// then
		expect(container.textContent).toContain("Chicken Breast");
	});
});
