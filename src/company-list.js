import preact from 'preact';
import SearchBar from "./SearchBar";
import { IntlProvider, Text } from 'preact-i18n';
import t from 'i18n';

class CompanyList extends preact.Component {
    render() {
        return (
            <IntlProvider scope="cdb" definition={i18n_definition}>
                <main>
                    <h1><Text id="title" /></h1>
                    <p><Text id="explanation" /></p>
                    <SearchBar id="aa-search-input" algolia_appId='M90RBUHW3U' algolia_apiKey='a306a2fc33ccc9aaf8cbe34948cf97ed' index='companies'
                               onAutocompleteSelected={(event, suggestion, dataset) => {
                                   location.href = '/company/' + suggestion.slug;
                               }} placeholder={t('select-company', 'cdb')} debug={true} style="margin-top: 15px;" />
                    <div id="company-details"/>
                </main>
            </IntlProvider>
        );
    }
}

preact.render((<CompanyList/>), null, document.getElementById('company-list'));
