/**
 * {object} generateRequestLetter({object})
 *
 * @param request_object {object} containing
 * @param template {string} downloaded request template
 * @return {object} letterObject to be plugged into generatePDF()
 */
function generateRequestLetter(request_object, template) {
    var subject = '';
    var flags = {};
    var variables = {};
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
            var erase_all = false;
            flags = {
                'erase_some': !erase_all,
                'erase_all': erase_all
            };
            variables = {
                'id_data': data_text,
                'erasure_data': '<italic>Name, Handynummer, Score-Wert</italic>\n'
            };
            break;
        case 'access':
            subject = 'Anfrage bzgl. Auskunft gemäß Art. 15 DSGVO';
            flags = {
                'data_portability': false,
                'runs': false
            };
            variables = {
                'id_data': data_text,
                'runs_list': '\nfoo\nbar'
            };
            break;
        case 'rectification':
            subject = 'Antrag auf Berichtigung personenbezogener Daten gemäß Art. 16 DSGVO';
            flags = {};
            variables = {
                'id_data': data_text,
                'rectification_data': data_text
            };
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
        content: handleTemplate(template, flags, variables),
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

function handleTemplate(template, flags, variables) {
    for(var flag in flags) {
        template = template.replace(new RegExp('\\[' + flag + '>([\\s\\S]*?)\\]', 'gmu'), flags[flag] ? '$1' : '');
    }
    for(var variable in variables) {
        template = template.replace('{' + variable + '}', variables[variable]);
    }
    return template;
}