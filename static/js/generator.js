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

generatePDF({
    sender_oneline: 'Markus Mustermensch | Helene-Engelbrecht-Straße 121 | 37473 Musterdorf',
    recipient_address: 'Milena Mustermensch\nMusterfirma\nAbt. Musterung\nPostfach 123456\n67890 Musterstadt',
    information_block: 'Mein Zeichen: muster-0001\nIhre Nachricht vom: 2018-03-14\n',
    subject: 'Anfrage auf Selbstauskunft nach §15 EU-DSGVO',
    content: 'Sehr geehrte Menschen,\n\n' +
    '\n' +
    'lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n' +
    '\n' +
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Donec elementum ligula eu sapien consequat eleifend. \n' +
    '\n' +
    'Donec nec dolor erat, condimentum sagittis sem. Praesent porttitor porttitor risus, dapibus rutrum ipsum gravida et. Integer lectus nisi, facilisis sit amet eleifend nec, pharetra ut augue. Integer quam nunc, consequat nec egestas ac, volutpat ac nisi. \n' +
    '\n' +
    'Sed consectetur dignissim dignissim. Donec pretium est sit amet ipsum fringilla feugiat. Aliquam erat volutpat. Maecenas scelerisque, orci sit amet cursus tincidunt, libero nisl eleifend tortor, vitae cursus risus mauris vitae nisi. Cras laoreet ultrices ligula eget tempus. \n' +
    '\n' +
    'Aenean metus purus, iaculis ut imperdiet eget, sodales et massa. Duis pellentesque nisl vel massa dapibus non lacinia velit volutpat. Maecenas accumsan interdum sodales. In hac habitasse platea dictumst. Pellentesque ornare blandit orci, eget tristique risus convallis ut. Vivamus a sapien neque. \n' +
    '\n' +
    'Lorem Ipsum Dolor Sit Amet\n' +
    '\n' +
    'Mit freundlichen Grüßen\n\n\nMarkus Mustermensch'
}, iframe);

Array.from(document.getElementsByClassName('form-element')).forEach(function(el) { el.onchange = function(ev) {
    generatePDF(el.value, iframe);
}});