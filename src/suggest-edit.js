import { render } from 'preact';
import Modal from 'Components/Modal';
import t from 'Utility/i18n';
import { fetchCompanyDataBySlug } from './Utility/companies';
import { slugify, domainWithoutTldFromUrl, PARAMETERS } from './Utility/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
require('brutusin-json-forms');
/* global brutusin */
import { ErrorException, rethrow } from './Utility/errors';
import FlashMessage, { flash } from 'Components/FlashMessage';
let bf;
let schema;
const SUBMIT_URL =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/suggest'
        : 'https://backend.datenanfragen.de/suggest';

window.onload = () => {
    const SCHEMA_URL = BASE_URL + 'schema.json';
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
};

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
    if (PARAMETERS['slug']) {
        fetchCompanyDataBySlug(PARAMETERS['slug']).then((company) => {
            renderForm(schema, company);
        });
    } else renderForm(schema);
}

function renderForm(schema, company = undefined) {
    let BrutusinForms = brutusin['json-forms'];

    const TO_HIDE = [
        'slug',
        'custom-access-template',
        'custom-erasure-template',
        'custom-rectification-template',
        'custom-objection-template',
        'request-language',
        'pgp-fingerprint',
        'pgp-url',
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
            var tagName = element.tagName.toLowerCase();
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
    bf = BrutusinForms.create(schema);
    bf.render(
        document.getElementById('suggest-form'),
        company || (PARAMETERS['name'] ? { name: PARAMETERS['name'] } : {})
    );
}

document.getElementById('submit-suggest-form').onclick = () => {
    let data = bf.getData();
    if (!data) {
        flash(<FlashMessage type="warning">{t('no-input', 'suggest')}</FlashMessage>);
        return;
    } else if (!data.name && !data.web) {
        flash(<FlashMessage type="warning">{t('name-or-web-missing', 'suggest')}</FlashMessage>);
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
            data: data,
            new: !PARAMETERS['slug'],
        },
        ['for', 'data'].concat(properties, ['new'])
    );

    fetch(SUBMIT_URL, {
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
            rethrow(err, 'POSTing the suggestion failed.', { submit_url: SUBMIT_URL, body }, t('error', 'suggest'));
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

        window.location = BASE_URL + 'company/' + (PARAMETERS['slug'] || '');
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
