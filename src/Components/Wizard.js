import preact from "preact";
import t from '../Utility/i18n';
import { Text, MarkupText } from 'preact-i18n';
import { SearchBar } from "../Components/SearchBar";
import {rethrow} from "../Utility/errors";
import localforage from "localforage";
import Cookie from 'js-cookie';
import Privacy, {PRIVACY_ACTIONS} from "../Utility/Privacy";

const CATEGORIES = [ 'suggested', 'commerce', 'entertainment', 'social media', 'finance', 'insurance', 'telecommunication', 'utility', /*'public body',*/ 'other' ];
const USER_CHANGED_COOKIE = 'changed_saved_companies';

export default class Wizard extends preact.Component {
    constructor(props) {
        super(props);

        globals._country_listeners.push(value => { this.setState({ country: value }); });
        globals._country_listeners.push(() => { this.prepareWizard(); });

        this.state = {
            current_tab: 0,
            selected_companies: {},
            country: globals.country // Don't ever update `this.state.country` directly but rather use `globals.country`.
        };

        this.prepareWizard();

        this.changeTab = this.changeTab.bind(this);
        this.addCompany = this.addCompany.bind(this);
        this.removeCompany = this.removeCompany.bind(this);
    }

    prepareWizard() {
        if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)) {
            this.saved_companies = new SavedCompanies();

            this.saved_companies.length()
                .then(length => {
                    if(length === 0 || !this.saved_companies.getUserChanged()) this.loadSuggestedCompanies();
                    else {
                        this.saved_companies.getAll()
                            .then(companies => {
                                this.setState({ selected_companies: companies });
                            });
                    }
                });
        }
        else this.loadSuggestedCompanies();
    }

    loadSuggestedCompanies() {
        fetch(BASE_URL + 'db/suggested-companies/' + this.state.country + '_wizard.json')
            .then(res => res.json()).then(companies => {
            this.setState(prev => {
                prev.selected_companies = companies;
                return prev;
            });
            if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)) {
                this.saved_companies.clearAll()
                    .then(() => {
                        this.saved_companies.addMultiple(companies, false);
                        this.saved_companies.setUserChanged(false);
                    });
            }
        })
            .catch(err => rethrow(err));
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
        if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)) this.saved_companies.add(slug, name);
    }

    removeCompany(slug) {
        this.setState(prev => {
            delete prev.selected_companies[slug];
            return prev;
        });
        if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)) this.saved_companies.remove(slug);
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
            <div>
                <div id="wizard-tabs">
                    {tabs}
                </div>
                <div id="wizard" className="box">
                    <div id="wizard-selector" className="col50">
                        {
                            this.state.current_tab === 0 ? '' :
                                <SearchBar id='aa-search-input' index='companies'
                                           onAutocompleteSelected={(event, suggestion, dataset) => { this.addCompany(suggestion.document.slug, suggestion.document.name) }}
                                           placeholder={t('search-company', 'wizard', { category: t(CATEGORIES[this.state.current_tab], 'categories') })}
                                           filters={this.state.current_tab === CATEGORIES.length - 1 ? [] : [ 'categories:' + CATEGORIES[this.state.current_tab] ]}
                                           empty_template={this.isLastTab() ? null : '<p style="margin-left: 10px;">' + t('no-results', 'search') + '</p>'}
                                />
                        }

                        {/* TODO: These texts are pretty bad and cringey but I am just not good at writing stuff like that. I am *very* open to different suggestions. */}
                        <MarkupText id={CATEGORIES[this.state.current_tab]} fields={{ country: t('country-' + this.state.country, 'i18n-widget') }} />
                        <div id="wizard-buttons">
                            <button className={"button-" + (this.isLastTab() ? "primary" : "secondary")} onClick={() => { location.href = BASE_URL + '/generator?from=wizard' + (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES) ? '' : ('&companies=' + Object.keys(this.state.selected_companies).join(','))) }} disabled={Object.values(this.state.selected_companies).length === 0}><Text id="finish"/></button>
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

export class SavedCompanies {
    constructor() {
        this.localforage_instance = localforage.createInstance({
            'name': 'Datenanfragen.de',
            'storeName': 'wizard-companies'
        });
    }

    length() { return this.localforage_instance.length(); }

    add(slug, name, by_user = true) {
        if(by_user) this.setUserChanged();
        return this.localforage_instance.setItem(slug, name).catch((err) => { rethrow(err, 'Could not save company for the wizard', { slug: slug, name: name }); });
    }
    addMultiple(companies, by_user = true) {
        if(by_user) this.setUserChanged();
        for(let slug in companies) this.add(slug, companies[slug], by_user);
    }

    remove(slug, by_user = true) {
        if(by_user) this.setUserChanged();
        if(slug) return this.localforage_instance.removeItem(slug);
    }
    clearAll() {
        this.setUserChanged(false);
        return this.localforage_instance.clear().catch((err) => { rethrow(err, 'Could clear saved companies.'); });
    }

    getUserChanged() { return Cookie.get(USER_CHANGED_COOKIE) === 'true'; }
    setUserChanged(value = true) { Cookie.set(USER_CHANGED_COOKIE, value ? 'true' : 'false', { expires: 365 }); }

    getAll() {
        let companies = {};

        return new Promise((resolve, reject) => {
            this.localforage_instance.iterate((name, slug) => {
                companies[slug] = name;
            })
                .then(() => { resolve(companies); })
                .catch((err) => { rethrow(err, 'Could not get saved companies for the wizard'); reject(); });
        });
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
        Object.keys(this.props.companies).sort().forEach(slug => {
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
