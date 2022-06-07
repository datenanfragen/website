import fs from 'fs';

export const makePdfWorker = () =>
    new Worker(URL.createObjectURL(new Blob([fs.readFileSync(__dirname + '/../generated/pdf.worker.js', 'utf8')])));
