import { mm2pt, formatAddress, stripTags } from './utility';
import { layout } from './layouts/din-5008-a';

export default class Letter {
    constructor(props) {
        this.doc = {};

        this.props = {
            sender_address: [],
            recipient_address: [],
            information_block: '',
            subject: '',
            content: '',
            signature: [],
            layout_function: layout
        };
        this.setProps(props);
    }

    toString() {
        const information_block = Array.isArray(this.props.information_block)
            ? this.props.information_block.join('\n')
            : this.props.information_block;
        return information_block + '\n\n' + stripTags(this.props.content) + '\n' + this.props.signature['name'];
    }

    setProps(props) {
        for (let i in props) {
            if (Object.prototype.hasOwnProperty.call(this.props, i)) this.props[i] = props[i];
        }

        this.doc = layout(
            formatAddress(this.props.sender_address, ' • '),
            formatAddress(this.props.recipient_address),
            this.props.information_block,
            this.props.subject,
            Letter.parseTags(this.props.content),
            Letter.handleSignature(this.props.signature)
        );
    }

    static handleSignature(signature) {
        if (!signature) return null;
        switch (signature.type) {
            case 'text':
                return { text: signature.name, marginTop: mm2pt(2) };
            case 'image':
                return [
                    { image: signature.value, width: mm2pt(60), marginTop: mm2pt(5) },
                    { text: signature.name, marginTop: mm2pt(1) }
                ];
            default:
                return null;
        }
    }

    /**
     * Convert a string with (potential) tags into a format understood by pdfmake.
     *
     * The following tags are supported:
     *   - <bold>This text will be bold.</bold>
     *   - <italic>This text will be italic.</italic>
     *
     * Nesting tags is not supported.
     *
     * @param {string} content String to parse
     * @return {Array}
     */
    static parseTags(content) {
        if (!content) return [];

        const regex = /<(.+?>)([\S\s]*?)<\/\1/gmu;
        const text_array = content.split(regex);

        let content_array = [];
        text_array.forEach(function(slice, i) {
            switch (slice) {
                case 'bold>':
                    content_array.push({ text: text_array[i + 1], bold: true });
                    delete text_array[i + 1];
                    break;
                case 'italic>':
                    content_array.push({ text: text_array[i + 1], italics: true });
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
}
