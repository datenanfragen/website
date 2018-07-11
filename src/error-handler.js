function logError(event) {
    console.log('%cAn unexpected error occurred:', 'color: red; font-weight: bold;', event, 'Please submit reports via GitHub (https://github.com/datenanfragen/website/issues) or email (dev@datenanfragen.de).');
}

let debugging_enabled = false;
try {
    let cookie = require('js-cookie/src/js.cookie');
    debugging_enabled = !!cookie.get('debugging_enabled');
}
catch(e) {}

try {
    let preact = require('preact');
    let Modal = require('Components/Modal').default;
    let t  = require('Utility/i18n').default;

    window.addEventListener('error', event => {
        logError(event);

        // This is horrendous. It is however the easiest (and worryingly cleanest) way I see to achieve the intended result here as the (interesting) properties of the `Error` object are not enumerable and JSON.stringify() only encodes enumerable properties.
        let debug_info = JSON.parse(JSON.stringify(event, [ 'code', 'message', 'description', 'arguments', 'type', 'name', 'colno', 'filename', 'lineno', 'error', 'stack' ]));
        debug_info.error.context = event.error.context;

        let report_title = encodeURIComponent('JS error (' + event.message + ')');
        let report_body = encodeURIComponent('[' + t('explain-context', 'error-handler') + ']\n\n**Debug information:**\n\n```\n' + JSON.stringify(debug_info, null, '    ') + '\n```');

        let github_issue_url = 'https://github.com/datenanfragen/website/issues/new?title=' + report_title + '&body=' + report_body;
        let mailto_url = 'mailto:dev@datenanfragen.de?' + 'subject=' + report_title + '&body=' + report_body;

        if(event.error.code <= 3 || debugging_enabled) {
            let dismiss = () => { preact.render('', document.body, modal) };
            let modal = preact.render((
                <Modal onDismiss={dismiss}>
                    <p>{t('explanation', 'error-handler')}</p>
                    <a href={github_issue_url} className="button button-small" style="margin-right: 10px;" target="_blank">{t('report-on-github', 'error-handler')}</a>
                    <a href={mailto_url} className="button button-small">{t('report-via-email', 'error-handler')}</a>
                </Modal>), document.body);
        }
    });
}
catch(e) {
    window.addEventListener('error', logError);
}
