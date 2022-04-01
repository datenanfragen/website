declare module '*.worker.ts' {
    class PdfWorker extends Worker {
        constructor();
    }

    export default PdfWorker;
}
