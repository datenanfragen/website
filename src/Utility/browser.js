// Returns `true` if canvas image extraction is blocked.
// Inspired by: https://estada.ch/2018/12/22/firefox-privacy-enhancement-renders-every-off-screen-canvas-white/
export function detectBlockedCanvasImageExtraction(ctx = undefined) {
    if (!ctx) {
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        ctx = c.getContext('2d');
    }
    const old_fs = ctx.fillStyle;

    const old_px = ctx.getImageData(0, 0, 1, 1).data;
    // I unfortunately can't seem to find a way to set the `fillStyle` to a value I can access directly. :(
    const old_px_color = ((old_px[0] << 16) | (old_px[1] << 8) | old_px[2]).toString(16);

    ctx.fillRect(0, 0, 1, 1);
    const px = ctx.getImageData(0, 0, 1, 1).data;

    // Restore the original pixel. This obviously won't work if extraction is actually blocked but in that case it
    // doesn't matter anyway.
    ctx.fillStyle = old_px_color;
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = old_fs;

    return px.reduce((acc, cur) => acc && cur === 255, true);
}

// Apparently, triggering a download in JavaScript is very hard
// inspired by: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
export function download(url, filename) {
    let element = document.createElement('a');
    element.setAttribute('href', url);
    if (filename) element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
