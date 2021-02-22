import { Component } from 'preact';
import { Text, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import PropTypes from 'prop-types';

export default class DynamicInput extends Component {
    constructor(props) {
        super(props);
        this.state = { focus: false };
    }

    shouldComponentUpdate(nextProps) {
        return !this.state.focus && nextProps !== this.props;
    }

    render() {
        let input;
        let control = '';
        switch (this.props.type) {
            case 'address':
                input = (
                    <AddressControl
                        key={this.props.id + this.props.suffix}
                        id={this.props.id}
                        suffix={this.props.suffix}
                        required={!this.props.optional}
                        onChange={this.props.onChange}
                        value={this.props.value}
                        // The controls usually automatically add a label if they know their description. If changing
                        // the description is not allowed, though, a label is already set simply by the description
                        // text. In that case, we obviously don't want to generate a second label.
                        suppressLabel={this.props.allowChangingDescription}
                    />
                );
                if (this.props.hasPrimary)
                    control = (
                        <div className="col50">
                            <button
                                id={this.props.id + '-primaryButton'}
                                name="primary_button"
                                rel={this.props.id}
                                className="button button-secondary dynamic-input-primaryButton"
                                data-isprimary={this.props.value['primary']}
                                onClick={this.props.onPrimaryChange}>
                                <Text id="primary-address" />
                            </button>
                        </div>
                    );
                break;
            case 'textarea':
                input = (
                    <TextareaControl
                        key={this.props.id + this.props.suffix}
                        id={this.props.id}
                        suffix={this.props.suffix}
                        required={!this.props.optional}
                        onChange={this.props.onChange}
                        value={this.props.value}
                        suppressLabel={this.props.allowChangingDescription}
                    />
                );
                break;
            case 'birthdate':
                input = (
                    <DateControl
                        key={this.props.id + this.props.suffix}
                        id={this.props.id}
                        suffix={this.props.suffix}
                        required={!this.props.optional}
                        onChange={this.props.onChange}
                        value={this.props.value}
                        suppressLabel={this.props.allowChangingDescription}
                    />
                );
                break;
            case 'name':
            case 'input':
            default:
                input = (
                    <InputControl
                        key={this.props.id + this.props.suffix}
                        id={this.props.id}
                        suffix={this.props.suffix}
                        required={!this.props.optional}
                        onChange={this.props.onChange}
                        value={this.props.value}
                        suppressLabel={this.props.allowChangingDescription}
                    />
                );
                break;
        }
        return (
            <IntlProvider scope="generator" definition={I18N_DEFINITION}>
                <div
                    className={'dynamic-input dynamic-input-' + this.props.type}
                    id={'dynamic-input-' + this.props.id + '-' + this.props.suffix}>
                    <div className="col40">
                        <div className="form-group" style="width: 100%; display: table;">
                            {this.props.allowRemoving ? (
                                <div style="display: table-cell; width: 27px;">
                                    <button
                                        id={this.props.id + '-delete-' + this.props.suffix}
                                        rel={this.props.id}
                                        className="dynamic-input-delete button button-secondary button-small icon-trash"
                                        onClick={this.props.removeHandler}
                                        title={t('delete-field', 'generator')}
                                    />
                                </div>
                            ) : (
                                []
                            )}
                            <div style="display: table-cell;">
                                {this.props.allowChangingDescription ? (
                                    [
                                        <label
                                            htmlFor={this.props.id + '-desc-' + this.props.suffix}
                                            className="sr-only">
                                            <Text id="description" />
                                        </label>,
                                        <input
                                            key={this.props.id + this.props.suffix}
                                            name="desc"
                                            type="text"
                                            id={this.props.id + '-desc-' + this.props.suffix}
                                            rel={this.props.id}
                                            className="form-element"
                                            value={this.props.desc}
                                            placeholder={t('description', 'generator')}
                                            style="margin-left: 5px;"
                                            required={!this.props.optional}
                                            onChange={this.props.onChange}
                                            onFocus={(e) => {
                                                this.setState({ focus: true });
                                            }}
                                            onBlur={(e) => {
                                                this.setState({ focus: false });
                                            }}
                                        />,
                                    ]
                                ) : (
                                    <label htmlFor={this.props.id + '-value-' + this.props.suffix}>
                                        {this.props.desc}
                                    </label>
                                )}
                            </div>
                        </div>
                        {control}
                    </div>
                    <div className="col60">
                        <div
                            style="padding-left: 10px;"
                            className={'form-group' + (this.props.onAction ? ' action-button-container' : '')}>
                            {input}
                            {this.props.onAction ? (
                                <button
                                    id={this.props.id + '-action-' + this.props.suffix}
                                    rel={this.props.id}
                                    className="dynamic-input-action button button-primary button-small icon-arrow-right"
                                    onClick={this.props.onAction}
                                />
                            ) : (
                                []
                            )}
                        </div>
                    </div>
                    <div className="clearfix" />
                </div>
            </IntlProvider>
        );
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        suffix: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['input', 'textarea', 'email', 'address', 'name', 'birthdate']),
        desc: PropTypes.string,

        optional: PropTypes.bool,
        hasPrimary: PropTypes.bool,
        allowRemoving: PropTypes.bool,
        allowChangingDescription: PropTypes.bool,

        value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
        onChange: PropTypes.func.isRequired,
        onAction: PropTypes.func,
        onPrimaryChange: PropTypes.func.isRequired,
        removeHandler: PropTypes.func,
    };
}

export class TextareaControl extends Component {
    constructor(props) {
        super(props);
        this.state = { focus: false };
    }

    shouldComponentUpdate(nextProps) {
        return !this.state.focus && nextProps !== this.props;
    }

    render() {
        return (
            <div className="form-group">
                {!this.props.suppressLabel && this.props.desc ? (
                    <label for={this.props.id + '-value-' + this.props.suffix} className="sr-only">
                        {this.props.desc}
                    </label>
                ) : (
                    ''
                )}

                <textarea
                    key={this.props.id + this.props.suffix}
                    name="value"
                    id={this.props.id + this.props.suffix}
                    rel={this.props.id}
                    className="form-element"
                    placeholder={t('value', 'generator')}
                    required={this.props.required}
                    onChange={this.props.onChange}
                    onFocus={(e) => {
                        this.setState({ focus: true });
                    }}
                    onBlur={(e) => {
                        this.setState({ focus: false });
                    }}
                    value={this.props.value}
                />
            </div>
        );
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        suffix: PropTypes.string.isRequired,

        suppressLabel: PropTypes.bool,
        desc: PropTypes.string,

        required: PropTypes.bool,

        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    };
}

export class InputControl extends Component {
    constructor(props) {
        super(props);
        this.state = { focus: false };
    }

    shouldComponentUpdate(nextProps) {
        return !this.state.focus && nextProps !== this.props;
    }

    render() {
        return (
            <div className="form-group">
                {!this.props.suppressLabel && this.props.desc ? (
                    <label htmlFor={this.props.id + '-value-' + this.props.suffix} className="sr-only">
                        {this.props.desc}
                    </label>
                ) : (
                    ''
                )}
                <input
                    key={this.props.id + this.props.suffix}
                    name="value"
                    type="text"
                    id={this.props.id + '-value-' + this.props.suffix}
                    rel={this.props.id}
                    className="form-element"
                    placeholder={t('value', 'generator')}
                    required={this.props.required}
                    onChange={this.props.onChange}
                    onFocus={(e) => {
                        this.setState({ focus: true });
                    }}
                    onBlur={(e) => {
                        this.setState({ focus: false });
                    }}
                    value={this.props.value}
                />
            </div>
        );
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        suffix: PropTypes.string,

        suppressLabel: PropTypes.bool,
        desc: PropTypes.string,

        required: PropTypes.bool,

        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    };
}

export class DateControl extends Component {
    constructor(props) {
        super(props);
        this.state = { focus: false };
    }

    shouldComponentUpdate(nextProps) {
        return !this.state.focus && nextProps !== this.props;
    }

    render() {
        return (
            <div className="form-group">
                {!this.props.suppressLabel && this.props.desc ? (
                    <label htmlFor={this.props.id + '-value-' + this.props.suffix} className="sr-only">
                        {this.props.desc}
                    </label>
                ) : (
                    []
                )}
                <input
                    key={this.props.id + this.props.suffix}
                    name="value"
                    type="date"
                    id={this.props.id + '-value-' + this.props.suffix}
                    rel={this.props.id}
                    className="form-element"
                    placeholder={t('value', 'generator')}
                    required={this.props.required}
                    onChange={this.props.onChange}
                    onFocus={(e) => {
                        this.setState({ focus: true });
                    }}
                    onBlur={(e) => {
                        this.setState({ focus: false });
                    }}
                    value={this.props.value}
                />
            </div>
        );
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        suffix: PropTypes.string,

        suppressLabel: PropTypes.bool,
        desc: PropTypes.string,

        required: PropTypes.bool,

        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    };
}

export class AddressControl extends Component {
    constructor(props) {
        super(props);
        this.state = { focus: false };
    }

    shouldComponentUpdate(nextProps) {
        return !this.state.focus && nextProps !== this.props;
    }

    render() {
        return (
            <div id={this.props.id + '-container-' + this.props.suffix}>
                <div className="form-group fancy-fg">
                    <input
                        key={this.props.id + '-street_1-' + this.props.suffix}
                        name="street_1"
                        rel={this.props.id}
                        type="text"
                        id={this.props.id + '-street_1-' + this.props.suffix}
                        placeholder={t('address-line-1', 'generator')}
                        className="form-element"
                        required={this.props.required}
                        onChange={this.props.onChange}
                        onFocus={(e) => {
                            this.setState({ focus: true });
                        }}
                        onBlur={(e) => {
                            this.setState({ focus: false });
                        }}
                        value={this.props.value['street_1']}
                    />
                    <label className="fancy-label" htmlFor={this.props.id + '-street_1-' + this.props.suffix}>
                        <Text id="address-line-1" />
                    </label>
                </div>
                <div className="form-group fancy-fg">
                    <input
                        key={this.props.id + '-street_2-' + this.props.suffix}
                        name="street_2"
                        rel={this.props.id}
                        type="text"
                        id={this.props.id + '-street_2-' + this.props.suffix}
                        placeholder={t('address-line-2', 'generator')}
                        className="form-element"
                        onChange={this.props.onChange}
                        onFocus={(e) => {
                            this.setState({ focus: true });
                        }}
                        onBlur={(e) => {
                            this.setState({ focus: false });
                        }}
                        value={this.props.value['street_2']}
                    />
                    <label className="fancy-label" htmlFor={this.props.id + '-street_2-' + this.props.suffix}>
                        <Text id="address-line-2" />
                    </label>
                </div>
                <div className="form-group fancy-fg">
                    <input
                        key={this.props.id + '-place-' + this.props.suffix}
                        name="place"
                        rel={this.props.id}
                        type="text"
                        id={this.props.id + '-place-' + this.props.suffix}
                        placeholder={t('address-place', 'generator')}
                        className="form-element"
                        required={this.props.required}
                        onChange={this.props.onChange}
                        onFocus={(e) => {
                            this.setState({ focus: true });
                        }}
                        onBlur={(e) => {
                            this.setState({ focus: false });
                        }}
                        value={this.props.value['place']}
                    />
                    <label className="fancy-label" htmlFor={this.props.id + '-place-' + this.props.suffix}>
                        <Text id="address-place" />
                    </label>
                </div>
                <div className="form-group fancy-fg">
                    <input
                        key={this.props.id + '-country-' + this.props.suffix}
                        name="country"
                        rel={this.props.id}
                        type="text"
                        id={this.props.id + '-country-' + this.props.suffix}
                        placeholder={t('address-country', 'generator')}
                        className="form-element"
                        onChange={this.props.onChange}
                        onFocus={(e) => {
                            this.setState({ focus: true });
                        }}
                        onBlur={(e) => {
                            this.setState({ focus: false });
                        }}
                        value={this.props.value['country']}
                    />
                    <label className="fancy-label" htmlFor={this.props.id + '-country-' + this.props.suffix}>
                        <Text id="address-country" />
                    </label>
                </div>
                <input
                    key={this.props.id + '-primary-' + this.props.suffix}
                    name="primary"
                    rel={this.props.id}
                    type="hidden"
                    id={this.props.id + '-primary-' + this.props.suffix}
                    className="dynamic-input-primary form-element"
                    value={this.props.value['primary']}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        suffix: PropTypes.string,

        desc: PropTypes.string,

        required: PropTypes.bool,

        value: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };
}
