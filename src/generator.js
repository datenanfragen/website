import preact from 'preact';
import RequestForm from 'Forms/RequestForm';
import Letter from 'Letter';
import SearchBar from "./SearchBar";
import { IntlProvider, Text } from 'preact-i18n';
import t from 'i18n';

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
            "type": "input",
            "optional": true,
            "value": ""
        }, {
            "desc": t('address', 'generator'),
            "type": "address",
            "optional": true,
            "value": {"primary": true}
        }];

        this.state = {
            request_data: {
                type: 'access',
                id_data: this.default_fields,
                reference: Letter.generateReference(new Date()),
                recipient_address: '',
                signature: {type: 'text', value: ''},
                erase_all: true,
                erasure_data: '',
                data_portability: false,
                recipient_runs: [],
                rectification_data: [],
                custom_data: {
                    content: '',
                    subject: '',
                    sender_address: {},
                    name: ''
                }
            },
            template_text: '',
            suggestion: null,
            download_active: false
        };

        this.template_url = BASE_URL + '/templates/' + LOCALE + '/';
        this.letter = new Letter({});

        // TODO: Is this the right spot for this?
        pdfMake.fonts = {
            Roboto: {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Medium.ttf',
                italics: 'Roboto-Italic.ttf'
            },
            Code39: {
                normal: 'code39.ttf'
            }
        };

        this.iframe = null;
        this.download_button = null;
        this.renderPdf = this.renderPdf.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAutocompleteSelected = this.handleAutocompleteSelected.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleLetterChange = this.handleLetterChange.bind(this);
        this.newRequest = this.newRequest.bind(this);

        fetch(this.template_url + 'access-default.txt')
            .then(res => res.text()).then(text => {this.setState({template_text: text})});
    }

    render() {
        let company_info = '';
        let comments = '';
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

        return (
            <main>
                <h2 id="generator-heading"><Text id="generate-request"/>: {this.state.request_data['reference']} </h2>
                <div id="generator-controls">
                    <button id="new-request-button" onClick={this.newRequest}><Text id='new-request'/></button>
                </div>
                <SearchBar id="aa-search-input" algolia_appId='M90RBUHW3U' algolia_apiKey='a306a2fc33ccc9aaf8cbe34948cf97ed'
                           index='companies' onAutocompleteSelected={this.handleAutocompleteSelected}
                           placeholder={t('select-company', 'generator')} debug={false}/>
                <div id="request-generator" className="grid" style="margin-top: 10px;">
                    <div className="col50">
                        <RequestForm onChange={this.handleInputChange} onTypeChange={this.handleTypeChange} onLetterChange={this.handleLetterChange} request_data={this.state.request_data}/>
                    </div>
                    <div className="col50">
                        {company_info}
                        <div id="pdf-controls">
                            <a id="download-button" className={"button" + (this.state.download_active ? '' : ' disabled')} href="" download=""
                               ref={el => this.download_button = el} onClick={e => {if(!this.state.download_active) e.preventDefault();}}><Text id="download-pdf"/></a>
                            <button id="generate-button" onClick={this.renderPdf}><Text id="generate-pdf"/></button>
                            <div className="clearfix" />
                        </div>
                        <iframe id="pdf-viewer" ref={el => this.iframe = el} className={this.state.download_active ? '' : 'empty'} />
                        {comments}
                    </div>
                </div>
                <div className="clearfix" />
            </main>);
    }

    handleAutocompleteSelected(event, suggestion, dataset) {
        let template_file = suggestion['custom-' + this.state.request_data.type + '-template'] || this.state.request_data.type + '-default.txt';
        fetch(this.template_url + template_file)
            .then(res => res.text()).then(text => {this.setState({template_text: text})});

        this.setState(prev => {
            prev.request_data['recipient_address'] = suggestion.name + '\n' + suggestion.address;
            prev.request_data['data'] = suggestion['required-elements-access'] || this.default_fields; // TODO: Be *a lot* gentler here. Compare the two arrays and keep already entered data. Also switch types.
            prev.request_data['recipient_runs'] = suggestion.runs || [];
            prev.suggestion = suggestion;
            return prev;
        });
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
            .then(res => res.text()).then(text => {this.setState({template_text: text})});
    }

    handleInputChange(changed_data) {
        this.setState(prev => {
            for(let key in changed_data) {
                prev['request_data'][key] = changed_data[key];
            }
            return prev;
        });
        // TODO: trigger a render sometimes (See #8)
    }

    handleLetterChange(event, address_change = false) {
        if(address_change) {
            this.setState(prev => {
                let att = event.target.getAttribute('name');
                prev.request_data.custom_data['sender_address'][att] = event.target.value;
            });
        } else {
            this.setState(prev => {
                let att = event.target.getAttribute('name');
                if(prev.request_data.custom_data.hasOwnProperty(att)) prev.request_data.custom_data[att] = event.target.value;
            });
        }
    }

    newRequest() {
        this.setState(prev => {
            prev['request_data'] = {
                type: 'access',
                id_data: prev['request_data']['id_data'],
                reference: Letter.generateReference(new Date()),
                recipient_address: '',
                signature: prev['request_data']['signature'],
                erase_all: true,
                erasure_data: '',
                data_portability: false,
                recipient_runs: [],
                rectification_data: [],
                custom_data: {
                    content: '',
                    subject: '',
                    sender_address: prev['request_data']['custom_data']['sender_address'],
                    name: prev['request_data']['custom_data']['name']
                }
            };
            prev['suggestion'] = null;
            prev['download_active'] = false;
            return prev;
        });
        fetch(this.template_url + 'access-default.txt')
            .then(res => res.text()).then(text => {this.setState({template_text: text})});
    }

    renderPdf() {
        if(this.state.request_data['type'] === 'custom') {
            let signature = this.state.request_data['signature'];
            signature['name'] = this.state.request_data.custom_data['name'];
            this.letter.setProps({
                subject: this.state.request_data.custom_data['subject'],
                content: this.state.request_data.custom_data['content'],
                signature: signature,
                recipient_address: this.state.request_data['recipient_address'],
                sender_oneline: Letter.formatAddress(this.state.request_data.custom_data['sender_address'], ' • ', this.state.request_data.custom_data['name'])
            });
        } else this.letter.setProps(Letter.propsFromRequest(this.state.request_data, this.state.template_text));
        this.setState({download_active: false});
        pdfMake.createPdf(this.letter.toPdfDoc()).getBlob((blob) => {
            var url = URL.createObjectURL(blob);
            this.iframe.src = url;
            this.download_button.setAttribute('href', url);
            this.download_button.setAttribute('download', (this.state.suggestion !== null ? this.state.suggestion['slug'] : slugify(this.state.request_data.recipient_address.split('\n', 1)[0] || 'custom-recipient'))
                + '_' + this.state.request_data['type'] + '_' + this.state.request_data['reference'] + '.pdf'); // TODO: This uses code that is not implemented in this branch, but has been merged into master.
            this.setState({download_active: true});
        });
    }
}

// taken from https://gist.github.com/mathewbyrne/1280286
function slugify(text)
{
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

preact.render((<IntlProvider scope="generator" definition={I18N_DEFINITION}><Generator/></IntlProvider>), null, document.getElementById('generator'));
