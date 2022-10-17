import { parseBcp47Tag, fallback_countries, isSupportedCountry } from './common';
import type { LiteralUnion } from 'type-fest';
import type { Country } from '../store/app';
import type { I18nLanguage } from '../types/globals.d';

export const clearUrlParameters = () => {
    window.history.pushState({}, document.title, `${window.location.origin}${window.location.pathname}`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.PARAMETERS = {};
};

/**
 * Check whether canvas image extraction is blocked (usually because the user is either the Tor Browser or has
 * `privacy.resistFingerprinting` turned on in Firefox).
 *
 * If the extraction is in fact blocked, the browser will return white for any pixel of the canvas. We can use this to
 * do a little experiment: We paint one pixel of the canvas in any color and then try to extract the value. If it white,
 * extraction is blocked, otherwise it is not.
 * Inspired by: https://estada.ch/2018/12/22/firefox-privacy-enhancement-renders-every-off-screen-canvas-white/
 *
 * @param ctx A canvas context if we already have one. Otherwise, we will just create one on the fly.
 * @returns true if canvas extraction is blocked, false otherwise
 */
export const detectBlockedCanvasImageExtraction = (ctx = null as CanvasRenderingContext2D | null) => {
    if (!ctx) {
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        ctx = c.getContext('2d')!;
    }

    // For the test, we need to set the `fillStyle`. As this setting is persisted for the context (which may be used
    // elsewhere), we need to remember the old value.
    const old_fs = ctx.fillStyle;
    // We also need to remember the previous data at the pixel we will override. To make sure we don't run into any
    // compression issues, we remember a little more than a single pixel.
    const old_data = ctx.getImageData(0, 0, 5, 5);

    // Paint a single pixel at (0, 0) and immediately try to extract it back.
    // If canvas extraction is blocked, it will return white for any pixel, so we need to choose any color other than
    // white for this experiment. A nice pink should do the trick.
    ctx.fillStyle = '#d53f8c';
    ctx.fillRect(0, 0, 1, 1);
    const px = ctx.getImageData(0, 0, 1, 1).data;

    // Restore the original pixel. This obviously won't work if extraction is actually blocked but in that case it
    // doesn't matter anyway.
    ctx.putImageData(old_data, 0, 0);
    ctx.fillStyle = old_fs;

    // Check if the tested pixel is white (i.e. all channels are 255)—in that case extraction is blocked.
    return px.reduce((acc, cur) => acc && cur === 255, true);
};

// Inspired by: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
export const download = (url: string, filename: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', url);
    if (filename) element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};

// Adapted after: https://stackoverflow.com/a/133997
export const clientPost = (
    url: string,
    params: Record<string, string>,
    target: LiteralUnion<'_blank' | '_self' | '_parent' | '_top', string>
) => {
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', url);
    form.setAttribute('target', target || '_parent');

    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            const hidden_field = document.createElement('input');
            hidden_field.setAttribute('type', 'hidden');
            hidden_field.setAttribute('name', key);
            hidden_field.setAttribute('value', params[key]);

            form.appendChild(hidden_field);
        }
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
};

// This uses the `navigator.language` property (similar-ish to the `Accept-Language` header which we cannot access from
// JS) which may not necessarily represent the user's country (or even include region information at all).
// The more reliable way would be to feed the user's IP into a geolocation service but that is not an option, so we have
// to stick with this.
export const guessUserCountry = (locale: I18nLanguage): Country => {
    const { country } = parseBcp47Tag(navigator.language);

    // If we cannot guess the user's country, it makes sense to fallback to the language.
    if (!navigator.language || !country) return fallback_countries[locale];

    // If however we *can* guess the country but just don't support it, we show all companies.
    return isSupportedCountry(country) ? country : 'all';
};
