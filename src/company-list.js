import { render, Component } from 'preact';
import { SearchBar } from 'Components/SearchBar';
import { IntlProvider, Text } from 'preact-i18n';
import PropTypes from 'prop-types';

import t from 'Utility/i18n';
import Privacy, { PRIVACY_ACTIONS } from 'Utility/Privacy';
import Scrollspy from 'react-scrollspy';

if (!Privacy.isAllowed(PRIVACY_ACTIONS.SEARCH) && document.getElementById('aa-search-input'))
    document.getElementById('aa-search-input').style.display = 'none';

class CompanyList extends Component {
    render() {
        let anchor_map = new Map([
            ['#', 'numbers'],
            ['A', 'A'],
            ['B', 'B'],
            ['C', 'C'],
            ['D', 'D'],
            ['E', 'E'],
            ['F', 'F'],
            ['G', 'G'],
            ['H', 'H'],
            ['I', 'I'],
            ['J', 'J'],
            ['K', 'K'],
            ['L', 'L'],
            ['M', 'M'],
            ['N', 'N'],
            ['O', 'O'],
            ['P', 'P'],
            ['Q', 'Q'],
            ['R', 'R'],
            ['S', 'S'],
            ['T', 'T'],
            ['U', 'U'],
            ['V', 'V'],
            ['W', 'W'],
            ['X', 'X'],
            ['Y', 'Y'],
            ['Z', 'Z'],
        ]);
        let anchor_links = [];
        let anchor_ids = [];
        anchor_map.forEach((value, key, map) => {
            anchor_links.push(
                <li>
                    <a href={'#' + value} className="no-link-decoration">
                        {key}
                    </a>
                </li>
            );
            anchor_ids.push(value + '-container');
        });

        return (
            <IntlProvider scope="cdb" definition={I18N_DEFINITION}>
                <div id="company-list-controls">
                    <div className="container">
                        <div className="narrow-page">
                            <div id="suggest-company-btn">
                                <a
                                    className="button button-primary icon icon-letter"
                                    href={BASE_URL + 'suggest/#!type=new&for=cdb'}>
                                    <Text id="suggest-new" />
                                </a>
                            </div>
                            <p>
                                <Text id="explanation" />
                            </p>
                            <SearchBar
                                id="aa-search-input"
                                index="companies"
                                anchorize={true}
                                placeholder={t('select-company', 'cdb')}
                                debug={true}
                                style="margin-top: 15px;"
                            />
                            <Scrollspy
                                items={anchor_ids}
                                currentClassName="active"
                                className="textscroll"
                                offset={-280}>
                                {anchor_links}
                            </Scrollspy>
                        </div>
                    </div>
                </div>
            </IntlProvider>
        );
    }

    componentDidMount() {
        window.onscroll = () => {
            let controls = document.getElementById('company-list-controls');
            if (controls) {
                if (window.pageYOffset > controls.offsetTop) {
                    controls.classList.add('sticky');
                    document.body.classList.add('sticky-offset');
                }
                if (window.pageYOffset < controls.offsetTop + 200) {
                    controls.classList.remove('sticky');
                    document.body.classList.remove('sticky-offset');
                }
            }
        };
    }
}

class CompanySearch extends Component {
    render() {
        return (
            <IntlProvider scope="cdb" definition={I18N_DEFINITION}>
                {/* TODO: I am not sure if I realized that before but all instances of this `CompanySearch` are actually filtering by the user's country currently. I am not sure whether we want that. If we decide to keep it, we should also filter the Hugo-generated list pages. */}
                <SearchBar
                    id="aa-search-input"
                    index="companies"
                    onAutocompleteSelected={(event, suggestion, dataset) => {
                        location.href = '/company/' + suggestion.document.slug;
                    }}
                    placeholder={t('select-company', 'cdb')}
                    debug={true}
                    style="margin-top: 15px;"
                    filters={this.props.filters}
                />
            </IntlProvider>
        );
    }

    static propTypes = {
        filters: PropTypes.arrayOf(PropTypes.string),
    };
}

let company_list_div = document.getElementById('company-list');
if (company_list_div) {
    render(<CompanyList />, company_list_div.parentElement, company_list_div);
}
let search_div = document.getElementById('company-search');
if (search_div) {
    let search_filters = search_div.dataset.filterCategory;
    render(
        <CompanySearch filters={search_filters ? ['categories:' + search_filters] : undefined} />,
        search_div.parentElement,
        search_div
    );
}
