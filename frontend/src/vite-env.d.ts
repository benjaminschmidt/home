interface ImportMetaEnv {
	readonly VITE_API_BASE_URL: string;
}

// biome-ignore lint/correctness/noUnusedVariables: This interface augments the global ImportMeta
interface ImportMeta {
	readonly env: ImportMetaEnv;
}
