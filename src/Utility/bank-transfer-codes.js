import QRCode from 'qrcode';

export function epcrData(amount, reference) {
    return (
        'BCD\n' + // Service Code
        '002\n' + // Version
        '1\n' + // Encoding (1=UFT-8)
        'SCT\n' + // SEPA Credit Transfer
        'GENODEF1SLR\n' + // BIC
        'Datenanfragen.de e. V.\n' + // Recipient (up to 70 characters)
        'DE42830654080104085140\n' + // IBAN
        'EUR' +
        Number.parseFloat(amount).toFixed(2) +
        '\n' + // Amount (format: EUR#.##)
        'CHAR\n' + // AT-44 purpose code (CHAR is for charity reasons)
        '\n' + // Creditor Reference
        reference +
        '\n' + // Statement Reference
        'Spende an Datenanfragen.de e. V.'
    ); // Information to the user
}

export function renderEpcrQr(canvas_element, amount, reference, light_color = null) {
    QRCode.toCanvas(canvas_element, epcrData(amount, reference), {
        errorCorrectionLevel: 'M',
        width: 256,
        height: 256,
        color: { light: light_color || '#f7fafc' },
    });
}

export function bezahlcodeData(amount, reference) {
    return (
        'bank://singlepaymentsepa?' +
        'name=' +
        encodeURIComponent('Datenanfragen.de e. V.') +
        '&iban=DE42830654080104085140' +
        '&bic=GENODEF1SLR' +
        '&amount=' +
        encodeURIComponent(Number.parseFloat(amount).toFixed(2).replace('.', ',')) +
        '&reason=' +
        encodeURIComponent(reference) +
        '&currency=EUR'
    );
}

export function renderBezahlcodeQr(canvas_element, amount, reference, light_color = null) {
    QRCode.toCanvas(canvas_element, bezahlcodeData(amount, reference), {
        errorCorrectionLevel: 'M',
        width: 256,
        height: 256,
        color: { light: light_color || '#f7fafc' },
    });
}
