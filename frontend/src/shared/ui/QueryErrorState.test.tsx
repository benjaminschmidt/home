import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, test, vi } from "vitest";

const { invalidate } = vi.hoisted(() => ({
	invalidate: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
	useRouter: () => ({ invalidate }),
}));

import { QueryErrorState } from "@/shared/ui/QueryErrorState.tsx";

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

describe("QueryErrorState", () => {
	test("shows the API error and retries through the router", () => {
		// when
		render(
			<QueryErrorState
				error={{ message: "Service unavailable" }}
				title="Couldn't load ingredients"
			/>,
		);

		// then
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Couldn't load ingredientsService unavailable",
		);

		// when
		fireEvent.click(screen.getByRole("button", { name: "Retry" }));

		// then
		expect(invalidate).toHaveBeenCalledOnce();
	});

	test("uses a safe fallback for errors without a message", () => {
		// when
		render(
			<QueryErrorState
				error={{ status: 503 }}
				title="Couldn't load ingredient"
			/>,
		);

		// then
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Please try again in a moment.",
		);
	});
});
