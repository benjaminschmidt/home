import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { StyledCardActionSelector } from "@/pages/ingredient-list/ui/StyledCardActionSelector.tsx";

describe("StyledCardActionSelector", () => {
	test("renders null when options is empty", () => {
		const { container } = render(
			<StyledCardActionSelector
				selectedIndex={0}
				setSelectedIndex={vi.fn()}
				options={[]}
			/>,
		);
		expect(container.firstChild).toBeNull();
	});

	test("renders a select when options are provided", () => {
		const { container } = render(
			<StyledCardActionSelector
				selectedIndex={0}
				setSelectedIndex={vi.fn()}
				options={[{ default: false, id: "1", value: "Whole" }]}
			/>,
		);
		expect(container.querySelector("input")).not.toBeNull();
	});

	test("renders the selected option value", () => {
		const { container } = render(
			<StyledCardActionSelector
				selectedIndex={1}
				setSelectedIndex={vi.fn()}
				options={[
					{ default: false, id: "1", value: "Whole" },
					{ default: false, id: "2", value: "Sliced" },
				]}
			/>,
		);
		expect(container.textContent).toContain("Sliced");
	});

	test("prefixes default option with star", () => {
		const { container } = render(
			<StyledCardActionSelector
				selectedIndex={0}
				setSelectedIndex={vi.fn()}
				options={[{ default: true, id: "1", value: "Whole" }]}
			/>,
		);
		expect(container.textContent).toContain("★");
	});

	test("does not prefix non-default option with star", () => {
		const { container } = render(
			<StyledCardActionSelector
				selectedIndex={0}
				setSelectedIndex={vi.fn()}
				options={[{ default: false, id: "1", value: "Whole" }]}
			/>,
		);
		expect(container.textContent).not.toContain("★");
	});
});
