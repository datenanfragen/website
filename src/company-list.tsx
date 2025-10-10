import { render } from 'preact';
import { SearchBar } from './Components/SearchBar';
import { IntlProvider, Text } from 'preact-i18n';
import t from './Utility/i18n';
import { Privacy, PRIVACY_ACTIONS } from './Utility/Privacy';
import Scrollspy from 'react-scrollspy';
import { useEffect } from 'preact/hooks';

if (!Privacy.isAllowed(PRIVACY_ACTIONS.SEARCH) && document.getElementById('aa-search-input')) {
    const searchInput = document.getElementById('aa-search-input');
    if (searchInput) searchInput.style.display = 'none';
}

const CompanyList = () => {
    useEffect(() => {
        const handleScroll = () => {
            const controls = document.getElementById('company-list-controls');
            if (controls) {
                if (window.scrollY > controls.offsetTop) {
                    controls.classList.add('sticky');
                    document.body.classList.add('sticky-offset');
                }
                if (window.scrollY < controls.offsetTop + 200) {
                    controls.classList.remove('sticky');
                    document.body.classList.remove('sticky-offset');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const anchorIds = alphabet.map((x) => (x === '#' ? 'numbers' : x) + '-container');
    const anchorLinks = alphabet.map((x) => (
        <li>
            <a href={'#' + (x === '#' ? 'numbers' : x)} className="no-link-decoration">
                {x}
            </a>
        </li>
    ));

    return (
        <IntlProvider scope="cdb" definition={window.I18N_DEFINITION}>
            <div id="company-list-controls">
                <div className="container">
                    <div className="narrow-page">
                        <div id="suggest-company-btn">
                            <a
                                className="button button-primary icon icon-letter"
                                href={window.BASE_URL + 'suggest/#!type=new&for=cdb'}>
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
                        <Scrollspy items={anchorIds} currentClassName="active" className="textscroll" offset={-280}>
                            {anchorLinks}
                        </Scrollspy>
                    </div>
                </div>
            </div>
        </IntlProvider>
    );
};

type CompanySearchProps = { filters: string[] | undefined };

const CompanySearch = (props: CompanySearchProps) => (
    <IntlProvider scope="cdb" definition={window.I18N_DEFINITION}>
        {/* TODO: I am not sure if I realized that before but all instances of this `CompanySearch` are actually filtering by the user's country currently. I am not sure whether we want that. If we decide to keep it, we should also filter the Hugo-generated list pages. */}
        <SearchBar
            id="aa-search-input"
            index="companies"
            placeholder={t('select-company', 'cdb')}
            debug={true}
            style="margin-top: 15px;"
            filters={props.filters}
            anchorize={true}
        />
    </IntlProvider>
);

const companyListDiv = document.getElementById('company-list');
if (companyListDiv) {
    render(<CompanyList />, companyListDiv.parentElement!, companyListDiv);
}
const searchDiv = document.getElementById('company-search');
if (searchDiv) {
    const searchFilters = searchDiv.dataset.filterCategory;
    render(
        <CompanySearch filters={searchFilters ? ['categories:' + searchFilters] : undefined} />,
        searchDiv.parentElement!,
        searchDiv
    );
}
