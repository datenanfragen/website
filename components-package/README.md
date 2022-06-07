# Datenanfragen.de components for external use

> This package allows you to use the components making up Datenanfragen.de outside of the [`website`](https://github.com/datenanfragen/website) repository.

Datenanfragen.de is an open source project by [Datenanfragen.de e.&nbsp;V.](https://www.datarequests.org/verein), a registered non-profit from Germany. We have made it our mission to help you exercise your right to privacy. Through our website, we offer a generator for GDPR requests, among other things.

This package allows you to use the components making up that website elsewhere. We use this in our [mobile](https://github.com/datenanfragen/mobile-app/) and [desktop app](https://github.com/datenanfragen/desktop-app/).

## Setup

You can install the package using yarn or npm:

```sh
yarn add @datenanfragen/components
# or `npm i @datenanfragen/components`
```

First, you either need to call the exported `setupWindow()` function or do the setup in there yourself.

Then, you need to set `window.LOCALE` to the two-letter ISO code of the desired language, e.g.:

```ts
window.LOCALE = 'en';
```

You also need the following HTML:

```html
<aside id=flash-messages></aside>
```

Finally, include the CSS:

```scss
@import 'npm:@datenanfragen/components/dist/index.css';
```

## Usage

Now, you can use the exported components in your Preact code, e.g.:

```tsx
import { render } from 'preact';
import { ActWidget } from '@datenanfragen/components';

const App = () => (
    <>
        <h1>Send a data request</h1>
        <ActWidget requestTypes={['access', 'erasure']} company="datenanfragen" transportMedium="email" />
    </>
);

const el = document.getElementById('app');
if (el) render(<App />, el);
```

## Contributing

First of all, thank you very much for taking the time to contribute! Contributions are incredibly valuable for a project like ours.

We warmly welcome issues and pull requests through GitHub. They should be filed against the [`website` repository](https://github.com/datenanfragen/website), which this package is built from. You can also chat with us through our [Matrix space](https://matrix.to/#/#datenanfragen:matrix.altpeter.me). Feel free to ask questions, pitch your ideas, or just talk with the community.

Please be aware that by contributing, you agree for your work to be released under the MIT license, as specified in the `LICENSE` file.

If you are interested in contributing in other ways besides coding, we can also really use your help. Have a look at our [contribute page](https://www.datarequests.org/contribute) for more details.
