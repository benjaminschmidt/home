import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import type { IngredientDto } from "home-api";
import { updateIngredient } from "home-api";
import { afterEach, describe, expect, test, vi } from "vitest";
import { EditIngredientPage } from "@/pages/ingredient-edit/ui/EditIngredientPage.tsx";
import { ingredientFactory, ingredientVariantFactory } from "@/shared/testing";

vi.mock("home-api", async () => {
	const actual = await vi.importActual<typeof import("home-api")>("home-api");
	return {
		...actual,
		updateIngredient: vi.fn(),
	};
});

afterEach(cleanup);

const renderPage = (ingredientDto: IngredientDto, onCancel = vi.fn()) => {
	const queryClient = new QueryClient();
	const onSaved = vi.fn();
	render(
		<QueryClientProvider client={queryClient}>
			<EditIngredientPage
				ingredientDto={ingredientDto}
				onSaved={onSaved}
				onCancel={onCancel}
			/>
		</QueryClientProvider>,
	);
	return { onSaved };
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

	test("submits an update and calls onSaved with the response", async () => {
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
		const { onSaved } = renderPage(ingredientDto);

		// when
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Wheat flour" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Save" }));

		// then
		await waitFor(() => {
			expect(onSaved).toHaveBeenCalledWith(updatedIngredientDto);
		});
		expect(vi.mocked(updateIngredient)).toHaveBeenCalledWith(
			expect.objectContaining({
				path: { ingredientId: ingredientDto.id },
				body: expect.objectContaining({ name: "Wheat flour" }),
			}),
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
});
