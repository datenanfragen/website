import { Component } from 'preact';
import { IntlProvider, MarkupText } from 'preact-i18n';
import t from '../Utility/i18n';
import Privacy, { PRIVACY_ACTIONS } from '../Utility/Privacy';
import * as Typesense from 'typesense';
import { rethrow } from '../Utility/errors';
import FeatureDisabledWidget from './FeatureDisabledWidget';
import PropTypes from 'prop-types';

export let SearchBar;

if (Privacy.isAllowed(PRIVACY_ACTIONS.SEARCH)) {
    const autocomplete = require('autocomplete.js');

    SearchBar = class SearchBar extends Component {
        constructor(props) {
            super(props);

            this.client = new Typesense.Client({
                masterNode: {
                    host: 'search.datenanfragen.de',
                    port: '443',
                    protocol: 'https',
                    apiKey: '',
                },
                timeoutSeconds: 2,
            });

            this.algolia_autocomplete = null;
            this.input_element = null;
        }

        static countryFilter(country) {
            const items = ['all', country];

            /* Our records often simply specify Germany for companies that are also relevant for Austria and/or Switzerland.
               Thus, we explicitly include results from Germany for these countries.

               Ideally, we would rank those additional results lower but as far as I am aware, Typesense doesn't support that.
            */
            if (['at', 'ch'].includes(country)) items.push('de');

            return 'relevant-countries:[' + items.join(', ') + ']';
        }

        componentDidMount() {
            const options = {
                query_by: this.props.query_by || 'name, runs, web, slug, address, comments',
                sort_by: '_text_match:desc,sort-index:asc',
                num_typos: 4,
                per_page: this.props.numberOfHits || 5,
            };

            this.algolia_autocomplete = autocomplete(
                this.input_element,
                { autoselect: true, hint: false, debug: this.props.debug || false },
                {
                    source: (query, callback) => {
                        options['q'] = query;
                        options['filter_by'] = (this.props.filters || [])
                            .concat(
                                this.props.disableCountryFiltering || globals.country === 'all'
                                    ? []
                                    : [SearchBar.countryFilter(globals.country)]
                            )
                            .join(' && ');

                        this.client
                            .collections(this.props.index)
                            .documents()
                            .search(options)
                            .then((res) => {
                                callback(res.hits);
                            })
                            .catch((e) => {
                                e.no_side_effects = true;
                                rethrow(e);
                            });
                    },
                    templates: {
                        suggestion:
                            this.props.suggestion_template ||
                            ((suggestion) => {
                                const d = suggestion.document;

                                const name_hs = suggestion.highlights.filter((a) => a.field === 'name');
                                const runs_hs = suggestion.highlights.filter((a) => a.field === 'runs');

                                return (
                                    (this.props.anchorize
                                        ? `<a class="no-link-decoration" href="${BASE_URL}company/${d.slug}">`
                                        : '') +
                                    '<span><strong>' +
                                    (name_hs.length === 1 ? name_hs[0].snippet : d.name) +
                                    (d.quality === 'tested'
                                        ? '&nbsp;<span class="icon icon-check-badge color-green-800" title="' +
                                          t('quality-tested', 'search') +
                                          '"></span>'
                                        : d.quality !== 'verified'
                                        ? '&nbsp;<span class="icon icon-question-badge color-orange-800" title="' +
                                          t('quality-unverified', 'search') +
                                          '"></span>'
                                        : '') +
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
                                          d.categories.map((c) => t(c, 'categories')).join(', ') +
                                          '</span>'
                                        : '') +
                                    (this.props.anchorize ? '</a>' : '')
                                );
                            }),
                        empty:
                            this.props.empty_template ||
                            function (query) {
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
                        footer: this.props.footer_template,
                    },
                }
            );
            if (this.props.onAutocompleteSelected)
                this.algolia_autocomplete.on('autocomplete:selected', this.props.onAutocompleteSelected);
            if (typeof this.props.setupPlaceholderChange === 'function')
                this.props.setupPlaceholderChange(this.input_element);
        }

        componentWillUnmount() {
            if (this.algolia_autocomplete) {
                this.algolia_autocomplete.autocomplete.destroy();
            }
        }

        render() {
            return (
                <input
                    id={this.props.id}
                    className="aa-input-search"
                    placeholder={this.props.placeholder}
                    type="search"
                    style={this.props.style}
                    ref={(el) => (this.input_element = el)}
                />
            );
        }

        static propTypes = {
            id: PropTypes.string.isRequired,
            placeholder: PropTypes.string.isRequired,
            debug: PropTypes.bool,
            style: PropTypes.string,

            index: PropTypes.string.isRequired,
            query_by: PropTypes.string,
            numberOfHits: PropTypes.number,
            disableCountryFiltering: PropTypes.bool,
            // TODO: write a custom function to validate that either onAS or anchorize is set
            onAutocompleteSelected: PropTypes.func,
            anchorize: PropTypes.bool, // turn the suggestions into anchors linking to the respective company page

            suggestion_template: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
            empty_template: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
            header_template: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
            footer_template: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

            setupPlaceholderChange: PropTypes.func,

            filters: PropTypes.arrayOf(PropTypes.string),
        };
    };
} else {
    SearchBar = class SearchBar extends Component {
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
