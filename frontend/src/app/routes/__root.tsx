import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { MuiThemeProvider } from "@/shared/config";
import { Layout } from "@/widgets/layout";

const Route = createRootRoute({
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
				]}
			/>
			<Layout>
				<Outlet />
			</Layout>
		</MuiThemeProvider>
	),
});

export { Route };
