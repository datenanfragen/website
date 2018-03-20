/**
 * {object} generateRequest({object})
 *
 * @param request_object {object} containing
 * @return {object} letterObject to be plugged into generatePDF()
 */
function generateRequest(request_object) {
    var subject = '';
    var content = '';
    var data_text = '';
    var name = '';
    var sender_address = {};
    request_object.data.forEach(function (item) {
        data_text += '[bold]' + item.desc + ':[/bold] ';
        switch(item.type) {
            case 'address':
                data_text += '\n' + formatAddress(item.value, ', ');
                if(item.value.primary === 'true') sender_address = item.value;
                break;
            case 'textarea':
                data_text += '\n' + item.value;
                break;
            case 'name':
                name = item.value;
            case 'input':
                data_text += item.value;
                break;
        }
        data_text += '\n';
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
            content = 'Sehr geehrte Damen und Herren,\n\nhiermit bitte ich um Auskunft über die zu mir gespeicherten personenbezogenen Daten, [bold]ihre Herkunft[/bold] und Verwendungszweck sowie eine Aufstellung, an wen die Daten in den letzten 24 Monaten weitergegeben wurden.' +
                'Dies schließt insbesondere Scoring-Werte oder Verhaltensmuster mit ein. Zur Identifikation habe ich einige Daten beigefügt: \n\n' + data_text + '\n' +
                'Mit freundlichen Grüßen';
            break;
        default:
            return null;
    }
    return {
        sender_oneline: formatAddress(sender_address, ' • ', name),
        recipient_address: request_object.recipient_address,
        information_block: 'Mein Zeichen: test-001',
        subject: subject,
        content: content,
        signature: request_object.signature
    };
}

/**
 * {string} formatAddress({object}, {string})
 * generates a formatted address string
 * @param address {object} with schema {name: {string}, street_1: {string}, street_2: {string}, place: {string}, country: {string}}
 * @param delimiter {string} optional, defaults to '\n'
 * @param name {string} optional
 * @return {string}
 */
function formatAddress(address, delimiter = '\n', name = '') {
    return [name, address.street_1, address.street_2, address.place, address.country].filter(item => item).join(delimiter);
}
