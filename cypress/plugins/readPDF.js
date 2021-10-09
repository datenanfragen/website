const fs = require('fs');
const pdf = require('pdf-parse');

const readPdf = (filename) => {
    /* eslint-disable no-console */
    console.log('reading PDF file %s', filename);
    const dataBuffer = fs.readFileSync(filename);

    return pdf(dataBuffer).then(function (data) {
        return {
            numpages: data.numpages,
            text: data.text,
        };
    });
    /* eslint-disable no-console */
};

module.exports = { readPdf };
