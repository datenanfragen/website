import preact from 'preact';
import RequestForm from 'Forms/RequestForm';
import RequestLetter from 'Utility/RequestLetter';
import { SearchBar } from './Components/SearchBar';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';
import { fetchCompanyDataBySlug } from 'Utility/companies';
import { slugify, PARAMETERS } from 'Utility/common';
import localforage from 'localforage';
import Privacy, { PRIVACY_ACTIONS } from './Utility/Privacy';
import Modal from './Components/Modal';
import { isDebugMode } from './Utility/errors';
import CompanyWidget from './Components/CompanyWidget';
import IdData, { ID_DATA_CHANGE_EVENT, ID_DATA_CLEAR_EVENT } from './Utility/IdData';
import { SavedCompanies } from './Components/Wizard';
import t, { t_r } from './Utility/i18n';
import Joyride from 'react-joyride';
import { tutorial_steps } from './wizard-tutorial.js';
import Cookie from 'js-cookie';
import SvaFinder from './Components/SvaFinder';
import { download } from './Utility/browser';
import Template from 'letter-generator/Template';
import { defaultFields, trackingFields, templateURL, REQUEST_ARTICLES, initializeFields } from './Utility/requests';
import Request from './DataType/Request';

const HIDE_IN_WIZARD_MODE = [
    '.search',
    '.request-type-chooser',
    '#data-portability',
    '#advanced-information',
    '.company-remove'
];

class Generator extends preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            request_data: new Request(),
            template_text: '',
            suggestion: null,
            download_active: false,
            blob_url: '',
            download_filename: '',
            batch: [],
            modal_showing: '',
            response_type: '',
            fill_fields: [],
            fill_signature: null,
            response_request: {},
            request_done: false, // TODO: Maybe change according to #98
            run_wizard_tutorial: false
        };

        this.letter = new RequestLetter({}, (blob_url, filename) => {
            this.setState({
                blob_url: blob_url,
                download_filename: filename,
                download_active: true
            });
        });

        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            this.request_store = localforage.createInstance({
                name: 'Datenanfragen.de',
                storeName: 'my-requests'
            });
        }
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            this.idData = new IdData();
            this.idData.getAll(false).then(fill_fields => this.setState({ fill_fields: fill_fields }));
            this.idData.getSignature().then(fill_signature => this.setState({ fill_signature: fill_signature }));
        }

        this.renderRequest = this.renderRequest.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAutocompleteSelected = this.handleAutocompleteSelected.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleLetterChange = this.handleLetterChange.bind(this);
        this.handleLetterTemplateChange = this.handleLetterTemplateChange.bind(this);
        this.handleTransportMediumChange = this.handleTransportMediumChange.bind(this);
        this.storeRequest = this.storeRequest.bind(this);
        this.newRequest = this.newRequest.bind(this);
        this.hideModal = this.hideModal.bind(this);

        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)) this.saved_companies = new SavedCompanies();
        if (PARAMETERS['from'] === 'wizard') {
            if (Cookie.get('finished_wizard_tutorial') !== 'true') this.state.run_wizard_tutorial = true;

            if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES)) {
                this.saved_companies.getAll().then(companies => {
                    this.setState({ batch: Object.keys(companies) });
                    if (this.state.batch && this.state.batch.length > 0) {
                        fetchCompanyDataBySlug(this.state.batch.shift(), company => {
                            this.setCompany(company);
                        });
                    }
                });
            } else {
                const batch_companies = PARAMETERS['companies'];
                if (batch_companies) {
                    this.setState({ batch: batch_companies.split(',') });
                }
            }
        } else if (PARAMETERS['company']) {
            fetchCompanyDataBySlug(PARAMETERS['company'], company => {
                this.setCompany(company);
            });
        }

        this.resetInitialConditions();
    }

    resetInitialConditions() {
        if (this.state.batch && this.state.batch.length > 0) {
            fetchCompanyDataBySlug(this.state.batch.shift(), company => {
                this.setCompany(company);
            });
        }

        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            const response_to = PARAMETERS['response_to'];
            const response_type = PARAMETERS['response_type'];
            if (response_to && response_type) {
                this.request_store.getItem(response_to).then(request => {
                    fetch(templateURL(this.state.request_data.language) + response_type + '.txt')
                        .then(res => res.text())
                        .then(text => {
                            this.setState(prev => {
                                prev.request_data.custom_data['content'] = new Template(text, [], {
                                    request_article: REQUEST_ARTICLES[request.type],
                                    request_date: request.date,
                                    request_recipient_address: request.recipient
                                }).getText();
                                if (response_type === 'admonition') {
                                    // TODO @zner0L: I don't think this is used anywhere.
                                    prev.request_data['via'] = request.via;
                                    prev.request_data['recipient_address'] = request.recipient;
                                }
                                prev.request_data['reference'] = request.reference;
                                prev.response_type = response_type;
                                prev.request_data['type'] = 'custom';
                                prev.response_request = request;
                                return prev;
                            });
                            if (response_type === 'admonition' && request.slug) {
                                fetchCompanyDataBySlug(request.slug, company => {
                                    this.setCompany(company);
                                });
                            }
                            this.renderRequest();
                        });
                });
                if (response_type === 'complaint') this.showModal('choose_authority');
            }
        }

        fetch(templateURL(this.state.request_data.language) + 'access-default.txt')
            .then(res => res.text())
            .then(text => {
                this.setState({ template_text: text });
                this.renderRequest();

                initializeFields(this.state.request_data.id_data).then(res => {
                    this.setState(prev => {
                        prev.request_data.id_data = res.new_fields;
                        prev.request_data.signature = res.signature;

                        if (res.new_fields.name) prev.request_data.custom_data.name = name.value;
                        if (res.new_fields.address) prev.request_data.custom_data.sender_address = res.new_fields.value;

                        return prev;
                    });
                });
            });
    }

    tutorialCallback(data) {
        if (data.type == 'finished') Cookie.set('finished_wizard_tutorial', 'true', { expires: 365 });
    }

    render() {
        const company_widget = this.state.suggestion ? (
            <CompanyWidget
                company={this.state.suggestion}
                onRemove={() => {
                    this.setState(prev => {
                        prev['suggestion'] = null;
                        prev.request_data['recipient_runs'] = [];
                        prev.request_data['language'] = LOCALE;

                        return prev;
                    });
                    Generator.clearUrl();
                }}
            />
        ) : (
            ''
        );
        const new_request_text = this.state.batch && this.state.batch.length > 0 ? 'next-request' : 'new-request';

        return (
            <main>
                <Joyride
                    ref={c => (this.tutorial = c)}
                    callback={this.tutorialCallback}
                    steps={tutorial_steps}
                    type="continuous"
                    run={this.state.run_wizard_tutorial}
                    autoStart={true}
                    locale={{
                        back: t('back', 'wizard_tutorial'),
                        close: t('close', 'wizard_tutorial'),
                        last: t('finish', 'wizard_tutorial'),
                        next: t('next', 'wizard_tutorial'),
                        skip: t('skip', 'wizard_tutorial')
                    }}
                    showSkipButton={true}
                    showStepsProgress={true}
                    showOverlay={false}
                />

                {this.state.modal_showing}
                <header id="generator-header">
                    <div id="generator-controls" style="margin-bottom: 10px;">
                        {this.getActionButton()}
                        <button
                            className="button button-secondary"
                            id="new-request-button"
                            onClick={() => {
                                if (!this.state.request_done) this.showModal('new_request');
                                else this.newRequest();
                            }}>
                            <Text id={new_request_text} />
                        </button>
                    </div>
                </header>
                <div className="clearfix" />
                <div className="search">
                    <SearchBar
                        id="aa-search-input"
                        index="companies"
                        onAutocompleteSelected={this.handleAutocompleteSelected}
                        placeholder={t('select-company', 'generator')}
                        debug={false}
                    />
                    {/* For some reason, autocomplete.js completely freaks out if it is wrapped in any tag at all and there isn't *anything at all* after it (only in the generator, though). As a workaround, we just use a space. We are counting on #24 anyway… */}{' '}
                </div>
                <div id="request-generator" className="grid" style="margin-top: 10px;">
                    <div id="form-container">
                        <RequestForm
                            onChange={this.handleInputChange}
                            onTypeChange={this.handleTypeChange}
                            onLetterChange={this.handleLetterChange}
                            onTransportMediumChange={this.handleTransportMediumChange}
                            request_data={this.state.request_data}
                            fillFields={this.state.fill_fields}
                            fillSignature={this.state.fill_signature}
                            onLetterTemplateChange={this.handleLetterTemplateChange}>
                            {company_widget}
                        </RequestForm>
                    </div>
                    <div className="clearfix" />
                    {isDebugMode() ? (
                        <div id="content-container" className="box">
                            <iframe
                                title="Debug preview"
                                id="pdf-viewer"
                                src={this.state.blob_url}
                                className={this.state.blob_url ? '' : 'empty'}
                            />
                        </div>
                    ) : (
                        []
                    )}
                </div>
                <div className="clearfix" />
            </main>
        );
    }

    adjustAccordingToWizardMode() {
        const wizard = PARAMETERS['from'] === 'wizard';

        HIDE_IN_WIZARD_MODE.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (wizard) el.classList.add('hidden');
                else el.classList.remove('hidden');
            });
        });
        document.querySelectorAll('.company-info h1').forEach(selector => {
            selector.style.marginLeft = wizard ? '0' : '';
        });
    }

    componentDidUpdate() {
        this.adjustAccordingToWizardMode();
    }

    componentDidMount() {
        this.adjustAccordingToWizardMode();

        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            const callback = () => {
                this.idData.getAll(false).then(fill_fields => this.setState({ fill_fields: fill_fields }));
                this.idData.getSignature().then(fill_signature => this.setState({ fill_signature: fill_signature }));
            };

            window.addEventListener(ID_DATA_CHANGE_EVENT, callback);
            window.addEventListener(ID_DATA_CLEAR_EVENT, callback);
        }
    }

    /**
     * @param modal {string|Component} if it is a string, modal will be interpreted as modal_id
     */
    showModal(modal) {
        if (typeof modal === 'string') {
            switch (modal) {
                case 'new_request': // TODO: Logic
                    modal = (
                        <Modal
                            positiveText={[
                                t(
                                    this.state.request_data.transport_medium === 'email'
                                        ? 'send-email-first'
                                        : 'download-pdf-first',
                                    'generator'
                                ),
                                <span
                                    style="margin-left: 10px;"
                                    className={
                                        'icon ' +
                                        (this.state.request_data.transport_medium === 'email'
                                            ? 'icon-email'
                                            : 'icon-download')
                                    }
                                />
                            ]}
                            negativeText={t('new-request', 'generator')}
                            onNegativeFeedback={e => {
                                this.hideModal();
                                this.newRequest();
                            }}
                            onPositiveFeedback={e => {
                                if (this.state.blob_url) {
                                    this.hideModal();
                                    this.storeRequest();
                                    download(
                                        this.state.request_data.transport_medium === 'email'
                                            ? this.letter.toMailtoLink(
                                                  this.state.suggestion ? this.state.suggestion['email'] : ''
                                              )
                                            : this.state.blob_url,
                                        this.state.request_data.transport_medium === 'email'
                                            ? null
                                            : this.state.download_filename
                                    );
                                    this.newRequest();
                                }
                            }}
                            positiveDefault={true}
                            onDismiss={this.hideModal}>
                            <Text id="modal-new-request" />
                        </Modal>
                    );
                    break;
                case 'choose_authority':
                    modal = (
                        <Modal
                            negativeText={t('cancel', 'generator')}
                            onNegativeFeedback={() => this.hideModal()}
                            positiveDefault={true}
                            onDismiss={() => this.hideModal()}>
                            <MarkupText id="modal-select-authority" />
                            <SvaFinder
                                callback={sva => {
                                    this.setCompany(sva);
                                    fetch(templateURL(sva['complaint-language']) + 'complaint.txt')
                                        .then(res => res.text())
                                        .then(text => {
                                            this.setState(prev => {
                                                prev.request_data.custom_data['content'] = new Template(text, [], {
                                                    request_article: REQUEST_ARTICLES[this.state.response_request.type],
                                                    request_date: this.state.response_request.date,
                                                    request_recipient_address: this.state.response_request.recipient
                                                }).getText();
                                            });
                                            this.renderRequest();
                                        });
                                    this.hideModal();
                                }}
                                style="margin-top: 15px;"
                            />
                        </Modal>
                    );
            }
        }
        this.setState({ modal_showing: modal });
    }

    hideModal() {
        this.setState({ modal_showing: '' });
    }

    getActionButton() {
        return this.state.request_data.transport_medium === 'email' ? (
            <a
                id="sendmail-button"
                className={'button' + (this.state.blob_url ? '' : ' disabled') + ' button-primary'}
                href={this.letter.toMailtoLink(this.state.suggestion ? this.state.suggestion['email'] : '')}
                onClick={e => {
                    if (!this.state.blob_url) {
                        e.preventDefault();
                    } else {
                        this.storeRequest();
                        this.setState({ request_done: true });
                    }
                }}>
                <Text id="send-email" />
                &nbsp;&nbsp;
                <span className="icon icon-email" />
            </a>
        ) : (
            <a
                id="download-button"
                className={'button' + (this.state.download_active ? '' : ' disabled') + ' button-primary'}
                href={this.state.blob_url}
                download={this.state.download_filename}
                onClick={e => {
                    if (!this.state.download_active) {
                        e.preventDefault();
                    } else {
                        this.storeRequest();
                        this.setState({ request_done: true });
                    }
                }}>
                <Text id="download-pdf" />
                &nbsp;&nbsp;
                <span className="icon icon-download" />
            </a>
        );
    }

    setCompany(company) {
        const template_file =
            company['custom-' + this.state.request_data.type + '-template'] ||
            this.state.request_data.type + '-default.txt';
        fetch(templateURL(company['request-language']) + template_file)
            .then(res => res.text())
            .then(text => {
                this.setState({ template_text: text });
                this.renderRequest();
            });

        // I would love to have `Request` handle this. But unfortunately that won't work as Preact won't notice the
        // state has changed. :(
        this.setState(prev => {
            prev.request_data['transport_medium'] = company['suggested-transport-medium']
                ? company['suggested-transport-medium']
                : company['fax']
                ? 'fax'
                : 'letter';
            prev.request_data['recipient_address'] =
                company.name +
                (PARAMETERS['response_type'] !== 'complaint'
                    ? '\n' + t_r('attn', company['request-language'] || LOCALE)
                    : '') +
                '\n' +
                company.address +
                (prev.request_data['transport_medium'] === 'fax'
                    ? '\n' + t_r('by-fax', company['request-language'] || LOCALE) + company['fax']
                    : '');

            const language =
                !!company['request-language'] && company['request-language'] !== ''
                    ? company['request-language']
                    : LOCALE;

            if (!['access-tracking.txt'].includes(template_file)) {
                prev.request_data['id_data'] = IdData.mergeFields(
                    prev.request_data['id_data'],
                    !!company['required-elements'] && company['required-elements'].length > 0
                        ? company['required-elements']
                        : defaultFields(language)
                );
            } else {
                prev.request_data['id_data'] = IdData.mergeFields(
                    prev.request_data['id_data'],
                    trackingFields(language)
                );

                // This is not the most elegant thing in the world, but we need to support 'no ID data' requests for
                // more than adtech companies. Ideally, this would be another bool in the schema but we can't really
                // change that right now because of Typesense. Thus, we have to stick to matching the template for now.
                // And I have realized that our current adtech case also applies to pretty much all other 'no ID data'
                // requests anyway in that they are either also to tracking companies or those companies at least
                // identify the user by the same details (i.e. cookie IDs, device IDs, etc.)
                // I couldn't come up with a better name, so we'll just leave them as tracking requests, I guess…
                prev.request_data.is_tracking_request = true;
            }

            prev.request_data['recipient_runs'] = company.runs || [];
            prev.suggestion = company;
            prev.request_data['data_portability'] = company['suggested-transport-medium'] === 'email';
            prev.request_data['language'] = company['request-language'] || LOCALE;

            return prev;
        });
    }

    handleAutocompleteSelected(event, suggestion, dataset) {
        if (this.state.suggestion) {
            this.showModal(
                <Modal
                    positiveText={t('new-request', 'generator')}
                    negativeText={t('override-request', 'generator')}
                    onNegativeFeedback={e => {
                        this.hideModal();
                        this.setCompany(suggestion.document);
                        this.renderRequest();
                    }}
                    onPositiveFeedback={e => {
                        this.hideModal();
                        this.newRequest();
                        this.setCompany(suggestion.document);
                        this.renderRequest();
                    }}
                    positiveDefault={true}
                    onDismiss={this.hideModal}>
                    <Text id="modal-autocomplete-new-request" />
                </Modal>
            );
        } else {
            this.setCompany(suggestion.document);
            this.renderRequest();
        }
    }

    handleTypeChange(event) {
        this.handleInputChange({ type: event.target.value });
        if (event.target.value === 'custom') {
            this.letter.clearProps();
            return;
        }
        const template_file = this.state.suggestion
            ? this.state.suggestion['custom-' + this.state.request_data.type + '-template'] ||
              this.state.request_data.type + '-default.txt'
            : this.state.request_data.type + '-default.txt';
        fetch(templateURL(this.state.request_data.language) + template_file)
            .then(res => res.text())
            .then(text => {
                this.setState({ template_text: text });
                this.renderRequest();
            });
    }

    handleInputChange(changed_data) {
        this.setState(prev => {
            for (let key in changed_data) {
                prev['request_data'][key] = changed_data[key];
            }
            return prev;
        });
        this.renderRequest();
    }

    handleLetterChange(event, address_change = false) {
        if (address_change) {
            this.setState(prev => {
                const att = event.target.getAttribute('name');
                prev.request_data.custom_data['sender_address'][att] = event.target.value;
                return prev;
            });
        } else {
            this.setState(prev => {
                const att = event.target.getAttribute('name');
                if (Object.prototype.hasOwnProperty.call(prev.request_data.custom_data, att))
                    prev.request_data.custom_data[att] = event.target.value;
                return prev;
            });
        }
        this.renderRequest();
    }

    handleLetterTemplateChange(event) {
        if (event.target.value && event.target.value !== 'no-template') {
            fetch(templateURL(this.state.request_data.language) + event.target.value + '.txt')
                .then(res => res.text())
                .then(text => {
                    this.setState(prev => {
                        prev.request_data.custom_data['content'] = text;
                        prev.response_type = event.target.value;
                        return prev;
                    });
                    this.renderRequest();
                });
        } else if (event.target.value === 'no-template') {
            this.setState({ response_type: '' });
        }
    }

    handleTransportMediumChange(event) {
        this.setState(prev => {
            prev['request_data']['transport_medium'] = event.target.value;
            switch (event.target.value) {
                case 'fax':
                    if (
                        prev['suggestion'] &&
                        !prev['request_data']['recipient_address'].includes(
                            t_r('by-fax', this.state.request_data.language)
                        )
                    ) {
                        prev['request_data']['recipient_address'] +=
                            '\n' + t_r('by-fax', this.state.request_data.language) + (prev['suggestion']['fax'] || '');
                    }
                    break;
                case 'letter':
                case 'email':
                    prev['request_data']['recipient_address'] = prev['request_data']['recipient_address'].replace(
                        new RegExp(
                            '(?:\\r\\n|\\r|\\n)' + t_r('by-fax', this.state.request_data.language) + '\\+?[0-9\\s]*',
                            'gm'
                        ),
                        ''
                    );
                    break;
            }

            prev['request_data']['data_portability'] = event.target.value === 'email';

            return prev;
        });
        this.renderRequest();
    }

    static clearUrl() {
        window.history.pushState({}, document.title, BASE_URL + 'generator');
    }

    newRequest() {
        if (
            this.state.request_data.type === 'access' &&
            Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_WIZARD_ENTRIES) &&
            this.state.suggestion &&
            this.state.suggestion['slug']
        ) {
            this.saved_companies.remove(this.state.suggestion['slug']);
        }

        if (PARAMETERS['from'] === 'wizard' && this.state.batch && this.state.batch.length === 0) {
            // Remove the GET parameters from the URL so this doesn't get triggered again on the next new request and get the generator out of wizard-mode.
            Generator.clearUrl();
            this.adjustAccordingToWizardMode();
            this.showModal(
                <Modal
                    positiveText={t('ok', 'generator')}
                    onPositiveFeedback={this.hideModal}
                    positiveDefault={true}
                    onDismiss={this.hideModal}>
                    <Text id="wizard-done-modal" />
                </Modal>
            );
        }

        // Remove GET parameter-selected company from the URL after the request is finished.
        // Also remove warning and complaint GET parameters from the URL after the request is finished.
        if (PARAMETERS['company'] || PARAMETERS['response_type'] || PARAMETERS['response_to']) {
            Generator.clearUrl();
        }

        this.setState(prev => {
            prev['request_data'] = new Request();
            prev['suggestion'] = null;
            prev['download_active'] = false;
            prev['blob_url'] = '';
            prev['download_filename'] = '';
            prev['response_type'] = '';
            prev['request_done'] = false;
            return prev;
        });

        this.resetInitialConditions();
    }

    renderRequest() {
        const sender = this.state.request_data.custom_data['sender_address'];
        const sender_address = [
            this.state.request_data.custom_data['name'],
            sender.street_1,
            sender.street_2,
            sender.place,
            sender.country
        ];
        if (this.state.request_data['type'] === 'custom') {
            const signature = this.state.request_data['signature'];
            signature['name'] = this.state.request_data.custom_data['name'];
            this.letter.setProps({
                subject: this.state.request_data.custom_data['subject'],
                content: this.state.request_data.custom_data['content'],
                signature: signature,
                recipient_address: this.state.request_data['recipient_address'],
                sender_address: sender_address,
                information_block: RequestLetter.makeInformationBlock(this.state.request_data),
                reference_barcode: RequestLetter.barcodeFromText(this.state.request_data.reference)
            });
        } else this.letter.setProps(RequestLetter.propsFromRequest(this.state.request_data, this.state.template_text));

        switch (this.state.request_data['transport_medium']) {
            case 'fax':
            case 'letter':
                this.setState({ download_active: false });
                this.letter.initiatePdfGeneration(
                    (this.state.suggestion !== null
                        ? this.state.suggestion['slug']
                        : slugify(this.state.request_data.recipient_address.split('\n', 1)[0] || 'custom-recipient')) +
                        '_' +
                        this.state.request_data['type'] +
                        '_' +
                        this.state.request_data['reference'] +
                        '.pdf'
                );
                break;
            case 'email': {
                this.setState({
                    blob_url: URL.createObjectURL(
                        new Blob([this.letter.toEmailString(true)], {
                            type: 'text/plain'
                        })
                    )
                });
                break;
            }
        }
    }

    storeRequest() {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            this.idData.storeArray(this.state.request_data['id_data']);
            this.idData.storeSignature(this.state.request_data['signature']);
        }
        this.state.request_data.store(
            this.state.suggestion ? this.state.suggestion['slug'] : undefined,
            this.state.response_type
        );
    }
}

preact.render(
    <IntlProvider scope="generator" definition={I18N_DEFINITION}>
        <Generator />
    </IntlProvider>,
    null,
    document.getElementById('generator')
);
