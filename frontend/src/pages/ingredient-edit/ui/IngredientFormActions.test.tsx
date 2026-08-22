import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
	createIngredientFormDefaultValues,
	useAppForm,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";
import { ingredientFormSchema } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import { IngredientFormActions } from "@/pages/ingredient-edit/ui/IngredientFormActions.tsx";

afterEach(cleanup);

type IngredientFormActionsTestHostProps = {
	errorMessage?: string;
	isSubmitting?: boolean;
	onCancel?: () => void;
	onReset?: () => void;
};

const IngredientFormActionsTestHost = ({
	errorMessage,
	isSubmitting = false,
	onCancel = vi.fn(),
	onReset = vi.fn(),
}: IngredientFormActionsTestHostProps) => {
	const form = useAppForm({
		defaultValues: createIngredientFormDefaultValues({ name: "Flour" }),
		validators: {
			onChange: ingredientFormSchema,
		},
	});

	return (
		<form>
			<form.AppField name="name">
				{(field) => (
					<input
						aria-label="Test name"
						value={field.state.value}
						onChange={(event) => field.handleChange(event.target.value)}
					/>
				)}
			</form.AppField>
			<IngredientFormActions
				errorMessage={errorMessage}
				form={form}
				isSubmitting={isSubmitting}
				onCancel={onCancel}
				onReset={onReset}
			/>
		</form>
	);
};

describe("IngredientFormActions", () => {
	test("renders the actions and update error", () => {
		// when
		render(
			<IngredientFormActionsTestHost errorMessage="Name already in use" />,
		);

		// then
		expect(screen.getByRole("region", { name: "Form actions" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Reset form" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Cancel editing" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Save changes" })).toBeTruthy();
		expect(screen.getByText("Name already in use")).toBeTruthy();
	});

	test("disables Save when the form is pristine", () => {
		// when
		render(<IngredientFormActionsTestHost />);

		// then
		expect(screen.getByRole("button", { name: "Save changes" })).toHaveProperty(
			"disabled",
			true,
		);
	});

	test("calls onCancel when cancel is clicked", () => {
		// given
		const onCancel = vi.fn();
		render(<IngredientFormActionsTestHost onCancel={onCancel} />);

		// when
		fireEvent.click(screen.getByRole("button", { name: "Cancel editing" }));

		// then
		expect(onCancel).toHaveBeenCalledOnce();
	});

	test("resets changed values and calls onReset", () => {
		// given
		const onReset = vi.fn();
		render(<IngredientFormActionsTestHost onReset={onReset} />);
		fireEvent.change(screen.getByLabelText("Test name"), {
			target: { value: "Whole wheat" },
		});

		// when
		fireEvent.click(screen.getByRole("button", { name: "Reset form" }));

		// then
		expect(screen.getByLabelText("Test name")).toHaveProperty("value", "Flour");
		expect(onReset).toHaveBeenCalledOnce();
	});

	test("disables all actions while the update is pending", () => {
		// when
		render(<IngredientFormActionsTestHost isSubmitting />);

		// then
		expect(screen.getByRole("button", { name: "Reset form" })).toHaveProperty(
			"disabled",
			true,
		);
		expect(
			screen.getByRole("button", { name: "Cancel editing" }),
		).toHaveProperty("disabled", true);
		expect(screen.getByRole("button", { name: "Save changes" })).toHaveProperty(
			"disabled",
			true,
		);
	});

	test("provides tooltips for each action", async () => {
		// given
		render(<IngredientFormActionsTestHost />);
		fireEvent.change(screen.getByLabelText("Test name"), {
			target: { value: "Whole wheat" },
		});

		// when
		fireEvent.mouseOver(screen.getByRole("button", { name: "Save changes" }));

		// then
		expect((await screen.findByRole("tooltip")).textContent).toBe(
			"Save changes",
		);
	});
});
