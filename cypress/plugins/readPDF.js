/* eslint-disable no-console */

const fs = require('fs');
const pdf = require('pdf-parse');

const readPdf = (filename) => {
    /* eslint-disable no-console */
    console.log('reading PDF file %s', filename);
    /* eslint-disable no-console */

    const dataBuffer = fs.readFileSync(filename);

    return pdf(dataBuffer).then(function (data) {
        return {
            numpages: data.numpages,
            text: data.text,
        };
    });
};

module.exports = { readPdf };
