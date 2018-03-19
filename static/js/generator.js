// Dynamic Input Listener
var dynamic_input_container = document.getElementById('request-dynamic-input');
var dynamic_input_type = document.getElementById('dynamic-input-type');
var dynamic_elements = [];
generateDynamicFields();

document.getElementById('add-dynamic-inputs').onclick = function(ev) {
    var new_input = {
        desc: '',
        type: dynamic_input_type.value
    };
    dynamic_elements.push(new_input);
    dynamic_input_container.appendChild(makeDynamicInputElement(new_input, dynamic_elements.length-1));
    refreshListeners();
};

var iframe = document.getElementById('pdf-viewer');

// functions.php
function generateDynamicFields(required_fields = null) {
    var defaults = [
        {
            "desc": "Name",
            "type": "name"
        }, {
            "desc": "Geburtsdatum",
            "type": "input"
        }, {
            "desc": "Adresse",
            "type": "address"
        }
    ];
    dynamic_elements = required_fields ? required_fields : defaults;
    dynamic_input_container.innerHTML = ''; // TODO: Maybe be a little more… gentle here?
    dynamic_elements.forEach((item, id) => {
        dynamic_input_container.appendChild(makeDynamicInputElement(item, id));
    });

    refreshListeners();
}

function generateJsonFromInputFields() {
    const address_attributes = ['street_1', 'street_2', 'place', 'country', 'primary'];

    var data = [];
    dynamic_elements.forEach((item, id) => {
        var proto = {
            desc: document.getElementById(id + '-desc').value,
            type: item.type
        };
        switch(item.type) {
            case 'address':
                proto['value'] = {};
                address_attributes.forEach(att => {
                    proto['value'][att] = document.getElementById(id + '-' + att).value;
                });
                break;
            case 'textarea':
            case 'name':
            case 'input':
            default:
                proto['value'] = document.getElementById(id + '-value').value;
                break;
        }
        data.push(proto);
    });

    return data;
}

function refreshListeners() {
    Array.from(document.getElementsByClassName('dynamic-input-delete')).forEach(function(el) { el.onclick = function(ev) {
        document.getElementById(el.getAttribute('rel')).remove();
    }});
    Array.from(document.getElementsByClassName('dynamic-input-primaryButton')).forEach(function(el) { el.onclick = function(ev) {
        Array.from(document.getElementsByClassName('dynamic-input-primary')).forEach(input => {
            input.value = false;
            document.getElementById(input.id + 'Button').setAttribute('data-isprimary', "false");
        });
        var input = document.getElementById(el.getAttribute('rel'));
        input.value = true;
        input.onchange();
        el.setAttribute('data-isprimary', "true");
    }});
    Array.from(document.getElementsByClassName('form-element')).forEach(function(el) { el.onchange = function(ev) {
        var data = generateJsonFromInputFields();
        console.log(data);
        var letter = generateRequest({
            type: 'access',
            data: data,
            recipient_address: document.getElementById('request-recipient').value
        });
        console.log(letter);
        generatePDF(letter, iframe);
    }});
}
