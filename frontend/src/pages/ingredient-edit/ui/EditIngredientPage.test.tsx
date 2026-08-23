import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import type { IngredientDto } from "home-api";
import { createIngredient, deleteIngredient, updateIngredient } from "home-api";
import { afterEach, describe, expect, test, vi } from "vitest";
import { EditIngredientPage } from "@/pages/ingredient-edit/ui/EditIngredientPage.tsx";
import { ingredientFactory, ingredientVariantFactory } from "@/shared/testing";

vi.mock("home-api", async () => {
	const actual = await vi.importActual<typeof import("home-api")>("home-api");
	return {
		...actual,
		createIngredient: vi.fn(),
		deleteIngredient: vi.fn(),
		updateIngredient: vi.fn(),
	};
});

afterEach(cleanup);

const renderPage = (
	ingredientDto: IngredientDto,
	onCancel = vi.fn(),
	onDeleted = vi.fn(),
) => {
	const queryClient = new QueryClient();
	render(
		<QueryClientProvider client={queryClient}>
			<EditIngredientPage
				mode="edit"
				ingredientDto={ingredientDto}
				onCancel={onCancel}
				onDeleted={onDeleted}
			/>
		</QueryClientProvider>,
	);
};

const renderCreatePage = (onCancel = vi.fn(), onCreated = vi.fn()) => {
	const queryClient = new QueryClient();
	render(
		<QueryClientProvider client={queryClient}>
			<EditIngredientPage
				mode="create"
				onCancel={onCancel}
				onCreated={onCreated}
			/>
		</QueryClientProvider>,
	);
};

describe("EditIngredientPage", () => {
	test("prefills the form from the ingredient", () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			weightToVolumeConversionFactor: 2.5,
			conversionWeightUnit: "GRAM",
			conversionVolumeUnit: "MILLILITER",
			ingredientVariants: [],
		});

		// when
		renderPage(ingredientDto);

		// then
		expect(screen.getByLabelText("Name")).toHaveProperty("value", "Flour");
		expect(screen.getByText("Ingredient")).toBeTruthy();
	});

	test("preselects the current default variant", () => {
		// given
		const variants = [
			ingredientVariantFactory.build({
				id: "a",
				description: "Whole",
				defaultVariant: false,
			}),
			ingredientVariantFactory.build({
				id: "b",
				description: "Sliced",
				defaultVariant: true,
			}),
		];
		const ingredientDto = ingredientFactory.build({
			name: "Bread",
			ingredientVariants: variants,
		});

		// when
		renderPage(ingredientDto);

		// then
		expect(
			screen.getByRole("combobox", { name: "Default variant" }).textContent,
		).toBe("Sliced");
	});

	test("disables Save when the shared page form is invalid", () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});
		renderPage(ingredientDto);

		// when
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "  " },
		});

		// then
		expect(screen.getByRole("button", { name: "Save" })).toHaveProperty(
			"disabled",
			true,
		);
	});

	test("enables Save only after a valid value changes", () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});
		renderPage(ingredientDto);

		// when
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Wheat flour" },
		});

		// then
		expect(screen.getByRole("button", { name: "Save" })).toHaveProperty(
			"disabled",
			false,
		);
	});

	test("resets changed values to the initial form state without submitting", () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});
		vi.mocked(updateIngredient).mockClear();
		renderPage(ingredientDto);
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Whole wheat flour" },
		});

		// when
		fireEvent.click(screen.getByRole("button", { name: "Reset" }));

		// then
		expect(screen.getByLabelText("Name")).toHaveProperty("value", "Flour");
		expect(vi.mocked(updateIngredient)).not.toHaveBeenCalled();
	});

	test("saves in place and uses the response as the new form baseline", async () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});
		const updatedIngredientDto: IngredientDto = {
			...ingredientDto,
			name: "Wheat flour",
		};
		vi.mocked(updateIngredient).mockResolvedValue({
			data: updatedIngredientDto,
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		renderPage(ingredientDto);

		// when
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Wheat flour" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Save" }));

		// then
		await waitFor(() => {
			expect(screen.getByLabelText("Name")).toHaveProperty(
				"value",
				"Wheat flour",
			);
		});
		expect(vi.mocked(updateIngredient)).toHaveBeenCalledWith(
			expect.objectContaining({
				path: { ingredientId: ingredientDto.id },
				body: expect.objectContaining({ name: "Wheat flour" }),
			}),
		);
		expect(screen.getByRole("button", { name: "Save" })).toHaveProperty(
			"disabled",
			true,
		);

		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Whole wheat flour" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Reset" }));

		expect(screen.getByLabelText("Name")).toHaveProperty(
			"value",
			"Wheat flour",
		);
	});

	test("submits conversion and default variant values from the shared form", async () => {
		// given
		const defaultVariant = ingredientVariantFactory.build({
			description: "Whole",
		});
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [defaultVariant],
		});
		vi.mocked(updateIngredient).mockResolvedValue({
			data: ingredientDto,
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		renderPage(ingredientDto);

		// when
		fireEvent.change(screen.getByLabelText("Weight amount"), {
			target: { value: "2" },
		});
		fireEvent.change(screen.getByLabelText("Volume amount"), {
			target: { value: "5" },
		});
		fireEvent.mouseDown(
			screen.getByRole("combobox", { name: "Default variant" }),
		);
		fireEvent.click(screen.getByRole("option", { name: "Whole" }));
		fireEvent.click(screen.getByRole("button", { name: "Save" }));

		// then
		await waitFor(() => {
			expect(vi.mocked(updateIngredient)).toHaveBeenCalledWith(
				expect.objectContaining({
					body: {
						name: "Flour",
						weightToVolumeConversionFactor: 2.5,
						conversionWeightUnit: "GRAM",
						conversionVolumeUnit: "MILLILITER",
						defaultVariantId: defaultVariant.id,
					},
				}),
			);
		});
	});

	test("shows the error message when the update fails", async () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});
		vi.mocked(updateIngredient).mockResolvedValue({
			data: undefined,
			error: { message: "Name already in use" },
			request: new Request("http://localhost"),
			response: new Response(),
		});
		renderPage(ingredientDto);

		// when
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Wheat flour" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Save" }));

		// then
		await waitFor(() => {
			expect(screen.getByText("Name already in use")).toBeTruthy();
		});
	});

	test("calls onCancel when cancel is clicked", () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});
		const onCancel = vi.fn();

		// when
		renderPage(ingredientDto, onCancel);
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

		// then
		expect(onCancel).toHaveBeenCalledOnce();
	});

	test("shows the delete action only for an existing ingredient", () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});

		// when
		renderPage(ingredientDto);

		// then
		expect(
			screen.getByRole("button", { name: "Delete ingredient" }),
		).toBeTruthy();

		cleanup();
		renderCreatePage();
		expect(
			screen.queryByRole("button", { name: "Delete ingredient" }),
		).toBeNull();
	});

	test("opens a confirmation dialog for permanent deletion", () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});
		renderPage(ingredientDto);

		// when
		fireEvent.click(screen.getByRole("button", { name: "Delete ingredient" }));

		// then
		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeTruthy();
		expect(screen.getByText(/Permanently delete "Flour"/)).toBeTruthy();
		expect(within(dialog).getByRole("button", { name: "Cancel" })).toBeTruthy();
		expect(within(dialog).getByRole("button", { name: "Delete" })).toBeTruthy();
		expect(within(dialog).queryByText("Cancel")).toBeNull();
		expect(within(dialog).queryByText("Delete")).toBeNull();
	});

	test("cancels deletion without calling the API", async () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});
		renderPage(ingredientDto);
		fireEvent.click(screen.getByRole("button", { name: "Delete ingredient" }));

		// when
		fireEvent.click(
			within(screen.getByRole("dialog")).getByRole("button", {
				name: "Cancel",
			}),
		);

		// then
		expect(vi.mocked(deleteIngredient)).not.toHaveBeenCalled();
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
	});

	test("deletes the ingredient and forwards the success callback", async () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});
		const onDeleted = vi.fn();
		vi.mocked(deleteIngredient).mockResolvedValue({
			data: undefined,
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		renderPage(ingredientDto, vi.fn(), onDeleted);
		fireEvent.click(screen.getByRole("button", { name: "Delete ingredient" }));

		// when
		fireEvent.click(
			within(screen.getByRole("dialog")).getByRole("button", {
				name: "Delete",
			}),
		);

		// then
		await waitFor(() => {
			expect(vi.mocked(deleteIngredient)).toHaveBeenCalledWith({
				path: { ingredientId: ingredientDto.id },
			});
			expect(onDeleted).toHaveBeenCalledOnce();
		});
	});

	test("keeps the confirmation dialog open when deletion fails", async () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});
		vi.mocked(deleteIngredient).mockResolvedValue({
			data: undefined,
			error: { message: "Ingredient is still in use" },
			request: new Request("http://localhost"),
			response: new Response(),
		});
		renderPage(ingredientDto);
		fireEvent.click(screen.getByRole("button", { name: "Delete ingredient" }));

		// when
		fireEvent.click(
			within(screen.getByRole("dialog")).getByRole("button", {
				name: "Delete",
			}),
		);

		// then
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
			expect(screen.getByText("Ingredient is still in use")).toBeTruthy();
		});
		expect(screen.getByRole("button", { name: "Cancel" })).toHaveProperty(
			"disabled",
			false,
		);
	});

	test("renders a blank create form with a None default variant option", () => {
		// when
		renderCreatePage();

		// then
		expect(screen.getByLabelText("Name")).toHaveProperty("value", "");
		const defaultVariantSelector = screen.getByRole("combobox", {
			name: "Default variant",
		});
		expect(defaultVariantSelector.textContent).not.toContain("None");
		fireEvent.mouseDown(defaultVariantSelector);
		expect(screen.getByRole("option", { name: "None" })).toBeTruthy();
	});

	test("creates an ingredient and forwards the response", async () => {
		// given
		const createdIngredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});
		const onCreated = vi.fn();
		vi.mocked(createIngredient).mockResolvedValue({
			data: createdIngredientDto,
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		renderCreatePage(vi.fn(), onCreated);

		// when
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Flour" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Save" }));

		// then
		await waitFor(() => {
			expect(vi.mocked(createIngredient)).toHaveBeenCalledWith({
				body: {
					name: "Flour",
					weightToVolumeConversionFactor: undefined,
					conversionWeightUnit: undefined,
					conversionVolumeUnit: undefined,
					defaultVariantId: undefined,
				},
			});
		});
		expect(onCreated).toHaveBeenCalledWith(createdIngredientDto);
	});

	test("shows the error message when creation fails", async () => {
		// given
		vi.mocked(createIngredient).mockResolvedValue({
			data: undefined,
			error: { message: "Name already in use" },
			request: new Request("http://localhost"),
			response: new Response(),
		});
		renderCreatePage();

		// when
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Flour" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Save" }));

		// then
		await waitFor(() => {
			expect(screen.getByText("Name already in use")).toBeTruthy();
		});
	});
});
