import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CardHeader } from "@/shared/ui/card/CardHeader.tsx";

describe("CardHeader", () => {
	test("renders the title text", () => {
		// when
		const { container } = render(
			<CardHeader title="Chicken Breast" forceCompact />,
		);

		// then
		expect(container.textContent).toContain("Chicken Breast");
	});
});
