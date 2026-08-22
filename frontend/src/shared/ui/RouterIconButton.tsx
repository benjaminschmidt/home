import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import { createLink } from "@tanstack/react-router";
import { forwardRef } from "react";

const RouterIconButton = createLink(
	forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
		return <IconButton ref={ref} component="button" {...props} />;
	}),
);

export { RouterIconButton };
