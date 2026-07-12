import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import type { IngredientDto } from "home-api";
import type { RefObject } from "react";
import { IngredientList } from "@/pages/ingredient-list/ui/IngredientList.tsx";
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
				<Box sx={{ maxWidth: { sm: 420 }, mx: "auto", width: "100%" }}>
					<SearchField search={search} onSearchChange={onSearchChange} />
				</Box>
			</Box>

			<IngredientList ingredients={ingredients} sentinelRef={sentinelRef} />
		</Stack>
	);
};

export { IngredientListPage };
