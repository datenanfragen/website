import preact from 'preact';
import t from 'Utility/i18n';
import Radio from './Radio';

export default class RequestTypeChooser extends preact.Component {
    render() {
        return (
            <div className="request-type-chooser">
                {t('request-type', 'generator')}
                <br />
                <div className="radio-group radio-group-vertical">
                    <Radio
                        id="request-type-choice-access"
                        radio_variable={this.props.current}
                        value="access"
                        name="request-type"
                        onChange={this.props.onTypeChange}
                        label={t('access-request', 'generator')}
                    />
                    <Radio
                        id="request-type-choice-erasure"
                        radio_variable={this.props.current}
                        value="erasure"
                        name="request-type"
                        onChange={this.props.onTypeChange}
                        label={t('erasure-request', 'generator')}
                    />
                    <Radio
                        id="request-type-choice-rectification"
                        radio_variable={this.props.current}
                        value="rectification"
                        name="request-type"
                        onChange={this.props.onTypeChange}
                        label={t('rectification-request', 'generator')}
                    />
                    <Radio
                        id="request-type-choice-custom"
                        radio_variable={this.props.current}
                        value="custom"
                        name="request-type"
                        onChange={this.props.onTypeChange}
                        label={t('own-request', 'generator')}
                    />
                </div>
            </div>
        );
    }
}
