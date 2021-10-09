# The Datenanfragen.de website

> This repository contains the source code for the Datenanfragen.de website.

Datenanfragen.de is an open source project by [Datenanfragen.de e.&nbsp;V.](https://www.datarequests.org/verein), a registered non-profit from Germany. We have made it our mission to help you exercise your right to privacy.  
Through our website, we offer a generator for GDPR requests as well as access to our company and supervisory authority database (see [this repository](https://github.com/datenanfragen/data/) for the source behind this data) and comprehensive articles on the GDPR and privacy in general.

![A screenshot of the datarequests.org homepage](https://static.dacdn.de/other/screenshot-datarequests-home.png)

Live versions of the website are currently available in [German](https://www.datenanfragen.de), [English](https://www.datarequests.org), [French](https://www.demandetesdonnees.fr), [Spanish](https://www.solicituddedatos.es/), and [Portuguese](https://www.pedidodedados.org).

## Development

Datenanfragen.de is designed as a static website, running on [Hugo](https://gohugo.io/) and [Preact](https://preactjs.com/).

To build the project locally for development, follow these steps:

1. Install [Yarn 1](https://classic.yarnpkg.com/en/docs/install) (Classic) and the extended(!) version of [Hugo](https://gohugo.io/getting-started/quick-start/) (v0.88.1).
2. Clone the repo and run `yarn` in the root directory of the repo to fetch all required dependencies.
3. Run the deploy script (`./deploy.sh`) to fetch and prepare the required resources from our [data](https://github.com/datenanfragen/data) repository.
4. Open two terminal windows. In the first, run `yarn dev` to start the Webpack file watcher, which will automatically build the JS files. In the second one, run `hugo server` to have Hugo continuously build the actual website and the SCSS.
5. Now the website should be served by Hugo on multiple ports, starting from `1313`, for the different language versions.

We recommend building and developing on Linux or macOS. If you are on Windows, use WSL.

<details>
<summary>Windows development tips</summary>
    
### Developing on Windows inside WSL

- Install [ripgrep](https://github.com/BurntSushi/ripgrep) to speed up the merge conflict commit hook.
- Developing tests with Cypress requires a GUI, which might not work with WSL.

### Developing on Windows outside of WSL

- We do not recommend this, but it's possible.
- You need to run the `deploy.sh` script once via some bash-like tool. Use WSL or Git Bash.
- Use Node LTS and not the latest Node release (otherwise you might get Python errors).
- To get around file name limitations ([#581](https://github.com/datenanfragen/website/issues/581)), run `$env:HUGO_DISABLEALIASES="true"` in the terminal that will run `hugo`.
- Please make sure to only commit LF line endings. Configure your IDE or Git accordingly, or use some conversion tool.
- Some commit hooks might not work on Windows. You can use `git commit --no-verify` carefully to get around this.
</details>

<details>
<summary>macOS development tips</summary>
    
### Increase the maximum file limit for processes

Because `hugo server` registers a file watcher for every file in our repo and the number of files can get very large, you might get file watcher related errors. To fix, increase the file limit for processes on your computer (this change is temporary until you restart):

```
sudo sysctl -w kern.maxfiles=65536
```
</details>

The production builds are done automatically by [CircleCI](https://circleci.com/) using the `deploy.sh` script and deployed using dattel, our own static hosting solution (split into a [server](https://github.com/binaro-xyz/dattel-server) and [client](https://github.com/binaro-xyz/dattel-client)).

For testing, we use CircleCI in combination with Cypress (see [more on our browser tests here](/cypress/README.md)). We previously used BrowserStack who kindly let us use their services.

## Contributing

First of all, thank you very much for taking the time to contribute! Contributions are incredibly valuable for a project like ours.

We warmly welcome issues and pull requests through GitHub. You can also chat with us through our [Matrix space](https://matrix.to/#/#datenanfragen:matrix.altpeter.me). Feel free to ask questions, pitch your ideas, or just talk with the community.

Please be aware that by contributing, you agree for your work to be released under the MIT license, as specified in the `LICENSE` file.

If you are interested in contributing in other ways besides coding, we can also really use your help. Have a look at our [contribute page](https://www.datarequests.org/contribute) for more details.

### Translations

While you can just contribute translations through this repository, an easier way is through the localisation platform [Weblate](https://hosted.weblate.org/engage/datenanfragen-de/). We manage our translations through them. There, you can easily help us translate—be it a couple of strings or whole components.

If you're interested in chatting about our translation efforts, join our [i18n room on Matrix](https://matrix.to/#/#dade-i18n:matrix.altpeter.me).

<!-- 
TODO:

* Outsource the part about contributions to a separate `CONTRIBUTING` once there is enough content to justify that.
-->
