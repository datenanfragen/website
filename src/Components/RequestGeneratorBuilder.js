import preact from 'preact';
import { IntlProvider, MarkupText } from 'preact-i18n';
import t, { t_r } from '../Utility/i18n';
import Request from '../DataType/Request';
import { defaultFields, trackingFields, REQUEST_ARTICLES, initializeFields, fetchTemplate } from '../Utility/requests';
import RequestLetter from '../Utility/RequestLetter';
import { slugify, PARAMETERS } from '../Utility/common';
import IdData, { ID_DATA_CHANGE_EVENT, ID_DATA_CLEAR_EVENT } from '../Utility/IdData';
import replacer_factory from '../Utility/request-generator-replacers';
import { fetchCompanyDataBySlug } from '../Utility/companies';
import Privacy, { PRIVACY_ACTIONS } from '../Utility/Privacy';
import Modal, { showModal, dismissModal } from './Modal';
import SvaFinder from './SvaFinder';
import { download, clearUrlParameters } from '../Utility/browser';
import Template from 'letter-generator/Template';
import UserRequests from '../my-requests';

export default class RequestGeneratorBuilder extends preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            request: new Request(),
            suggestion: null,
            template_text: '',

            batch: [],

            blob_url: '',
            download_filename: '',
            download_active: false,

            response_type: '',
            response_request: {},

            fill_fields: [],
            fill_signature: null
        };

        // If specified in the URL, load a single company…
        if (PARAMETERS['company']) this.setCompanyBySlug(PARAMETERS['company']);
        // …or multiple ones.
        const batch_companies = PARAMETERS['companies'];
        if (batch_companies) this.state.batch = batch_companies.split(',');

        this.letter = new RequestLetter({}, (blob_url, filename) => {
            this.setState({
                blob_url: blob_url,
                download_filename: filename,
                download_active: true
            });
        });

        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) this.idData = new IdData();

        this.resetInitialConditions();
    }

    resetInitialConditions = () => {
        // We always need to initialize the fields…
        initializeFields(this.state.request.id_data).then(res => {
            this.setState(prev => {
                // …if they haven't already been initialized elsewhere.
                if (!this.state.request.id_data) {
                    prev.request.id_data = res.new_fields;
                    prev.request.signature = res.signature;
                }

                const name = res.new_fields.filter(i => i.type === 'name')[0];
                const address = res.new_fields.filter(i => i.type === 'address')[0];
                if (name) prev.request.custom_data.name = name.value;
                if (address) prev.request.custom_data.sender_address = address.value;

                return prev;
            });
        });

        const response_to = PARAMETERS['response_to'];
        const response_type = PARAMETERS['response_type'];

        // We are in batch mode, move to the next company.
        if (this.state.batch && this.state.batch.length > 0) this.setCompanyBySlug(this.state.batch.shift());
        // This is a response to a previous request (warning or complaint).
        else if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS) && response_to && response_type) {
            new UserRequests().getRequest(response_to).then(request => {
                fetchTemplate(this.state.request.language, response_type, null, '').then(text => {
                    this.setState(prev => {
                        prev.request.custom_data.content = new Template(text, [], {
                            request_article: REQUEST_ARTICLES[request.type],
                            request_date: request.date,
                            request_recipient_address: request.recipient
                        }).getText();

                        if (response_type === 'admonition') {
                            // This might be useful in the future event though it is not used now. Looking forward to a conversations feature!
                            prev.request.via = request.via;
                            prev.request.recipient_address = request.recipient;
                        }

                        prev.request.reference = request.reference;
                        prev.response_type = response_type;
                        prev.request.type = 'custom';
                        prev.response_request = request;

                        return prev;
                    });
                    if (response_type === 'admonition' && request.slug) this.setCompanyBySlug(request.slug);
                    this.renderLetter();
                });
            });

            if (response_type === 'complaint') this.showAuthorityChooser();
        }
        // This is just a regular ol' request.
        else {
            fetchTemplate(this.state.request.language, 'access').then(text => {
                this.setState({ template_text: text });
                this.renderLetter();
            });
        }
    };

    componentDidMount() {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            const callback = () => {
                this.idData.getAll(false).then(fill_fields => this.setState({ fill_fields: fill_fields }));
                this.idData.getSignature().then(fill_signature => this.setState({ fill_signature: fill_signature }));
            };

            window.addEventListener(ID_DATA_CHANGE_EVENT, callback);
            window.addEventListener(ID_DATA_CLEAR_EVENT, callback);
        }
    }

    render() {
        const replacers = replacer_factory(this);
        const children_mapper = c =>
            c.nodeName && Object.keys(replacers).includes(c.nodeName.name)
                ? replacers[c.nodeName.name](c)
                : Array.isArray(c.children)
                ? { ...c, children: c.children.map(children_mapper) }
                : c;
        const children = this.props.children.map(children_mapper);

        return (
            <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                <div>{children}</div>
            </IntlProvider>
        );
    }

    startBatch = companies => {
        this.setState({ batch: companies });
        if (this.state.batch && this.state.batch.length > 0) this.setCompanyBySlug(this.state.batch.shift());
    };

    setCompanyBySlug = slug => {
        fetchCompanyDataBySlug(slug, company => {
            this.setCompany(company);
        });
    };
    setCompany = company => {
        fetchTemplate(company['request-language'], this.state.request.type, company).then(text => {
            this.setState({ template_text: text });
            this.renderLetter();
        });

        // I would love to have `Request` handle this. But unfortunately that won't work as Preact won't notice the
        // state has changed. :(
        this.setState(prev => {
            prev.request.transport_medium = company['suggested-transport-medium']
                ? company['suggested-transport-medium']
                : company.fax
                ? 'fax'
                : 'letter';
            prev.request.recipient_address =
                company.name +
                (PARAMETERS.response_type !== 'complaint'
                    ? '\n' + t_r('attn', company['request-language'] || LOCALE)
                    : '') +
                '\n' +
                company.address +
                (prev.request.transport_medium === 'fax'
                    ? '\n' + t_r('by-fax', company['request-language'] || LOCALE) + company['fax']
                    : '');

            const language =
                !!company['request-language'] && company['request-language'] !== ''
                    ? company['request-language']
                    : LOCALE;

            // This is not the most elegant thing in the world, but we need to support 'no ID data' requests for
            // more than adtech companies. Ideally, this would be another bool in the schema but we can't really
            // change that right now because of Typesense. Thus, we have to stick to matching the template for now.
            // And I have realized that our current adtech case also applies to pretty much all other 'no ID data'
            // requests anyway in that they are either also to tracking companies or those companies at least
            // identify the user by the same details (i.e. cookie IDs, device IDs, etc.)
            // I couldn't come up with a better name, so we'll just leave them as tracking requests, I guess…
            // TODO: Get rid of the `.txt` replacement.
            prev.request.is_tracking_request = [
                'access-tracking',
                'erasure-tracking',
                'rectification-tracking'
            ].includes((company['custom-' + this.state.request.type + '-template'] || '').replace(/\.txt$/, ''));

            prev.request.id_data = IdData.mergeFields(
                prev.request.id_data,
                !!company['required-elements'] && company['required-elements'].length > 0
                    ? company['required-elements']
                    : prev.request.is_tracking_request
                    ? trackingFields(language)
                    : defaultFields(language)
            );

            prev.request.recipient_runs = company.runs || [];
            prev.suggestion = company;
            prev.request.data_portability = company['suggested-transport-medium'] === 'email';
            prev.request.language = company['request-language'] || LOCALE;

            return prev;
        });
    };

    handleTypeChange = e => {
        this.handleInputChange({ type: e.target.value });
        if (e.target.value === 'custom') {
            this.letter.clearProps();
            return;
        }

        fetchTemplate(this.state.request.language, this.state.request.type, this.state.suggestion).then(text => {
            this.setState({ template_text: text });
            this.renderLetter();
        });
    };

    handleInputChange = changed_data => {
        this.setState(prev => {
            for (const key in changed_data) {
                prev.request[key] = changed_data[key];
            }
            return prev;
        });

        this.renderLetter();
    };

    handleTransportMediumChange = e => {
        const by_fax_text = t_r('by-fax', this.state.request.language);

        this.setState(prev => {
            prev.request.transport_medium = e.target.value;
            switch (e.target.value) {
                case 'fax':
                    if (prev.suggestion && !prev.request.recipient_address.includes(by_fax_text)) {
                        prev.request.recipient_address += '\n' + by_fax_text + (prev.suggestion.fax || '');
                    }
                    break;
                case 'letter': // fallthrough intentional
                case 'email':
                    prev.request.recipient_address = prev.request.recipient_address.replace(
                        new RegExp('(?:\\r\\n|\\r|\\n)' + by_fax_text + '\\+?[0-9\\s]*', 'gm'),
                        ''
                    );
                    break;
            }

            prev.request.data_portability = e.target.value === 'email';

            return prev;
        });
        this.renderLetter();
    };

    handleCustomLetterPropertyChange = (e, address_change = false) => {
        if (address_change) {
            this.setState(prev => {
                const att = e.target.getAttribute('name');
                prev.request.custom_data.sender_address[att] = e.target.value;
                return prev;
            });
        } else {
            this.setState(prev => {
                const att = e.target.getAttribute('name');
                if (Object.prototype.hasOwnProperty.call(prev.request.custom_data, att))
                    prev.request.custom_data[att] = e.target.value;
                return prev;
            });
        }
        this.renderLetter();
    };

    handleCustomLetterTemplateChange = e => {
        const new_template = e.target.value;
        if (new_template !== 'no-template') {
            fetchTemplate(this.state.request.language, new_template, null, '').then(text => {
                this.setState(prev => {
                    prev.request.custom_data.content = text;
                    prev.response_type = new_template;
                    return prev;
                });
                this.renderLetter();
            });
        } else this.setState({ response_type: '' });
    };

    handleAutocompleteSelected = (e, suggestion, dataset) => {
        if (this.state.suggestion) {
            const modal = showModal(
                <Modal
                    positiveText={t('new-request', 'generator')}
                    negativeText={t('override-request', 'generator')}
                    onNegativeFeedback={e => {
                        dismissModal(modal);
                        this.setCompany(suggestion.document);
                        this.renderLetter();
                    }}
                    onPositiveFeedback={e => {
                        dismissModal(modal);
                        this.newRequest();
                        this.setCompany(suggestion.document);
                        this.renderLetter();
                    }}
                    positiveDefault={true}
                    onDismiss={() => dismissModal(modal)}>
                    {t('modal-autocomplete-new-request', 'generator')}
                </Modal>
            );
        } else {
            this.setCompany(suggestion.document);
            this.renderLetter();
        }
    };

    showAuthorityChooser = () => {
        const modal = showModal(
            <Modal
                negativeText={t('cancel', 'generator')}
                onNegativeFeedback={() => dismissModal(modal)}
                positiveDefault={true}
                onDismiss={() => dismissModal(modal)}>
                <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                    <MarkupText id="modal-select-authority" />
                </IntlProvider>
                <SvaFinder
                    callback={sva => {
                        this.setCompany(sva);
                        fetchTemplate(sva['complaint-language'], 'complaint', null, '').then(text => {
                            this.setState(prev => {
                                prev.request.custom_data.content = new Template(text, [], {
                                    request_article: REQUEST_ARTICLES[this.state.response_request.type],
                                    request_date: this.state.response_request.date,
                                    request_recipient_address: this.state.response_request.recipient
                                }).getText();
                            });
                            this.renderLetter();
                        });
                        dismissModal(modal);
                    }}
                    style="margin-top: 15px;"
                />
            </Modal>
        );
    };

    renderLetter = () => {
        const sender = this.state.request.custom_data.sender_address;
        const sender_address = [
            this.state.request.custom_data.name,
            sender.street_1,
            sender.street_2,
            sender.place,
            sender.country
        ];
        if (this.state.request.type === 'custom') {
            this.letter.setProps({
                subject: this.state.request.custom_data.subject,
                content: this.state.request.custom_data.content,
                signature: { ...this.state.request.signature, name: this.state.request.custom_data.name },
                recipient_address: this.state.request.recipient_address,
                sender_address: sender_address,
                information_block: RequestLetter.makeInformationBlock(this.state.request),
                reference_barcode: RequestLetter.barcodeFromText(this.state.request.reference)
            });
        } else this.letter.setProps(RequestLetter.propsFromRequest(this.state.request, this.state.template_text));

        switch (this.state.request.transport_medium) {
            case 'fax': // fallthrough intentional
            case 'letter':
                this.setState({ download_active: false });
                this.letter.initiatePdfGeneration(
                    (this.state.suggestion !== null
                        ? this.state.suggestion.slug
                        : slugify(this.state.request.recipient_address.split('\n', 1)[0] || 'custom-recipient')) +
                        '_' +
                        this.state.request.type +
                        '_' +
                        this.state.request.reference +
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
    };

    newRequest() {
        if (this.props.newRequestHook) this.props.newRequestHook(this);

        // Remove GET parameter-selected company from the URL after the request is finished.
        // Also remove warning and complaint GET parameters from the URL after the request is finished.
        if (PARAMETERS['company'] || PARAMETERS['response_type'] || PARAMETERS['response_to']) {
            clearUrlParameters();
        }

        this.setState(prev => {
            prev.request = new Request();
            prev.request.done = false;
            prev.suggestion = null;
            prev.download_active = false;
            prev.blob_url = '';
            prev.download_filename = '';
            prev.response_type = '';

            return prev;
        });

        this.resetInitialConditions();
    }

    confirmNewRequest = () => {
        const medium = this.state.request.transport_medium;

        const modal = showModal(
            <Modal
                positiveText={[
                    t(medium === 'email' ? 'send-email-first' : 'download-pdf-first', 'generator'),
                    <span
                        style="margin-left: 10px;"
                        className={'icon icon-' + (medium === 'email' ? 'email' : 'download')}
                    />
                ]}
                negativeText={t('new-request', 'generator')}
                onNegativeFeedback={e => {
                    dismissModal(modal);
                    this.newRequest();
                }}
                onPositiveFeedback={e => {
                    if (this.state.blob_url) {
                        dismissModal(modal);
                        this.storeRequest();
                        download(
                            medium === 'email'
                                ? this.letter.toMailtoLink(this.state.suggestion && this.state.suggestion.email)
                                : this.state.blob_url,
                            this.state.download_filename
                        );
                        this.newRequest();
                    }
                }}
                positiveDefault={true}
                onDismiss={() => dismissModal(modal)}>
                {t('modal-new-request', 'generator')}
            </Modal>
        );
    };

    storeRequest = () => {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            this.idData.storeArray(this.state.request.id_data);
            this.idData.storeSignature(this.state.request.signature);
        }

        this.state.request.store(
            this.state.suggestion ? this.state.suggestion.slug : undefined,
            this.state.response_type
        );
    };

    static get defaultProps() {
        return {};
    }
}

// If we need to add more placeholders in the future, their names also need to be added to the Webpack MinifyPlugin's
// mangle exclude list.
export class ActionButtonPlaceholder extends preact.Component {}
export class NewRequestButtonPlaceholder extends preact.Component {}
export class CompanySelectorPlaceholder extends preact.Component {}
export class RequestFormPlaceholder extends preact.Component {}
export class DynamicInputContainerPlaceholder extends preact.Component {}
export class SignatureInputPlaceholder extends preact.Component {}
export class RequestTypeChooserPlaceholder extends preact.Component {}
export class RecipientInputPlaceholder extends preact.Component {}
export class TransportMediumChooserPlaceholder extends preact.Component {}
