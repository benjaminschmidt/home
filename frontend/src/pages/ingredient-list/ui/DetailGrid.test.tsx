import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DetailGrid } from "@/pages/ingredient-list/ui/DetailGrid.tsx";

describe("DetailGrid", () => {
	test("renders a single row", () => {
		const { container } = render(
			<DetailGrid detailArray={[{ label: "Calories", value: "250 kcal" }]} />,
		);
		expect(container.querySelector("dt")?.textContent).toBe("Calories:");
		expect(container.querySelector("dd")?.textContent).toBe("250 kcal");
	});

	test("renders all rows for multiple items", () => {
		const detailArray = [
			{ label: "Calories", value: "250 kcal" },
			{ label: "Fat", value: "5 g" },
			{ label: "Protein", value: "10 g" },
		];
		const { container } = render(<DetailGrid detailArray={detailArray} />);
		const dts = container.querySelectorAll("dt");
		const dds = container.querySelectorAll("dd");
		expect(dts).toHaveLength(3);
		expect(dds).toHaveLength(3);
		expect(dts[0].textContent).toBe("Calories:");
		expect(dts[1].textContent).toBe("Fat:");
		expect(dts[2].textContent).toBe("Protein:");
		expect(dds[0].textContent).toBe("250 kcal");
		expect(dds[1].textContent).toBe("5 g");
		expect(dds[2].textContent).toBe("10 g");
	});
});
