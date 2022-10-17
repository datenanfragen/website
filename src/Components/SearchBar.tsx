import type { MergeExclusive } from 'type-fest';
import type { SearchParams, SearchResponseHit } from 'typesense/lib/Typesense/Documents';
import type { Company } from '../types/company';
import { useEffect, useRef } from 'preact/hooks';
import { IntlProvider, MarkupText } from 'preact-i18n';
import { useAppStore } from '../store/app';
import t from '../Utility/i18n';
import { Privacy, PRIVACY_ACTIONS } from '../Utility/Privacy';
import { searchClient, defaultSearchParams, countryFilter } from '../Utility/search';
import { rethrow } from '../Utility/errors';
import { FeatureDisabledWidget } from './FeatureDisabledWidget';

export type SearchBarProps = {
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

type Hit = SearchResponseHit<Company>;

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
    const country = useAppStore((state) => state.country);

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

                                    ...defaultSearchParams,
                                    ...(queryBy && { query_by: queryBy }),
                                    ...(numberOfHits && { per_page: numberOfHits }),

                                    filter_by: (filters || [])
                                        .concat(
                                            disableCountryFiltering || country === 'all' ? [] : [countryFilter(country)]
                                        )
                                        .join(' && '),
                                };

                                searchClient
                                    .collections<Company>(index)
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
        country,
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

export const DisabledSearchBar = () => {
    return (
        <IntlProvider scope="search" definition={window.I18N_DEFINITION}>
            <FeatureDisabledWidget includeImage={false}>
                <MarkupText id="search-disabled" />
            </FeatureDisabledWidget>
        </IntlProvider>
    );
};

export const SearchBar = Privacy.isAllowed(PRIVACY_ACTIONS.SEARCH) ? RealSearchBar : DisabledSearchBar;
