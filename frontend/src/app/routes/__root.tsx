import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { MuiThemeProvider } from "@/shared/config/theme-provider.tsx";
import NavBar from "@/widgets/navigation/ui/NavBar.tsx";

export const Route = createRootRoute({
	component: () => (
		<MuiThemeProvider>
			<NavBar />
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
			<Outlet />
		</MuiThemeProvider>
	),
});
