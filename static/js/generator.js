var iframe = document.getElementById('pdf-viewer');

function generatePDF(text, iframe) {
    // create a document and pipe to a blob
    var doc = new PDFDocument();
    var stream = doc.pipe(blobStream());

    // and some justified text wrapped into columns
    doc.text(text, 10, 10)
        .font('Times-Roman', 13)
        .moveDown()
        .text('abc', {
            width: 412,
            align: 'justify',
            indent: 10,
            columns: 2,
            height: 300,
            ellipsis: true
        });

    // end and display the document in the iframe to the right
    doc.end();
    stream.on('finish', function() {
        iframe.src = stream.toBlobURL('application/pdf');
    });
}

generatePDF('Test', iframe);

Array.from(document.getElementsByClassName('form-element')).forEach(function(el) { el.onchange = function(ev) {
    generatePDF(el.value, iframe);
}});