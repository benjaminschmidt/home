import ListItemButton, {
	type ListItemButtonProps,
} from "@mui/material/ListItemButton";
import { createLink } from "@tanstack/react-router";
import { forwardRef } from "react";

export const RouterListItemButton = createLink(
	forwardRef<HTMLButtonElement, ListItemButtonProps>((props, ref) => {
		return <ListItemButton ref={ref} component="button" {...props} />;
	}),
);
