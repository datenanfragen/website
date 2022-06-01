import QRCode from 'qrcode';

/**
 * Generates a EPCR data string for a bank transfer to convert into a qrcode.
 * @param amount The amount to transfer.
 * @param reference The bank transfer reference.
 */
export const epcrData = (amount: number, reference: string) =>
    'BCD\n' + // Service Code
    '002\n' + // Version
    '1\n' + // Encoding (1=UFT-8)
    'SCT\n' + // SEPA Credit Transfer
    'GENODEF1SLR\n' + // BIC
    'Datenanfragen.de e. V.\n' + // Recipient (up to 70 characters)
    'DE42830654080104085140\n' + // IBAN
    'EUR' +
    (amount || 0).toFixed(2) +
    '\n' + // Amount (format: EUR#.##)
    'CHAR\n' + // AT-44 purpose code (CHAR is for charity reasons)
    '\n' + // Creditor Reference
    reference +
    '\n' + // Statement Reference
    'Spende an Datenanfragen.de e. V.'; // Information to the user

export const renderEpcrQr = (
    canvas_element: HTMLCanvasElement,
    amount: number,
    reference: string,
    light_color?: string
) =>
    QRCode.toCanvas(canvas_element, epcrData(amount, reference), {
        errorCorrectionLevel: 'M',
        width: 256,
        color: { light: light_color || '#f7fafc' },
    });

/**
 * Generates a bezahlcode data string for a bank transfer to convert into a qrcode.
 * @param amount The amount to transfer.
 * @param reference The bank transfer reference.
 */
export const bezahlcodeData = (amount: number, reference: string) =>
    'bank://singlepaymentsepa?' +
    'name=' +
    encodeURIComponent('Datenanfragen.de e. V.') +
    '&iban=DE42830654080104085140' +
    '&bic=GENODEF1SLR' +
    '&amount=' +
    encodeURIComponent((amount || 0).toFixed(2).replace('.', ',')) +
    '&reason=' +
    encodeURIComponent(reference) +
    '&currency=EUR';

export const renderBezahlcodeQr = (
    canvas_element: HTMLCanvasElement,
    amount: number,
    reference: string,
    light_color?: string
) =>
    QRCode.toCanvas(canvas_element, bezahlcodeData(amount, reference), {
        errorCorrectionLevel: 'M',
        width: 256,
        color: { light: light_color || '#f7fafc' },
    });
