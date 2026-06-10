import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { OverviewGridElement } from "@/shared/ui/OverviewGridElement.tsx";

describe("OverviewGridElement", () => {
	test("renders label", () => {
		// when
		const { container } = render(
			<OverviewGridElement label="Calories" value="250 kcal" />,
		);

		// then
		expect(container.querySelector("dt")?.textContent).toBe("Calories");
	});

	test("renders value", () => {
		// when
		const { container } = render(
			<OverviewGridElement label="Calories" value="250 kcal" />,
		);

		// then
		expect(container.querySelector("dd")?.textContent).toBe("250 kcal");
	});
});
