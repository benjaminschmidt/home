import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { client } from "home-api/dist/src/client.gen";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { reportWebVitals } from "@/app/analytics/reportWebVitals.ts";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Initialize client for backend fetching
console.log("Using the api at", import.meta.env.VITE_API_BASE_URL);
client.setConfig({
	baseUrl: import.meta.env.VITE_API_BASE_URL,
});

// Create a new query client instance
const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
	routeTree,
	context: { queryClient },
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</StrictMode>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example, reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
