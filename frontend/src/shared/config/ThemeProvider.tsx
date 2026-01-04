import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

const themeDark = createTheme({
	colorSchemes: {
		dark: true,
	},
});

type MuiThemeProviderProps = {
	children: ReactNode;
};

const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
	return (
		<ThemeProvider theme={themeDark} defaultMode="dark">
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
};
export { MuiThemeProvider, type MuiThemeProviderProps };
