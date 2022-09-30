import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import { InstantSearch, SearchBox, connectHits, connectStateResults } from 'react-instantsearch-dom';
import { useGeneratorStore } from '../../store/generator';
import type { PageOptions, SetPageFunction } from './App';
import { CompanyResult } from './CompanyResult';
import { countryFilter, instantSearchClient } from '../../Utility/search';
import { companyFromHit } from '../../Utility/companies';
import { rethrow, ErrorException } from '../../Utility/errors';
import type { HitsProvided, StateResultsProvided, Hit } from 'react-instantsearch-core';
import { useFetch } from '../../hooks/useFetch';
import { useModal } from '../Modal';
import type { Company, CompanyPack } from '../../types/company';
import { ComponentChildren } from 'preact';
import t from '../../Utility/i18n';
import { useState } from 'preact/hooks';
import { useAppStore } from '../../store/app';
import { TransportMediumChooser } from '../Generator/TransportMediumChooser';
import type { TransportMedium } from '../../types/request.d';
import { slugify, almostUniqueId, objFilter } from '../../Utility/common';
import { submitUrl } from '../../Utility/suggest';
import { flash, FlashMessage } from '../FlashMessage';

// TODO: Respect privacy controls!

type CompanySearchPageProps = {
    setPage: SetPageFunction;
    pageOptions?: PageOptions;
};

const Hits = connectHits(({ hits }: HitsProvided<Company>) => {
    const [appendToBatch, removeFromBatch] = useGeneratorStore((state) => [state.appendToBatch, state.removeFromBatch]);
    const batch = useGeneratorStore((state) => state.batch);
    const [focussedOption, setFocussedOption] = useState(-1);

    const toggleHitInBatch = (hit: Hit<Company>) => {
        if (Object.keys(batch || {}).includes(hit.slug)) removeFromBatch(hit.slug);
        else appendToBatch(companyFromHit(hit));
    };

    return (
        <ul
            tabIndex={0}
            role="listbox"
            aria-multiselectable={true}
            className="company-result-list"
            aria-label={t('search-results', 'search')}
            aria-activedescendant={`company-result-option-${focussedOption}`}
            onFocus={() => setFocussedOption(0)}
            onBlur={() => setFocussedOption(-1)}
            onKeyDown={(e) => {
                // Keys as per https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role
                switch (e.code) {
                    case 'ArrowDown':
                        setFocussedOption(focussedOption + 1 < hits.length ? focussedOption + 1 : hits.length - 1);
                        break;
                    case 'ArrowUp':
                        setFocussedOption(focussedOption - 1 >= 0 ? focussedOption - 1 : 0);
                        break;
                    case 'Home':
                        setFocussedOption(0);
                        break;
                    case 'End':
                        setFocussedOption(hits.length - 1);
                        break;
                    case 'Space':
                        if (focussedOption >= 0 && focussedOption < hits.length) toggleHitInBatch(hits[focussedOption]);
                        break;
                }
            }}>
            {hits.map((hit, index) => (
                <CompanyResult
                    id={`company-result-option-${index}`}
                    focussed={index === focussedOption}
                    company={hit}
                    active={Object.keys(batch || {}).includes(hit.slug) || false}
                    onClick={() => toggleHitInBatch(hit)}
                />
            ))}
        </ul>
    );
});

const Results = connectStateResults(
    ({
        searchState,
        searchResults,
        children,
    }: Partial<StateResultsProvided<Company>> & { children?: ComponentChildren; batch_length: number }) => {
        const country = useAppStore((state) => state.country);
        const companyPacksUrl = `${window.BASE_URL}db/company-packs/${country}.json`;
        const { data: companyPacks, error: companyPacksError } = useFetch<CompanyPack[]>(companyPacksUrl);
        if (companyPacksError)
            rethrow(ErrorException.fromError(companyPacksError), 'Loading the company packs failed.', {
                suggested_companies_url: companyPacksUrl,
            });

        return searchState?.query ? (
            searchResults && searchResults.nbHits > 0 ? (
                children
            ) : (
                <IntlProvider scope="search" definition={window.I18N_DEFINITION}>
                    <p style="margin-left: 10px;">
                        <Text id="no-company" />
                    </p>
                </IntlProvider>
            )
        ) : (
            <>
                <h3 style="margin-top: 30px;">
                    <Text id="empty-query-suggested-companies" />
                </h3>
                <div className="company-suggestion-container">
                    {companyPacks?.map((p) => (
                        <CompanySuggestionsPack pack={p} />
                    ))}
                </div>
            </>
        );
    }
);

type CompanySuggestionsPackProps = { pack: CompanyPack };

const CompanySuggestionsPack = ({ pack }: CompanySuggestionsPackProps) => {
    const description = t(`${pack.slug as 'address-brokers'}-description`, 'company-packs');

    const [batch, appendToBatchBySlug] = useGeneratorStore((state) => [state.batch, state.appendToBatchBySlug]);

    const ModalContent = () => {
        const [selectedCompanies, setSelectedCompanies] = useState(
            pack.type === 'choose' ? [] : pack.companies.map((c) => c.slug)
        );

        return (
            <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
                <>
                    <h1>{t(`${pack.slug as 'address-brokers'}-title`, 'company-packs')}</h1>

                    {description && <p>{description}</p>}

                    <ul className="unstyled-list">
                        {pack.companies.map((c) => {
                            return (
                                <li>
                                    <input
                                        type="checkbox"
                                        className="form-element"
                                        checked={selectedCompanies.includes(c.slug)}
                                        onChange={(e) =>
                                            setSelectedCompanies(
                                                e.currentTarget.checked
                                                    ? [...selectedCompanies, c.slug]
                                                    : selectedCompanies.filter((s) => s !== c.slug)
                                            )
                                        }
                                        id={`company-pack-choose-${c.slug}`}
                                    />
                                    <label for={`company-pack-choose-${c.slug}`}>{c.name}</label>
                                </li>
                            );
                        })}
                    </ul>
                    <button
                        className="button button-primary"
                        style="float: right"
                        onClick={() =>
                            Promise.all(
                                selectedCompanies
                                    .filter((slug) => !Object.keys(batch || {}).includes(slug))
                                    .map((slug) => appendToBatchBySlug(slug))
                            ).then(hideModal)
                        }>
                        <Text
                            id="add-n-companies"
                            fields={{ n: `${selectedCompanies.length}` }}
                            plural={selectedCompanies.length}
                        />
                    </button>
                </>
            </IntlProvider>
        );
    };

    const [Modal, showModal, hideModal] = useModal(<ModalContent />);

    return (
        <IntlProvider scope="company-packs" definition={window.I18N_DEFINITION}>
            <Modal />

            <section className="company-suggestion-pack">
                <h1>{t(`${pack.slug as 'address-brokers'}-title`, 'company-packs')}</h1>
                {pack.type === 'add-all' && (
                    <span className="icon icon-star color-yellow-600" title={t('add-all-star', 'company-packs')} />
                )}
                <p>
                    {pack.companies
                        .slice(0, 7)
                        .map((c) => c.name)
                        .join(', ')}
                    {pack.companies.length > 7 && (
                        <em>
                            <Text id="and-n-more" fields={{ n: pack.companies.length - 7 }} />
                        </em>
                    )}
                </p>
                <button className="company-suggestion-pack-cta button" onClick={showModal}>
                    {pack.type === 'add-all' ? (
                        <Text id="add-companies-button" />
                    ) : (
                        <Text id="choose-companies-button" />
                    )}
                </button>
            </section>
        </IntlProvider>
    );
};

const useCustomCompanyModal = (props?: { initialName?: string }) => {
    const appendToBatch = useGeneratorStore((state) => state.appendToBatch);

    const CustomCompanyModalContent = () => {
        const [name, setName] = useState(props?.initialName || '');
        const [transportMedium, setTransportMedium] = useState<TransportMedium>('email');
        const [email, setEmail] = useState('');
        const [address, setAddress] = useState('');
        const [fax, setFax] = useState('');

        const promptForCompanySuggestions = useAppStore((state) => state.promptForCompanySuggestions);
        const [suggest, setSuggest] = useState(false);
        const [sources, setSources] = useState('');

        return (
            <div className="custom-company-modal-content">
                <Text id="add-custom-company-explanation" />

                <div className="form-group">
                    <label htmlFor="custom-company-input-name">
                        <Text id="company-name" />
                    </label>
                    <input
                        id="custom-company-input-name"
                        type="text"
                        className="form-element"
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                    />
                </div>

                <div className="form-group">
                    <TransportMediumChooser
                        value={transportMedium}
                        onChange={(newTransportMedium) => setTransportMedium(newTransportMedium)}
                        label={<Text id="request-transport-medium" />}
                    />
                </div>

                {transportMedium === 'email' && (
                    <div className="form-group">
                        <label htmlFor="custom-company-input-email">
                            <Text id="company-email" />
                        </label>
                        <input
                            id="custom-company-input-email"
                            type="text"
                            className="form-element"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                        />
                    </div>
                )}

                {transportMedium === 'fax' && (
                    <div className="form-group">
                        <label htmlFor="custom-company-input-fax">
                            <Text id="company-fax" />
                        </label>
                        <input
                            id="custom-company-input-fax"
                            type="text"
                            className="form-element"
                            value={fax}
                            onChange={(e) => setFax(e.currentTarget.value)}
                        />
                    </div>
                )}

                {transportMedium !== 'email' && (
                    <div className="form-group">
                        <label htmlFor="custom-company-input-address">
                            <Text id="company-letter" />
                        </label>
                        <textarea
                            id="custom-company-input-address"
                            className="form-element"
                            value={address}
                            onChange={(e) => setAddress(e.currentTarget.value)}
                            rows={6}
                        />
                    </div>
                )}

                {promptForCompanySuggestions && (
                    <>
                        <hr />

                        <label>
                            <input
                                checked={suggest}
                                type="checkbox"
                                className="form-element"
                                onChange={(e) => setSuggest(e.currentTarget.checked)}
                            />
                            <Text id="want-to-suggest-checkbox" />
                        </label>

                        {suggest && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="custom-company-suggest-sources">
                                        <Text id="want-to-suggest-provide-sources" />
                                    </label>
                                    <textarea
                                        id="custom-company-suggest-sources"
                                        className="form-element"
                                        value={sources}
                                        onChange={(e) => setSources(e.currentTarget.value)}
                                    />

                                    <MarkupText id="want-to-suggest-disclaimer" />
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Great. Now these out-of-line modal buttons are becoming a pattern. -.- */}
                <div className="button-group">
                    <button
                        className="button button-primary"
                        style="float: right;"
                        disabled={!name.trim()}
                        onClick={() => {
                            appendToBatch({
                                slug: `<${slugify(name)}-${almostUniqueId()}>`,
                                name,
                                address,
                                fax,
                                email,
                                'suggested-transport-medium': transportMedium,
                                quality: 'verified',
                            });

                            if (suggest) {
                                const body = JSON.stringify({
                                    for: 'cdb',
                                    data: objFilter(
                                        {
                                            slug: slugify(name),
                                            name,
                                            address,
                                            fax,
                                            email,
                                            sources: sources.split('\n').filter((l) => l.trim()),
                                            quality: 'verified',
                                        },
                                        ([, val]) => !!val.toString().trim()
                                    ),
                                    new: true,
                                });
                                fetch(submitUrl, {
                                    method: 'PUT',
                                    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                                    body,
                                })
                                    .then((res) => Promise.all([res, res.json()]))
                                    .then(([res, json]) => {
                                        switch (res.status) {
                                            case 201:
                                            case 502:
                                                if (json.url) {
                                                    flash(
                                                        <FlashMessage type="success">
                                                            <p>{t('success', 'suggest')}</p>
                                                            <p>
                                                                <a href={json.url}>{t('view-on-github', 'suggest')}</a>
                                                            </p>
                                                        </FlashMessage>
                                                    );
                                                    break;
                                                }
                                            // eslint-disable-next-line no-fallthrough
                                            default:
                                                flash(
                                                    <FlashMessage type="error">{t('error', 'suggest')}</FlashMessage>
                                                );
                                                break;
                                        }
                                    })
                                    .catch((err) => {
                                        rethrow(
                                            err,
                                            'PUTing the suggestion failed.',
                                            { submitUrl, body },
                                            t('error', 'suggest')
                                        );
                                    });
                            }

                            dismissCustomCompanyModal();
                        }}>
                        <Text id={suggest ? 'add-company-and-suggest' : 'add-company'} />
                    </button>
                    <button
                        className="button button-secondary"
                        style="float: left;"
                        onClick={() =>
                            ((!name.trim() && !email.trim() && !address.trim()) ||
                                confirm(t('confirm-cancel-add-custom-company', 'generator'))) &&
                            dismissCustomCompanyModal()
                        }>
                        <Text id="cancel" />
                    </button>
                    <div className="clearfix" />
                </div>
            </div>
        );
    };

    const [CustomCompanyModal, showCustomCompanyModal, dismissCustomCompanyModal] = useModal(
        <CustomCompanyModalContent />,
        { backdropDismisses: false, escDismisses: false, hasDismissButton: false }
    );

    return [CustomCompanyModal, showCustomCompanyModal, dismissCustomCompanyModal] as const;
};

const CustomCompanyButton = connectStateResults(({ searchState }: StateResultsProvided<Company>) => {
    const [CustomCompanyModal, showCustomCompanyModal] = useCustomCompanyModal({ initialName: searchState?.query });
    return (
        <>
            <CustomCompanyModal />
            <button
                className="button button-secondary button-small"
                onClick={showCustomCompanyModal}
                style="margin-right: 10px;">
                <Text id="add-custom-company" />
            </button>
        </>
    );
});
export const CompanySearchPage = (props: CompanySearchPageProps) => {
    const batch = useGeneratorStore((state) => state.batch);
    const batch_length = Object.keys(batch || {}).length || 0;
    const country = useAppStore((state) => state.country);

    const searchClientParams = { filter_by: country === 'all' ? '' : countryFilter(country) };
    return (
        <>
            <InstantSearch
                indexName="companies"
                searchClient={
                    props.pageOptions?.searchClient?.(searchClientParams) || instantSearchClient(searchClientParams)
                }>
                <SearchBox translations={{ placeholder: t('select-company', 'cdb') }} />
                <Results>
                    <Hits />
                </Results>

                <div className="app-cta-container">
                    <CustomCompanyButton />
                    <button
                        id="review-n-companies-button"
                        className="button button-primary"
                        disabled={batch_length < 1}
                        onClick={() => props.setPage('review_selection')}>
                        <MarkupText id="review-n-companies" plural={batch_length} fields={{ count: batch_length }} />
                        <span className="icon icon-arrow-right padded-icon-right" />
                    </button>
                </div>

                {/* TODO: Pagination? */}
            </InstantSearch>
        </>
    );
};
