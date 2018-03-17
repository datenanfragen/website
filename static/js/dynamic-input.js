function makeDynamicInputElement(type, id, prefix) {
    switch(type) {
        case 'textarea':
            return '<div class="dynamic-input dynamic-input-textarea" id="dynamic-input-' + id + '">\n' +
                '        <div class="col25">\n' +
                '            <div class="form-group"><label for="' + id + '-' + prefix + '-title" class="sr-only">Titel</label><input type="text" id="' + id + '-' + prefix + '-title" class="form-element"></div>\n' +
                '            <div class="col50"><button id="' + id + '-' + prefix + '-delete" rel="dynamic-input-' + id + '" class="dynamic-input-delete">Delete</button></div>\n' +
                '        </div>\n' +
                '        <div class="col75">\n' +
                '            <div class="form-group"><label for="' + id + '-' + prefix + '-content" class="sr-only">Titel</label><textarea id="' + id + '-' + prefix + '-content" class="form-element"></textarea></div>\n' +
                '        </div>\n' +
                '    </div>' +
                '    <div class="clearfix"></div>';
        case 'input':
            return '<div class="dynamic-input dynamic-input-textarea" id="dynamic-input-' + id + '">\n' +
                '        <div class="col25">\n' +
                '            <div class="form-group"><label for="' + id + '-' + prefix + '-title" class="sr-only">Titel</label><input type="text" id="' + id + '-' + prefix + '-title" class="form-element"></div>\n' +
                '            <div class="col50"><button id="' + id + '-' + prefix + '-delete" rel="dynamic-input-' + id + '" class="dynamic-input-delete">Delete</button></div>\n' +
                '        </div>\n' +
                '        <div class="col75">\n' +
                '            <div class="form-group"><label for="' + id + '-' + prefix + '-content" class="sr-only">Titel</label><input id="' + id + '-' + prefix + '-content" class="form-element"></div>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <div class="clearfix"></div>';
        case 'address':
            return '<div class="dynamic-input dynamic-input-address" id="dynamic-input-' + id + '">\n' +
                '        <div class="col25">\n' +
                '            <div class="form-group"><label for="' + id + '-' + prefix + '-title" class="sr-only">Titel</label><input type="text" id="' + id + '-' + prefix + '-title" class="form-element"></div>\n' +
                '            <div class="col50"><button id="' + id + '-' + prefix + '-delete" rel="dynamic-input-' + id + '" class="dynamic-input-delete">Delete</button></div>\n' +
                '        </div>\n' +
                '        <div class="col75">\n' +
                '            <div class="form-group"><label for="' + id + '-' + prefix + '-name">Name</label><input type="text" id="' + id + '-' + prefix + '-name" class="form-element"></div>\n' +
                '            <div class="form-group"><label for="' + id + '-' + prefix + '-street-1">Adresse 1</label><input type="text" id="' + id + '-' + prefix + '-street-1" class="form-element"></div>\n' +
                '            <div class="form-group"><label for="' + id + '-' + prefix + '-street-2">Adresse 2</label><input type="text" id="' + id + '-' + prefix + '-street-2" class="form-element"></div>\n' +
                '            <div class="form-group"><label for="' + id + '-' + prefix + '-place">Ort</label><input type="text" id="' + id + '-' + prefix + '-place" class="form-element"></div>\n' +
                '            <div class="form-group"><label for="' + id + '-' + prefix + '-country">Land</label><input type="text" id="' + id + '-' + prefix + '-country" class="form-element"></div>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <div class="clearfix"></div>';
        default:
            return '';
    }
}