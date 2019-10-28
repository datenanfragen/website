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
