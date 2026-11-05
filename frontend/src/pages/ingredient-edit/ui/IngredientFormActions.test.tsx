import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { IngredientFormActions } from "@/pages/ingredient-edit/ui/IngredientFormActions.tsx";

afterEach(cleanup);

const renderActions = (
	overrides: Partial<ComponentProps<typeof IngredientFormActions>> = {},
) => {
	const props: ComponentProps<typeof IngredientFormActions> = {
		canSaveAll: true,
		onCancel: vi.fn(),
		onDiscardAll: vi.fn(),
		onSaveAll: vi.fn(),
		unsavedCount: 1,
		...overrides,
	};

	render(<IngredientFormActions {...props} />);
	return props;
};

describe("IngredientFormActions", () => {
	test("renders the actions, unsaved count, and update error", () => {
		// when
		renderActions({ errorMessage: "Some changes could not be saved." });

		// then
		expect(screen.getByRole("region", { name: "Form actions" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Reset" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Save all" })).toBeTruthy();
		expect(screen.getByText("1 unsaved change")).toBeTruthy();
		expect(screen.getByText("Some changes could not be saved.")).toBeTruthy();
	});

	test("disables Save all when there are no unsaved changes", () => {
		// when
		renderActions({ canSaveAll: false, unsavedCount: 0 });

		// then
		expect(screen.getByRole("button", { name: "Save all" })).toHaveProperty(
			"disabled",
			true,
		);
	});

	test("calls the top-level actions", () => {
		// given
		const props = renderActions();

		// when
		fireEvent.click(screen.getByRole("button", { name: "Reset" }));
		fireEvent.click(screen.getByRole("button", { name: "Save all" }));
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

		// then
		expect(props.onDiscardAll).toHaveBeenCalledOnce();
		expect(props.onSaveAll).toHaveBeenCalledOnce();
		expect(props.onCancel).toHaveBeenCalledOnce();
	});

	test("disables all actions while submitting", () => {
		// when
		renderActions({ isSubmitting: true });

		// then
		expect(screen.getByRole("button", { name: "Reset" })).toHaveProperty(
			"disabled",
			true,
		);
		expect(screen.getByRole("button", { name: "Cancel" })).toHaveProperty(
			"disabled",
			true,
		);
		expect(screen.getByRole("button", { name: "Save all" })).toHaveProperty(
			"disabled",
			true,
		);
	});

	test("provides a tooltip for Save all", async () => {
		// given
		renderActions();

		// when
		fireEvent.mouseOver(screen.getByRole("button", { name: "Save all" }));

		// then
		expect((await screen.findByRole("tooltip")).textContent).toBe("Save all");
	});
});
