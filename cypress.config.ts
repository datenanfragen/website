import { defineConfig } from 'cypress';

export default defineConfig({
    projectId: 'nug7wk',

    viewportWidth: 1920,
    viewportHeight: 1080,

    defaultCommandTimeout: 10000,
    allowCypressEnv: false,
    video: true,

    e2e: {
        baseUrl: 'http://localhost:1314',

        specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',

        experimentalRunAllSpecs: true,
        testIsolation: true,
        retries: process.env.CYPRESS_RETRIES ? +process.env.CYPRESS_RETRIES : 3,
    },

    expose: {
        baseUrl_DE: process.env.CYPRESS_baseUrl_DE,
        ENVIRONMENT: process.env.CYPRESS_ENVIRONMENT,
    },
});
