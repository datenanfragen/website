import t from 'Utility/i18n';
import { fetchCompanyDataBySlug } from './Utility/companies';
import { slugify, domainFromUrl, PARAMETERS } from './Utility/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
require('brutusin-json-forms');
/* global brutusin */
import { ErrorException, rethrow } from './Utility/errors';
import FlashMessage, { flash } from 'Components/FlashMessage';
let bf;
// The requests to the dev endpoint can be viewed here: https://beeceptor.com/console/datenanfragen-test
const SUBMIT_URL =
    process.env.NODE_ENV === 'development'
        ? 'https://datenanfragen-test.free.beeceptor.com/suggest'
        : 'https://z374s4qgtc.execute-api.eu-central-1.amazonaws.com/prod/suggest';

window.onload = () => {
    const SCHEMA_URL = BASE_URL + 'schema.json';
    fetch(SCHEMA_URL)
        .then(res => res.json())
        .then(out => {
            prepareForm(out);
        })
        .catch(err => {
            rethrow(ErrorException.fromError(err), 'Could not get `schema.json` for cdb suggestion form.', {
                schema_url: SCHEMA_URL
            });
        });
};

function prepareForm(schema) {
    if (PARAMETERS['slug']) {
        fetchCompanyDataBySlug(PARAMETERS['slug'], company => {
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
        'request-language'
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
                setTimeout(
                    el => {
                        document.getElementById(el).parentElement.parentElement.remove();
                    },
                    0,
                    element.parentElement.attributes.for.value
                );
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
                element.className += ' button-small button-primary';
            } else if (tagName === 'label') {
                element.onmouseover = ev => {
                    let tooltip = document.createTextNode(ev.target.title);
                    let tip_container = document.createElement('div');
                    tip_container.className = 'label-tooltip';
                    tip_container.appendChild(tooltip);
                    ev.target.appendChild(tip_container);
                };
                element.onmouseout = ev => {
                    ev.target.removeChild(ev.target.lastChild);
                };
            } else if (tagName === 'td') {
                if (element.className === 'item-action') element.style = 'padding-left: 0;';
                if (element.className === 'item-value') element.style = 'padding-right: 0;';
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
        /* eslint-disable no-unused-vars */
        let preact = require('preact');
        /* eslint-enable no-unused-vars */
        flash(<FlashMessage type="warning">{t('no-input', 'suggest')}</FlashMessage>);
        return;
    }

    // Do some post-processing on the user-submitted data to make the review easier.
    if (!data.slug) {
        const DOMAIN = domainFromUrl(data.web);
        data.slug = slugify(DOMAIN ? DOMAIN.replace('www.', '') : data.name);
    }
    if (!data['relevant-countries']) data['relevant-countries'] = ['all'];
    if (data.phone) data.phone = formatPhoneNumber(data.phone);
    if (data.fax) data.fax = formatPhoneNumber(data.fax);

    document.getElementById('loading-indicator').classList.remove('hidden');
    fetch(SUBMIT_URL, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            for: 'cdb',
            data: data,
            new: !PARAMETERS['slug']
        })
    })
        .then(res => res.json())
        .then(res => {
            document.getElementById('loading-indicator').classList.add('hidden');
            displaySuccessModal(res);
        })
        .catch(err => {
            document.getElementById('loading-indicator').classList.add('hidden');
            rethrow(err);
            /* eslint-disable no-unused-vars */
            let preact = require('preact');
            /* eslint-enable no-unused-vars */
            flash(<FlashMessage type="error">{t('error', 'suggest')}</FlashMessage>);
        });
};

function formatPhoneNumber(number) {
    const RES = parsePhoneNumberFromString(number);
    return RES ? RES.formatInternational() : number;
}

function displaySuccessModal(data) {
    let preact = require('preact');
    let Modal = require('Components/Modal').default;

    let dismiss = () => {
        preact.render('', document.body, modal);

        window.location = BASE_URL + 'company/' + (PARAMETERS['slug'] || '');
    };
    let modal = preact.render(
        <Modal onDismiss={dismiss} positiveText={t('ok', 'suggest')} onPositiveFeedback={dismiss}>
            <p>{t('success', 'suggest')}</p>
            <p>
                <a href={data.issue_url}>{t('view-on-github', 'suggest')}</a>
            </p>
        </Modal>,
        document.body
    );
}
