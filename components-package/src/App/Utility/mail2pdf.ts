import PostalMime from 'postal-mime';
import type { EmailAddress } from '../../../../src/types/proceedings';
import { t_a } from './i18n';

type EmailInput = string | ArrayBuffer | ReadableStream;

const addressesToString = (addr?: Required<EmailAddress> | Array<Required<EmailAddress>>) =>
    addr === undefined
        ? ''
        : addr instanceof Array
        ? addr.map((a) => (a.name ? `"${a.name}" <${a.address}>` : a.address)).join(', ')
        : addr.name
        ? `"${addr.name}" <${addr.address}>`
        : addr.address;

/**
 * Render RFC 822 email data as a PDF in the browser
 *
 * @param mailInput The email in RFC 822 format to process. This can be a string, an ArrayBuffer or a ReadableStream which will then be read into an ArrayBuffer.
 *
 * @returns A Promise resolving to a Blob of the PDF.
 */
export const mail2pdf = async (mailInput: EmailInput): Promise<Blob> => {
    const parser = new PostalMime();

    // Read the stream into an ArrayBuffer, see https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#fetch_stream
    if (mailInput instanceof ReadableStream) mailInput = await new Response(mailInput).arrayBuffer();

    const mail = await parser.parse(mailInput);

    const html = template({
        subject: mail.subject,
        has_html_body: mail.html !== '',
        body: mail.html || mail.text,
        from: addressesToString(mail.from),
        date: mail.date,
        to: addressesToString(mail.to),
        cc: addressesToString(mail.cc),
        bcc: addressesToString(mail.bcc),
        attachments: mail.attachments
            .filter((a) => a.disposition === 'attachment')
            .map((a) => ({ ...a, filename: a.filename || '<unnamed>' })),
    });

    return window.email.htmlToPdf(html, mail.subject, mail.messageId);
};

type Mail2PdfTmeplateVars = {
    subject: string;
    has_html_body: boolean;
    body: string;
    from: string;
    date: string;
    to: string;
    cc: string;
    bcc: string;
    attachments: { filename: string }[];
};
const template = (vars: Mail2PdfTmeplateVars) => `<html>
<head>
    <title>${vars.subject}</title>
    <style>
        body {
            margin: 0;
            font-family: system-ui, sans-serif;
            font-size: 16px;
            line-height: 1.4;
            background-color: transparent !important;
        }

        * {
            /*
               Outlook inserts page: <something>; on certain elements which causes Chrome to push them onto a separate
               page. This rule disables this as the additional pages contain mostly unnecessary whitespace and Outlook
               doesn't even respect those rules itself when printing.
            */
            page: unset !important;
        }

        a {
            color: rgb(11, 108, 218);
        }

        #header {
            margin-bottom: 25px;
        }

        #attachments {
            margin: 0 15px 0 10px;
        }

        #attachments h2 {
            font-weight: normal;
            font-size: 9pt;
            border-bottom: 1px solid rgb(87, 87, 87);
            line-height: 0;
            margin: 10px -15px 15px -10px;
        }

        #attachments h2 span {
            background-color: #fff;
            margin-left: 10px;
        }

        table#attachments-table {
            width: 100%;
            border-collapse: collapse;
        }

        #attachments-table td:nth-of-type(2) {
            text-align: right;
        }

        table#attachments-table tr td {
            border-bottom: 1px solid rgb(87, 87, 87);
            padding: 5px 0;
        }

        table#attachments-table tr:last-child td {
            border: none;
        }

        ul.br-list {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .mono {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            font-size: 0.8em;
        }

        #body {
            white-space: pre-wrap;
        }
    </style>
    <meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src: none;">
</head>
<body>
    <div id="header">
        <ul class="br-list">
            <li><strong>${t_a('subject', 'mail2pdf')}:</strong> ${vars.subject}</li>
            ${vars.from ? `<li><strong>${t_a('from', 'mail2pdf')}:</strong> ${vars.from}</li>` : ''}
            ${vars.date ? `<li><strong>${t_a('date', 'mail2pdf')}:</strong> ${vars.date}</li>` : ''}
            ${vars.to ? `<li><strong>${t_a('to', 'mail2pdf')}:</strong> ${vars.to}</li>` : ''}
            ${vars.cc ? `<li><strong>${t_a('cc', 'mail2pdf')}:</strong> ${vars.cc}</li>` : ''}
            ${vars.bcc ? `<li><strong>${t_a('bcc', 'mail2pdf')}:</strong> ${vars.bcc}</li>` : ''}
        </ul>
    </div>
    <hr>
    ${!vars.has_html_body ? `<div id="body">${vars.body}</div>` : `<pre id="body" class="mono">${vars.body}</pre>`}
    <hr>
    ${
        vars.attachments && vars.attachments.length > 0
            ? `<div id="attachments">
            <h2><span>${t_a('subject', 'mail2pdf')}</span></h2>
            <table id="attachments-table">
                ${vars.attachments
                    .map(
                        (a) => `<tr>
                        <td>${a.filename}</td>
                    </tr>`
                    )
                    .join('\n')}
            </table>
        </div>`
            : ''
    }
</body>
</html>`;
