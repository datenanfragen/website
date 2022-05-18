import { render } from 'preact';
import { SavedIdData } from './DataType/SavedIdData';
import { Privacy, PRIVACY_ACTIONS } from './Utility/Privacy';
import t from './Utility/i18n';
import { IntlProvider, MarkupText, Text } from 'preact-i18n';
import { DynamicInputContainer } from './Components/Generator/DynamicInputContainer';
import { InputControl } from './Components/Generator/DynamicInput';
import { SignatureInput } from './Components/Generator/SignatureInput';
import { FeatureDisabledWidget } from './Components/FeatureDisabledWidget';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { Address, IdDataElement, Signature } from 'request';
import { produce } from 'immer';
import { isAddress } from './Utility/requests';

const DEFAULT_FIXED_FIELDS = {
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
};

const IdDataControls = () => {
    const savedIdData = useMemo(() => new SavedIdData(), []);
    const [custom_id_data, setCustomIdData] = useState<IdDataElement[]>([]);
    const [signature, setSignature] = useState<Signature>({ type: 'text', name: '' });
    const [fixed_id_data, setFixedIdData] = useState(DEFAULT_FIXED_FIELDS);

    const resetSavedIdData = useCallback(() => {
        savedIdData.getAll().then((id_data) => id_data && setCustomIdData(id_data));
        savedIdData.getAllFixed().then((fixed_data) => {
            setFixedIdData(
                (fixed_data ?? []).reduce(
                    (acc, elem: IdDataElement) => ({ ...acc, [elem.type]: elem.value }),
                    DEFAULT_FIXED_FIELDS
                )
            );
        });
        savedIdData.getSignature().then((signature) => signature && setSignature(signature));
    }, [savedIdData]);

    useEffect(() => {
        resetSavedIdData();
    }, [resetSavedIdData]);

    useEffect(() => {
        savedIdData.storeArray(fieldsArrayFromFixedData(fixed_id_data));
    }, [savedIdData, fixed_id_data]);

    useEffect(() => {
        savedIdData.storeArray(custom_id_data, false);
    }, [savedIdData, custom_id_data]);

    const handleFixedChange = (type: 'name' | 'birthdate' | 'email' | 'address', value: string | Address) => {
        setFixedIdData(
            produce((data) => {
                if (!isAddress(value)) {
                    if (type !== 'address') data[type] = value;
                } else {
                    if (type === 'address') data[type] = { ...value, primary: true };
                }
            })
        );
    };

    if (Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_ID_DATA)) {
        return (
            <div id="id-data-controls-container" className="narrow-page">
                <DynamicInputContainer
                    key="id-data-controls"
                    id="id-data-controls"
                    onAddField={(new_field) =>
                        setCustomIdData(
                            produce((fields) => {
                                const last_index =
                                    custom_id_data
                                        .map((f) =>
                                            parseInt(
                                                f.desc.match(
                                                    new RegExp(`^${t('custom-input-desc', 'id-data-controls')} (\\d+)$`)
                                                )?.[1] ?? '',
                                                10
                                            )
                                        )
                                        .sort()
                                        .pop() || 0;
                                fields.push({
                                    ...new_field,
                                    desc:
                                        new_field.desc ||
                                        `${t('custom-input-desc', 'id-data-controls')} ${last_index + 1}`,
                                });
                            })
                        )
                    }
                    onRemoveField={(idx) => {
                        if (!custom_id_data[idx]) throw new Error('index out of bounds');
                        savedIdData.removeByDesc(custom_id_data[idx].desc);
                        setCustomIdData(
                            produce((fields) => {
                                fields.splice(idx, 1);
                            })
                        );
                    }}
                    onChange={(idx, new_data) =>
                        setCustomIdData(
                            produce((fields) => {
                                if (!fields[idx]) throw new Error('index out of bounds');
                                fields[idx] = new_data;
                            })
                        )
                    }
                    fields={custom_id_data}
                    title={t('saved-data', 'id-data-controls')}
                    hasPrimary={false}>
                    <IntlProvider scope="id-data-controls" definition={window.I18N_DEFINITION}>
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
                                        <label htmlFor="name-input-value-fixed-id-data">{t('name', 'generator')}</label>
                                    </strong>
                                </div>
                                <div className="col60" style="padding-left: 10px; box-sizing: border-box;">
                                    <InputControl
                                        type="name"
                                        id="name-input"
                                        suffix="fixed-id-data"
                                        onChange={(v) => handleFixedChange('name', v)}
                                        value={fixed_id_data.name}
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
                                        type="email"
                                        id="email-input"
                                        suffix="fixed-id-data"
                                        onChange={(v) => handleFixedChange('email', v)}
                                        value={fixed_id_data.email}
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
                                    <InputControl
                                        type="address"
                                        id="main-address-input"
                                        suffix="fixed-id-data"
                                        onChange={(v) => handleFixedChange('address', v)}
                                        value={fixed_id_data.address}
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
                                    <InputControl
                                        type="birthdate"
                                        id="birthdate-input"
                                        suffix="fixed-id-data"
                                        onChange={(v) => handleFixedChange('birthdate', v)}
                                        value={fixed_id_data.birthdate}
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
                    onChange={(s) => {
                        setSignature(s);
                        savedIdData.storeSignature(s);
                    }}
                    value={signature}
                    isForIdData={true}
                />
            </div>
        );
    }
    return (
        <FeatureDisabledWidget>
            <MarkupText id="id-data-deactivated" />
        </FeatureDisabledWidget>
    );
};

const fieldsArrayFromFixedData = (data: typeof DEFAULT_FIXED_FIELDS): IdDataElement[] => {
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
};

const main = document.querySelector('main');
if (main)
    render(
        <IntlProvider scope="id-data-controls" definition={window.I18N_DEFINITION}>
            <main>
                <IdDataControls />
            </main>
        </IntlProvider>,
        main.parentElement!,
        main
    );
