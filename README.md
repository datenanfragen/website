# The Datenanfragen.de website

> This repository contains the source code for the Datenanfragen.de website.

Datenanfragen.de is an open source project by [Datenanfragen.de e.&nbsp;V.](https://verein.datenanfragen.de), a registered non-profit from Germany. We have made it our mission to help you exercise your right to privacy.  
Through our website, we offer a generator for GDPR requests as well as access to our company and supervisory authority database (see [this repository](https://github.com/datenanfragen/data/) for the source behind this data) and comprehensive articles on the GDPR and privacy in general.

![A screenshot of the datarequests.org homepage](https://static.dacdn.de/other/screenshot-datarequests-home.png)

Live versions of the website are currently available in [German](https://www.datenanfragen.de) and [English](https://www.datarequests.org).

## Development

[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=TmJoNzBKZm1IMjRyWVRWT2RpbDRtcGhqc3lOa0hXQVdvd1hqT1dsZlhlQT0tLW9TT3ZZNDNiNVBuSU9aQStVU3MzU1E9PQ==--4e6977336bc1f79c108463e38b35cf0b3dc54b66)](https://www.browserstack.com/automate/public-build/TmJoNzBKZm1IMjRyWVRWT2RpbDRtcGhqc3lOa0hXQVdvd1hqT1dsZlhlQT0tLW9TT3ZZNDNiNVBuSU9aQStVU3MzU1E9PQ==--4e6977336bc1f79c108463e38b35cf0b3dc54b66)

Datenanfragen.de is designed as a static website, running on [Hugo](https://gohugo.io/). For the JavaScript and (S)CSS, we use [webpack](https://webpack.js.org/).

To build the project, first install Hugo and [Yarn](https://yarnpkg.com). Then clone the repository and run `yarn` in the root directory to fetch all required dependencies. Then run the deploy script (`./deploy.sh`) to fetch the required resources from our data repository.  
For development, use `yarn dev` to start the webpack file watcher which will automatically build the JS and (S)CSS files. For Hugo, use `hugo server --baseURL "http://localhost" --disableFastRender --config config.toml,config-dev.toml,config-menus.toml`.  
The production builds are automatically done by [Netlify](https://www.netlify.com/) using the `deploy.sh` script.

For testing, we use GitLab CI in combination with BrowserStack who kindly let us use their services.

## Contributing

First of all, thank you very much for taking the time to contribute! Contributions are incredibly valuable for a project like ours.

The primary development is done on a private GitLab instance, with all commits being mirrored to the GitHub repository. We still welcome issues and pull requests through GitHub—thanks to the distributed nature of Git, it is easy for us to incorporate those.

Please be aware that by contributing, you agree for your work to be released under the MIT license, as specified in the `LICENSE` file.

<!-- 
TODO:

* Link the 'Contribute' page for other ways to contribute, once that exists
* Explain the i18n
* Outsource the part about contributions to a separate `CONTRIUTING`, once there is enough content to justify that
-->
