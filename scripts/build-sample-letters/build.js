const path = require('path');
const util = require('util');
const fs = require('fs');
const deepmerge = require('deepmerge');
const matcher = require('matcher');
const carbone = require('carbone');
const renderCarbone = util.promisify(carbone.render).bind(carbone);
const PDFDocument = require('pdfkit');
const { templatify, mm2pt } = require('./util');

// This script generates the sample letters in the various formats from our request templates and update the
// corresponding blog post, which was previously done manually (and a source of great pain and suffering).

// It would be great to move the template translations into Weblate, have that be the single source of truth for our
// templates and then have everything else be generated by this script. Unfortunately, that is not possible right now as
// there is a license mismatch between the templates (CC0) and the other translations (MIT).
// As such, the templates are unfortunately still duplicated in the `data` repository and cannot be translated easily
// yet.

// Should we ever find a way to move these translations to Weblate, we need to remember that the translations here are
// currently *NOT* an exact copy of the templates in `data`. Some line breaks are different.

const languages = fs
    .readdirSync(path.join(__dirname, '..', '..', 'content'), { withFileTypes: true })
    .filter((i) => i.isDirectory())
    .map((d) => d.name);

const _i18n = require('./res/i18n.json');
const i18n = languages.reduce((acc, l) => ({ ...acc, [l]: deepmerge(_i18n.en, _i18n[l] || {}) }), {});

const _t = (lang, key) =>
    key.includes('*')
        ? matcher(Object.keys(i18n[lang]), [key])
              .sort()
              .map((k) => i18n[lang][k])
        : i18n[lang][key];

// At the moment, the `regular_template()` function seems quite pointless as all templatees are regular templates right
// now. However, if we manage to have this be the single source of truth for our templates one day (see above), we will
// also have other template types. For example, `access-tracking` is mostly a copy of the `access-default` template with
// only a few changes.
// With that, we would be able to avoid having to duplicate the entire template in the translations (as it is sadly the
// case right now) and could instead define a custom template that only replaces the respective lines but inherits the
// rest from `access-default`.
const regular_template = (t, type) => ({
    subject: t(`${type}-subject`),
    body: [
        t('common-body-salutation'),
        ...t(`${type}-body-*`),
        t('common-body-id-data'),
        t('common-body-deadline'),
        t('common-body-thanks'),
        t('common-body-bye'),
    ],
    doc_title: t(`${type}-doc-title`),
    filename: t(`${type}-filename`),
});
const templates = (t) => ({
    common: {
        explanation: t('sample-explanation'),
        sender_address: t('sample-sender-address'),
        recipient_address: t('sample-recipient-address'),
        reference_line: t('sample-reference-line'),
        date_line: t('sample-date-line'),
        your_name: t('sample-your-name'),
        page: t('page'),
        of: t('of'),

        variables: {
            id_data: t('common-var-id-data'),
            rectification_data: t('rectification-var-rectification-data'),
            erasure_data: t('erasure-var-erasure-data'),
        },

        doc_title: t('common-doc-title'),
        doc_desc: t('common-doc-desc'),
    },

    access: regular_template(t, 'access'),
    erasure: regular_template(t, 'erasure'),
    objection: regular_template(t, 'objection'),
    rectification: regular_template(t, 'rectification'),
});
const flags = { runs: 0, has_fields: 1, data_portability: 2, erase_all: 2, erase_some: 2 };

const out_dir = path.join(__dirname, '..', '..', 'static', 'downloads');

(async () => {
    carbone.set({ templatePath: path.join(__dirname, 'res') });

    // TODO: Replace this with `languages` once we have the translations for all languages here.
    for (const lang of ['de', 'en']) {
        const t = (key) => _t(lang, key);
        const common_template = templates(t).common;

        for (const type of ['access', 'erasure', 'objection', 'rectification']) {
            const specific_template = templates(t)[type];
            const data = {
                ...common_template,
                ...specific_template,
                // I have not found a way to directly insert string array items, so we map them to objects with a string
                // property. *shrug*
                body: specific_template.body
                    .map((p) => templatify(p, flags, common_template.variables))
                    .map((p) => ({ text: p.trim() })),
            };
            const text = data.body.map((p) => p.text);

            // Build OTT and DOTX.
            for (const format of ['ott', 'dotx']) {
                const file = await renderCarbone(`template.${format}`, data, {
                    // Carbone doesn't officially support the template format variants, so we pretend that we're using
                    // ODT and DOCX instead of OTT and DOTX, respectively. From what I have seen, this seems to only be
                    // relevant for proper line breaks.
                    extension: format === 'dotx' ? 'docx' : 'odt',
                });
                fs.writeFileSync(path.join(out_dir, `${data.filename}.${format}`), file);
            }

            // Build PDF.
            // There is an unfortunate amount of code similar to what we do in letter-generator here but as pdfmake
            // doesn't support forms yet, there isn't much we can do about that.
            const pdf = new PDFDocument({
                layout: 'portrait',
                size: 'A4',
                margins: { left: mm2pt(25), top: mm2pt(27), right: mm2pt(20), bottom: mm2pt(16.9) },
                bufferPages: true,
            });
            pdf.initForm();
            pdf.info.Title = data.subject;
            pdf.info.Subject = data.subject;
            pdf.info.Author = 'Datenanfragen.de e. V.';
            const field_bg = '#e0edf8';

            pdf.fontSize(6);
            pdf.formText('field-sender-address', mm2pt(25), mm2pt(30), mm2pt(85), 8, {
                value: data.sender_address.replace(/{(.+)}/, '$1'),
                backgroundColor: field_bg,
            });

            pdf.fontSize(12);

            pdf.formText('field-recipient-address', mm2pt(25), mm2pt(35), mm2pt(85), mm2pt(40), {
                value: data.recipient_address.replace(/{(.+)}/, '$1'),
                multiline: true,
                backgroundColor: field_bg,
            });

            pdf.formText('field-information-block', mm2pt(210 - 85), mm2pt(32), mm2pt(75), mm2pt(40), {
                value: `${data.reference_line}\n${data.date_line}`,
                multiline: true,
                backgroundColor: field_bg,
            });

            pdf.font('Helvetica-Bold').text(data.subject, mm2pt(25), mm2pt(85));
            pdf.moveDown();

            let field_no = 0; // This is not great for a11y but currently I don't have a better way to name the fields.
            pdf.font('Helvetica');
            const printTextField = (value, x, height = undefined, multiline = true, name = undefined) => {
                const field_height = height || pdf.currentLineHeight(true) * 7;
                const field_width = pdf.page.width - x - pdf.page.margins.right;
                if (pdf.y + field_height > pdf.page.height - pdf.page.margins.bottom) pdf.addPage();

                pdf.formText(name || 'field-' + field_no++, x, pdf.y, field_width, field_height, {
                    value,
                    multiline: multiline,
                    backgroundColor: field_bg,
                });

                pdf.y += field_height;
            };
            const printText = (text, x, y) => {
                if (!x) x = pdf.x;
                if (!y) y = pdf.y;

                if (text.startsWith('[')) {
                    // TODO: Can we set a default value for this/do we want to?
                    pdf.formCheckbox('field-' + field_no++, x, pdf.y - 2, mm2pt(5), mm2pt(5), {
                        backgroundColor: field_bg,
                    });
                    printText(text.replace(/\[|]/g, ''), x + mm2pt(8), pdf.y);
                    pdf.x = x;
                } else if (text.includes('{')) {
                    // TODO: This only works if the field is at the end of the paragraph which is currently always the
                    // case.
                    const value = text.match(/{(.+)}/)[1];
                    printText(text.replace(/{(.+)}/, ''), x, pdf.y);

                    printTextField(value, x);
                } else pdf.text(text, x, pdf.y);

                pdf.moveDown();
            };
            for (const paragraph of text) printText(paragraph);
            pdf.moveDown(2);
            printTextField(
                data.your_name.replace(/{(.+)}/, '$1'),
                pdf.x,
                pdf.currentLineHeight(true),
                false,
                'field-your-name'
            );

            const page_range = pdf.bufferedPageRange();
            for (let i = page_range.start; i < page_range.count; i++) {
                pdf.switchToPage(i);
                pdf.moveTo(0, mm2pt(87)).lineTo(mm2pt(8), mm2pt(87)).stroke();
                pdf.moveTo(0, mm2pt(192)).lineTo(mm2pt(8), mm2pt(192)).stroke();
                pdf.moveTo(0, mm2pt(148.5)).lineTo(mm2pt(10), mm2pt(148.5)).stroke();
            }

            pdf.pipe(fs.createWriteStream(path.join(out_dir, `${data.filename}.pdf`)));
            pdf.end();

            // Build TXT.
            const txt_text = `${'='.repeat(data.subject.length)}
${data.subject}
${'='.repeat(data.subject.length)}

${data.explanation}

---

${text.join('\n\n')}
${data.your_name}`;
            fs.writeFileSync(path.join(out_dir, `${data.filename}.txt`), txt_text);

            // Update blog post.
            const post_text = [...text, data.your_name]
                .map((l) => l.replace(/{(.+)}/, '<span class="blog-letter-fill-in">$1</span>').replace(/\n/g, '<br>\n'))
                .map((l) => `<p>${l}</p>`)
                .join('\n\n');
            const post_slug = `sample-letter-gdpr-${
                type === 'objection' ? 'direct-marketing-objection' : `${type}-request`
            }`;
            const post_path = path.join(__dirname, '..', '..', 'content', lang, 'blog', post_slug, 'index.md');
            const old_text = fs.readFileSync(post_path).toString();
            const new_text = old_text.replace(
                /<div class="blog-letter">[\S\s]+?<\/div>/,
                `<div class="blog-letter">
${post_text}
</div>`
            );
            fs.writeFileSync(post_path, new_text);
        }
    }
})();
