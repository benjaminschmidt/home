import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { SearchField } from "@/shared/ui/SearchField.tsx";

describe("SearchField", () => {
	afterEach(() => {
		cleanup();
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	test("renders the current search value", () => {
		// when
		render(<SearchField search="chicken" onSearchChange={vi.fn()} />);

		// then
		expect((screen.getByLabelText("Search") as HTMLInputElement).value).toBe(
			"chicken",
		);
	});

	test("debounces search changes", () => {
		// given
		vi.useFakeTimers();
		const onSearchChange = vi.fn();
		render(<SearchField search="" onSearchChange={onSearchChange} />);

		// when
		fireEvent.change(screen.getByLabelText("Search"), {
			target: { value: " chicken " },
		});

		// then
		expect(onSearchChange).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(300);
		});
		expect(onSearchChange).toHaveBeenCalledWith("chicken");
	});

	test("cancels the previous pending search change", () => {
		// given
		vi.useFakeTimers();
		const onSearchChange = vi.fn();
		render(<SearchField search="" onSearchChange={onSearchChange} />);
		const input = screen.getByLabelText("Search");

		// when
		fireEvent.change(input, { target: { value: "c" } });
		act(() => {
			vi.advanceTimersByTime(250);
		});
		fireEvent.change(input, { target: { value: "chicken" } });
		act(() => {
			vi.advanceTimersByTime(299);
		});

		// then
		expect(onSearchChange).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(onSearchChange).toHaveBeenCalledTimes(1);
		expect(onSearchChange).toHaveBeenCalledWith("chicken");
	});

	test("clears the search immediately", () => {
		// given
		const onSearchChange = vi.fn();
		render(<SearchField search="chicken" onSearchChange={onSearchChange} />);

		// when
		fireEvent.click(screen.getByLabelText("Clear search"));

		// then
		expect((screen.getByLabelText("Search") as HTMLInputElement).value).toBe(
			"",
		);
		expect(onSearchChange).toHaveBeenCalledWith("");
	});
});
