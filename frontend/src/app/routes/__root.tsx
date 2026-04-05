import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { MuiThemeProvider } from "@/shared/config";
import { Layout } from "@/widgets/layout";

const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	component: () => (
		<MuiThemeProvider>
			<TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
					{
						name: "React Query",
						render: <ReactQueryDevtoolsPanel />,
					},
				]}
			/>
			<Layout>
				<Outlet />
			</Layout>
		</MuiThemeProvider>
	),
});

export { Route };
