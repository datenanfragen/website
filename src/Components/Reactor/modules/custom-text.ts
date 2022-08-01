import { createReactorModule } from '../../../Utility/reactor';
import type { ReactorModuleData } from '../../../types/reactor';

export interface CustomTextModuleData extends ReactorModuleData {
    issue: {
        flags: Record<string, never>;
        variables: { text: string };
    };
}
declare module '../../../types/reactor' {
    interface ReactorModuleDataMapping {
        'custom-text': CustomTextModuleData;
    }
}

const defaultModuleData: CustomTextModuleData = {
    includeIssue: false,
    issue: {
        flags: {},
        variables: { text: '' },
    },
    additionalData: [],
};

export const module = createReactorModule('custom-text', {
    steps: [
        {
            id: 'start',
            body: 'Please enter the message you want to send to the company.',
            type: 'textarea',
            nextStepId: 'base::generate-letter',
            variableName: 'text',
            rows: 15,
            onEnter: ({ reactorState }) => reactorState.setType('response'),
        },
    ],

    hooks: [
        {
            stepId: 'base::select-issue',
            position: 'before',
            options: [
                {
                    text: 'I want to write my own message.',
                    targetStepId: 'custom-text::start',
                    hideIf: ({ reactorState }) =>
                        reactorState.type === 'complaint' || Object.keys(reactorState.activeModules()).length > 0,
                },
            ],
        },
    ],

    defaultModuleData,
    offerToIncludeInComplaintIf: false,
});
