import { render } from 'preact';
import { Form, type FormProps } from 'formj';
import { useFetch } from './hooks/useFetch';
import { ajv } from './Utility/suggest';
import { fetchCompanyDataBySlug } from './Utility/companies';
import { useEffect, useState } from 'preact/hooks';
import { searchClient } from './Utility/search';
import { rethrow } from './Utility/errors';
import t from './Utility/i18n';

const pointersToHide = [
    '/slug',
    '/custom-access-template',
    '/custom-erasure-template',
    '/custom-rectification-template',
    '/custom-objection-template',
    '/required-elements',
    '/request-language',
    '/pgp-fingerprint',
    '/pgp-url',
    '/comments',
    '/quality',
    '/facet-group',
    '/needs-id-document',
    '/nsfw',
];
const SimilarList = (props: { name: string }) => {
    const [similarMatches, setSimilarMatches] = useState<any>([]);

    useEffect(() => {
        const searchOptions = {
            query_by: 'name, runs',
            prefix: false,
            sort_by: '_text_match:desc,sort-index:asc',
            num_typos: 1,
            per_page: 5,
            drop_tokens_threshold: 0,
            q: '',
        };

        if (props.name) {
            searchOptions['q'] = props.name;
            searchClient
                .collections('companies')
                .documents()
                .search(searchOptions)
                .then((res) =>
                    setSimilarMatches(
                        (res.hits &&
                            res.hits.map((hit: any) => ({
                                slug: hit.document.slug,
                                name: hit.document.name,
                                runs: hit.highlights
                                    .filter((highlight: any) => highlight.field === 'runs')
                                    .flatMap((highlight: any) => highlight.snippets),
                            }))) ||
                            []
                    )
                )
                .catch((error) => rethrow(error));
        }
    }, [props.name]);

    return (
        similarMatches.length > 0 && (
            <div className="similar-list">
                <label>{t('similarly-named-companies', 'suggest')}</label>
                <ul>
                    {similarMatches.map((similarMatch: any) => (
                        <li key={similarMatch.slug}>
                            <a href={window.BASE_URL + 'company/' + similarMatch.slug} target="_blank" rel="noreferrer">
                                {similarMatch.name}
                            </a>
                            {similarMatch.runs.length > 0 && (
                                <>
                                    {' '}
                                    ({t('also-runs', 'suggest')}
                                    {/* eslint-disable-next-line react/no-danger */}
                                    <span dangerouslySetInnerHTML={{ __html: similarMatch.runs.join(', ') }} />)
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )
    );
};

export const SuggestForm = () => {
    const [companyData, setCompanyData] = useState<any>(null);
    const [old_companyData, setOldCompanyData] = useState<any>(null);

    const { data, error } = useFetch<FormProps['schema']>(window.BASE_URL + 'schema.json');

    const slug = window.PARAMETERS['slug'];
    useEffect(() => {
        if (!slug) {
            setCompanyData({});
            return;
        }
        fetchCompanyDataBySlug(slug).then((data) => {
            setOldCompanyData(data);
            setCompanyData(data);
        });
    }, [slug]);

    if (error) return <div>Error loading form schema: {error.message}</div>;
    if (!data) return <div>Loading form schema...</div>;

    if (companyData !== null)
        return (
            <Form
                schema={data}
                customAjv={ajv}
                pointersToHide={pointersToHide}
                initialData={companyData}
                autoComplete="off"
                helpers={[
                    ({ value }) => ({
                        pointers: ['/name'],
                        type: 'custom-addon',
                        hidden: !value,
                        element: <SimilarList name={value as string} />,
                    }),
                ]}
            />
        );
    return <div>Loading company data...</div>;
};

const elem = document.getElementById('suggest-form');
if (elem) render(<SuggestForm />, elem);
