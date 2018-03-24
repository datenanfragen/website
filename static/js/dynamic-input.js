function makeDynamicInputElement(element, id) {
    var input_elements = '';
    var control_elements = '';
    var container_element = document.createElement('div');

    switch(element.type) {
        case 'textarea':
            input_elements = '<div class="form-group">' +
                '<label for="' + id + '-value" class="sr-only">' + element.desc + '</label>' +
                '<textarea id="' + id + '-value" class="form-element" placeholder="Wert"' + (element.required == false ? '' : ' required') + '></textarea>' +
                '</div>\n';
            break;
        case 'name':
        case 'input':
            input_elements = '<div class="form-group">' +
                '<label for="' + id + '-value" class="sr-only">' + element.desc + '</label>' +
                '<input type="text" id="' + id + '-value" class="form-element" placeholder="Wert"' + (element.required == false ? '' : ' required') + '>' +
                '</div>\n';
            break;
        case 'address':
            input_elements =
                '<div class="form-group fancy-fg"><input type="text" id="' + id + '-street_1" placeholder="Adresszeile 1" class="form-element"' + (element.required == false ? '' : ' required') + '>' +
                '<label class="fancy-label" for="' + id + '-street_1">Adresszeile 1</label></div>\n' +
                '<div class="form-group fancy-fg"><input type="text" id="' + id + '-street_2" placeholder="Adresszeile 2" class="form-element">' +
                '<label class="fancy-label" for="' + id + '-street_2">Adresszeile 2</label></div>\n' +
                '<div class="form-group fancy-fg"><input type="text" id="' + id + '-place" placeholder="Ort" class="form-element"' + (element.required == false ? '' : ' required') + '>' +
                '<label class="fancy-label" for="' + id + '-place">Ort</label></div>\n' +
                '<div class="form-group fancy-fg"><input type="text" id="' + id + '-country" placeholder="Land" class="form-element">' +
                '<label class="fancy-label" for="' + id + '-country">Land</label></div>\n' +
                '<input type="hidden" id="' + id + '-primary" class="dynamic-input-primary form-element" value="false">';

            control_elements += '<div class="col50"><button id="' + id + '-primaryButton" rel="' + id + '-primary" class="dynamic-input-primaryButton" data-isprimary="false">Hauptadresse</button></div>';
            break;
        default:
            return '';
    }

    container_element.innerHTML = '<div class="dynamic-input dynamic-input-textarea" id="dynamic-input-' + id + '">\n' +
        '<div class="col40">\n' +
        '<div class="form-group" style="width: 100%; display: table;">' +
        '<div style="display: table-cell"><button id="' + id + '-delete" rel="' + id + '" class="dynamic-input-delete"><img src="/img/trash.svg" style="height: 16px;"></button></div>' +
        '<div style="display: table-cell;"><label for="' + id + '-desc" class="sr-only">Beschreibung</label><input type="text" id="' + id + '-desc" class="form-element" value="' + element.desc + '" placeholder="Beschreibung" style="margin-left: 5px;" required></div>' +
        '</div>\n' +
        control_elements +
        '</div>\n' +
        '<div class="col60"><div style="padding-left: 10px;">' + input_elements + '</div></div>\n' +
        '</div>' +
        '<div class="clearfix"></div>';
    return container_element;
}
