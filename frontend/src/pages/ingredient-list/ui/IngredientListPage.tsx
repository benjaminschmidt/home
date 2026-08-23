import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import type { IngredientDto } from "home-api";
import type { RefObject } from "react";
import { IngredientList } from "@/pages/ingredient-list/ui/IngredientList.tsx";
import { RouterIconButton } from "@/shared/ui/RouterIconButton.tsx";
import { SearchField } from "@/shared/ui/SearchField.tsx";

type IngredientListPageProps = {
	ingredients: IngredientDto[];
	search: string;
	onSearchChange: (search: string) => void;
	sentinelRef?: RefObject<HTMLDivElement | null>;
};

const IngredientListPage = ({
	ingredients,
	search,
	onSearchChange,
	sentinelRef,
}: IngredientListPageProps) => {
	return (
		<Stack spacing={2}>
			<Box
				sx={{
					bgcolor: "background.default",
					pb: 1,
					position: "sticky",
					pt: 1,
					top: { xs: 56, sm: 64 },
					zIndex: 1,
				}}
			>
				<Stack
					direction="row"
					spacing={1}
					sx={{ alignItems: "center", maxWidth: { sm: 480 }, mx: "auto" }}
				>
					<Box sx={{ flexGrow: 1, minWidth: 0 }}>
						<SearchField search={search} onSearchChange={onSearchChange} />
					</Box>
					<Tooltip title="Add ingredient">
						<RouterIconButton to="/ingredients/add" aria-label="Add ingredient">
							<AddIcon />
						</RouterIconButton>
					</Tooltip>
				</Stack>
			</Box>

			<IngredientList ingredients={ingredients} sentinelRef={sentinelRef} />
		</Stack>
	);
};

export { IngredientListPage };
