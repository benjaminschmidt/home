import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

declare module "@mui/material/styles" {
	interface Palette {
		outline: string;
	}

	interface PaletteOptions {
		outline?: string;
	}
}

const themeDark = createTheme({
	colorSchemes: {
		light: {
			palette: {
				outline: "rgba(0, 0, 0, 0.23)",
			},
		},
		dark: {
			palette: {
				outline: "rgba(255, 255, 255, 0.23)",
			},
		},
	},
	shape: {
		borderRadius: 12,
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

export { MuiThemeProvider };
