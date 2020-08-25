function logError(event) {
    /* eslint-disable no-console */
    console.log(
        '%cAn unexpected error occurred:',
        'color: red; font-weight: bold;',
        event,
        'Please submit reports via GitHub (https://github.com/datenanfragen/website/issues) or email (dev@datenanfragen.de).'
    );
    /* eslint-enable no-console */
}

try {
    const preact = require('preact');
    const Modal = require('Components/Modal').default;
    const t = require('Utility/i18n').default;

    const handler = (event) => {
        logError(event);

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

        const report_title = encodeURIComponent('JS error (' + event.message + ')');
        const report_body = encodeURIComponent(
            '[' +
                t('explain-context', 'error-handler') +
                ']\n\n**Debug information:**\n\n```js\n' +
                JSON.stringify(debug_info, null, '    ') +
                '\n```'
        );

        const github_issue_url =
            'https://github.com/datenanfragen/website/issues/new?title=' + report_title + '&body=' + report_body;
        const mailto_url = 'mailto:dev@datenanfragen.de?' + 'subject=' + report_title + '&body=' + report_body;

        if (!debug_info.error.code || debug_info.error.code <= 3) {
            const dismiss = () => {
                preact.render('', document.body, modal);
            };
            const modal = preact.render(
                <Modal onDismiss={dismiss}>
                    {event.error.enduser_message ? <p>{event.error.enduser_message}</p> : ''}
                    <p>{t('explanation', 'error-handler')}</p>
                    <p dangerouslySetInnerHTML={{ __html: t('privacy', 'error-handler') }} />
                    <a
                        href={github_issue_url}
                        className="button button-small"
                        style="margin-right: 10px;"
                        target="_blank"
                        rel="noopener noreferrer">
                        {t('report-on-github', 'error-handler')}
                    </a>
                    <a href={mailto_url} className="button button-small">
                        {t('report-via-email', 'error-handler')}
                    </a>
                </Modal>,
                document.body
            );
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
