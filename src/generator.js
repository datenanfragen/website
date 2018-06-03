import preact from 'preact';
import RequestForm from 'Forms/RequestForm';
import Letter from 'Letter';
import { SearchBar } from "./SearchBar";
import { IntlProvider, Text } from 'preact-i18n';
import t from 'i18n';
import localforage from 'localforage';
import Privacy, {PRIVACY_ACTIONS} from "./Privacy";

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
                id_data: JSON.parse(JSON.stringify(this.default_fields)), // This is hideous but the only way to deep copy this array...
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
            batch_position: 0
        };

        this.template_url = BASE_URL + 'templates/' + LOCALE + '/';
        this.database_url = BASE_URL + 'db/';
        this.letter = new Letter({});

        if(Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS)) {
            // TODO: Is there a better place for this?
            localforage.config({
                'name': 'Datenanfragen.de',
                'storeName': 'my-requests'
            });
        }
        this.renderRequest = this.renderRequest.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAutocompleteSelected = this.handleAutocompleteSelected.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleLetterChange = this.handleLetterChange.bind(this);
        this.handleTransportMediumChange = this.handleTransportMediumChange.bind(this);
        this.storeRequest = this.storeRequest.bind(this);
        this.newRequest = this.newRequest.bind(this);

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
            console.log('Worker Error', error); // TODO: Proper error handling
        };

        let batch_companies = findGetParamter('companies');
        if(batch_companies) {
            this.setState({batch: batch_companies.split(',')});
            if(this.state.batch && this.state.batch.length > 0) {
                this.fetchCompanyDataBySlug(this.state.batch.shift(), company => {this.setCompany(company)});
            }
        }

        fetch(this.template_url + 'access-default.txt')
            .then(res => res.text()).then(text => {this.setState({template_text: text})});
    }

    render() {
        let company_info = '';
        let comments = '';
        let new_request_text = 'new-request';
        if(this.state.batch && this.state.batch.length > 0) new_request_text = 'next-request';
        if(this.state.suggestion !== null) {
            company_info =
                (<div id="company-info">
                    <fieldset>
                        <legend><Text id="current-company" /></legend>
                        <span id="company-name" style="font-size: 15pt">{this.state.suggestion['name']}</span>
                        {this.state.suggestion['fax'] ?  [<br />, t('fax', 'generator') + ': ' + this.state.suggestion['fax']] : []}
                        {this.state.suggestion['email'] ? [<br />, t('email', 'generator') + ': ' + this.state.suggestion['email']] : []}
                        <br /><a href="#" onClick={e => {
                        e.preventDefault();
                        this.setState(prev => {
                            prev['suggestion'] = null;
                            prev.request_data['recipient_runs'] = [];
                            return prev;
                        })
                    }}><Text id="deselect-company" /></a>
                    </fieldset>
                </div>);
            if(this.state.suggestion['comments']) {
                let comment_list = [];
                this.state.suggestion['comments'].forEach(comment => {
                    comment_list.push(<div className="company-comments">{comment}</div>);
                });
                comments = <fieldset id="comment-container">
                    <legend><Text id="current-company-comments" /></legend>
                    {comment_list}
                </fieldset>;
            }
        }

        let generate_text = 'generate-pdf';
        let action_button = <a id="download-button" className={"button" + (this.state.download_active ? '' : ' disabled')} href={this.state.blob_url} download={this.state.download_filename}
                               onClick={e => {if(!this.state.download_active) e.preventDefault();}}><Text id="download-pdf"/></a>;

        if(this.state.request_data.transport_medium === 'email') {
            generate_text = 'generate-email';
            let mailto_link = 'mailto:' + (this.state.suggestion && this.state.suggestion['email'] ? this.state.suggestion['email'] : '') + '?' +
                'subject=' + encodeURIComponent(this.letter.props.subject) + ' (' + t('my-reference', 'generator') + ': ' + this.state.request_data['reference'] + ')' +
                '&body=' + encodeURIComponent(Letter.stripTags(this.letter.props.content)) + (this.letter.props.signature['type'] === 'text' ? '\n' + this.letter.props.signature['name'] : '');
            action_button = <a id="sendmail-button" className={"button" + (this.state.blob_url ? '' : ' disabled')} href={mailto_link}
                               onClick={e => {if(!this.state.blob_url) e.preventDefault();}}><Text id="send-email"/></a>
        }

        return (
            <main>
                <h2 id="generator-heading"><Text id="generate-request"/>: {this.state.request_data['reference']} </h2>
                <div id="generator-controls">
                    <button id="new-request-button" onClick={this.newRequest}><Text id={new_request_text}/></button>
                </div>
                <div className="clearfix" />
                <SearchBar id="aa-search-input" algolia_appId='M90RBUHW3U' algolia_apiKey='a306a2fc33ccc9aaf8cbe34948cf97ed'
                           index='companies' onAutocompleteSelected={this.handleAutocompleteSelected}
                           placeholder={t('select-company', 'generator')} debug={false}/>
                <div id="request-generator" className="grid" style="margin-top: 10px;">
                    <div className="col50">
                        <RequestForm onChange={this.handleInputChange} onTypeChange={this.handleTypeChange} onLetterChange={this.handleLetterChange} onTransportMediumChange={this.handleTransportMediumChange} request_data={this.state.request_data}/>
                    </div>
                    <div className="col50">
                        {company_info}
                        <div id="pdf-controls">
                            {action_button}
                            <button id="generate-button" onClick={this.renderRequest}><Text id={generate_text} /></button>
                            <div className="clearfix" />
                        </div>
                        <iframe id="pdf-viewer" src={this.state.blob_url} className={this.state.blob_url ? '' : 'empty'} />
                        {comments}
                    </div>
                </div>
                <div className="clearfix" />
            </main>);
    }

    setCompany(company) {
        let template_file = company['custom-' + this.state.request_data.type + '-template'] || this.state.request_data.type + '-default.txt';
        fetch(this.template_url + template_file)
            .then(res => res.text()).then(text => {this.setState({template_text: text})});

        this.setState(prev => {
            prev.request_data['transport_medium'] = company['suggested-transport-medium'] ? company['suggested-transport-medium'] : company['fax'] ? 'fax' : 'letter';
            prev.request_data['recipient_address'] = company.name + '\n' + company.address + (prev.request_data['transport_medium'] === 'fax' ?'\n' + t('by-fax', 'generator') + company['fax'] : '');
            prev.request_data['id_data'] = this.mergeIdDataFields(prev.request_data['id_data'], company['required-elements'] || this.default_fields);
            prev.request_data['recipient_runs'] = company.runs || [];
            prev.suggestion = company;
            return prev;
        });
    }

    handleAutocompleteSelected(event, suggestion, dataset) {
        this.setCompany(suggestion);
        this.renderRequest();
    }

    mergeIdDataFields(fields_to_add_to, fields_to_merge) {
        let new_fields = fields_to_merge.slice();
        let old_fields = fields_to_add_to.slice();
        let merged_fields = [];
        let has_primary_address = 0;
        old_fields.forEach((field, i) => { // TODO: How to keep user added inputs and remove machine added inputs? Or do we even need to?
            let j = new_fields.findIndex(new_field => {
                return new_field['type'] === field['type'] && new_field['desc'] === field['desc']; // Is it a good idea to also check for desc?
            });
            if(typeof j !== 'undefined' && j >= 0) {
                field['optional'] = 'optional' in new_fields[j] ? new_fields[j]['optional'] : false;
                if(field['type'] === 'address') field['value']['primary'] = ++has_primary_address === 1;
                merged_fields.push(field);
                new_fields.splice(j, 1);
            }
        });
        return merged_fields.concat(new_fields.map(field => {
            field['value'] = field['value'] || (field['type'] === 'address' ? {"primary": ++has_primary_address === 1} : '');
            return field;
        }));
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
            return prev;
        });
        this.renderRequest();
    }

    fetchCompanyDataBySlug(slug, callback) {
        try {
            fetch(this.database_url + slug + '.json')
                .then(res => res.json()).then(json => {callback(json)});
        } catch(error) {
            console.error(error.message); // TODO: Proper Error Handling
        }
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
        fetch(this.template_url + 'access-default.txt')
            .then(res => res.text()).then(text => {this.setState({template_text: text})});

        if(this.state.batch && this.state.batch.length > 0) {
            this.fetchCompanyDataBySlug(this.state.batch.shift(), company => {this.setCompany(company)});
        }
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
                    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><pre style="white-space: pre-line;">' + this.letter.toEmailString() + '</pre></body>'
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
            localforage.setItem(this.state.request_data['reference'], {
                date: this.state.request_data.date,
                type: this.state.request_data.type,
                slug: this.state.suggestion ? this.state.suggestion['slug'] : null,
                recipient: this.state.request_data.recipient_address,
                via: this.state.request_data.transport_medium
            }).catch(() => { console.log('Failed to save request with reference ' + this.state.request_data['reference']); /* TODO: Proper error handling. */ });
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
