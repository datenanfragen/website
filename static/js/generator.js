// Dynamic Input Listener

var dynamic_input_container = document.getElementById('request-dynamic-input');
var dynamic_input_type = document.getElementById('dynamic-input-type');
var dynamic_elements = 3;

document.getElementById('add-dynamic-inputs').onclick = function(ev) {
    dynamic_input_container.innerHTML += makeDynamicInputElement(dynamic_input_type.value, dynamic_elements++, 'request');
    console.log(dynamic_elements);
    Array.from(document.getElementsByClassName('dynamic-input-delete')).forEach(function(el) { el.onclick = function(ev) {
        document.getElementById(el.getAttribute('rel')).remove();
    }});
    Array.from(document.getElementsByClassName('form-element')).forEach(function(el) { el.onchange = function(ev) {
        generatePDF(el.value, iframe);
    }});
};

Array.from(document.getElementsByClassName('dynamic-input-delete')).forEach(function(el) { el.onclick = function(ev) {
    document.getElementById(el.getAttribute('rel')).remove();
}});

// PDF Listener

var iframe = document.getElementById('pdf-viewer');


/**
 * {object} generateRequest({object})
 *
 * @param request_object {object} containing
 * @return {object} letterObject to be plugged into generatePDF()
 */
function generateRequest(request_object) {
    var subject = '';
    var content = '';
    var data_text = '[bold]Aktuelle Adresse:[endbold][tabular]' + formatAddress(request_object.current_address, '\n') + '[endtabular]';
    request_object.data.forEach(function (item) {

    });
    switch(request_object.type) {
        case 'erasure':
            subject = 'Anfrage auf Löschung von Daten zu meiner Person nach §15 EU-DSGVO';
            content = 'Sehr geehrte Damen und Herren,\n\nhiermit bitte ich um die Löschung der bei Ihnen gespeicherten personenbezogenen Daten über meine Person.' +
                'Dies schließt insbesondere Scoring-Werte oder Verhaltensmuster mit ein. Zur Identifikation habe ich einige Daten beigefügt: \n\n' + data_text + '\n\n' +
                'Dieses Schreiben ist nach Ausführung des Löschvorgangs zu vernichten.\n\nMit freundlichen Grüßen';
            break;
        case 'access':
            subject = 'Anfrage auf Selbstauskunft nach §15 EU-DSGVO';
            content = 'Sehr geehrte Damen und Herren,\n\nhiermit bitte ich um Auskunft über die zu mir gespeicherten personenbezogenen Daten, [bold]ihre Herkunft[endbold] und Verwendungszweck sowie eine Aufstellung, an wen die Daten in den letzten 24 Monaten weitergegeben wurden.' +
                'Dies schließt insbesondere Scoring-Werte oder Verhaltensmuster mit ein. Zur Identifikation habe ich einige Daten beigefügt: \n\n\n' + data_text + '\n\n' +
                'Mit freundlichen Grüßen';
            break;
        default:
            return null;
    }
    return {
        sender_address: formatAddress(request_object.current_address, '\n'),
        sender_oneline: formatAddress(request_object.current_address, ' • '),
        recipient_address: request_object.recipient_address,
        information_block: 'Mein Zeichen: test-001',
        subject:  subject,
        content: content
    };
}

/**
 * {string} formatAddress({object}, {string})
 * generates a formatted address string
 * @param address {object} with schema {name: {string}, street_1: {string}, street_2: {string}, place: {string}, country: {string}}
 * @param delimiter {string} defaults to '\n'
 * @return {string}
 */
function formatAddress(address, delimiter) {
    return address.name +
        (address.street_1 ? delimiter + address.street_1 : '') +
        (address.street_2 ? delimiter + address.street_2 : '') +
        (address.place ? delimiter + address.place : '') +
        (address.country ? delimiter + address.country : '');
}

var letter = generateRequest({
    type: 'access',
    current_address: {
        name: 'Markus Mustermensch',
        street_1: 'Lange Lange Langstraße 1254',
        place: '43678 Musterdorf'
    },
    data: [{
            title: 'Vorherige Adresse (bis 2014)',
            type: 'address',
            values: {
                name: 'Marvin Muster',
                street_1: '2576 Foo Lane',
                place: 'Barinton 345 Z3',
                country: 'UK'
            }
        }, {
            title: 'Geburtsdatum',
            type: 'input',
            value: '1992-03-14'
        }, {
            title: 'Kundennummer',
            type: 'input',
            value: '#28848473'
        }, {
            title: 'PGP-Key (bitte bei elektronischer Antwort verwenden)',
            type: 'textarea',
            value: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
            'Version: GnuPG v1.4.9 (Darwin)\n' +
            ' \n' +
            'mQENBErJM6oBCAC7NG5NZ5kiJg+KTTaIDjX9BU8bc7FI5a2zCYc3p9eikJfyyZYM\n' +
            '...\n' +
            'sWbckvcIjJRcAtRliKbAf+KjplbcEIzt+kxmweE5XeKvDFtzAD041FGAphIkKcuu\n' +
            'IAzL+XcMWzc3DA==\n' +
            '=+ojz\n' +
            '-----END PGP PUBLIC KEY BLOCK-----'
        }],
    recipient_address: 'Musterfirma\nAbt. Musterung\nMilena Mustermensch\nMusterstraße 34\n87654 Musterstadt'
});
generatePDF(letter, iframe);

Array.from(document.getElementsByClassName('form-element')).forEach(function(el) { el.onchange = function(ev) {
    generatePDF(el.value, iframe);
}});