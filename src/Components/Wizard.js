import preact from "preact";
import t from '../Utility/i18n';
import { fetchCompanyNameBySlug } from '../Utility/companies';
import { Text, MarkupText } from 'preact-i18n';
import { SearchBar } from "../Components/SearchBar";

const CATEGORIES = [ 'suggested', 'commerce', 'entertainment', 'social media', 'finance', 'insurance', 'telecommunication', 'utility', /*'public body',*/ 'other' ];

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

    isLastTab() {
        return this.state.current_tab === CATEGORIES.length - 1;
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
            tabs.push(<WizardTab desc={t(category, 'categories')} index={i} isCurrent={this.state.current_tab === i} clickCallback={this.changeTab} />);
        });
        let next_button = [];
        if(!this.isLastTab()) {
            next_button = <button className="button-primary" onClick={() => { this.changeTab(this.state.current_tab + 1)} }><Text id="next"/></button>;
        }
        return (
            <div id="wizard" className="box">
                <div id="wizard-tabs">
                    {tabs}
                </div>

                <div id="wizard-inner">
                    <div id="wizard-selector" className="col50">
                        {
                            this.state.current_tab === 0 ? '' :
                                <SearchBar id='aa-search-input' index='companies'
                                           onAutocompleteSelected={(event, suggestion, dataset) => { this.addCompany(suggestion.document.slug, suggestion.document.name) }} placeholder={t('search-company', 'wizard', { category: t(CATEGORIES[this.state.current_tab], 'categories') })}
                                           filters={this.state.current_tab === CATEGORIES.length - 1 ? [] : [ 'categories:' + CATEGORIES[this.state.current_tab] ]}
                                />
                        }

                        {/* TODO: These texts are pretty bad and cringey but I am just not good at writing stuff like that. I am *very* open to different suggestions. */}
                        <MarkupText id={CATEGORIES[this.state.current_tab]}/>
                        <div id="wizard-buttons">
                            <button className={"button-" + (this.isLastTab() ? "primary" : "secondary")} onClick={() => { location.href = BASE_URL + '/generator?companies=' + Object.keys(this.state.selected_companies).join(',') }}><Text id="finish"/></button>
                            {next_button}
                        </div>
                        <div className="clearfix" />
                    </div>
                    <div id="wizard-selected" className="col50">
                        <SelectedCompaniesList companies={this.state.selected_companies} removeCallback={this.removeCompany} />
                    </div>
                    <div className="clearfix" />
                </div>
            </div>
        );
    }
}

class WizardTab extends preact.Component {
    render() {
        return <a onClick={() => {this.props.clickCallback(this.props.index)}} className={'wizard-tab' + (this.props.isCurrent ? ' wizard-tab-current' : '')}>{this.props.desc}</a>;
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
