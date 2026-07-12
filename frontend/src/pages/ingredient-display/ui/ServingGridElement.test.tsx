import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import type { Ingredient } from "@/entities/ingredients";
import { ServingGridElement } from "@/pages/ingredient-display/ui/ServingGridElement.tsx";

afterEach(cleanup);

const ingredient: Ingredient = {
	name: "ingredient",
	servingSize: 100,
	unit: "GRAM",
	defaultUnit: "GRAM",
	customUnits: [],
};

describe("ServingGridElement", () => {
	test("renders serving size with formatted unit", () => {
		// when
		const { container } = render(
			<ServingGridElement ingredient={ingredient} />,
		);

		// then
		expect(container.querySelector("dt")?.textContent).toBe("Serving");
		expect(container.querySelector("dd")?.textContent).toBe("100 g");
	});

	test("renders an em-dash when serving size is missing", () => {
		// when
		const { container } = render(
			<ServingGridElement
				ingredient={{
					...ingredient,
					servingSize: undefined,
				}}
			/>,
		);

		// then
		expect(container.querySelector("dt")?.textContent).toBe("Serving");
		expect(container.querySelector("dd")?.textContent).toBe("\u2014");
	});

	test("does not open the serving dialog when serving data is incomplete", () => {
		// given
		render(
			<ServingGridElement
				ingredient={{
					...ingredient,
					unit: undefined,
				}}
			/>,
		);

		// when
		fireEvent.click(screen.getByLabelText("Serving cannot be changed"));

		// then
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	test("opens and closes the serving dialog", async () => {
		// given
		render(<ServingGridElement ingredient={ingredient} />);

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
				ingredient={ingredient}
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
