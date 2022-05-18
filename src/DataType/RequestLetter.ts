import t, { t_r } from '../Utility/i18n';
import { Letter, Template, formatAddress, LetterProps } from 'letter-generator';
import type { Address, Request, IdDataElement } from '../types/request';

type FormattedData = { formatted: string; primary_address: Address | null; name: string };

export class RequestLetter extends Letter {
    language: string;
    reference: string;

    constructor(props: LetterProps, language: string, reference: string) {
        super(props);
        this.language = language;
        this.reference = reference;
    }

    toPdfDoc() {
        return this.doc;
    }

    toEmailString(include_subject = false) {
        let email = include_subject
            ? `${t('subject', 'generator')}: ${this.props.subject}${
                  this.reference ? ` (${t_r('my-reference', this.language)}: ${this.reference})` : ''
              }\n\n`
            : '';
        email +=
            (this.props.recipient_address?.[0]
                ? `${t_r('concerns', this.language)}: ${this.props.recipient_address[0]}\n`
                : '') + this.toString();
        return email;
    }

    static fromRequest(request: Request, template_string: string, flags: Record<string, boolean>): RequestLetter {
        let content: string;
        let sender_address: string | string[];
        const signature = { ...request.signature };

        if (request.type === 'custom') {
            sender_address = [
                request.custom_data.name,
                request.custom_data.sender_address.street_1,
                request.custom_data.sender_address.street_2,
                request.custom_data.sender_address.place,
                request.custom_data.sender_address.country,
            ];
            content = request.custom_data.content;
        } else {
            const id_data = RequestLetter.formatData(request.id_data);
            flags.runs = request.recipient_runs ? request.recipient_runs.length > 0 : false;
            flags.has_fields = !!id_data.formatted;

            const variables: Record<string, string> = {
                id_data: id_data.formatted,
                runs_list: '<italic>' + (request.recipient_runs.join(', ') || '') + '</italic>',
            };

            switch (request.type) {
                case 'rectification':
                    variables.rectification_data = RequestLetter.formatData(request.rectification_data ?? []).formatted;
                    break;
                case 'access':
                    flags.data_portability = request.data_portability;
                    break;
                case 'erasure':
                    flags.erase_all = request.erase_all;
                    flags.erase_some = !request.erase_all;
                    variables.erasure_data = '<italic>' + request.erasure_data + '</italic>';
                    break;
            }

            if (signature.name || signature.name === '') signature.name = id_data.name;

            sender_address = id_data.primary_address
                ? [
                      id_data.name,
                      id_data.primary_address.street_1,
                      id_data.primary_address.street_2,
                      id_data.primary_address.place,
                      id_data.primary_address.country,
                  ]
                : [id_data.name];

            content = new Template(template_string || '', flags, variables).getText();
        }

        return new RequestLetter(
            {
                information_block:
                    request.transport_medium === 'email'
                        ? RequestLetter.makeInformationBlock(request)
                        : [
                              RequestLetter.barcodeFromText(request.reference),
                              RequestLetter.makeInformationBlock(request),
                          ],
                subject:
                    request.type === 'custom'
                        ? request.custom_data.subject
                        : t_r(`letter-subject-${request.type}`, request.language),
                recipient_address: request.recipient_address.split('\n'),
                sender_address,
                signature,
                content,
            },
            request.language,
            request.reference
        );
    }

    static formatData(request_data: IdDataElement[]): FormattedData {
        let primary_address: Address | null = null; // This seems like an odd place for this, but I really want to spare the additional loop(s).
        let name = '';

        const formatted = request_data.reduce<string>((acc, item) => {
            if ((item.type !== 'address' && item.value !== '') || (item.type === 'address' && item.value.street_1)) {
                acc += `<bold>${item.desc}:</bold> `;

                switch (item.type) {
                    case 'address':
                        if (item.value.primary) primary_address = item.value;
                        return `${acc}\n${formatAddress(
                            [item.value.street_1, item.value.street_2, item.value.place, item.value.country],
                            ', '
                        )}\n`;
                    case 'textarea':
                        return `${acc}\n${item.value}\n`;
                    case 'name':
                        name = item.value;
                    // fallthrough intentional
                    case 'birthdate':
                    case 'email':
                    case 'input':
                    default:
                        return `${acc}${item.value}\n`;
                }
            }
            return acc;
        }, '');
        return { formatted, name, primary_address };
    }

    static barcodeFromText(text: string, addNewline = true) {
        return {
            text: '*' + text + '*' + (addNewline ? '\n' : ''),
            fontSize: 32,
            font: 'Code39',
        };
    }

    static makeInformationBlock(request: Request) {
        return (
            t_r('my-reference', request.language) +
            ': ' +
            request.reference +
            '\n' +
            t_r('date', request.language) +
            ': ' +
            request.date +
            (request.information_block ? '\n' + request.information_block : '')
        );
    }
}
