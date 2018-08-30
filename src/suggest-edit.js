import t from 'Utility/i18n';
import { fetchCompanyDataBySlug } from './Utility/companies';
require('brutusin-json-forms');
import {ErrorException, rethrow} from "./Utility/errors";

// TODO: Style properly (i.e. at all). I'll leave that for !29.

let bf;
let submit_url = 'https://z374s4qgtc.execute-api.eu-central-1.amazonaws.com/prod/suggest';
let url_params = new URLSearchParams(window.location.search);

window.onload = () => {
  let schema_url = BASE_URL + 'schema.json';
  fetch(schema_url)
  .then(res => res.json())
  .then(out => { prepareForm(out); })
  .catch(err => { rethrow(ErrorException.fromError(err), 'Could not get `schema.json` for cdb suggestion form.', { schema_url: schema_url }); });
}

function prepareForm(schema) {
  if(url_params.has('slug')) fetchCompanyDataBySlug(url_params.get('slug'), company => { renderForm(schema, company) });
  else renderForm(schema);
}

function renderForm(schema, company = undefined) {
  let BrutusinForms = brutusin['json-forms'];
  BrutusinForms.addDecorator((element, schema) => {
    element.placeholder = '';

    let to_hide = [ 'slug', 'custom-access-template', 'custom-erasure-template', 'custom-rectification-template' ];

    if(!element.tagName) {
      let sanitizedText = element.textContent.toLowerCase().replace(/[^a-z0-9* ]/g, '').replace(/ /g, '-');
      element.textContent = t(sanitizedText, 'schema', null, null, t(sanitizedText.replace(/-/g, ' '), 'categories', null, null, sanitizedText));

      if(to_hide.includes(sanitizedText)) {
        // We are currently in the scope of some promise or something like that. `setTimeout` brings us back to the scope of the content process.
        setTimeout((el) => { document.getElementById(el).parentElement.parentElement.remove(); }, 0, element.parentElement.attributes.for.value);
      }
    }
  });
  bf = BrutusinForms.create(schema);
  bf.render(document.getElementById('suggest-form'), company || ( url_params.get('name') ? { name: url_params.get('name') } : {}));
}

document.getElementById('submit-suggest-form').onclick = () => {
  let data = bf.getData();

  fetch(submit_url, {
    'method': 'POST',
    'headers': { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'for': 'cdb',
      'data': data
    })
  })
  .then(res => {
    displaySuccessModal();
  })
  .catch(err => { displaySuccessModal(); });
};

function displaySuccessModal() {
  let preact = require('preact');
  let Modal = require('Components/Modal').default;

  let dismiss = () => { preact.render('', document.body, modal) };
  let modal = preact.render((
    <Modal onDismiss={dismiss} positiveText={t('ok', 'suggest')} onPositiveFeedback={dismiss}>
    <p>{t('success', 'suggest')}</p>
    </Modal>), document.body);
}
