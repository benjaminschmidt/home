import { createFileRoute } from "@tanstack/react-router";
import Construction from "@/pages/construction";

export const Route = createFileRoute("/recipes")({
	component: Construction,
});
