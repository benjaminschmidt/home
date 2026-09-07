import { render, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { CardActionSelector } from "@/shared/ui/card/CardActionSelector.tsx";

describe("CardActionSelector", () => {
	test("renders null when options is empty", () => {
		// when
		const { container } = render(
			<CardActionSelector
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
			<CardActionSelector
				selectedIndex={0}
				setSelectedIndex={vi.fn()}
				options={[{ default: false, id: "1", value: "Whole" }]}
			/>,
		);

		// then
		expect(container.querySelector("input")).not.toBeNull();
	});

	test("labels the variant select", () => {
		// when
		const { container } = render(
			<CardActionSelector
				selectedIndex={0}
				setSelectedIndex={vi.fn()}
				options={[{ default: false, id: "1", value: "Whole" }]}
			/>,
		);

		// then
		expect(
			within(container).getByRole("combobox", { name: "Ingredient variant" }),
		).toBeDefined();
	});

	test("renders the selected option value", () => {
		// when
		const { container } = render(
			<CardActionSelector
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
			<CardActionSelector
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
			<CardActionSelector
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
