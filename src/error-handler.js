// Our email hoster Uberspace has a spam filter that cannot be disabled and that doesn't like JSON. We have had problems
// in the past with error reports being marked as spam and not being delivered to us. Thus, we employ this function to
// make our JSON look as little like JSON as possible.
function dejsonify(object) {
    // Taken from: https://stackoverflow.com/a/49042916
    const flatten = (obj, path = '') => {
        if (!(obj instanceof Object)) return { [path.replace(/\.$/g, '')]: obj };

        return Object.keys(obj).reduce((output, key) => {
            return obj instanceof Array
                ? { ...output, ...flatten(obj[key], path + '[' + key + '].') }
                : { ...output, ...flatten(obj[key], path + key + '.') };
        }, {});
    };
    return Object.entries(flatten(object))
        .map((e) => e.join(' := '))
        .join('\n');
}

function logError(event, debug_info = undefined) {
    /* eslint-disable no-console */
    console.group(
        '%cAn unexpected error occurred: ' + '%c' + (event?.error?.description || event?.error?.message || ''),
        'color: red; font-weight: bold; font-size: 1.5em;',
        'font-size: 1.5em;'
    );
    console.log(event);
    console.groupCollapsed(
        'Please submit reports via GitHub (https://github.com/datenanfragen/website/issues) or email (dev@datenanfragen.de) and copy the debug details below.'
    );
    console.log(JSON.stringify(debug_info || event));
    console.groupEnd();
    console.groupEnd();
    /* eslint-enable no-console */
}

function primitiveErrorModal(enduser_message, github_issue_url, mailto_url) {
    const dismiss = () => document.getElementById('error-modal') && document.getElementById('error-modal').remove();
    const html = `
<div id="error-modal" class="modal">
    <div class="backdrop" role="presentation" tabIndex="0"></div>
    <div class="inner">
        <button class="button-unstyled close-button icon-close" title="${
            I18N_DEFINITION['error-handler']['cancel']
        }"></button>

        ${enduser_message ? '<p id="error-modal-enduser-message"></p>' : ''}
        <p>${I18N_DEFINITION['error-handler']['explanation']}</p>
        <p>${I18N_DEFINITION['error-handler']['privacy']}</p>
        <a id="error-modal-github-link" class="button button-small" style="margin-right: 10px;" target="_blank" rel="noopener noreferrer">
            ${I18N_DEFINITION['error-handler']['report-on-github']}
        </a>
        <a id="error-modal-email-link" class="button button-small">
            ${I18N_DEFINITION['error-handler']['report-via-email']}
        </a>
    </div>
</div>`;

    // Using innerHTML is a little naughty but it is fine here, since we don't include anything that could possibly be
    // attacker-controlled. All that content is later added safely.
    document.body.innerHTML += html;
    if (enduser_message) document.getElementById('error-modal-enduser-message').innerText = enduser_message;
    document.getElementById('error-modal-github-link').href = github_issue_url;
    document.getElementById('error-modal-email-link').href = mailto_url;

    document.querySelector('#error-modal .backdrop').onclick = dismiss;
    document.querySelector('#error-modal .close-button').onclick = dismiss;
}

const flash_message_id = 'flash-message-error-online';
const button_id = 'button-flash-message-error-online';

const isNetworkError = (message) => {
    if (message === 'Network Error') return true;
    if (message === 'Failed to fetch') return true;
    if (message === 'NetworkError when attempting to fetch resource.') return true;
    return false;
};
try {
    const handler = (event) => {
        try {
            // Ignore errors triggered by browser extensions as those aren't caused by us and we can't do anything about
            // them (#656).
            if (
                [
                    'moz-extension://',
                    // `chrome-extension://` also applies to Chromium Edge, Opera, Vivaldi, Yandex.Browser, and Brave.
                    'chrome-extension://',
                    'safari-extension://',
                    'ms-browser-extension://',
                ].some((s) => event.error?.stack?.includes(s))
            ) {
                return;
            }

            if (event.error?.no_side_effects && isNetworkError(event.error.message)) {
                if (!window.navigator.onLine) {
                    // seems like we don't have a network connection in the first place
                    // --> show a little message to the user

                    // check if there is already a network message on screen
                    const existing_message = document.getElementById(flash_message_id);
                    if (existing_message?.dataset?.timeoutId) {
                        // clear the existing timeout, we will set it again
                        clearTimeout(existing_message.dataset.timeoutId);
                    } else if (!existing_message) {
                        const flash_message = `
<div class="flash-message flash-error" id="${flash_message_id}" data-timeout-id="">
<button id="${button_id}"
    class="button-unstyled close-button icon-close"
    title=${I18N_DEFINITION['generator']['cancel']}></button>
<div class="inner">${I18N_DEFINITION['error-handler']['no-internet']}</div>
</div>`;
                        document.getElementById('flash-messages').innerHTML += flash_message;
                        document.getElementById(button_id).onclick = () => {
                            const elem = document.getElementById(flash_message_id);
                            if (elem?.dataset?.timeoutId) {
                                clearTimeout(elem.dataset.timeoutId);
                            }
                            elem?.remove();
                        };
                    }
                    // the message should disappear automatically
                    const check_message = () => {
                        const message = document.getElementById(flash_message_id);
                        if (window.navigator.onLine) {
                            message?.remove();
                        } else {
                            const timeout_id = setTimeout(check_message, 5000);
                            message.dataset.timeoutId = timeout_id;
                        }
                    };
                    const timeout_id = setTimeout(check_message, 5000);
                    document.getElementById(flash_message_id).dataset.timeoutId = timeout_id;
                    return;
                }
            }
            // This is horrendous. It is however the easiest (and worryingly cleanest) way I see to achieve the intended result here as the (interesting) properties of the `Error` object are not enumerable and JSON.stringify() only encodes enumerable properties.
            const debug_info = JSON.parse(
                JSON.stringify(event, [
                    'code',
                    'message',
                    'description',
                    'arguments',
                    'type',
                    'name',
                    'colno',
                    'filename',
                    'lineno',
                    'error',
                    'stack',
                    'enduser_message',
                    'defaultPrevented',
                    'eventPhase',
                    'isTrusted',
                    'returnValue',
                ])
            );

            if (typeof debug_info.error !== 'object' || debug_info.error === null) {
                debug_info.error = { code: 999, message: event.message };
            }
            debug_info.code_version = CODE_VERSION;
            debug_info.user_agent = window.navigator.userAgent;
            debug_info.url = window.location;
            debug_info.error.context = event.error.context;

            logError(event, debug_info);

            const report_title = encodeURIComponent('JS error (' + event.message + ')');
            const reportBody = (debug_str) =>
                encodeURIComponent(
                    `[${I18N_DEFINITION['error-handler']['explain-context']}]\n\n**Debug information:**\n\n${debug_str}`
                );

            const github_issue_url = `https://github.com/datenanfragen/website/issues/new?title=${report_title}&body=${reportBody(
                '```js\n' + JSON.stringify(debug_info, null, 4) + '\n```'
            )}`;
            const mailto_url = `mailto:dev@datenanfragen.de?subject=${report_title}&body=${reportBody(
                dejsonify(debug_info)
            )}`;

            if (!debug_info.error.code || debug_info.error.code <= 3) {
                primitiveErrorModal(event.error.enduser_message, github_issue_url, mailto_url);
            }
        } catch (new_err) {
            logError(event);
        }
    };

    window.addEventListener('error', handler);
    window.addEventListener('unhandledrejection', (evt) => {
        // Promise rejections, for some reason, are passed the actual error as `evt.reason` instead of `evt.error` as
        // with 'regular' errors.
        evt.error = evt.reason;
        handler(evt);
    });
} catch (e) {
    window.addEventListener('unhandledrejection', logError);
    window.addEventListener('error', logError);
}
