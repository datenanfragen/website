import preact from 'preact';
import SearchBar from "./SearchBar";

class CompanyList extends preact.Component {
    render() {
        return (
            <main>
                <h1>Unternehmensdatenbank</h1>
                <p>In unserer Unternehmensdatenbank findest Du zahlreiche Unternehmen (bzw. andere Organisationen) und ihre jeweiligen Kontaktdaten für datenschutzspezifische Anfragen.</p>
                <SearchBar id="aa-search-input" algolia_appId='M90RBUHW3U' algolia_apiKey='a306a2fc33ccc9aaf8cbe34948cf97ed' index='companies'
                           onAutocompleteSelected={(event, suggestion, dataset) => {
                               location.href = '/company/' + suggestion.slug;
                           }} placeholder="Unternehmen auswählen…" debug={true} style="margin-top: 15px;" />
                <div id="company-details"/>
            </main>);
    }
}

preact.render((<CompanyList/>), null, document.getElementById('company-list'));
