/**
 * {number} mm2pt({number}):
 * converts values from millimeters to PDF points
 * @param mm {number}
 * @return {number}
 */
function mm2pt(mm) {
    return 72.0/25.4*mm;
}

/**
 * void generatePDF({object}, {element}):
 * generates a DIN 5008 letter PDF from the given letterObject and views it in the given iframe
 * @param letter {object} containing {sender_oneline: '', recipient_address: '', information_block: '', subject: '', content: ''}
 * @param iframe {element} to view the PDF blob
 */
function generatePDF(letter, iframe) {
    // create a document and pipe to a blob
    var doc = new PDFDocument({ // according to DIN 5008
        size: 'A4',
        margins: {
            top: mm2pt(27),
            bottom: mm2pt(16.9),
            left: mm2pt(25),
            right: mm2pt(20)
        },
        autoFirstPage: false
    });
    var stream = doc.pipe(blobStream());
    var font = 'Helvetica';
    var font_bold = 'Helvetica-Bold';
    doc.font(font, 12);

    // paper marks on every page
    doc.on('pageAdded', function() {
        // Falzmarken
        doc.moveTo(0, mm2pt(87)).lineTo(mm2pt(8), mm2pt(87)).stroke();
        doc.moveTo(0, mm2pt(192)).lineTo(mm2pt(8), mm2pt(192)).stroke();
        // Lochmarke
        doc.moveTo(0, mm2pt(148.5)).lineTo(mm2pt(10), mm2pt(148.5)).stroke();
    });
    doc.addPage();

    // address block
    doc.font(font, 6).text(letter.sender_oneline, mm2pt(20), mm2pt(27), {
        width: mm2pt(85),
        height: mm2pt(7)
    });
    doc.font(font, 12).text(letter.recipient_address, mm2pt(20), mm2pt(34), {
        width: mm2pt(85),
        height: mm2pt(28)
    });

    // information block
    doc.text(letter.information_block, mm2pt(210-85), mm2pt(32), {
        width: mm2pt(75),
        height: mm2pt(45)
    });

    // subject
    doc.font(font_bold).text(letter.subject + '\n\n\n\n', mm2pt(25), mm2pt(85), {continued: true})
        .font(font);

    // content block
    parseContent(letter.content, doc, {
        font: font,
        font_bold: font_bold,
        tabular_position: 10
    });

    // end and display the document in the iframe to the right
    doc.end();
    stream.on('finish', function() {
        iframe.src = stream.toBlobURL('application/pdf');
    });
}

/**
 * void parseContent({string}, {PDFDocument}, {object})
 * @param content {string} string to parse
 * @param doc {PDFDocument} document to render the parsed content into
 * @param options {object} possible options:
 *      - font: Name (or path) of the font to use
 *      - font_bold: Name (or path) of the bold font to use
 *      - tabular_position: Position of the tabular content in mm relative to the content block
 */
function parseContent(content, doc, options) {
    var regex = /(\[.*?\])/g;
    var text_array = content.split(regex);
    console.log(text_array);

    var lastContentSlice = 0;
    text_array.forEach(function (slice) {
        if(slice && !/^\[.*\]$/g.test(slice)) lastContentSlice++;
    });
    var i = 0;
    text_array.forEach(function(slice) {
        switch(slice) {
            case '[bold]':
                doc.font(options.font_bold);
                break;
            case '[endbold]':
                doc.font(options.font);
                break;
            case '[tabular]':
                doc.x = mm2pt(25 + options.tabular_position);
                break;
            case '[endtabular]':
                doc.x = mm2pt(25);
                doc.moveDown();
                break;
            case '':
                break;
            default:
                doc.text(slice, {continued: ++i < lastContentSlice});
        }
    });
}