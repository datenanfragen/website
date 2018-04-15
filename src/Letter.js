/**
 * {number} mm2pt({number}):
 * converts values from millimeters to PDF points
 * @param mm {number}
 * @return {number}
 */
function mm2pt(mm) {
    return 72.0/25.4*mm;
}

export default class Letter {
    constructor(props) {
        this.props = { // private
            sender_oneline: props.sender_oneline || '',
            recipient_address: props.recipient_address || '',
            information_block: props.information_block || '',
            subject: props.subject || '',
            content: props.content || '',
            signature: props.signature || {type: 'text', value: '', name: ''},
            reference_barcode: props.reference_barcode || {}
        };
        this.doc = {};
        this.updateDoc();
    }

    setProps(props) {
        for(let i in props) {
            if(this.props.hasOwnProperty(i)) this.props[i] = props[i];;
        }
        this.updateDoc();
    }

    updateDoc() {
        this.doc = {
            pageSize: 'A4',
            pageMargins: [mm2pt(25), mm2pt(27), mm2pt(20), mm2pt(16.9)], // [left, top, right, bottom]
            content: [
                {
                    columns: [
                        {
                            width: mm2pt(85),
                            text: this.props.sender_oneline,
                            fontSize: 6,
                        }
                    ],
                    absolutePosition: {x: mm2pt(20), y: mm2pt(27)},
                }, {
                    columns: [
                        {
                            width: mm2pt(85),
                            text: this.props.recipient_address,
                        }
                    ],
                    absolutePosition: {x: mm2pt(20), y: mm2pt(34)},
                }, {
                    columns: [
                        {
                            width: mm2pt(75),
                            text: [
                                this.props.reference_barcode,
                                this.props.information_block
                            ],
                        }
                    ],
                    absolutePosition: {x: mm2pt(210-85), y: mm2pt(32)},
                }, {
                    text: [
                        {
                            text: this.props.subject + '\n\n\n',
                            bold: true
                        },
                        Letter.parseContent(this.props.content)
                    ],
                    marginTop: mm2pt(58)
                },
                Letter.handleSignature(this.props.signature)],
            background: page => ({canvas: [
                    {
                        type: 'line',
                        x1: 0, y1: mm2pt(87),
                        x2: mm2pt(8), y2: mm2pt(87),
                        lineWidth: 1
                    }, {
                        type: 'line',
                        x1: 0, y1: mm2pt(192),
                        x2: mm2pt(8), y2: mm2pt(192),
                        lineWidth: 1
                    }, {
                        type: 'line',
                        x1: 0, y1: mm2pt(148.5),
                        x2: mm2pt(10), y2: mm2pt(148.5),
                        lineWidth: 1
                    }]})
        };
    }

    toPdfDoc() {
        return this.doc;
    }

    static fromRequest(request_object, template, flags = {}) {
        let subjects = { // TODO: Find a more appropriate place for this.
            'erasure': 'Antrag auf Löschung personenbezogener Daten gemäß Art. 17 DSGVO',
            'access': 'Anfrage bzgl. Auskunft gemäß Art. 15 DSGVO',
            'rectification': 'Antrag auf Berichtigung personenbezogener Daten gemäß Art. 16 DSGVO'
        };

        let data = Letter.formatData(request_object.data);
        request_object.signature['name'] = data.name;
        let today = new Date();
        let letter = new Letter({
            reference_barcode: Letter.barcodeFromText(request_object.reference),
            information_block: 'Mein Zeichen: ' + request_object.reference + '\n' +
            'Datum: ' + today.toISOString().substring(0, 10),
            subject: subjects[request_object.type],
            recipient_address: request_object.recipient_address,
            sender_oneline: Letter.formatAddress(data.primary_address, ' • ', data.name),
            signature: request_object.signature
        });

        // Only for testing TODO: remove!
        var erase_all = false;
        flags = {
            'erase_some': !erase_all,
            'erase_all': erase_all,
            'data_portability': false,
            'runs': false
        };
        let variables = {
            'id_data': data.formatted,
            'rectification_data': data.formatted,
            'erasure_data': '<italic>Name, Handynummer, Score-Wert</italic>\n',
            'runs_list': '\nfoo\nbar'
        };

        letter.setProps({content: Letter.handleTemplate(template, flags, variables)});
        return letter;
    }

    static handleSignature(signature) {
        if(!signature) return null;
        switch(signature.type) {
            case 'text':
                return {text: signature.name, marginTop: mm2pt(2)};
            case 'image':
                return [
                    {image: signature.value, width: mm2pt(60), marginTop: mm2pt(5)},
                    {text: signature.name, marginTop: mm2pt(1)}
                ];
            default:
                return null;
        }
    }

    /**
     * void parseContent({string})
     * @param content {string} string to parse
     * TODO: Documentation of "tags"
     */
    static parseContent(content) {
        const regex = /<(.+?>)([\s\S]*?)<\/\1/gmu;
        let text_array = content.split(regex);

        let content_array = [];
        text_array.forEach(function(slice, i) {
            switch(slice) {
                case 'bold>':
                    content_array.push({text: text_array[i + 1], bold: true});
                    delete text_array[i + 1];
                    break;
                case 'italic>':
                    content_array.push({text: text_array[i + 1], italics: true});
                    delete text_array[i + 1];
                    break;
                case '':
                    break;
                default:
                    content_array.push(slice);
            }
        });

        return content_array;
    }

    static formatData(request_data) {
        let formatted = '';
        let primary_address = {}; // This seems like an odd place for this, but I really want to spare the additional loop(s).
        let name = '';
        request_data.forEach((item) => {
            formatted += '<bold>' + item.desc + ':</bold> ';
            switch(item.type) {
                case 'address':
                    formatted += '\n' + Letter.formatAddress(item.value, ', ');
                    if(item.value.primary) primary_address = item.value;
                    break;
                case 'textarea':
                    formatted += '\n' + item.value;
                    break;
                case 'name':
                    name = item.value;
                case 'input':
                    formatted += item.value;
                    break;
            }
            formatted += '\n';
        });
        return {formatted: formatted, name: name, primary_address: primary_address};
    }

    /**
     * {string} formatAddress({object}, {string})
     * generates a formatted address string
     * @param address {object} with schema {name: {string}, street_1: {string}, street_2: {string}, place: {string}, country: {string}}
     * @param delimiter {string} optional, defaults to '\n'
     * @param name {string} optional
     * @return {string}
     */
    static formatAddress(address, delimiter = '\n', name = '') {
        return [name, address.street_1, address.street_2, address.place, address.country].filter(item => item).join(delimiter);
    }

    /**
     * {string} generateReference({Date})
     * returns a random reference for correspondence in the given year
     * @param date {Date}
     * @return {string}
     */
    static generateReference(date) {
        return date.getFullYear() + '-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    }

    static barcodeFromText(text, addNewline = true) {
        return {
            text: '*' + text + '*' + (addNewline ? '\n' : ''),
                fontSize: 32,
            // alignment: 'center', // TODO: This feels reasonable but looks quite ugly with that little stuff in the information block
            font: 'Code39'
        }
    }

    static handleTemplate(template, flags, variables) {
        for(var flag in flags) {
            template = template.replace(new RegExp('\\[' + flag + '>([\\s\\S]*?)\\]', 'gmu'), flags[flag] ? '$1' : '');
        }
        for(var variable in variables) {
            template = template.replace('{' + variable + '}', variables[variable]);
        }
        return template;
    }

}
