# Browser testing

Our browser tests are based on [Cypress](https://www.cypress.io/). To get an overview of Cypress, we recommend going through their very extensive and well-written [guides](https://docs.cypress.io/guides/overview/why-cypress.html), especially *[Writing your first test](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file)* and *[Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes)*.

## Running the tests

The tests are automatically run by the CI environment.

To run them locally, you can use the Cypress test runner. Make sure you have the correct dependencies installed by running: `yarn cypress verify`

If you want to, you can override the launch URLs:  
```sh
export CYPRESS_baseUrl='http://localhost:1314'
```

Then, run `yarn cypress open` to open the test runner. As we are running *Electron* in the CI env, you should also select that as the browser for local testing to get consistent results.

### Production tests

To run tests against the production site, you need to make sure to set the correct base URL and environment:

```sh
export CYPRESS_baseUrl='https://www.datarequests.org'
export CYPRESS_baseUrl_DE='https://www.datenanfragen.de'
export CYPRESS_ENVIRONMENT=production
```

If you are writing a test that doesn't work in production, you can then use `skipOn(isOn('production'))` to skip it for production tests after importing `import { isOn, skipOn } from '@cypress/skip-test'`. See the [`@cypress/skip-test` README](https://github.com/cypress-io/cypress-skip-test) for more details.

TODO: Change to `skipOn('production')` once the plugin actually behaves as documented, see: https://github.com/cypress-io/cypress-skip-test/issues/41
