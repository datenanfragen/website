import { MarkupText, Text, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import { useGeneratorStore } from '../../store/generator';
import { EMTPY_ADDRESS } from '../../Utility/requests';
import { InputControl } from './DynamicInput';

export const CustomRequestInput = () => {
    const request_type = useGeneratorStore((state) => state.request.type);
    const name = useGeneratorStore((state) => (state.request.type === 'custom' ? state.request.custom_data.name : ''));
    const subject = useGeneratorStore((state) =>
        state.request.type === 'custom' ? state.request.custom_data.subject : ''
    );
    const content = useGeneratorStore((state) =>
        state.request.type === 'custom' ? state.request.custom_data.content : ''
    );
    const sender_address = useGeneratorStore((state) =>
        state.request.type === 'custom' ? state.request.custom_data.sender_address : EMTPY_ADDRESS
    );

    const setCustomLetterProperty = useGeneratorStore((state) => state.setCustomLetterProperty);
    const setCustomLetterAddress = useGeneratorStore((state) => state.setCustomLetterAddress);

    if (request_type !== 'custom') return null;
    return (
        <IntlProvider scope="generator" definition={window.I18N_DEFINITION}>
            <div>
                <h2>
                    <Text id="custom-request" />
                </h2>
                <div className="form-group">
                    <label htmlFor="custom-subject-input" className="sr-only">
                        <Text id="subject" />
                    </label>
                    <input
                        type="text"
                        id="custom-subject-input"
                        name="subject"
                        className="form-element"
                        placeholder={t('subject', 'generator')}
                        onChange={(e) => setCustomLetterProperty('subject', e.currentTarget.value)}
                        value={subject}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="custom-content-input" className="sr-only">
                        <Text id="content" />
                    </label>
                    <textarea
                        type="text"
                        id="custom-content-input"
                        name="content"
                        className="form-element"
                        placeholder={t('content', 'generator')}
                        onChange={(e) => setCustomLetterProperty('content', e.currentTarget.value)}
                        style="height: 200px;"
                        value={content}
                    />
                    <div id="tagxplanation">
                        <MarkupText id="tagxplanation" />
                    </div>
                </div>
            </div>
            <div>
                <h2 className="has-margin">
                    <Text id="sender-address" />
                </h2>
                <div className="form-group fancy-fg">
                    <input
                        type="text"
                        id="custom-sender-name"
                        name="name"
                        placeholder={t('name', 'generator')}
                        className="form-element"
                        onChange={(e) => setCustomLetterProperty('name', e.currentTarget.value)}
                        value={name}
                    />
                    <label className="fancy-label" htmlFor="custom-sender-name">
                        <Text id="name" />
                    </label>
                </div>

                <InputControl
                    type="address"
                    id="0"
                    suffix="custom-request"
                    required={false}
                    onChange={setCustomLetterAddress}
                    value={sender_address}
                />
            </div>
        </IntlProvider>
    );
};
