importScripts('pdfmake.min.js');
importScripts('vfs_fonts.js');

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

onmessage = (e) => {
    let doc = e.data;
    let pdf = pdfMake.createPdf(doc);
    console.log('created pdf');
    pdf.getBlob((blob) => {
        var url = URL.createObjectURL(blob);
        postMessage(url);
    })
};
