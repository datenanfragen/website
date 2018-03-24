// Dynamic Input Listener
var dynamic_element_counter = 0
var dynamic_input_container = document.getElementById('request-dynamic-input');
var dynamic_input_type = document.getElementById('dynamic-input-type');
var dynamic_elements = {};
var signature_container = document.getElementById('signature-container');
var iframe = document.getElementById('pdf-viewer');

generateDynamicFields();
var signature_canvas = setupSignatureCanvas(signature_container, 400, 200);
document.getElementById('signature-clear-button').onclick = function (e) {
    signature_canvas.context.clearTo('#fff');
};

document.getElementById('add-dynamic-inputs').onclick = function(ev) {
    refreshListeners(addDynamicField({
        desc: '',
        type: dynamic_input_type.value
    }));
};

document.getElementById('generate-button').onclick = function (ev) {
    document.reRenderPDF();
};
document.pdfDone = function (url) {
    download_link.setAttribute('href', url);
};

// functions.php
function generateDynamicFields(fields = [
    {
        "desc": "Name",
        "type": "name"
    }, {
        "desc": "Geburtsdatum",
        "type": "input",
        "required": false
    }, {
        "desc": "Adresse",
        "type": "address"
    }]) {
    dynamic_input_container.innerHTML = ''; // TODO: Maybe be a little more… gentle here?
    fields.forEach(field => {
        refreshListeners(addDynamicField(field));
    });
}

function addDynamicField(field) {
    let id = dynamic_element_counter++;
    dynamic_elements[id] = field;
    let element = makeDynamicInputElement(field, id);
    dynamic_input_container.appendChild(element);
    return element;
}

function removeDynamicFieldById(id) {
    delete dynamic_elements[id];
    document.getElementById('dynamic-input-' + id).remove();
}

function generateJsonFromInputFields() {
    const address_attributes = ['street_1', 'street_2', 'place', 'country', 'primary'];

    var data = [];
    for(var id in dynamic_elements) {
        var proto = {
            desc: document.getElementById(id + '-desc').value,
            type: dynamic_elements[id].type
        };
        switch(dynamic_elements[id].type) {
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
    }

    return data;
}

document.reRenderPDF = function() {
    var data = generateJsonFromInputFields();
    var letter = generateRequest({
        type: 'access',
        data: data,
        recipient_address: document.getElementById('request-recipient').value,
        signature: {
            type: 'image',
            value: signature_canvas.node.toDataURL()
        }
    });
    generatePDF(letter, iframe);
};

function refreshListeners(element = document) {
    Array.from(element.getElementsByClassName('dynamic-input-delete')).forEach(function(el) { el.onclick = function(ev) {
        removeDynamicFieldById(el.getAttribute('rel'));
        document.reRenderPDF();
    }});
    Array.from(element.getElementsByClassName('dynamic-input-primaryButton')).forEach(function(el) { el.onclick = function(ev) {
        Array.from(document.querySelectorAll('.dynamic-input-primary[value="true"]')).forEach(input => {
            input.value = false;
            document.getElementById(input.id + 'Button').setAttribute('data-isprimary', "false");
        });
        var input = document.getElementById(el.getAttribute('rel'));
        input.value = true;
        input.onchange();
        el.setAttribute('data-isprimary', "true");
    }});
    Array.from(element.getElementsByClassName('form-element')).forEach(function(el) { el.onchange = function(ev) {
        document.reRenderPDF();
    }});
}

// see https://stackoverflow.com/questions/3814442/drawing-a-circle-on-the-canvas-using-mouse-events
function createCanvas(parent, width, height) {
    var canvas = {};
    canvas.node = document.createElement('canvas');
    canvas.context = canvas.node.getContext('2d');
    canvas.node.width = width || 100;
    canvas.node.height = height || 100;
    parent.appendChild(canvas.node);
    return canvas;
}

// see https://stackoverflow.com/questions/3814442/drawing-a-circle-on-the-canvas-using-mouse-events
function setupSignatureCanvas(container, width, height, fillColor = '#fff') {
    var canvas = createCanvas(container, width, height);
    var ctx = canvas.context;

    // define a custom drawPath method
    ctx.fillCircle = function(x, y, radius, fillColor) {
        this.fillStyle = fillColor;
        this.beginPath();
        this.moveTo(x, y);
        this.arc(x, y, radius, 0, Math.PI*2, false);
        this.fill();
        this.closePath();
    };

    ctx.lastX = 0;
    ctx.lastY = 0;
    ctx.drawPath = function(x, y, strokeStyle = '#000', lineWidth = 1) {
        this.beginPath();
        this.moveTo(this.lastX, this.lastY);
        this.lineTo(x, y);
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.stroke();
        this.closePath();
    };
    ctx.clearTo = function(fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, width, height);
    };
    ctx.clearTo(fillColor);

    // bind mouse events
    canvas.node.onmousemove = function(e) {
        if (!canvas.isDrawing) {
            return;
        }
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        ctx.drawPath(x, y);
        ctx.lastX = x;
        ctx.lastY = y;
    };
    canvas.node.onmousedown = function(e) {
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        ctx.lastX = x;
        ctx.lastY = y;

        ctx.beginPath();
        ctx.fillCircle(x, y, 1, '#000');
        ctx.closePath();

        canvas.isDrawing = true;
    };
    canvas.node.onmouseup = function(e) {
        canvas.isDrawing = false;
    };
    canvas.node.onmouseout = function (e) {
        document.reRenderPDF();
    };

    return canvas;
}

