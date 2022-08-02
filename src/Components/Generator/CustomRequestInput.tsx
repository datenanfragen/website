import { MarkupText, Text, IntlProvider } from 'preact-i18n';
import t from '../../Utility/i18n';
import { useGeneratorStore } from '../../store/generator';

export const CustomRequestInput = () => {
    const request_type = useGeneratorStore((state) => state.request.type);
    const subject = useGeneratorStore((state) =>
        state.request.type === 'custom' ? state.request.custom_data.subject : ''
    );
    const content = useGeneratorStore((state) =>
        state.request.type === 'custom' ? state.request.custom_data.content : ''
    );

    const setCustomLetterProperty = useGeneratorStore((state) => state.setCustomLetterProperty);

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
        </IntlProvider>
    );
};
