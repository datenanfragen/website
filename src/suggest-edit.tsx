import { render } from 'preact';
import { Form, type FormProps } from 'formj';
import { useFetch } from './hooks/useFetch';
import { ajv } from './Utility/suggest';
import { fetchCompanyDataBySlug } from './Utility/companies';
import { useEffect, useState } from 'preact/hooks';

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

export const SuggestForm = () => {
    const [companyData, setCompanyData] = useState<any>(null);
    const [old_companyData, setOldCompanyData] = useState<any>(null);

    const { data, error } = useFetch<FormProps['schema']>(window.BASE_URL + 'schema.json');

    const slug = window.PARAMETERS['slug'];
    useEffect(() => {
        if (!slug) return;
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
            />
        );
    return <div>Loading company data...</div>;
};

const elem = document.getElementById('suggest-form');
if (elem) render(<SuggestForm />, elem);
