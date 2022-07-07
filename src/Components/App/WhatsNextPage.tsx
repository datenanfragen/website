import { IntlProvider, Text } from 'preact-i18n';
import { SetPageFunction } from './App';

type WhatsNextPageProps = {
    setPage: SetPageFunction;
};

export const WhatsNextPage = (props: WhatsNextPageProps) => {
    return (
        <IntlProvider definition={window.I18N_DEFINITION} scope="generator">
            <p>
                <Text id="whats-next-deadline" />
            </p>
            <p>
                <Text id="whats-next-my-requests" />
            </p>
            <button className="button button-secondary" onClick={() => alert('TODO')} style="margin-bottom: 10px;">
                <Text id="export-to-calendar" />
            </button>
            <br />
            <a className="button button-secondary" href={`${window.BASE_URL}my-requests`} style="margin-bottom: 10px;">
                <Text id="view-requests" />
            </a>
            <br />
            <button className="button button-secondary" onClick={() => props.setPage('request_type_chooser')}>
                <Text id="send-more" />
            </button>
        </IntlProvider>
    );
};
