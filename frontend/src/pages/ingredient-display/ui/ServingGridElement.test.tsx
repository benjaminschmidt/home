import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { ServingGridElement } from "@/pages/ingredient-display/ui/ServingGridElement.tsx";

afterEach(cleanup);

describe("ServingGridElement", () => {
	test("renders serving size with formatted unit", () => {
		// when
		const { container } = render(
			<ServingGridElement servingSize={100} unit="GRAM" />,
		);

		// then
		expect(container.querySelector("dt")?.textContent).toBe("Serving");
		expect(container.querySelector("dd")?.textContent).toBe("100 g");
	});

	test("renders an em-dash when serving size is missing", () => {
		// when
		const { container } = render(<ServingGridElement />);

		// then
		expect(container.querySelector("dt")?.textContent).toBe("Serving");
		expect(container.querySelector("dd")?.textContent).toBe("\u2014");
	});

	test("opens and closes the serving dialog", async () => {
		// given
		render(<ServingGridElement servingSize={100} unit="GRAM" />);

		// when
		fireEvent.click(screen.getByLabelText("Change serving"));

		// then
		expect(screen.getByRole("dialog")).toBeTruthy();
		expect(screen.getByRole("combobox", { name: "Unit" })).toBeTruthy();

		// when
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

		// then
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
	});

	test("applies serving changes", async () => {
		// given
		const onServingChange = vi.fn();
		render(
			<ServingGridElement
				servingSize={100}
				unit="GRAM"
				onServingChange={onServingChange}
			/>,
		);

		// when
		fireEvent.click(screen.getByLabelText("Change serving"));
		fireEvent.change(screen.getByLabelText("Amount"), {
			target: { value: "250" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Apply" }));

		// then
		expect(onServingChange).toHaveBeenCalledWith({
			servingSize: 250,
			unit: "GRAM",
		});
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
	});
});
