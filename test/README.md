# Browser testing

## Notes:

* Do **not** call `browser.end()` in the tests themselves. We are automatically doing that in the `afterEach` hook.
* We are only running one build at a time and not using our 5 parallel threads. This is probably for the best though, as I have no idea how we would go about managing multiple MRs testing concurrently. With this configuration, we can at least have five of them at a time.
* Tests are currently only being run for the German version of the site. We should probably change that in the future.
* Tests are currently only being run in (the latest version of?) Firefox on a random OS.
