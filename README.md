# The Datenanfragen.de website

> This repository contains the source code for the Datenanfragen.de website.

Datenanfragen.de is an open source project by [Datenanfragen.de e.&nbsp;V.](https://www.datarequests.org/verein), a registered non-profit from Germany. We have made it our mission to help you exercise your right to privacy.  
Through our website, we offer a generator for GDPR requests as well as access to our company and supervisory authority database (see [this repository](https://github.com/datenanfragen/data/) for the source behind this data) and comprehensive articles on the GDPR and privacy in general.

![A screenshot of the datarequests.org homepage](https://static.dacdn.de/other/screenshot-datarequests-home.png)

Live versions of the website are currently available in [German](https://www.datenanfragen.de), [English](https://www.datarequests.org), [French](https://www.demandetesdonnees.fr) and [Portuguese](https://www.pedidodedados.org).

## Development

Datenanfragen.de is designed as a static website, running on [Hugo](https://gohugo.io/) and [Preact](https://preactjs.com/).

To build the project locally for development, follow these steps:

1. Install [Yarn](https://classic.yarnpkg.com/en/docs/install) and the extended(!) version of [Hugo](https://gohugo.io/getting-started/quick-start/).
2. Clone the repo and run `yarn` in the root directory of the repo to fetch all required dependencies.
3. Run the deploy script (`./deploy.sh`) to fetch and prepare the required resources from our [data](https://github.com/datenanfragen/data) repository.
4. Open two terminal windows. In the first, run `yarn dev` to start the Webpack file watcher which will automatically build the JS files. In the second one, run `hugo server` to have Hugo continously build the actual website and the SCSS.
5. Now the website should be served by Hugo on multiple ports, starting from `1313`, for the different language versions.

The production builds are done automatically by [CircleCI](https://circleci.com/) using the `deploy.sh` script and deployed using dattel, our own static hosting solution (split into a [server](https://github.com/binaro-xyz/dattel-server) and [client](https://github.com/binaro-xyz/dattel-client)).

For testing, we use CircleCI in combination with Cypress (see [more on our browser tests here](/cypress/README.md)). We previously used BrowserStack who kindly let us use their services.

## Contributing

First of all, thank you very much for taking the time to contribute! Contributions are incredibly valuable for a project like ours.

We warmly welcome issues and pull requests through GitHub.

Please be aware that by contributing, you agree for your work to be released under the MIT license, as specified in the `LICENSE` file.

If you are interested in contributing in other ways besides coding, we can also really use your help. Have a look at our [contribute page](https://www.datarequests.org/contribute) for more details.

### Translations

While you can just contribute translations through this repository, an easier way is through the localisation platform [Weblate](https://hosted.weblate.org/engage/datenanfragen-de/). We manage our translations through them. There, you can easily help us translate—be it a couple of strings or whole components.

<!-- 
TODO:

* Outsource the part about contributions to a separate `CONTRIBUTING` once there is enough content to justify that.
-->
