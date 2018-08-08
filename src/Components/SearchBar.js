import preact from 'preact';
import { IntlProvider, MarkupText } from 'preact-i18n';
import t from '../Utility/i18n';
import Privacy, {PRIVACY_ACTIONS} from "../Utility/Privacy";

export let SearchBar;

if(Privacy.isAllowed(PRIVACY_ACTIONS.ALGOLIA_SEARCH)) {
    let algoliasearch = require('algoliasearch');
    let autocomplete = require('autocomplete.js');

    SearchBar = class SearchBar extends preact.Component {
        constructor(props) {
            super(props);

            this.client = algoliasearch(this.props.algolia_appId, this.props.algolia_apiKey);
            this.index = this.client.initIndex(this.props.index);

            this.algolia_autocomplete = null;
            this.input_element = null;

            this.suggestionTemplate = this.suggestionTemplate.bind(this);
        }

        componentDidMount() {
            this.algolia_autocomplete = autocomplete('#' + this.props.id, {hint: false}, {
                source: autocomplete.sources.hits(this.index, {hitsPerPage: 5}),
                displayKey: 'name',
                templates: {
                    suggestion: this.suggestionTemplate,
                    footer: '<div class="algolia-branding"><a href="https://www.algolia.com"><img src="/img/search-by-algolia.svg"></a></div>'
                },
                debug: this.props.debug || false
            });
            this.algolia_autocomplete.on('autocomplete:selected', this.props.onAutocompleteSelected);
            if (typeof this.props.setupPlaceholderChange === 'function') this.props.setupPlaceholderChange(this.input_element);
        }

        suggestionTemplate(suggestion) {
            return '<span><strong>' + suggestion._highlightResult.name.value + '</strong></span>' + (this.props.index === 'companies' ? ''
                + (suggestion._highlightResult.runs ? '<br><span>' + t('also-runs', 'search') + suggestion._highlightResult.runs.map(e => e.value).join(', ') + '</span>' : '')
                + (suggestion._highlightResult.categories ? '<br><span>' + t('categories', 'search') + suggestion._highlightResult.categories.map(e => t(e.value, 'categories')).join(', ') + '</span>' : '') : '');
        }

        render() {
            return (<input id={this.props.id} className="aa-input-search" placeholder={this.props.placeholder} type="search" style={this.props.style} ref={el => this.input_element = el} />);
        }
    };
}
else {
    SearchBar = class SearchBar extends preact.Component {
        render() {
            return <IntlProvider scope="search" definition={I18N_DEFINITION}><p><MarkupText id="search-disabled"/></p></IntlProvider>;
        }
    }
}



