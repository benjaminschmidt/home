import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: {
        path: 'api.yaml'
    },
    output: {
        path: 'src'
    },
});
