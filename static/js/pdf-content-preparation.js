/**
 * {object} generateRequestLetter({object})
 *
 * @param request_object {object} containing
 * @return {object} letterObject to be plugged into generatePDF()
 */
function generateRequestLetter(request_object) {
    var subject = '';
    var content = '';
    var data_text = '';
    var name = '';
    var sender_address = {};
    var today = new Date();
    var information_block = 'Mein Zeichen: ' + generateMark(today) + '\n' +
        'Datum: ' + today.toISOString().substring(0, 10);

    request_object.data.forEach(function (item) {
        data_text += '<bold>' + item.desc + ':</bold> ';
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
            subject = 'Antrag auf Löschung personenbezogener Daten gemäß Art. 17 DSGVO';
            content = '' + data_text;
            break;
        case 'access':
            subject = 'Anfrage bzgl. Auskunft gemäß Art. 15 DSGVO';
            content = '' + data_text;
            break;
        case 'rectification':
            subject = 'Antrag auf Berichtigung personenbezogener Daten gemäß Art. 16 DSGVO';
            content = '' + data_text;
            break;
        default:
            return null;
    }
    request_object.signature['name'] = name;
    return {
        sender_oneline: formatAddress(sender_address, ' • ', name),
        recipient_address: request_object.recipient_address,
        information_block: information_block,
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

/**
 * {string} generateMark({Date})
 * returns a random mark for correspondence in the given year
 * @param date {Date}
 * @return {string}
 */
function generateMark(date) {
    return date.getFullYear() + '-' + Math.random().toString(36).substring(2, 9).toUpperCase();
}