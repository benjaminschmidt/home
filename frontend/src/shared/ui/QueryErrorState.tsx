import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "@tanstack/react-router";

type QueryErrorStateProps = {
	error: unknown;
	title: string;
};

const getErrorMessage = (error: unknown) => {
	if (error instanceof Error && error.message.trim() !== "") {
		return error.message;
	}

	if (typeof error === "object" && error !== null && "message" in error) {
		const message = error.message;
		if (typeof message === "string" && message.trim() !== "") {
			return message;
		}
	}

	return "Please try again in a moment.";
};

const QueryErrorState = ({ error, title }: QueryErrorStateProps) => {
	const router = useRouter();

	return (
		<Box sx={{ mx: "auto", width: "100%", maxWidth: 640 }}>
			<Alert
				severity="error"
				variant="outlined"
				action={
					<Button
						color="inherit"
						size="small"
						onClick={() => void router.invalidate()}
					>
						Retry
					</Button>
				}
			>
				<AlertTitle>{title}</AlertTitle>
				{getErrorMessage(error)}
			</Alert>
		</Box>
	);
};

export { QueryErrorState };
