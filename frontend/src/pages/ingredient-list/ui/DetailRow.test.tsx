import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DetailRow } from "@/pages/ingredient-list/ui/DetailRow.tsx";

describe("DetailRow", () => {
	test("renders label with colon", () => {
		const { container } = render(
			<DetailRow label="Calories" value="250 kcal" />,
		);
		expect(container.querySelector("dt")?.textContent).toBe("Calories:");
	});

	test("renders value", () => {
		const { container } = render(
			<DetailRow label="Calories" value="250 kcal" />,
		);
		expect(container.querySelector("dd")?.textContent).toBe("250 kcal");
	});
});
