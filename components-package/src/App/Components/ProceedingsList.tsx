import { RequestList } from '../../index';
import { IntlProvider, Text } from 'preact-i18n';

type ProceedingsListProps<PageId extends string> = {
    setPage: (newPage: PageId, params?: Record<string, string>) => void;
};
export const ProceedingsList = <PageId extends string>(props: ProceedingsListProps<PageId>) => (
    <IntlProvider definition={window.I18N_DEFINITION_APP} scope="proceedings">
        <header>
            <h1>
                <Text id="title" />
            </h1>
        </header>

        <RequestList
            emptyComponent={
                <div className="box box-info" style="width: 80%; margin: auto;">
                    <h2>
                        <Text id="no-requests-heading" />
                    </h2>
                    <Text id="no-requests" />
                    <br />

                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a
                        className="button button-primary"
                        href=""
                        style="float: right;"
                        onClick={(e) => {
                            e.preventDefault();
                            props.setPage('newRequests' as PageId);
                        }}>
                        <Text id="generate-request" />
                    </a>
                    <div className="clearfix" />
                </div>
            }
            onReact={(reference) => {
                props.setPage('reactor' as PageId, { reference });
            }}
        />
    </IntlProvider>
);
