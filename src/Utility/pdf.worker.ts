import { PdfRenderer } from 'letter-generator';
import vfsFonts from './fonts.json';

onmessage = (e) => {
    const pdf_renderer = new PdfRenderer(e.data.pdfdoc);
    pdf_renderer.setFonts(vfsFonts, {
        Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
        },
        Code39: {
            normal: 'code39.ttf',
        },
    });

    pdf_renderer.pdfBlob().then((blob) =>
        postMessage({
            blob_url: URL.createObjectURL(blob),
            filename: e.data.filename,
        })
    );
};
