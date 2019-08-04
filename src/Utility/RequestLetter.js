import t, { t_r } from './i18n';
import { formatAddress, stripTags } from 'letter-generator/utility';
import Letter from 'letter-generator/Letter';
import Template from 'letter-generator/Template';

export default class RequestLetter {
    constructor(props) {
        this.clearProps();
        this.setProps(props);
    }

    setProps(props) {
        for (let i in props) {
            if (Object.prototype.hasOwnProperty.call(this.props, i)) this.props[i] = props[i];
        }

        this.letter.setProps({
            sender_address: props.sender_address,
            recipient_address: props.recipient_address,
            information_block: [props.reference_barcode, props.information_block],
            subject: props.subject,
            content: props.content,
            signature: props.signature
        });
    }

    clearProps() {
        this.props = {
            sender_address: '',
            recipient_address: '',
            information_block: '',
            subject: '',
            content: '',
            signature: { type: 'text', value: '', name: '' },
            reference_barcode: {},
            reference: '',
            language: LOCALE
        };
        this.letter = new Letter();

        // To update `this.letter`.
        this.setProps({});
    }

    toPdfDoc() {
        return this.letter.doc;
    }

    toEmailString(include_subject = false) {
        let email = include_subject
            ? t('subject', 'generator') +
              ': ' +
              this.props.subject +
              (this.props.reference
                  ? ' (' + t_r('my-reference', this.props.language) + ': ' + this.props.reference + ')'
                  : '') +
              '\n\n'
            : '';
        email +=
            (this.props.recipient_address
                ? t_r('concerns', this.props.language) + ': ' + this.props.recipient_address.split('\n')[0] + '\n'
                : '') +
            this.props.information_block +
            '\n\n' +
            stripTags(this.props.content) +
            '\n' +
            this.props.signature['name'];
        return email;
    }

    /**
     * Generate a `mailto:` link for this letter.
     *
     * @param {String} [email=''] The recipient's email address.
     */
    toMailtoLink(email = '') {
        return (
            'mailto:' +
            email +
            '?' +
            'subject=' +
            encodeURIComponent(this.props.subject) +
            ' (' +
            t_r('my-reference', this.props.language) +
            ': ' +
            this.props.reference +
            ')' +
            '&body=' +
            encodeURIComponent(this.toEmailString())
        );
    }

    static propsFromRequest(request_object, template, flags = {}) {
        let id_data = RequestLetter.formatData(request_object.id_data);
        let rectification_data = RequestLetter.formatData(request_object.rectification_data);
        request_object.signature['name'] = id_data.name;

        flags = {
            erase_some: !request_object.erase_all,
            erase_all: request_object.erase_all,
            data_portability: request_object.data_portability,
            runs: request_object.recipient_runs ? request_object.recipient_runs.length > 0 : false
        };
        let variables = {
            id_data: id_data.formatted,
            rectification_data: rectification_data.formatted,
            erasure_data: '<italic>' + request_object.erasure_data + '</italic>',
            runs_list: '<italic>' + (request_object.recipient_runs.join(', ') || '') + '</italic>'
        };

        const sender = id_data.primary_address;

        const sender_address = [id_data.name, sender.street_1, sender.street_2, sender.place, sender.country];
        return {
            reference: request_object.reference,
            reference_barcode: RequestLetter.barcodeFromText(request_object.reference),
            information_block: RequestLetter.makeInformationBlock(request_object),
            subject: t_r('letter-subject-' + request_object.type, request_object.language),
            recipient_address: request_object.recipient_address,
            sender_address: sender_address,
            signature: request_object.signature,
            content: new Template(template, flags, variables).getText(),
            language: request_object.language
        };
    }

    static formatData(request_data) {
        let formatted = '';
        let primary_address = {}; // This seems like an odd place for this, but I really want to spare the additional loop(s).
        let name = '';

        request_data.forEach(item => {
            formatted += '<bold>' + item.desc + ':</bold> ';
            switch (item.type) {
                case 'address':
                    formatted +=
                        '\n' +
                        formatAddress(
                            [item.value.street_1, item.value.street_2, item.value.place, item.value.country],
                            ', '
                        );
                    if (item.value.primary) primary_address = item.value;
                    break;
                case 'textarea':
                    formatted += '\n' + item.value;
                    break;
                case 'name':
                    name = item.value;
                // fallthrough intentional
                case 'birthdate':
                case 'input':
                default:
                    formatted += item.value;
                    break;
            }
            formatted += '\n';
        });
        return { formatted: formatted, name: name, primary_address: primary_address };
    }

    static barcodeFromText(text, addNewline = true) {
        return {
            text: '*' + text + '*' + (addNewline ? '\n' : ''),
            fontSize: 32,
            font: 'Code39'
        };
    }

    static makeInformationBlock(request_object) {
        return (
            t_r('my-reference', request_object.language) +
            ': ' +
            request_object.reference +
            '\n' +
            t_r('date', request_object.language) +
            ': ' +
            request_object.date +
            '\n' +
            request_object.information_block
        );
    }
}
