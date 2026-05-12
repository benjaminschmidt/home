import CardActionArea, {
	type CardActionAreaProps,
} from "@mui/material/CardActionArea";
import { createLink } from "@tanstack/react-router";
import { forwardRef } from "react";

const RouterCardActionArea = createLink(
	forwardRef<HTMLButtonElement, CardActionAreaProps>((props, ref) => {
		return <CardActionArea ref={ref} component="button" {...props} />;
	}),
);

export { RouterCardActionArea };
