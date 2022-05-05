import { useEffect, useRef } from 'preact/hooks';
import { IntlProvider, MarkupText } from 'preact-i18n';
import t from '../Utility/i18n';
import Privacy, { PRIVACY_ACTIONS } from '../Utility/Privacy';
import { searchClient } from '../Utility/search';
import { rethrow } from '../Utility/errors';
import { FeatureDisabledWidget } from './FeatureDisabledWidget';
import type { MergeExclusive } from 'type-fest';
import type { SearchParams, SearchResponseHit } from 'typesense/lib/Typesense/Documents';

type SearchBarProps = {
    id: string;
    placeholder: string;
    debug?: boolean;
    style?: string;

    index: string;
    queryBy?: string;
    numberOfHits?: number;
    disableCountryFiltering?: boolean;

    suggestionTemplate?: string | (() => string);
    emptyTemplate?: string | (() => string);
    headerTemplate?: string | (() => string);
    footerTemplate?: string | (() => string);

    filters?: string[];
} & MergeExclusive<
    { onAutocompleteSelected: (jqueryEvent: never, hit: Hit, dataset: never) => void },
    {
        /** Turn the suggestions into anchors linking to the respective company page. */
        anchorize: true;
    }
>;

type Suggestion = {
    slug: string;
    categories?: (keyof typeof window.I18N_DEFINITION.categories)[];
    name: string;
    runs?: string[];
    quality: 'tested' | 'verified' | 'imported' | 'scraped';
};
type Hit = SearchResponseHit<Suggestion>;

const countryFilter = (country: typeof window.globals.country) => {
    const items = ['all', country];

    // Our records often simply specify Germany for companies that are also relevant for Austria and/or Switzerland.
    // Thus, we explicitly include results from Germany for these countries.
    //
    // Ideally, we would rank those additional results lower but as far as I am aware, Typesense doesn't support that.
    if (['at', 'ch'].includes(country)) items.push('de');

    return `relevant-countries:[${items.join(', ')}]`;
};

const RealSearchBar = ({
    id,
    anchorize,
    debug,
    disableCountryFiltering,
    emptyTemplate,
    filters,
    footerTemplate,
    headerTemplate,
    index,
    numberOfHits,
    onAutocompleteSelected,
    queryBy,
    suggestionTemplate,
    placeholder,
    style,
}: SearchBarProps) => {
    const input_element = useRef(null);
    // TODO: We're using an ancient version of autocomplete.js that doesn't have type definitions.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const autocomplete_ref = useRef<any>(null);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        import('autocomplete.js')
            .then(
                ({ default: autocomplete }) =>
                    (autocomplete_ref.current = autocomplete(
                        input_element.current,
                        { autoselect: true, hint: false, debug: debug || false },
                        {
                            source: (q: string, callback: (hits?: Hit[]) => void) => {
                                const options: SearchParams = {
                                    q,
                                    query_by: queryBy || 'name, runs, web, slug, address, comments',
                                    sort_by: '_text_match:desc,sort-index:asc',
                                    num_typos: 4,
                                    per_page: numberOfHits || 5,
                                    filter_by: (filters || [])
                                        .concat(
                                            disableCountryFiltering || window.globals.country === 'all'
                                                ? []
                                                : [countryFilter(window.globals.country)]
                                        )
                                        .join(' && '),
                                };

                                searchClient
                                    .collections<Suggestion>(index)
                                    .documents()
                                    .search(options)
                                    .then((res) => callback(res.hits))
                                    .catch((e) => {
                                        e.no_side_effects = true;
                                        rethrow(e);
                                    });
                            },
                            templates: {
                                suggestion:
                                    suggestionTemplate ||
                                    ((hit: Hit) => {
                                        const d = hit.document;

                                        const name_hs = hit.highlights?.filter((a) => a.field === 'name');
                                        const runs_hs = hit.highlights?.filter((a) => a.field === 'runs');

                                        return `
${anchorize ? `<a class="no-link-decoration" href="${window.BASE_URL}company/${d.slug}">` : ''}
    <div class="anchor-overlay" aria-hidden="true"></div>
        <h4>
            ${name_hs?.length === 1 ? name_hs[0].snippet : d.name}
            ${
                d.quality === 'tested'
                    ? `&nbsp;<span class="icon icon-check-badge color-green-800" title="${t(
                          'quality-tested',
                          'search'
                      )}"></span>`
                    : d.quality !== 'verified'
                    ? `&nbsp;<span class="icon icon-question-badge color-orange-800" title="${t(
                          'quality-unverified',
                          'search'
                      )}"></span>`
                    : ''
            }
        </h4>
${anchorize ? '</a>' : ''}

${
    d.runs?.length
        ? `<span>
               ${t('also-runs', 'search')}${((runs_hs?.length === 1 ? runs_hs[0].snippets : d.runs) || []).join(', ')}
           </span><br>`
        : ''
}
${
    d.categories?.length
        ? `<span>
               ${t('categories', 'search')}${d.categories.map((c) => t(c, 'categories')).join(', ')}
           </span>`
        : ''
}
`;
                                    }),
                                empty:
                                    emptyTemplate ||
                                    ((query: { query: string }) => {
                                        return `
<p style="margin-left: 10px;">${t('no-results', 'search')}
    <br>
    <a href="${window.BASE_URL}suggest#!type=new&for=cdb&name=${query.query}" target="_blank">
        ${t('suggest-a-company', 'search')}
    </a>
</p>`;
                                    }),
                                header: headerTemplate,
                                footer: footerTemplate,
                            },
                        }
                    ))
            )
            .then(
                () =>
                    onAutocompleteSelected &&
                    autocomplete_ref.current?.on('autocomplete:selected', onAutocompleteSelected)
            );

        return () => autocomplete_ref.current?.autocomplete.destroy();
    }, [
        anchorize,
        debug,
        disableCountryFiltering,
        emptyTemplate,
        filters,
        footerTemplate,
        headerTemplate,
        index,
        numberOfHits,
        onAutocompleteSelected,
        queryBy,
        suggestionTemplate,
    ]);

    return (
        <input
            id={id}
            className="aa-input-search"
            placeholder={placeholder}
            type="search"
            style={style}
            ref={input_element}
        />
    );
};

const DisabledSearchBar = () => {
    return (
        <IntlProvider scope="search" definition={window.I18N_DEFINITION}>
            <FeatureDisabledWidget includeImage={false}>
                <MarkupText id="search-disabled" />
            </FeatureDisabledWidget>
        </IntlProvider>
    );
};

export const SearchBar = Privacy.isAllowed(PRIVACY_ACTIONS.SEARCH) ? RealSearchBar : DisabledSearchBar;
