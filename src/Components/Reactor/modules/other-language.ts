import { createReactorModule, yes, no } from '../../../Utility/reactor';
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
            body: true,
            variableName: 'request_language',
            nextStepId: 'other-language::response-language',
        },
        {
            id: 'response-language',
            type: 'input',
            body: true,
            variableName: 'response_language',
            nextStepId: 'other-language::does-user-understand-response-language',
        },
        {
            id: 'does-user-understand-response-language',
            type: 'options',
            body: true,
            options: [
                {
                    text: yes,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag(
                            'other-language',
                            'user_does_not_understand_response_language',
                            false
                        ),
                },
                {
                    text: no,
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
                    id: 'other-language',
                    text: true,
                    targetStepId: 'other-language::start',
                    onChoose: ({ reactorState }) => reactorState.setIncludeIssue('other-language', true),
                },
            ],
        },
    ],

    defaultModuleData,
    offerToIncludeInComplaintIf: true,
});
