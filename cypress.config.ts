import { defineConfig } from 'cypress';

export default defineConfig({
    projectId: 'nug7wk',

    viewportWidth: 1920,
    viewportHeight: 1080,

    defaultCommandTimeout: 10000,
    videoUploadOnPasses: false,

    e2e: {
        baseUrl: 'http://localhost:1314',

        specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',

        experimentalRunAllSpecs: true,
        testIsolation: true,
    },
});
