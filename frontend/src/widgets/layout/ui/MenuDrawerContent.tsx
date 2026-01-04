import { Apple } from "@mui/icons-material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useLocation } from "@tanstack/react-router";
import type { ParsedLocation } from "@tanstack/router-core";
import { RouterListItemButton } from "@/shared/ui/RouterListItemButton.tsx";

const getCurrent = (location: ParsedLocation) => {
	if (location.pathname === "/") return "recipes";
	else if (location.pathname.startsWith("/recipes")) return "recipes";
	else if (location.pathname.startsWith("/ingredients")) return "ingredients";
};

const MenuDrawerContent = () => {
	const location = useLocation();
	const value = getCurrent(location);

	return (
		<List>
			<ListItem key="Recipes" disablePadding>
				<RouterListItemButton
					selected={value === "recipes"}
					aria-selected={value === "recipes"}
					to="/recipes"
				>
					<ListItemIcon>
						<RestaurantMenuIcon />
					</ListItemIcon>
					<ListItemText primary="Recipes" />
				</RouterListItemButton>
			</ListItem>
			<ListItem key="Ingredients" disablePadding>
				<RouterListItemButton
					selected={value === "ingredients"}
					aria-selected={value === "ingredients"}
					to="/ingredients"
				>
					<ListItemIcon>
						<Apple />
					</ListItemIcon>
					<ListItemText primary="Ingredients" />
				</RouterListItemButton>
			</ListItem>
		</List>
	);
};

export { MenuDrawerContent };
