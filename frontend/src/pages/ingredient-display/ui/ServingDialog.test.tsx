import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { ServingDialog } from "@/pages/ingredient-display/ui/ServingDialog.tsx";

afterEach(cleanup);

describe("ServingDialog", () => {
	test("renders amount, unit selector, and actions", () => {
		// when
		render(
			<ServingDialog
				servingSize={100}
				unit="GRAM"
				customUnits={[{ name: "slice" }]}
				onClose={vi.fn()}
				onApply={vi.fn()}
			/>,
		);

		// then
		expect(screen.getByLabelText("Amount")).toBeTruthy();
		expect(screen.getByRole("combobox", { name: "Unit" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
	});

	test("shows ingredient custom units by name", () => {
		// given
		render(
			<ServingDialog
				servingSize={1}
				unit="slice"
				customUnits={[{ name: "slice" }]}
				onClose={vi.fn()}
				onApply={vi.fn()}
			/>,
		);

		// when
		fireEvent.mouseDown(screen.getByRole("combobox", { name: "Unit" }));

		// then
		expect(screen.getByRole("option", { name: "slice" })).toBeTruthy();
	});

	test("applies the selected serving draft and closes", () => {
		// given
		const onClose = vi.fn();
		const onApply = vi.fn();
		render(
			<ServingDialog
				servingSize={100}
				unit="GRAM"
				onClose={onClose}
				onApply={onApply}
			/>,
		);

		// when
		fireEvent.change(screen.getByLabelText("Amount"), {
			target: { value: "250" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Apply" }));

		// then
		expect(onApply).toHaveBeenCalledWith({ servingSize: 250, unit: "GRAM" });
		expect(onClose).toHaveBeenCalledOnce();
	});
});
