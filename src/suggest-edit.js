import t from 'Utility/i18n';
import { fetchCompanyDataBySlug } from './Utility/companies';
import { slugify, domainFromUrl } from './Utility/common';
require('brutusin-json-forms');
/* global brutusin */
import { ErrorException, rethrow } from './Utility/errors';
import FlashMessage, { flash } from 'Components/FlashMessage';
let bf;
let submit_url = 'https://z374s4qgtc.execute-api.eu-central-1.amazonaws.com/prod/suggest';

let url_params = new URLSearchParams(window.location.search);

window.onload = () => {
    let schema_url = BASE_URL + 'schema.json';
    fetch(schema_url)
        .then(res => res.json())
        .then(out => {
            prepareForm(out);
        })
        .catch(err => {
            rethrow(ErrorException.fromError(err), 'Could not get `schema.json` for cdb suggestion form.', {
                schema_url: schema_url
            });
        });
};

function prepareForm(schema) {
    if (url_params.has('slug')) {
        fetchCompanyDataBySlug(url_params.get('slug'), company => {
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
            let sanitizedText = element.textContent
                .toLowerCase()
                .replace(/[^\d *a-z]/g, '')
                .replace(/ /g, '-');
            element.textContent = t(
                sanitizedText,
                'schema',
                null,
                null,
                t(
                    sanitizedText.replace(/-/g, ' '),
                    'categories',
                    null,
                    null,
                    t(sanitizedText, 'countries', null, null, sanitizedText)
                )
            );

            if (TO_HIDE.includes(sanitizedText)) {
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
        company || (url_params.get('name') ? { name: url_params.get('name') } : {})
    );
}

document.getElementById('submit-suggest-form').onclick = () => {
    let data = bf.getData();

    if (!data.slug) data.slug = slugify(domainFromUrl(data.web) || data.name);

    fetch(submit_url, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            for: 'cdb',
            data: data
        })
    })
        .then(res => {
            displaySuccessModal();
        })
        .catch(err => {
            let preact = require('preact');
            flash(<FlashMessage type="error">{t('error', 'suggest')}</FlashMessage>);
        });
};

function displaySuccessModal() {
    let preact = require('preact');
    let Modal = require('Components/Modal').default;

    let dismiss = () => {
        preact.render('', document.body, modal);

        window.location = BASE_URL + 'company/' + (url_params.get('slug') || '');
    };
    let modal = preact.render(
        <Modal onDismiss={dismiss} positiveText={t('ok', 'suggest')} onPositiveFeedback={dismiss}>
            <p>{t('success', 'suggest')}</p>
        </Modal>,
        document.body
    );
}
