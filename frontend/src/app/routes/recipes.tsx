import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "@/pages/construction";

const Route = createFileRoute("/recipes")({
	component: Construction,
});

export { Route };
