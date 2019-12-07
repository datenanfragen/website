# Translating Datenanfragen.de

## Adding a new language

* Introduce Hugo to the new language in `config/_default/languages.toml`.
* Add a base URL in `config/production/languages.toml` and copy one of the existing blocks in `config/development/languages.toml` for the new language.
* In `src/general.js`, extend the array upon which `I18N_DEFINITION_REQUESTS` is built with the new language code. Also add a fallback country in `guessUserCountry()`.
* In the deploy script `deploy.sh`, make sure to also copy the companies and SVAs for the new language.
* Add the new language to the `languageFiles` for `preact-i18n` in `.eslintrc.js`.
* In `content/` create a `*.[new lang].md` file for all pages that should be available in the new language.
* Translate the 404 page.
* Setup the necessary redirects in `_redirects`.
* Add the domain in the Netlify control panel and set the appropriate DNS records.
