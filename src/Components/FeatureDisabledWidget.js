import { Component } from 'preact';
import t from 'Utility/i18n';
import PropTypes from 'prop-types';

export default class FeatureDisabledWidget extends Component {
    render() {
        return (
            <div className="box box-warning">
                {this.props.includeImage ? (
                    <img
                        alt={t('feature-disabled-alt', 'privacy-controls')}
                        style="display: block; margin: 0 auto 40px auto; width: 200px; max-width: 30%;"
                        src="/card-icons/warning.svg"
                    />
                ) : (
                    []
                )}

                <div style="text-align: center;">
                    {this.props.children?.length > 0 ? (
                        this.props.children
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: t('feature-disabled', 'privacy-controls') }} />
                    )}
                </div>
            </div>
        );
    }

    static get defaultProps() {
        return {
            includeImage: true,
        };
    }

    static propTypes = {
        children: PropTypes.node,
        includeImage: PropTypes.bool,
    };
}
