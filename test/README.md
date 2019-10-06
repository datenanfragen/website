# Browser testing

## Running the tests

The tests are automatically run by the CI environment.

To trigger them from your local machine, you need to have access to the BrowserStack credentials. Set them as environment variables:

```sh
export BROWSERSTACK_USER=myuser
export BROWSERSTACK_ACCESS_KEY=myaccesskey
```

There are multiple options:

* To run the whole test suite (including linting), use `yarn test`.  
  This will automatically take care of everything.
* To only run the browser tests, first start browserstack-local using `yarn bs-local`, then run `yarn btest`.
* To only run a specific browser test, first start browserstack-local using `yarn bs-local`, then run `yarn run-test <test path>` (e.g. `yarn run-test test/src/privacy-controls/feedback.js`).

## Notes:

* Do **not** call `browser.end()` in the tests themselves. We are automatically doing that in the `afterEach` hook.
* We are only running one build at a time and not using our 5 parallel threads. This is probably for the best though, as I have no idea how we would go about managing multiple MRs testing concurrently. With this configuration, we can at least have five of them at a time.
* Tests are currently only being run for the German version of the site. We should probably change that in the future.
* Tests are currently only being run in (the latest version of?) Firefox on a random OS.
