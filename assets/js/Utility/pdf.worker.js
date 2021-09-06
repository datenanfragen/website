import PdfRenderer from 'letter-generator/PdfRenderer';

onmessage = (e) => {
    const pdf_renderer = new PdfRenderer(e.data.pdfdoc);
    pdf_renderer.setFonts(require('./vfs_fonts.js').pdfMake.vfs, {
        Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
        },
        Code39: {
            normal: 'code39.ttf',
        },
    });

    pdf_renderer.pdfBlob().then((blob) => {
        postMessage({
            blob_url: URL.createObjectURL(blob),
            filename: e.data.filename,
        });
    });
};
