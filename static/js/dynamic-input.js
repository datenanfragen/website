function makeDynamicInputElement(input_object, id) {
    var input_elements = '';
    var control_elements = '<div class="col50">' +
        '<button id="' + id + '-delete" rel="dynamic-input-' + id + '" class="dynamic-input-delete">Löschen</button>' +
        '</div>\n';
    var container_element = document.createElement('div');

    switch(input_object.type) {
        case 'textarea':
            input_elements = '<div class="form-group">' +
                '<label for="' + id + '-value" class="sr-only">' + input_object.desc + '</label>' +
                '<textarea id="' + id + '-value" class="form-element"></textarea>' +
                '</div>\n';
            break;
        case 'name':
        case 'input':
            input_elements = '<div class="form-group">' +
                '<label for="' + id + '-value" class="sr-only">' + input_object.desc + '</label>' +
                '<input id="' + id + '-value" class="form-element">' +
                '</div>\n';
            break;
        case 'address':
            input_elements = '<div class="form-group"><label for="' + id + '-street_1">Adresse 1</label><input type="text" id="' + id + '-street_1" class="form-element"></div>\n' +
                '<div class="form-group"><label for="' + id + '-street_2">Adresse 2</label><input type="text" id="' + id + '-street_2" class="form-element"></div>\n' +
                '<div class="form-group"><label for="' + id + '-place">Ort</label><input type="text" id="' + id + '-place" class="form-element"></div>\n' +
                '<div class="form-group"><label for="' + id + '-country">Land</label><input type="text" id="' + id + '-country" class="form-element"></div>\n' +
                '<input type="hidden" id="' + id + '-primary" class="dynamic-input-primary form-element" value="false">';

            control_elements += '<div class="col50"><button id="' + id + '-primaryButton" rel="' + id + '-primary" class="dynamic-input-primaryButton" data-isprimary="false">Hauptadresse</button></div>';
            break;
        default:
            return '';
    }

    container_element.innerHTML = '<div class="dynamic-input dynamic-input-textarea" id="dynamic-input-' + id + '">\n' +
        '        <div class="col25">\n' +
        '            <div class="form-group"><label for="' + id + '-desc" class="sr-only">Beschreibung</label><input type="text" id="' + id + '-desc" class="form-element" value="' + input_object.desc + '"></div>\n' +
        control_elements +
        '        </div>\n' +
        '        <div class="col75">\n' + input_elements +
        '        </div>\n' +
        '    </div>' +
        '    <div class="clearfix"></div>';
    return container_element;
}