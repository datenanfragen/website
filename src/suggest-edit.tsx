import { render } from "preact";
import { Form, type FormProps } from "formj";
import { useFetch } from "./hooks/useFetch";
import { ajv } from "./Utility/suggest";


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
    const { data, error } = useFetch<FormProps["schema"]>(window.BASE_URL + 'schema.json');
    if (error) return <div>Error loading form schema: {error.message}</div>;
    if (!data) return <div>Loading form schema...</div>;

    return <Form schema={data} customAjv={ajv} pointersToHide={pointersToHide}></Form >
};

const elem = document.getElementById('suggest-form');
if (elem) render(<SuggestForm />, elem);
