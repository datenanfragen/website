function mm2pt(mm) {
    return 72.0/25.4*mm;
}

function generatePDF(letter, iframe) {
    // create a document and pipe to a blob
    var doc = new PDFDocument({ // according to DIN 5008
        size: 'A4',
        margins: {
            top: mm2pt(27),
            bottom: mm2pt(16.9),
            left: mm2pt(25),
            right: mm2pt(20)
        }
    });
    var stream = doc.pipe(blobStream());
    var font = 'Helvetica';

    // Falzmarken TODO: auf jede Seite tun
    doc.moveTo(0, mm2pt(87)).lineTo(mm2pt(8), mm2pt(87)).stroke();
    doc.moveTo(0, mm2pt(192)).lineTo(mm2pt(8), mm2pt(192)).stroke();

    // Lochmarke
    doc.moveTo(0, mm2pt(148.5)).lineTo(mm2pt(10), mm2pt(148.5)).stroke();


    doc.font(font, 12);

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

    // content block
    doc.font('Helvetica-Bold').text(letter.subject, mm2pt(25), mm2pt(85))
        .font(font)
        .moveDown(2)
        .text(letter.content);

    // end and display the document in the iframe to the right
    doc.end();
    stream.on('finish', function() {
        iframe.src = stream.toBlobURL('application/pdf');
    });
}
