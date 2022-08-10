import { createReactorModule } from '../../../Utility/reactor';
import type { ReactorModuleData } from '../../../types/reactor';

export interface OtherLanguageModuleData extends ReactorModuleData {
    issue: {
        flags: { user_does_not_understand_response_language: boolean };
        variables: { response_language: string; request_language: string };
    };
}
declare module '../../../types/reactor' {
    interface ReactorModuleDataMapping {
        'other-language': OtherLanguageModuleData;
    }
}

const defaultModuleData: OtherLanguageModuleData = {
    includeIssue: false,
    issue: {
        flags: {
            user_does_not_understand_response_language: false,
        },
        variables: { response_language: '', request_language: '' },
    },
    additionalData: [],
};

export const module = createReactorModule('other-language', {
    steps: [
        {
            id: 'start',
            type: 'input',
            body: `Companies have to communicate with you in easily accessible form, using clear and plain language. A company that offers a service in a country should also offer answers in the language that is understood by the people in that country.

What language was your request in?`,
            variableName: 'request_language',
            nextStepId: 'other-language::response_language',
        },
        {
            id: 'response_language',
            type: 'input',
            body: `What language was the company’s response in?`,
            variableName: 'response_language',
            nextStepId: 'other-language::does-user-understand-response-language',
        },
        {
            id: 'does-user-understand-response-language',
            type: 'options',
            body: 'Do you understand the company’s response?',
            options: [
                {
                    text: 'yes',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag(
                            'other-language',
                            'user_does_not_understand_response_language',
                            false
                        ),
                },
                {
                    text: 'no',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('other-language', 'user_does_not_understand_response_language', true),
                },
            ],
        },
    ],

    hooks: [
        {
            stepId: 'base::select-issue',
            position: 'before',
            options: [
                {
                    text: 'Company answered in a different language.',
                    targetStepId: 'other-language::start',
                    onChoose: ({ reactorState }) => reactorState.setIncludeIssue('other-language', true),
                },
            ],
        },
    ],

    defaultModuleData,
    offerToIncludeInComplaintIf: true,
});
