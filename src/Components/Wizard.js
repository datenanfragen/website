import preact from "preact";
import t from '../Utility/i18n';
import { fetchCompanyNameBySlug } from '../Utility/companies';
import { Text, MarkupText } from 'preact-i18n';
import { SearchBar } from "../Components/SearchBar";

const CATEGORIES = [ 'suggested', 'commerce', 'entertainment', 'finance', 'insurance', /*'public body',*/ 'social media', 'telecommunication', 'utility', 'other' ];

export default class Wizard extends preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            current_tab: 0,
            selected_companies: []
        };

        /* TODO: This is ridiculous. Best course of action is probably to generate that object in the deploy script. */
        fetch(BASE_URL + 'db/suggested-companies/' + country + '.json')
            .then(res => res.json()).then(json => {
                json.forEach((slug) => {
                    fetchCompanyNameBySlug(slug, (name) => {
                        this.setState(prev => {
                            prev.selected_companies[slug] = name;
                            return prev;
                        });
                    });
                })
            }
        );

        this.changeTab = this.changeTab.bind(this);
        this.addCompany = this.addCompany.bind(this);
        this.removeCompany = this.removeCompany.bind(this);
    }

    changeTab(next) {
        this.setState({ current_tab: next >= CATEGORIES.length ? 0 : next });
    }

    addCompany(slug, name) {
        this.setState(prev => {
            prev.selected_companies[slug] = name;
            return prev;
        });
    }

    removeCompany(slug) {
        this.setState(prev => {

            delete prev.selected_companies[slug];
            return prev;
        });
    }

    render() {
        let tabs = [];
        CATEGORIES.forEach((category, i) => {
            tabs.push(<WizardTab desc={t(category, 'categories')} index={i} clickCallback={this.changeTab} />);
        });
        return (
            <div id="wizard">
                <div id="wizard-tabs">
                    {tabs}
                </div>

                <div id="wizard-selector" className="col50">
                    {
                        this.state.current_tab === 0 ? '' :
                            <SearchBar id='aa-search-input' algolia_appId='M90RBUHW3U' algolia_apiKey='a306a2fc33ccc9aaf8cbe34948cf97ed' index='companies'
                                       onAutocompleteSelected={(event, suggestion, dataset) => { this.addCompany(suggestion.slug, suggestion.name) }} placeholder={t('select-company', 'cdb')}
                                       facetFilters={this.state.current_tab === CATEGORIES.length - 1 ? [] : [ 'categories:' + CATEGORIES[this.state.current_tab] ]}
                            />
                    }

                    <MarkupText id={CATEGORIES[this.state.current_tab]}/>
                </div>
                <div id="wizard-selected" className="col50">
                    <SelectedCompaniesList companies={this.state.selected_companies} removeCallback={this.removeCompany} />
                </div>
                <div className="clearfix" />
                <div id="wizard-buttons">
                    <button className="button-primary button-small" onClick={() => { this.changeTab(this.state.current_tab + 1)} }><Text id="next"/></button> <button className="button-secondary button-small" onClick={() => { location.href = BASE_URL + '/generator?companies=' + Object.keys(this.state.selected_companies).join(',') }}><Text id="finish"/></button>
                </div>
                <div className="clearfix" />
            </div>
        );
    }
}

class WizardTab extends preact.Component {
    render() {
        return <span class="wizard-tab"><a onClick={() => {this.props.clickCallback(this.props.index)}}>{this.props.desc}</a></span>;
    }
}

class SelectedCompaniesList {
    render() {
        let selected_companies = [];
        Object.keys(this.props.companies).forEach(slug => {
            selected_companies.push(<p>
                <button className="button-primary button-small icon-trash" onClick={() => {this.props.removeCallback(slug)}} />
                <SelectedCompany slug={slug} name={this.props.companies[slug]}/>
            </p>);
        });

        return (
            <div>
                {selected_companies}
            </div>
        )
    }
}

class SelectedCompany {
    render() {
        return (
            <span>{this.props.name}</span>
        )
    }
}
