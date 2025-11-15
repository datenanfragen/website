import { render, Component, Fragment } from 'preact';
import Modal from './Components/DeprecatedModal';
import t from 'Utility/i18n';
import { fetchCompanyDataBySlug } from './Utility/companies';
import { slugify, domainWithoutTldFromUrl } from './Utility/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
require('brutusin-json-forms');
/* global brutusin */
import { ErrorException, rethrow } from './Utility/errors';
import { submitUrl } from './Utility/suggest';
import { FlashMessage, flash } from './Components/FlashMessage';
import { searchClient } from 'Utility/search';
import equal from 'fast-deep-equal';
let bf;
let schema;
let company_data_old;

window.addEventListener('load', () => {
    const SCHEMA_URL = window.BASE_URL + 'schema.json';
    fetch(SCHEMA_URL)
        .then((res) => res.json())
        .then((out) => {
            prepareForm(out);
            schema = out;
        })
        .catch((err) => {
            rethrow(ErrorException.fromError(err), 'Could not get `schema.json` for cdb suggestion form.', {
                schema_url: SCHEMA_URL,
            });
        });
});

const sortRelevantCountries = (countries) => {
    countries.items.enum.sort((a, b) => {
        if (a === 'all') return -1;
        if (b === 'all') return 1;
        return t(a, 'countries').localeCompare(t(b, 'countries'));
    });
};

const sortCategories = (categories) => {
    categories.items.enum.sort((a, b) => {
        return t(a, 'categories').localeCompare(t(b, 'categories'));
    });
};

function prepareForm(schema) {
    sortRelevantCountries(schema.properties['relevant-countries']);
    sortCategories(schema.properties['categories']);
    if (window.PARAMETERS['slug']) {
        return fetchCompanyDataBySlug(window.PARAMETERS['slug']).then((company_data) => {
            company_data_old = company_data;
            return renderForm(schema, company_data);
        });
    }
    renderForm(schema);
}

function renderForm(schema, company_data = undefined) {
    let BrutusinForms = brutusin['json-forms'];

    const TO_HIDE = [
        'slug',
        'custom-access-template',
        'custom-erasure-template',
        'custom-rectification-template',
        'custom-objection-template',
        'required-elements',
        'request-language',
        'pgp-fingerprint',
        'pgp-url',
        'comments',
        'quality',
        'facet-group',
        'needs-id-document',
        'nsfw',
    ];
    BrutusinForms.addDecorator((element, schema) => {
        element.placeholder = '';

        if (!element.tagName) {
            const SANITIZED_TEXT = element.textContent
                .toLowerCase()
                .replace(/[^\d *a-z]/g, '')
                .replace(/ /g, '-');
            element.textContent = t(
                SANITIZED_TEXT,
                'schema',
                null,
                null,
                t(
                    SANITIZED_TEXT.replace(/-/g, ' '),
                    'categories',
                    null,
                    null,
                    t(SANITIZED_TEXT, 'countries', null, null, SANITIZED_TEXT)
                )
            );

            if (TO_HIDE.includes(SANITIZED_TEXT)) {
                // We are currently in the scope of some promise or something like that. `setTimeout` brings us back to the scope of the content process.
                setTimeout(() => {
                    document.querySelector(`tr[data-schema_id="$.${SANITIZED_TEXT}"]`)?.remove();
                }, 0);
            }
        } else {
            const tagName = element.tagName.toLowerCase();
            if (tagName === 'input' || tagName === 'textarea') {
                element.className += ' form-element';
                if (tagName === 'textarea') element.setAttribute('rows', '5');
            } else if (tagName === 'select') {
                let select_container = document.createElement('div');
                let icon = document.createElement('div');
                select_container.className = 'select-container';
                icon.className = 'icon icon-arrow-down';
                element.parentElement.appendChild(select_container);
                select_container.appendChild(element);
                select_container.appendChild(icon);
            } else if (tagName === 'button') {
                if (element.className === 'remove') {
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                    let icon = document.createElement('span');
                    icon.className = 'icon icon-trash';
                    element.appendChild(icon);
                }
                element.className += ' button button-small button-secondary';
            } else if (tagName === 'label') {
                element.onmouseover = (ev) => {
                    let tooltip = document.createTextNode(ev.target.title);
                    let tip_container = document.createElement('div');
                    tip_container.className = 'label-tooltip';
                    tip_container.appendChild(tooltip);
                    ev.target.appendChild(tip_container);
                };
                element.onmouseout = (ev) => {
                    ev.target.removeChild(ev.target.lastChild);
                };
            } else if (tagName === 'td') {
                if (element.className === 'item-action') element.style = 'padding-left: 0;';
                if (element.className === 'item-value') element.style = 'padding-right: 0;';
            } else if (tagName === 'tr') {
                element.dataset.schema_id = schema['$id'];
            }
        }
    });

    // Create and render form
    bf = BrutusinForms.create(schema);
    bf.render(
        document.getElementById('brutusin-form'),
        company_data || (PARAMETERS['name'] ? { name: PARAMETERS['name'] } : {})
    );

    // Set attributes to avoid autocompletion on the form
    // This is to avoid private data to be submitted (e.g. via a Password Manager)
    document.querySelectorAll('form.brutusin-form input, form.brutusin-form textarea').forEach((el) => {
        el.setAttribute('autocomplete', 'off');
        // https://developer.1password.com/docs/web/compatible-website-design/#ignore-offers-to-save-or-fill-specific-fields
        el.setAttribute('data-1p-ignore', '');
        // https://support.lastpass.com/s/document-item?language=en_US&bundleId=lastpass&topicId=LastPass%2Fc_lp_prevent_fields_from_being_filled_automatically.html&_LANG=enus
        el.setAttribute('data-lpignore', 'true');
        // https://stackoverflow.com/a/51272839
        el.setAttribute('data-protonpass-ignore', 'true');
        // https://github.com/bitwarden/clients/blob/e1415af407fef139fb69126349e5cc6d286f4474/apps/browser/src/autofill/services/collect-autofill-content.service.ts#L884-L889
        el.setAttribute('data-bwignore', 'true');
    });

    suggestSimilarNamedCompanies();
}

function suggestSimilarNamedCompanies() {
    const nameCell = document.querySelector('tr[data-schema_id="$.name"] > td.prop-value');

    // Create dummy container as Preact.render() does not guarantee order if parent already contains non-Preact components/elements.
    const container = document.createElement('div');
    nameCell.appendChild(container);

    const SimilarList = class SimilarList extends Component {
        constructor() {
            super();
            this.state = { similarMatches: [] };
        }

        componentDidMount() {
            const searchOptions = {
                query_by: 'name, runs',
                prefix: false,
                sort_by: '_text_match:desc,sort-index:asc',
                num_typos: 1,
                per_page: 5,
                drop_tokens_threshold: 0,
            };

            const nameInput = nameCell.querySelector('input');
            nameInput.oninput = () => this.setState({ similarMatches: [] });
            nameInput.onblur = (event) => {
                const name = event.target.value;
                if (name) {
                    searchOptions['q'] = name;
                    searchClient
                        .collections('companies')
                        .documents()
                        .search(searchOptions)
                        .then((res) =>
                            this.setState({
                                similarMatches: res.hits.map((hit) => ({
                                    slug: hit.document.slug,
                                    name: hit.document.name,
                                    runs: hit.highlights
                                        .filter((highlight) => highlight.field === 'runs')
                                        .flatMap((highlight) => highlight.snippets),
                                })),
                            })
                        )
                        .catch((e) => {
                            e.no_side_effects = true;
                            rethrow(e);
                        });
                }
            };
        }

        render() {
            return (
                this.state.similarMatches.length > 0 && (
                    <div className="similar-list">
                        <label>{t('similarly-named-companies', 'suggest')}</label>
                        <ul>
                            {this.state.similarMatches.map((similarMatch) => (
                                <li key={similarMatch.slug}>
                                    <a
                                        href={window.BASE_URL + 'company/' + similarMatch.slug}
                                        target="_blank"
                                        rel="noreferrer">
                                        {similarMatch.name}
                                    </a>
                                    {similarMatch.runs.length > 0 && (
                                        <Fragment>
                                            {' '}
                                            ({t('also-runs', 'suggest')}
                                            {/* eslint-disable-next-line react/no-danger */}
                                            <span dangerouslySetInnerHTML={{ __html: similarMatch.runs.join(', ') }} />)
                                        </Fragment>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            );
        }
    };

    render(<SimilarList />, container);
}

function isCompanyDataEquivalent(a, b) {
    function normalizeCompany(c) {
        if (c.fax) c.fax = c.fax.replace(/\s/g, '');
        if (c.phone) c.phone = c.phone.replace(/\s/g, '');
        return c;
    }
    return equal(normalizeCompany(a), normalizeCompany(b));
}

document.getElementById('submit-suggest-form').onclick = () => {
    let data = bf.getData();
    if (!data) {
        flash(<FlashMessage type="warning">{t('no-input', 'suggest')}</FlashMessage>);
        return;
    } else if (!data.name && !data.web) {
        flash(<FlashMessage type="warning">{t('name-or-web-missing', 'suggest')}</FlashMessage>);
        return;
    } else if (company_data_old && isCompanyDataEquivalent(data, company_data_old)) {
        flash(<FlashMessage type="warning">{t('no-change', 'suggest')}</FlashMessage>);
        return;
    }

    document.querySelectorAll('.brutusin-form .invalid').forEach((el) => {
        el.classList.remove('invalid');
    });

    // Do some post-processing on the user-submitted data to make the review easier.
    if (!data.slug) {
        const DOMAIN = domainWithoutTldFromUrl(data.web);
        data.slug = slugify(DOMAIN ? DOMAIN.replace('www.', '') : data.name);
    }
    if (!data['relevant-countries']) data['relevant-countries'] = ['all'];
    if (data.phone) data.phone = formatPhoneNumber(data.phone);
    if (data.fax) data.fax = formatPhoneNumber(data.fax);
    data.quality = 'verified';

    document.getElementById('loading-indicator').classList.remove('hidden');

    function getAllPropertyNamesInSchema(schema_part) {
        let res = [];
        for (let key in schema_part) {
            if (key === 'items') {
                res = res.concat(getAllPropertyNamesInSchema(schema_part[key]));
            }
            if (key === 'properties') {
                for (let [property_name, property_value] of Object.entries(schema_part[key])) {
                    res.push(property_name);
                    if (property_value) {
                        res = res.concat(getAllPropertyNamesInSchema(property_value));
                    }
                }
            }
        }
        return res;
    }
    // Get all property names in the order noted in the schema.
    // Later on we use them in the replacer part of JSON.stringify()
    // this replacer acts as a whitelist and gives an order of elements
    // --> if we put all properties in the whitelist,
    // we can control the ordering of the JSON to fix #187
    // (see https://stackoverflow.com/questions/16167581/sort-object-properties-and-json-stringify/40646557#comment70742750_40646557)
    let properties = getAllPropertyNamesInSchema(schema);
    // we use a replacer to order the JSON
    const body = JSON.stringify(
        {
            for: 'cdb',
            data,
            new: !PARAMETERS['slug'],
            comment: document.getElementById('comment').value,
        },
        ['for', 'data'].concat(properties, ['new', 'comment'])
    );

    fetch(submitUrl, {
        method: 'PUT',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body,
    })
        .then((res) => {
            document.getElementById('loading-indicator').classList.add('hidden');
            res.json().then((json) => {
                switch (res.status) {
                    case 201:
                    case 502:
                        if (json.url) {
                            displaySuccessModal(json);
                            break;
                        }
                        flash(<FlashMessage type="error">{t('github-error', 'suggest')}</FlashMessage>);
                        break;
                    case 400:
                        if (json.path) {
                            document
                                .querySelector(`tr[data-schema_id='${json.path.join('.').replace(/^data/, '$')}']`)
                                ?.classList.add('invalid');
                        }
                        flash(<FlashMessage type="error">{t('invalid-request', 'suggest')}</FlashMessage>);
                        break;
                    default:
                        flash(<FlashMessage type="error">{t('error', 'suggest')}</FlashMessage>);
                        break;
                }
            });
        })
        .catch((err) => {
            document.getElementById('loading-indicator').classList.add('hidden');
            rethrow(err, 'POSTing the suggestion failed.', { submitUrl, body }, t('error', 'suggest'));
        });
};

function formatPhoneNumber(number) {
    const RES = parsePhoneNumberFromString(number);
    return RES ? RES.formatInternational() : number;
}

function displaySuccessModal(data) {
    let modal;
    let dismiss = () => {
        render('', document.body, modal);

        window.location = window.BASE_URL + 'company/' + (PARAMETERS['slug'] || '');
    };
    modal = render(
        <Modal onDismiss={dismiss} positiveText={t('ok', 'suggest')} onPositiveFeedback={dismiss}>
            <p>{t('success', 'suggest')}</p>
            <p>
                <a href={data.url}>{t('view-on-github', 'suggest')}</a>
            </p>
        </Modal>,
        document.body
    );
}
