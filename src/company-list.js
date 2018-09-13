import preact from 'preact';
import { SearchBar } from "Components/SearchBar";
import { IntlProvider, Text } from 'preact-i18n';
import t from 'Utility/i18n';
import Privacy, {PRIVACY_ACTIONS} from 'Utility/Privacy';
import Scrollspy from 'react-scrollspy';

if(!Privacy.isAllowed(PRIVACY_ACTIONS.SEARCH) && document.getElementById('aa-search-input')) document.getElementById('aa-search-input').style.display = 'none';

class CompanyList extends preact.Component {
    render() {
        let anchor_map = new Map([['#', 'numbers'], ['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'], ['E', 'E'], ['F', 'F'], ['G', 'G'], ['H', 'H'], ['I', 'I'], ['J', 'J'], ['K', 'K'], ['L', 'L'], ['M', 'M'], ['N', 'N'], ['O', 'O'], ['P', 'P'], ['Q', 'Q'], ['R', 'R'], ['S', 'S'], ['T', 'T'], ['U', 'U'], ['V', 'V'], ['W', 'W'], ['X', 'X'], ['Y', 'Y'], ['Z', 'Z']]);
        let anchor_links = [];
        let anchor_ids = [];
        anchor_map.forEach((value, key, map) => {
            anchor_links.push(<li><a href={"#" + value}>{key}</a></li>);
            anchor_ids.push(value + '-container');
        });

        return (
            <IntlProvider scope="cdb" definition={I18N_DEFINITION}>
                <div id="company-list-controls">
                    <div className="container">
                        <p><Text id="explanation" /></p>
                        <SearchBar id="aa-search-input" index='companies'
                                   onAutocompleteSelected={(event, suggestion, dataset) => {
                                       location.href = '/company/' + suggestion.document.slug;
                                   }} placeholder={t('select-company', 'cdb')} debug={true} style="margin-top: 15px;" />
                        <Scrollspy items={anchor_ids} currentClassName="active" className="textscroll" offset={-205}>
                            {anchor_links}
                        </Scrollspy>
                    </div>
                </div>
            </IntlProvider>
        );
    }
}

class CompanySearch extends preact.Component {
    render() {
        return (
            <IntlProvider scope="cdb" definition={I18N_DEFINITION}>
                <SearchBar id="aa-search-input" index='companies'
                           onAutocompleteSelected={(event, suggestion, dataset) => {
                               location.href = '/company/' + suggestion.document.slug;
                           }} placeholder={t('select-company', 'cdb')} debug={true} style="margin-top: 15px;" />
            </IntlProvider>
        );
    }
}

// TODO: Enable only for list view.
window.onscroll = () => {
    let controls = document.getElementById('company-list-controls');
    if(window.pageYOffset > controls.offsetTop) {
        controls.classList.add("sticky");
        document.body.classList.add("sticky-offset");
    }
    if(window.pageYOffset < controls.offsetTop + 200) {
        controls.classList.remove("sticky");
        document.body.classList.remove("sticky-offset");
    }
};

preact.render((<CompanyList/>), null, document.getElementById('company-list'));
preact.render((<CompanySearch/>), null, document.getElementById('company-search'));

