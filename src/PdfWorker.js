importScripts('pdfmake.min.js');
importScripts('vfs_fonts.js');

/* global pdfMake */

pdfMake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf'
    },
    Code39: {
        normal: 'code39.ttf'
    }
};

onmessage = e => {
    pdfMake.createPdf(e.data).getBlob(blob => {
        postMessage(URL.createObjectURL(blob));
    });
};
