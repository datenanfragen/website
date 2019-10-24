import preact from 'preact';
import t from 'Utility/i18n';
import Radio from '../Radio';

const VALID_REQUEST_TYPES = ['access', 'erasure', 'rectification', 'objection', 'custom'];

export default class RequestTypeChooser extends preact.Component {
    render() {
        const request_types = this.props.request_types.filter(type => VALID_REQUEST_TYPES.includes(type));
        const current = this.props.current || request_types[0];
        const radios = request_types.map(type => (
            <Radio
                id={'request-type-choice-' + type}
                radio_variable={current}
                value={type}
                name="request-type"
                onChange={this.props.onTypeChange}
                label={t(type + '-request', 'generator')}
            />
        ));

        return (
            <div className="request-type-chooser">
                {t('request-type', 'generator')}
                <br />
                <div
                    className={
                        'radio-group' + (request_types.length > 2 ? ' radio-group-vertical' : 'radio-group-horizontal')
                    }>
                    {radios}
                </div>
            </div>
        );
    }

    static get defaultProps() {
        return {
            current: null,
            request_types: VALID_REQUEST_TYPES
        };
    }
}
