import preact from 'preact';
import { IntlProvider, MarkupText } from 'preact-i18n';
import t from '../Utility/i18n';
import Privacy, { PRIVACY_ACTIONS } from '../Utility/Privacy';
import * as Typesense from 'typesense';
import { rethrow } from '../Utility/errors';
import FeatureDisabledWidget from 'Components/FeatureDisabledWidget';

export let SearchBar;

if (Privacy.isAllowed(PRIVACY_ACTIONS.SEARCH)) {
    let autocomplete = require('autocomplete.js');

    SearchBar = class SearchBar extends preact.Component {
        constructor(props) {
            super(props);

            this.client = new Typesense.Client({
                masterNode: {
                    host: 'search.datenanfragen.de',
                    port: '443',
                    protocol: 'https',
                    apiKey: '981da30f2e80463cadf8a91bc2db4cf5'
                },
                timeoutSeconds: 2
            });

            this.algolia_autocomplete = null;
            this.input_element = null;
        }

        static countryFilter(country) {
            let items = ['all', country];

            /* Our records often simply specify Germany for companies that are also relevant for Austria and/or Switzerland.
               Thus, we explicitly include results from Germany for these countries.

               Ideally, we would rank those additional results lower but as far as I am aware, Typesense doesn't support that.
            */
            if (['at', 'ch'].includes(country)) items.push('de');

            return 'relevant-countries:[' + items.join(', ') + ']';
        }

        componentDidMount() {
            let options = {
                query_by: this.props.query_by || 'name, runs, web, slug, address, comments',
                sort_by: 'sort-index:asc',
                num_typos: 4,
                per_page: this.props.numberOfHits || 5
            };
            if (!this.props.disableCountryFiltering && !this.props.filters) this.props.filters = [];

            this.algolia_autocomplete = autocomplete(
                '#' + this.props.id,
                { hint: false, debug: this.props.debug || false },
                {
                    source: (query, callback) => {
                        options['q'] = query;
                        if (this.props.filters) {
                            options['filter_by'] = this.props.filters
                                .concat(
                                    this.props.disableCountryFiltering || globals.country === 'all'
                                        ? []
                                        : [SearchBar.countryFilter(globals.country)]
                                )
                                .join(' && ');
                        }

                        this.client
                            .collections(this.props.index)
                            .documents()
                            .search(options)
                            .then(res => {
                                callback(res.hits);
                            })
                            .catch(e => {
                                rethrow(e);
                            });
                    },
                    templates: {
                        suggestion:
                            this.props.suggestion_template ||
                            function(suggestion) {
                                let d = suggestion.document;

                                let name_hs = suggestion.highlights.filter(a => a.field === 'name');
                                let runs_hs = suggestion.highlights.filter(a => a.field === 'runs');

                                return (
                                    '<span><strong>' +
                                    (name_hs.length === 1 ? name_hs[0].snippet : d.name) +
                                    '</strong></span>' +
                                    (d.runs?.length
                                        ? '<br><span>' +
                                          t('also-runs', 'search') +
                                          (runs_hs.length === 1 ? runs_hs[0].snippets : d.runs).join(', ') +
                                          '</span>'
                                        : '') +
                                    (d.categories?.length
                                        ? '<br><span>' +
                                          t('categories', 'search') +
                                          d.categories.map(c => t(c, 'categories')).join(', ') +
                                          '</span>'
                                        : '')
                                );
                            },
                        empty:
                            this.props.empty_template ||
                            function(query) {
                                return (
                                    '<p style="margin-left: 10px;">' +
                                    t('no-results', 'search') +
                                    '<br><a href="' +
                                    BASE_URL +
                                    'suggest#!type=new&for=cdb&name=' +
                                    query.query +
                                    '" target="_blank">' +
                                    t('suggest-a-company', 'search') +
                                    '</a></p>'
                                );
                            },
                        header: this.props.header_template,
                        footer: this.props.footer_template
                    }
                }
            );
            this.algolia_autocomplete.on('autocomplete:selected', this.props.onAutocompleteSelected);
            if (typeof this.props.setupPlaceholderChange === 'function')
                this.props.setupPlaceholderChange(this.input_element);
        }

        render() {
            return (
                <input
                    id={this.props.id}
                    className="aa-input-search"
                    placeholder={this.props.placeholder}
                    type="search"
                    style={this.props.style}
                    ref={el => (this.input_element = el)}
                />
            );
        }
    };
} else {
    SearchBar = class SearchBar extends preact.Component {
        render() {
            return (
                <IntlProvider scope="search" definition={I18N_DEFINITION}>
                    <FeatureDisabledWidget includeImage={false}>
                        <MarkupText id="search-disabled" />
                    </FeatureDisabledWidget>
                </IntlProvider>
            );
        }
    };
}
