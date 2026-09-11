import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import type { ReactNode } from "react";

type IconActionButtonProps = {
	children: ReactNode;
	disabled?: boolean;
	label: string;
	onClick?: IconButtonProps["onClick"];
	type?: IconButtonProps["type"];
};

const IconActionButton = ({
	children,
	disabled = false,
	label,
	onClick,
	type = "button",
}: IconActionButtonProps) => (
	<Tooltip title={label}>
		<span>
			<IconButton
				aria-label={label}
				type={type}
				onClick={onClick}
				disabled={disabled}
				sx={{ color: "text.secondary" }}
			>
				{children}
			</IconButton>
		</span>
	</Tooltip>
);

export { IconActionButton, type IconActionButtonProps };
