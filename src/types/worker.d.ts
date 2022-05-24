declare module '*.worker.ts' {
    export default class PdfWorker extends Worker {
        constructor();
    }
}
