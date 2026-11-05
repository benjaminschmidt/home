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
import {
	createIngredient,
	deleteIngredient,
	updateIngredient,
	updateIngredientVariant,
} from "home-api";
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
		updateIngredientVariant: vi.fn(),
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
			conversionWeightAmount: 4,
			conversionVolumeAmount: 10,
			conversionWeightUnit: "GRAM",
			conversionVolumeUnit: "MILLILITER",
			ingredientVariants: [],
		});

		// when
		renderPage(ingredientDto);

		// then
		expect(screen.getByLabelText("Name")).toHaveProperty("value", "Flour");
		expect(screen.getByLabelText("Weight amount")).toHaveProperty("value", "4");
		expect(screen.getByLabelText("Volume amount")).toHaveProperty(
			"value",
			"10",
		);
		expect(screen.getByText("Ingredient")).toBeTruthy();
	});

	test("resets the editor when switching to another ingredient", () => {
		// given
		const firstIngredient = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [
				ingredientVariantFactory.build({ description: "Whole" }),
			],
		});
		const secondIngredient = ingredientFactory.build({
			name: "Butter",
			ingredientVariants: [
				ingredientVariantFactory.build({ description: "Salted" }),
			],
		});
		const queryClient = new QueryClient();
		const renderIngredient = (ingredientDto: IngredientDto) => (
			<QueryClientProvider client={queryClient}>
				<EditIngredientPage
					mode="edit"
					ingredientDto={ingredientDto}
					onCancel={vi.fn()}
					onDeleted={vi.fn()}
				/>
			</QueryClientProvider>
		);

		// when
		const { rerender } = render(renderIngredient(firstIngredient));
		rerender(renderIngredient(secondIngredient));

		// then
		expect(screen.getByLabelText("Name")).toHaveProperty("value", "Butter");
		expect(screen.getByLabelText("Description")).toHaveProperty(
			"value",
			"Salted",
		);
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

	test("renders an editor card for each ingredient variant", () => {
		// given
		const variants = [
			ingredientVariantFactory.build({
				id: "whole-id",
				description: "Whole",
				unit: "GRAM",
				servingSize: 100,
				calories: 165,
			}),
			ingredientVariantFactory.build({
				id: "sliced-id",
				description: "Sliced",
				unit: "GRAM",
				servingSize: 80,
				calories: 120,
			}),
		];
		const ingredientDto = ingredientFactory.build({
			name: "Bread",
			ingredientVariants: variants,
		});

		// when
		renderPage(ingredientDto);

		// then
		expect(screen.getByText("Variants")).toBeTruthy();
		expect(
			screen.getByRole("form", { name: "Ingredient variant: Whole" }),
		).toBeTruthy();
		expect(
			screen.getByRole("form", { name: "Ingredient variant: Sliced" }),
		).toBeTruthy();
		expect(screen.getAllByLabelText("Description")).toHaveLength(2);
		expect(screen.getAllByLabelText("Serving size")).toHaveLength(2);
	});

	test("saves an individual variant and resets its baseline", async () => {
		// given
		const variant = ingredientVariantFactory.build({
			id: "whole-id",
			description: "Whole",
			unit: "GRAM",
			servingSize: 100,
			calories: 165,
		});
		const ingredientDto = ingredientFactory.build({
			name: "Bread",
			ingredientVariants: [variant],
		});
		const updatedVariant = { ...variant, description: "Sliced" };
		vi.mocked(updateIngredientVariant).mockResolvedValue({
			data: updatedVariant,
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		renderPage(ingredientDto);
		const variantForm = screen.getByRole("form", {
			name: "Ingredient variant: Whole",
		});

		// when
		fireEvent.change(within(variantForm).getByLabelText("Description"), {
			target: { value: "Sliced" },
		});
		fireEvent.click(within(variantForm).getByRole("button", { name: "Save" }));

		// then
		await waitFor(() => {
			expect(vi.mocked(updateIngredientVariant)).toHaveBeenCalledWith({
				path: { ingredientId: ingredientDto.id, variantId: variant.id },
				body: expect.objectContaining({
					description: "Sliced",
					unit: variant.unit,
					servingSize: variant.servingSize,
				}),
			});
			expect(screen.getByLabelText("Description")).toHaveProperty(
				"value",
				"Sliced",
			);
		});
		expect(screen.queryByText("1 unsaved change")).toBeNull();
	});

	test("disables variant inputs while saving", async () => {
		// given
		const variant = ingredientVariantFactory.build({
			id: "whole-id",
			description: "Whole",
			calories: 100,
		});
		const ingredientDto = ingredientFactory.build({
			ingredientVariants: [variant],
		});
		type UpdateResult = {
			data: typeof variant;
			error: undefined;
			request: Request;
			response: Response;
		};
		let resolveUpdate!: (value: UpdateResult) => void;
		vi.mocked(updateIngredientVariant).mockImplementation(
			() =>
				new Promise<UpdateResult>((resolve) => {
					resolveUpdate = resolve;
				}),
		);
		renderPage(ingredientDto);
		const variantForm = screen.getByRole("form", {
			name: "Ingredient variant: Whole",
		});

		// when
		fireEvent.change(within(variantForm).getByLabelText("Calories"), {
			target: { value: "200" },
		});
		fireEvent.click(within(variantForm).getByRole("button", { name: "Save" }));

		// then
		await waitFor(() => expect(resolveUpdate).toBeDefined());
		expect(within(variantForm).getByLabelText("Description")).toHaveProperty(
			"disabled",
			true,
		);
		expect(within(variantForm).getByLabelText("Calories")).toHaveProperty(
			"disabled",
			true,
		);

		resolveUpdate({
			data: { ...variant, calories: 200 },
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		await waitFor(() =>
			expect(within(variantForm).getByLabelText("Calories")).toHaveProperty(
				"disabled",
				false,
			),
		);
	});

	test("saves variants before the ingredient in Save all", async () => {
		// given
		const variants = ingredientVariantFactory.buildList(2, {
			unit: "GRAM",
			servingSize: 100,
		});
		const ingredientDto = ingredientFactory.build({
			name: "Bread",
			ingredientVariants: variants,
		});
		vi.mocked(updateIngredientVariant).mockImplementation(async ({ path }) => {
			const variant = variants.find((item) => item.id === path.variantId);
			if (variant === undefined) throw new Error("Variant not found");

			return {
				data: { ...variant, description: `${variant.description} updated` },
				error: undefined,
				request: new Request("http://localhost"),
				response: new Response(),
			};
		});
		vi.mocked(updateIngredient).mockResolvedValue({
			data: { ...ingredientDto, name: "Updated bread" },
			error: undefined,
			request: new Request("http://localhost"),
			response: new Response(),
		});
		renderPage(ingredientDto);

		// when
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Updated bread" },
		});
		for (const variant of variants) {
			const variantForm = screen.getByRole("form", {
				name: `Ingredient variant: ${variant.description}`,
			});
			fireEvent.change(within(variantForm).getByLabelText("Description"), {
				target: { value: `${variant.description} updated` },
			});
		}
		await waitFor(() => {
			expect(screen.getByRole("button", { name: "Save all" })).toHaveProperty(
				"disabled",
				false,
			);
		});
		fireEvent.click(screen.getByRole("button", { name: "Save all" }));

		// then
		await waitFor(() => {
			expect(vi.mocked(updateIngredientVariant)).toHaveBeenCalledTimes(2);
			expect(vi.mocked(updateIngredient)).toHaveBeenCalledOnce();
		});
		const variantCallOrder = vi.mocked(updateIngredientVariant).mock
			.invocationCallOrder;
		const ingredientCallOrder =
			vi.mocked(updateIngredient).mock.invocationCallOrder[0];
		expect(Math.max(...variantCallOrder)).toBeLessThan(ingredientCallOrder);
	});

	test("does not save the ingredient when a variant save fails", async () => {
		// given
		const variant = ingredientVariantFactory.build({
			id: "whole-id",
			description: "Whole",
			unit: "GRAM",
			servingSize: 100,
		});
		const ingredientDto = ingredientFactory.build({
			name: "Bread",
			ingredientVariants: [variant],
		});
		vi.mocked(updateIngredientVariant).mockResolvedValue({
			data: undefined,
			error: { message: "Variant unavailable" },
			request: new Request("http://localhost"),
			response: new Response(),
		});
		vi.mocked(updateIngredient).mockClear();
		renderPage(ingredientDto);
		const variantForm = screen.getByRole("form", {
			name: "Ingredient variant: Whole",
		});

		// when
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Updated bread" },
		});
		fireEvent.change(within(variantForm).getByLabelText("Description"), {
			target: { value: "Updated whole" },
		});
		await waitFor(() => {
			expect(screen.getByRole("button", { name: "Save all" })).toHaveProperty(
				"disabled",
				false,
			);
		});
		fireEvent.click(screen.getByRole("button", { name: "Save all" }));

		// then
		await waitFor(() => {
			expect(screen.getByText("Variant unavailable")).toBeTruthy();
			expect(
				screen.getByText(
					"Some variant changes could not be saved. Review the highlighted variants.",
				),
			).toBeTruthy();
		});
		expect(vi.mocked(updateIngredient)).not.toHaveBeenCalled();
	});

	test("blocks Save all when variant descriptions are duplicated", async () => {
		// given
		const variants = [
			ingredientVariantFactory.build({ id: "whole-id", description: "Whole" }),
			ingredientVariantFactory.build({
				id: "sliced-id",
				description: "Sliced",
			}),
		];
		const ingredientDto = ingredientFactory.build({
			ingredientVariants: variants,
		});
		renderPage(ingredientDto);

		// when
		const slicedForm = screen.getByRole("form", {
			name: "Ingredient variant: Sliced",
		});
		fireEvent.change(within(slicedForm).getByLabelText("Description"), {
			target: { value: "Whole" },
		});

		// then
		await waitFor(() => {
			expect(
				within(slicedForm).getByText(
					"Description must be unique for this ingredient",
				),
			).toBeTruthy();
		});
		expect(screen.getByRole("button", { name: "Save all" })).toHaveProperty(
			"disabled",
			true,
		);
	});

	test("blocks Save all when variant descriptions depend on save order", async () => {
		// given
		const variants = [
			ingredientVariantFactory.build({ id: "whole-id", description: "Whole" }),
			ingredientVariantFactory.build({
				id: "sliced-id",
				description: "Sliced",
			}),
		];
		const ingredientDto = ingredientFactory.build({
			ingredientVariants: variants,
		});
		vi.mocked(updateIngredientVariant).mockClear();
		renderPage(ingredientDto);

		// when
		const variantForms = screen.getAllByRole("form", {
			name: /Ingredient variant:/,
		});
		for (const [index, variantForm] of variantForms.entries()) {
			fireEvent.change(within(variantForm).getByLabelText("Description"), {
				target: { value: variants[(index + 1) % variants.length].description },
			});
		}

		// then
		await waitFor(() =>
			expect(
				screen.getByText(
					"These variant description changes depend on save order. Save them one at a time.",
				),
			).toBeTruthy(),
		);
		expect(screen.getByRole("button", { name: "Save all" })).toHaveProperty(
			"disabled",
			true,
		);
		expect(vi.mocked(updateIngredientVariant)).not.toHaveBeenCalled();
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
		fireEvent.click(
			within(screen.getByRole("form", { name: "Ingredient" })).getByRole(
				"button",
				{ name: "Save" },
			),
		);

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
		fireEvent.click(
			within(screen.getByRole("form", { name: "Ingredient" })).getByRole(
				"button",
				{ name: "Save" },
			),
		);

		// then
		await waitFor(() => {
			expect(vi.mocked(updateIngredient)).toHaveBeenCalledWith(
				expect.objectContaining({
					body: {
						name: "Flour",
						conversionWeightAmount: 2,
						conversionVolumeAmount: 5,
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
		expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy();

		cleanup();
		renderCreatePage();
		expect(screen.queryByRole("button", { name: "Delete" })).toBeNull();
	});

	test("opens a confirmation dialog for permanent deletion", () => {
		// given
		const ingredientDto = ingredientFactory.build({
			name: "Flour",
			ingredientVariants: [],
		});
		renderPage(ingredientDto);

		// when
		fireEvent.click(screen.getByRole("button", { name: "Delete" }));

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
		fireEvent.click(screen.getByRole("button", { name: "Delete" }));

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
		fireEvent.click(screen.getByRole("button", { name: "Delete" }));

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
		fireEvent.click(screen.getByRole("button", { name: "Delete" }));

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
					conversionWeightAmount: undefined,
					conversionVolumeAmount: undefined,
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
