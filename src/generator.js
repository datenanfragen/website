import preact from 'preact';
import RequestForm from 'Forms/RequestForm';
import Letter from 'Utility/Letter';
import { SearchBar } from "./Components/SearchBar";
import { IntlProvider, Text } from 'preact-i18n';
import t from 'Utility/i18n';
import { fetchCompanyDataBySlug } from 'Utility/companies';
import localforage from 'localforage';
import Privacy, {PRIVACY_ACTIONS} from "./Utility/Privacy";
import Modal from "./Components/Modal";
import {ErrorException, rethrow} from "./Utility/errors";
import CompanyWidget from "./Components/CompanyWidget";
import IdData, {deepCopyObject, ID_DATA_CHANGE_EVENT, ID_DATA_CLEAR_EVENT} from "./Utility/IdData";

class Generator extends preact.Component {
    constructor(props) {
        super(props);
        this.default_fields = [{
            "desc": t('name', 'generator'),
            "type": "name",
            "optional": true,
            "value": ""
        }, {
            "desc": t('birthdate', 'generator'),
            "type": "birthdate",
            "optional": true,
            "value": ""
        }, {
            "desc": t('address', 'generator'),
            "type": "address",
            "optional": true,
            "value": {"primary": true}
        }];

        let today = new Date();

        this.state = {
            request_data: {
                type: 'access',
                transport_medium: 'fax',
                id_data: deepCopyObject(this.default_fields),
                reference: Letter.generateReference(today),
                date: today.toISOString().substring(0, 10),
                recipient_address: '',
                signature: {type: 'text', value: ''},
                erase_all: true,
                erasure_data: '',
                data_portability: false,
                recipient_runs: [],
                rectification_data: [],
                information_block: '',
                custom_data: {
                    content: '',
                    subject: '',
                    sender_address: {},
                    name: ''
                }
            },
            template_text: '',
            suggestion: null,
            download_active: false,
            blob_url: '',
            download_filename: '',
            batch: [],
            batch_position: 0,
            modal_showing: '',
            fill_fields: []
        };

        this.template_url = BASE_URL + 'templates/' + LOCALE + '/';
        this.database_url = BASE_URL + 'db/';
        this.letter = new Letter({});

        if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            // TODO: Is there a better place for this?
            this.request_store = localforage.createInstance({
                'name': 'Datenanfragen.de',
                'storeName': 'my-requests'
            });
        }
        if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            this.idData = new IdData();
            this.idData.getAll().then(fill_fields => this.setState({fill_fields: fill_fields}));
        }

        this.renderRequest = this.renderRequest.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAutocompleteSelected = this.handleAutocompleteSelected.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleLetterChange = this.handleLetterChange.bind(this);
        this.handleTransportMediumChange = this.handleTransportMediumChange.bind(this);
        this.storeRequest = this.storeRequest.bind(this);
        this.newRequest = this.newRequest.bind(this);
        this.hideModal = this.hideModal.bind(this);

        this.pdfWorker = new Worker(BASE_URL + 'js/pdfworker.gen.js');
        this.pdfWorker.onmessage = (message) => {
            this.setState({
                blob_url: message.data,
                download_filename: (this.state.suggestion !== null ? this.state.suggestion['slug'] : slugify(this.state.request_data.recipient_address.split('\n', 1)[0] || 'custom-recipient'))
                + '_' + this.state.request_data['type'] + '_' + this.state.request_data['reference'] + '.pdf',
                download_active: true
            });
        };
        this.pdfWorker.onerror = (error) => {
            rethrow(error, 'PdfWorker error');
        };

        let batch_companies = findGetParamter('companies');
        if(batch_companies) {
            this.setState({batch: batch_companies.split(',')});
        }

        this.resetInitalConditions();
    }

    resetInitalConditions() {
        if(this.state.batch && this.state.batch.length > 0) {
            fetchCompanyDataBySlug(this.state.batch.shift(), company => {this.setCompany(company)});
        }

        fetch(this.template_url + 'access-default.txt')
            .then(res => res.text()).then(text => {this.setState({template_text: text})});

        if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA) && IdData.shouldAlwaysFill()) {
            this.idData.getAll().then((fill_data) => this.setState((prev) => {
                prev.request_data['id_data'] = IdData.mergeFields(fill_data, prev.request_data['id_data']); // the order seems unintuitive but this way we add data conservatively
                return prev;
            }));
        }
    }

    render() {
        let company_widget = '';
        let new_request_text = 'new-request';
        if(this.state.batch && this.state.batch.length > 0) new_request_text = 'next-request';
        if(this.state.suggestion !== null) {
            company_widget = <CompanyWidget company={this.state.suggestion} onRemove={() => this.setState(prev => {
                prev['suggestion'] = null;
                prev.request_data['recipient_runs'] = [];
                return prev;
            })} />
        }

        let action_button = <a id="download-button" className={"button" + (this.state.download_active ? '' : ' disabled') + ' button-primary'} href={this.state.blob_url} download={this.state.download_filename}
                               onClick={e => {if(!this.state.download_active) e.preventDefault();}}><Text id="download-pdf"/></a>;

        if(this.state.request_data.transport_medium === 'email') {
            let mailto_link = 'mailto:' + (this.state.suggestion && this.state.suggestion['email'] ? this.state.suggestion['email'] : '') + '?' +
                'subject=' + encodeURIComponent(this.letter.props.subject) + ' (' + t('my-reference', 'generator') + ': ' + this.state.request_data['reference'] + ')' +
                '&body=' + encodeURIComponent(this.letter.toEmailString());
            action_button = <a id="sendmail-button" className={"button" + (this.state.blob_url ? '' : ' disabled') + ' button-primary'} href={mailto_link}
                               onClick={e => {if(!this.state.blob_url) e.preventDefault();}}><Text id="send-email"/></a>
        }

        return (
            <main>
                {this.state.modal_showing}
                <header id="generator-header">
                    <h2 id="generator-heading"><Text id="generate-request"/>: {this.state.request_data['reference']} </h2>
                    <div id="generator-controls">
                        <button className="button-primary" id="new-request-button" onClick={() => this.showModal('new_request')}><Text id={new_request_text}/></button>
                    </div>
                </header>
                <div className="clearfix" />
                <SearchBar id="aa-search-input" index='companies' onAutocompleteSelected={this.handleAutocompleteSelected}
                           placeholder={t('select-company', 'generator')} debug={false}/>
                <div id="request-generator" className="grid" style="margin-top: 10px;">
                    <div id="form-container" className="col50 box">
                        <RequestForm onChange={this.handleInputChange} onTypeChange={this.handleTypeChange} onLetterChange={this.handleLetterChange}
                                     onTransportMediumChange={this.handleTransportMediumChange} request_data={this.state.request_data}
                                     fillFields={this.state.fill_fields}
                        />
                    </div>
                    <div className="col50">
                        {company_widget}
                        <div id="content-container" className="box">
                            {action_button}
                            <iframe id="pdf-viewer" src={this.state.blob_url} className={this.state.blob_url ? '' : 'empty'} />
                        </div>
                    </div>
                </div>
                <div className="clearfix" />
            </main>);
    }

    componentDidMount() {
        if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            window.addEventListener(ID_DATA_CHANGE_EVENT, (event) => {
                this.idData.getAll().then((fill_fields) => this.setState({fill_fields: fill_fields}));
            });
            window.addEventListener(ID_DATA_CLEAR_EVENT, (event) => {
                this.idData.getAll().then((fill_fields) => this.setState({fill_fields: fill_fields}));
            });
        }
    }

    /**
     *
     * @param modal {string|Component} if it is a string, modal will be interpreted as modal_id
     */
    showModal(modal) {
        if(typeof modal === 'string') {
            let modal_id = modal;
            switch(modal_id) {
                case 'new_request': // TODO: Logic
                     modal = (<Modal positiveText={t('new-request', 'generator')} negativeText={t('cancel', 'generator')}
                                   onNegativeFeedback={this.hideModal} onPositiveFeedback={e => {
                        this.hideModal();
                        this.newRequest();
                    }} positiveDefault={true} onDismiss={this.hideModal}>
                        <Text id='modal-new-request' />
                    </Modal>);
            }
        }
        this.setState({'modal_showing': modal});
    }

    hideModal() {
        this.setState({'modal_showing': ''});
    }

    setCompany(company) {
        let template_file = company['custom-' + this.state.request_data.type + '-template'] || this.state.request_data.type + '-default.txt';
        fetch(this.template_url + template_file)
            .then(res => res.text()).then(text => {this.setState({template_text: text})});

        this.setState(prev => {
            prev.request_data['transport_medium'] = company['suggested-transport-medium'] ? company['suggested-transport-medium'] : company['fax'] ? 'fax' : 'letter';
            prev.request_data['recipient_address'] = company.name + '\n' + company.address + (prev.request_data['transport_medium'] === 'fax' ?'\n' + t('by-fax', 'generator') + company['fax'] : '');
            prev.request_data['id_data'] = IdData.mergeFields(prev.request_data['id_data'], company['required-elements'] || this.default_fields);
            prev.request_data['recipient_runs'] = company.runs || [];
            prev.suggestion = company;
            prev['request_data']['data_portability'] = company['suggested-transport-medium'] === 'email';
            return prev;
        });
    }

    handleAutocompleteSelected(event, suggestion, dataset) {
        if(this.state.suggestion) {
            this.showModal(<Modal positiveText={t('new-request', 'generator')} negativeText={t('override-request', 'generator')}
                                  onNegativeFeedback={e => {
                                      this.hideModal();
                                      this.setCompany(suggestion.document);
                                      this.renderRequest();
                                  }} onPositiveFeedback={e => {
                this.hideModal();
                this.newRequest();
                this.setCompany(suggestion.document);
                this.renderRequest();
            }} positiveDefault={true} onDismiss={this.hideModal}>
                <Text id='modal-autocomplete-new-request' />
            </Modal>);
        } else {
            this.setCompany(suggestion.document);
            this.renderRequest();
        }
    }

    handleTypeChange(event) {
        this.handleInputChange({type: event.target.value});
        if(event.target.value === 'custom') {
            this.letter.clearProps();
            this.letter.updateDoc();
            return;
        }
        let template_file = this.state.suggestion ? this.state.suggestion['custom-' + this.state.request_data.type + '-template'] || this.state.request_data.type + '-default.txt' : this.state.request_data.type + '-default.txt';
        fetch(this.template_url + template_file)
            .then(res => res.text()).then(text => {this.setState({template_text: text}); this.renderRequest();});
    }

    handleInputChange(changed_data) {
        let should_render = true;
        this.setState(prev => {
            for(let key in changed_data) {
                if(key === 'type') should_render = false;
                if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA) && key === 'id_data') this.idData.storeArray(changed_data[key]);
                prev['request_data'][key] = changed_data[key];
            }
            return prev;
        });
        if(should_render) this.renderRequest();
    }

    handleLetterChange(event, address_change = false) {
        if(address_change) {
            this.setState(prev => {
                let att = event.target.getAttribute('name');
                prev.request_data.custom_data['sender_address'][att] = event.target.value;
                return prev;
            });
        } else {
            this.setState(prev => {
                let att = event.target.getAttribute('name');
                if(prev.request_data.custom_data.hasOwnProperty(att)) prev.request_data.custom_data[att] = event.target.value;
                return prev;
            });
        }
        this.renderRequest();
    }

    handleTransportMediumChange(event) {
        // TODO: Warning when sending via email
        this.setState(prev => {
            prev['request_data']['transport_medium'] = event.target.value;
            switch(event.target.value) {
                case 'fax':
                    if(prev['suggestion'] && !prev['request_data']['recipient_address'].includes(t('by-fax', 'generator'))) prev['request_data']['recipient_address'] += '\n' + t('by-fax', 'generator') + (prev['suggestion']['fax'] || '');
                    break;
                case 'letter':
                case 'email':
                    prev['request_data']['recipient_address'] = prev['request_data']['recipient_address'].replace(new RegExp('(?:\\r\\n|\\r|\\n)' + t('by-fax', 'generator') + '\\+?[0-9\\s]*', 'gm'), '');
                    break;
            }

            prev['request_data']['data_portability'] = event.target.value === 'email';

            return prev;
        });
        this.renderRequest();
    }

    newRequest() {
        this.setState(prev => {
            prev['request_data'] = {
                type: 'access',
                transport_medium: 'fax',
                id_data: prev['request_data']['id_data'],
                reference: Letter.generateReference(new Date()),
                date: prev['request_data']['date'],
                recipient_address: '',
                signature: prev['request_data']['signature'],
                erase_all: true,
                erasure_data: '',
                data_portability: false,
                recipient_runs: [],
                rectification_data: [],
                information_block: '',
                custom_data: {
                    content: '',
                    subject: '',
                    sender_address: prev['request_data']['custom_data']['sender_address'],
                    name: prev['request_data']['custom_data']['name']
                }
            };
            prev['suggestion'] = null;
            prev['download_active'] = false;
            prev['blob_url'] = '';
            prev['download_filename'] = '';
            return prev;
        });

        this.resetInitalConditions();
    }

    renderRequest() {
        if(this.state.request_data['type'] === 'custom') {
            let signature = this.state.request_data['signature'];
            signature['name'] = this.state.request_data.custom_data['name'];
            this.letter.setProps({
                subject: this.state.request_data.custom_data['subject'],
                content: this.state.request_data.custom_data['content'],
                signature: signature,
                recipient_address: this.state.request_data['recipient_address'],
                sender_oneline: Letter.formatAddress(this.state.request_data.custom_data['sender_address'], ' • ', this.state.request_data.custom_data['name']),
                information_block: Letter.makeInformationBlock(this.state.request_data),
                reference_barcode: Letter.barcodeFromText(this.state.request_data.reference)
            });
        } else this.letter.setProps(Letter.propsFromRequest(this.state.request_data, this.state.template_text));

        switch(this.state.request_data['transport_medium']) {
            case 'fax':
            case 'letter':
                this.setState({download_active: false});
                this.pdfWorker.postMessage(this.letter.toPdfDoc());
                break;
            case 'email':
                let email_blob = new Blob([
                    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><pre style="white-space: pre-line;">' + this.letter.toEmailString(true) + '</pre></body>'
                ], {
                    type: 'text/html'
                });
                this.setState({blob_url: URL.createObjectURL(email_blob)});
                break;
        }

        this.storeRequest();
    }

    storeRequest() {
        if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            this.request_store.setItem(this.state.request_data['reference'], {
                date: this.state.request_data.date,
                type: this.state.request_data.type,
                slug: this.state.suggestion ? this.state.suggestion['slug'] : null,
                recipient: this.state.request_data.recipient_address,
                via: this.state.request_data.transport_medium
            }).catch((error) => {
                rethrow(error, 'Saving request failed.', { reference: this.state.request_data['reference'] });
            });
        }
    }
}

// taken from https://gist.github.com/mathewbyrne/1280286
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function findGetParamter(param){
    let tmp = [];
    let result = null;
    location.search.substr(1).split('&').forEach(item => {
        tmp = item.split('=');
        if(tmp[0] === param) return result = decodeURIComponent(tmp[1]);
    });
    return result;
}

preact.render((<IntlProvider scope="generator" definition={I18N_DEFINITION}><Generator/></IntlProvider>), null, document.getElementById('generator'));
