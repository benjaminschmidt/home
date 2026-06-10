import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { StyledCardActionSelector } from "@/shared/ui/StyledCardActionSelector.tsx";

describe("StyledCardActionSelector", () => {
	test("renders null when options is empty", () => {
		// when
		const { container } = render(
			<StyledCardActionSelector
				selectedIndex={0}
				setSelectedIndex={vi.fn()}
				forceCompact
				options={[]}
			/>,
		);

		// then
		expect(container.firstChild).toBeNull();
	});

	test("renders a select when options are provided", () => {
		// given / when
		const { container } = render(
			<StyledCardActionSelector
				selectedIndex={0}
				setSelectedIndex={vi.fn()}
				options={[{ default: false, id: "1", value: "Whole" }]}
			/>,
		);

		// then
		expect(container.querySelector("input")).not.toBeNull();
	});

	test("renders the selected option value", () => {
		// when
		const { container } = render(
			<StyledCardActionSelector
				selectedIndex={1}
				setSelectedIndex={vi.fn()}
				forceCompact
				options={[
					{ default: false, id: "1", value: "Whole" },
					{ default: false, id: "2", value: "Sliced" },
				]}
			/>,
		);

		// then
		expect(container.textContent).toContain("Sliced");
	});

	test("prefixes default option with star", () => {
		// when
		const { container } = render(
			<StyledCardActionSelector
				selectedIndex={0}
				setSelectedIndex={vi.fn()}
				options={[{ default: true, id: "1", value: "Whole" }]}
			/>,
		);

		// then
		expect(container.textContent).toContain("★");
	});

	test("does not prefix non-default option with star", () => {
		// when
		const { container } = render(
			<StyledCardActionSelector
				selectedIndex={0}
				setSelectedIndex={vi.fn()}
				forceCompact
				options={[{ default: false, id: "1", value: "Whole" }]}
			/>,
		);

		// then
		expect(container.textContent).not.toContain("★");
	});
});
