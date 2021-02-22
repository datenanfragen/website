import { render, Component } from 'preact';
import SavedIdData, { ID_DATA_CHANGE_EVENT, ID_DATA_CLEAR_EVENT } from './Utility/SavedIdData';
import Privacy, { PRIVACY_ACTIONS } from './Utility/Privacy';
import t from 'Utility/i18n';
import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import DynamicInputContainer from './Components/Generator/DynamicInputContainer';
import { AddressControl, DateControl, InputControl } from './Components/Generator/DynamicInput';
import SignatureInput from './Components/Generator/SignatureInput';
import FeatureDisabledWidget from 'Components/FeatureDisabledWidget';

class IdDataControls extends Component {
    constructor(props) {
        super(props);

        this.savedIdData = new SavedIdData();
        this.state = {
            reset_state: false,
            custom_id_data: [],
            fixed_id_data: {
                name: '',
                birthdate: '',
                email: '',
                address: {
                    street_1: '',
                    street_2: '',
                    place: '',
                    country: '',
                    primary: true,
                },
            },
            signature: { type: 'text', value: '' },
        };
        this.resetSavedIdData();

        this.handleFixedChange = this.handleFixedChange.bind(this);
        this.handleSignatureChange = this.handleSignatureChange.bind(this);
    }

    render() {
        if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
            return (
                <div id="id-data-controls-container" className="narrow-page">
                    <DynamicInputContainer
                        key="id-data-controls"
                        id="id-data-controls"
                        onAddField={this.handleAddField}
                        onRemoveField={this.handleRemoveField}
                        onSetPrimaryAddress={() => {}}
                        onChange={this.handleInputChange}
                        fields={this.state.custom_id_data}
                        title={t('saved-data', 'id-data-controls')}
                        hasPrimary={false}>
                        <IntlProvider scope="id-data-controls" definition={I18N_DEFINITION}>
                            <div>
                                <p>
                                    <MarkupText id="saved-data-explanation" />
                                </p>
                                <div className="form-group">
                                    <input
                                        type="checkbox"
                                        id="always-fill-in"
                                        className="form-element"
                                        checked={SavedIdData.shouldAlwaysFill()}
                                        onChange={(event) => {
                                            SavedIdData.setAlwaysFill(!SavedIdData.shouldAlwaysFill());
                                        }}
                                    />
                                    <label htmlFor="always-fill-in">
                                        <Text id="always-fill-in" />
                                    </label>
                                </div>

                                <div className="form-group" style="width: 100%; display: table;">
                                    <div className="col40">
                                        <strong>
                                            <label htmlFor="name-input-value-fixed-id-data">
                                                {t('name', 'generator')}
                                            </label>
                                        </strong>
                                    </div>
                                    <div className="col60" style="padding-left: 10px; box-sizing: border-box;">
                                        <InputControl
                                            id="name-input"
                                            suffix="fixed-id-data"
                                            onChange={(e) => this.handleFixedChange('name', e)}
                                            value={this.state.fixed_id_data['name']}
                                        />
                                    </div>
                                    <div className="clearfix" />

                                    <div className="col40">
                                        <strong>
                                            <label htmlFor="email-input-value-fixed-id-data">
                                                {t('email-address', 'generator')}
                                            </label>
                                        </strong>
                                    </div>
                                    <div className="col60" style="padding-left: 10px; box-sizing: border-box;">
                                        <InputControl
                                            id="email-input"
                                            suffix="fixed-id-data"
                                            onChange={(e) => this.handleFixedChange('email', e)}
                                            value={this.state.fixed_id_data['email']}
                                        />
                                    </div>
                                    <div className="clearfix" />

                                    <div className="col40">
                                        <strong>
                                            <label htmlFor="main-address-input-container-fixed-id-data">
                                                {t('address', 'generator')}
                                            </label>
                                        </strong>
                                    </div>
                                    <div className="col60" style="padding-left: 10px; box-sizing: border-box;">
                                        <AddressControl
                                            id="main-address-input"
                                            suffix="fixed-id-data"
                                            onChange={(e) => this.handleFixedChange('address', e)}
                                            value={this.state.fixed_id_data['address']}
                                        />
                                    </div>
                                    <div className="clearfix" />

                                    <div className="col40">
                                        <strong>
                                            <label htmlFor="birthdate-input-value-fixed-id-data">
                                                {t('birthdate', 'generator')}
                                            </label>
                                        </strong>
                                    </div>
                                    <div className="col60" style="padding-left: 10px; box-sizing: border-box;">
                                        <DateControl
                                            id="birthdate-input"
                                            suffix="fixed-id-data"
                                            onChange={(e) => this.handleFixedChange('birthdate', e)}
                                            value={this.state.fixed_id_data['birthdate']}
                                        />
                                    </div>
                                    <div className="clearfix" />
                                </div>
                            </div>
                        </IntlProvider>
                    </DynamicInputContainer>
                    <SignatureInput
                        id="id-data-controls-signature"
                        width={450}
                        height={200}
                        onChange={this.handleSignatureChange}
                        value={this.state.signature}
                        isForIdData={true}
                    />
                </div>
            );
        } else {
            return (
                <FeatureDisabledWidget>
                    <MarkupText id="id-data-deactivated" />
                </FeatureDisabledWidget>
            );
        }
    }

    handleAddField = (_, { desc, value, type }) => {
        this.changeData((fields) => {
            const last_index =
                fields
                    .map((f) => f.desc || '')
                    .map((d) =>
                        parseInt(d.match(new RegExp(`^${t('custom-input-desc', 'id-data-controls')} (\\d+)$`))?.[1], 10)
                    )
                    .filter((d) => d)
                    .sort()
                    .pop() || 0;
            fields.push({
                desc: desc || `${t('custom-input-desc', 'id-data-controls')} ${last_index + 1}`,
                type,
                optional: true,
                value: value || (type === 'address' ? { primary: false } : ''),
            });
        });
    };

    handleRemoveField = (_, idx) => {
        this.changeData((fields) => {
            let field = fields[idx];
            if (!field) throw new Error('index out of bounds');
            fields.splice(idx, 1);
        });
    };

    handleInputChange = (_, idx, prop, value) => {
        this.changeData((fields) => {
            let field = fields[idx];
            if (!field) throw new Error('index out of bounds');
            switch (prop) {
                case 'desc':
                case 'value':
                    field[prop] = value;
                    break;
                default:
                    field.value[prop] = value;
            }
        });
    };

    changeData = (closure) => {
        this.setState(
            (prev) => {
                // will modify internally, so we don't need to return it from there
                closure(prev.custom_id_data);
                return prev;
            },
            () => {
                let data = this.state.custom_id_data.concat(
                    IdDataControls.fieldsArrayFromFixedData(this.state.fixed_id_data)
                );
                let signature = this.state.signature;
                this.savedIdData.clear().then(() => {
                    this.savedIdData.storeArray(data, false);
                    this.savedIdData.storeSignature(signature);
                });
            }
        );
    };

    handleFixedChange(type, e) {
        let name = e.target.getAttribute('name');
        this.setState((prev) => {
            if (type === 'address') prev.fixed_id_data[type][name] = e.target.value;
            else prev.fixed_id_data[type] = e.target.value;
            return prev;
        });
        this.savedIdData.storeArray(IdDataControls.fieldsArrayFromFixedData(this.state.fixed_id_data));
    }

    handleSignatureChange(data) {
        this.setState({ signature: data['signature'] });
        this.savedIdData.storeSignature(data['signature']);
    }

    static fieldsArrayFromFixedData(data) {
        return [
            {
                desc: t('name', 'generator'),
                type: 'name',
                value: data['name'],
                optional: true,
            },
            {
                desc: t('birthdate', 'generator'),
                type: 'birthdate',
                value: data['birthdate'],
                optional: true,
            },
            {
                desc: t('address', 'generator'),
                type: 'address',
                value: data['address'],
                optional: true,
            },
            {
                desc: t('email-address', 'generator'),
                type: 'email',
                value: data['email'],
                optional: true,
            },
        ];
    }

    resetSavedIdData() {
        this.savedIdData.getAll().then((id_data) => this.setState({ custom_id_data: id_data }));
        this.savedIdData.getAllFixed().then((fixed_data) => {
            this.setState((prev) => {
                for (let i in fixed_data) {
                    prev.fixed_id_data[fixed_data[i].type] = fixed_data[i].value;
                }
                return prev;
            });
        });
        this.savedIdData.getSignature().then((signature) => this.setState({ signature: signature }));
    }

    queued = false;
    enqueueReset() {
        if (this.queued) return;
        this.queued = true;
        Promise.resolve().then(() => {
            this.resetSavedIdData();
            this.queued = false;
        });
    }

    componentDidMount() {
        window.addEventListener(ID_DATA_CHANGE_EVENT, (event) => {
            this.enqueueReset();
        });
        window.addEventListener(ID_DATA_CLEAR_EVENT, (event) => {
            this.enqueueReset();
        });
    }
}

const main = document.querySelector('main');
render(
    <IntlProvider scope="id-data-controls" definition={I18N_DEFINITION}>
        <main>
            <IdDataControls />
        </main>
    </IntlProvider>,
    main.parentElement,
    main
);
