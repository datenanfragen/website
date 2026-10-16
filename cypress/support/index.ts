// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace Cypress {
    interface Chainable {
        /**
         * Skip the current test if it is being run in the provided enviroment (checked against `CYPRESS_ENVIRONMENT`).
         *
         * @example cy.skipOn('production');
         */
        skipOn(envToSkip: string): void;
        /**
         * Only run the current test if it is being run in the provided enviroment (checked against
         * `CYPRESS_ENVIRONMENT`), and skip it otherwise.
         *
         * @example cy.onlyOn('production');
         */
        onlyOn(envToAllow: string): void;
    }
}
