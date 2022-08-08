import { render } from 'preact';
import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import t from './Utility/i18n';
import { RequestList } from './Components/RequestList';

(window as typeof window & { renderMyRequestsWidget: () => void }).renderMyRequestsWidget = function () {
    const my_requests_div = document.getElementById('my-requests');
    if (my_requests_div)
        render(
            <IntlProvider scope="my-requests" definition={window.I18N_DEFINITION}>
                <main>
                    <div>
                        <p>
                            <MarkupText id="explanation" />
                        </p>
                        <p>
                            <MarkupText id="explanation-saving" />
                        </p>
                        <RequestList
                            emptyComponent={
                                <div className="box box-info" style="width: 80%; margin: auto;">
                                    <h2>
                                        <Text id="no-requests-heading" />
                                    </h2>
                                    <img
                                        alt={t('no-requests-heading', 'my-requests')}
                                        style="display: block; margin: 20px auto; width: 40%;"
                                        src="/img/humaaans/empty.svg"
                                    />
                                    <Text id="no-requests" />
                                    <br />

                                    <a
                                        className="button button-primary"
                                        href={`${window.BASE_URL}generator`}
                                        style="float: right;">
                                        <Text id="generate-request" />
                                    </a>
                                    <div className="clearfix" />
                                </div>
                            }
                        />
                        <div className="clearfix" />
                    </div>
                </main>
            </IntlProvider>,
            my_requests_div.parentElement!,
            my_requests_div
        );
};
