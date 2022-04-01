import type { ComponentChildren } from 'preact';
import { MarkupText, IntlProvider } from 'preact-i18n';
import t from '../Utility/i18n';

type FeatureDisabledWidgetProps = {
    includeImage?: boolean;
    children?: ComponentChildren;
};

export const FeatureDisabledWidget = (props: FeatureDisabledWidgetProps) => (
    <div className="box box-warning">
        {(props.includeImage || props.includeImage === undefined) && (
            <img
                alt={t('feature-disabled-alt', 'privacy-controls')}
                style="display: block; margin: 0 auto 40px auto; width: 200px; max-width: 30%;"
                src="/card-icons/warning.svg"
            />
        )}

        <div style="text-align: center;">
            {props.children || (
                <IntlProvider definition={window.I18N_DEFINITION} scope="privacy-controls">
                    <MarkupText id="feature-disabled" />
                </IntlProvider>
            )}
        </div>
    </div>
);
