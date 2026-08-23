import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { DeleteIngredientDialog } from "@/pages/ingredient-edit/ui/DeleteIngredientDialog.tsx";

afterEach(cleanup);

type DeleteIngredientDialogTestProps = {
	errorMessage?: string;
	isDeleting?: boolean;
	onCancel?: () => void;
	onConfirm?: () => void;
	open?: boolean;
};

const renderDialog = ({
	errorMessage,
	isDeleting = false,
	onCancel = vi.fn(),
	onConfirm = vi.fn(),
	open = true,
}: DeleteIngredientDialogTestProps = {}) => {
	render(
		<DeleteIngredientDialog
			ingredientName="Flour"
			open={open}
			isDeleting={isDeleting}
			errorMessage={errorMessage}
			onCancel={onCancel}
			onConfirm={onConfirm}
		/>,
	);

	return { onCancel, onConfirm };
};

describe("DeleteIngredientDialog", () => {
	test("renders the ingredient name and icon actions", () => {
		// when
		renderDialog();

		// then
		expect(screen.getByRole("dialog")).toBeTruthy();
		expect(screen.getByText(/Permanently delete "Flour"/)).toBeTruthy();
		expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy();
		expect(screen.queryByText("Cancel")).toBeNull();
		expect(screen.queryByText("Delete")).toBeNull();
	});

	test("calls the cancel and confirm callbacks", () => {
		// given
		const { onCancel, onConfirm } = renderDialog();

		// when
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
		fireEvent.click(screen.getByRole("button", { name: "Delete" }));

		// then
		expect(onCancel).toHaveBeenCalledOnce();
		expect(onConfirm).toHaveBeenCalledOnce();
	});

	test("shows the deletion error", () => {
		// when
		renderDialog({ errorMessage: "Ingredient is still in use" });

		// then
		expect(screen.getByRole("alert").textContent).toContain(
			"Ingredient is still in use",
		);
	});

	test("disables both actions while deletion is pending", () => {
		// when
		const { onCancel, onConfirm } = renderDialog({ isDeleting: true });

		// then
		expect(screen.getByRole("button", { name: "Cancel" })).toHaveProperty(
			"disabled",
			true,
		);
		expect(screen.getByRole("button", { name: "Delete" })).toHaveProperty(
			"disabled",
			true,
		);
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
		fireEvent.click(screen.getByRole("button", { name: "Delete" }));
		expect(onCancel).not.toHaveBeenCalled();
		expect(onConfirm).not.toHaveBeenCalled();
	});
});
