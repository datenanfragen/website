const pdfMake = require('pdfmake');

export default class PdfRenderer {
    constructor(letter) {
        this.doc = letter.doc;
    }

    setFonts(vfs, fonts) {
        pdfMake.vfs = vfs;
        pdfMake.fonts = fonts;
    }

    triggerDownload() {
        pdfMake.createPdf(this.doc).download();
    }

    triggerOpenInNewWindow() {
        pdfMake.createPdf(this.doc).open();
    }

    triggerPrint() {
        pdfMake.createPdf(this.doc).print();
    }

    pdfBlob() {
        return new Promise(resolve => {
            pdfMake.createPdf(this.doc).getBlob(blob => {
                resolve(blob);
            });
        });
    }
}
