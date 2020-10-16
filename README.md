# The Datenanfragen.de website

> This repository contains the source code for the Datenanfragen.de website.

Datenanfragen.de is an open source project by [Datenanfragen.de e.&nbsp;V.](https://www.datarequests.org/verein), a registered non-profit from Germany. We have made it our mission to help you exercise your right to privacy.  
Through our website, we offer a generator for GDPR requests as well as access to our company and supervisory authority database (see [this repository](https://github.com/datenanfragen/data/) for the source behind this data) and comprehensive articles on the GDPR and privacy in general.

![A screenshot of the datarequests.org homepage](https://static.dacdn.de/other/screenshot-datarequests-home.png)

Live versions of the website are currently available in [German](https://www.datenanfragen.de), [English](https://www.datarequests.org), [French](https://www.demandetesdonnees.fr) and [Portuguese](https://www.pedidodedados.org).

## Development

Datenanfragen.de is designed as a static website, running on [Hugo](https://gohugo.io/) and [Preact](https://preactjs.com/).

To build the project, first install Hugo (we need the extended version) and [Yarn](https://yarnpkg.com). Then clone the repository and run `yarn` in the root directory to fetch all required dependencies. Then run the deploy script (`./deploy.sh`) to fetch the required resources from our data repository.  
For development, use `yarn dev` to start the webpack file watcher which will automatically build the JS and (S)CSS files. For Hugo, use `hugo server`.  
The production builds are automatically done by [Netlify](https://www.netlify.com/) using the `deploy.sh` script.

For testing, we use CircleCI in combination with Cypress (see [more on our browser tests here](/cypress/README.md)). We previously used BrowserStack Which kindly let us use their services.

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
