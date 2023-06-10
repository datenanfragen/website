import { createReactorModule, yes, no } from '../../../Utility/reactor';
import type { ReactorModuleData } from '../../../types/reactor';

export interface AdditionalIdModuleData extends ReactorModuleData {
    issue: {
        flags: { no_doubts: boolean; has_reasoning: boolean; concerns_online_account: boolean };
        variables: { reasoning: string };
    };
}
declare module '../../../types/reactor' {
    interface ReactorModuleDataMapping {
        'additional-id': AdditionalIdModuleData;
    }
}

const defaultModuleData: AdditionalIdModuleData = {
    includeIssue: false,
    issue: {
        flags: { concerns_online_account: false, no_doubts: false, has_reasoning: false },
        variables: { reasoning: '' },
    },
    additionalData: [],
};

export const module = createReactorModule('additional-id', {
    steps: [
        {
            id: 'start',
            type: 'options',
            body: true,
            options: [
                { text: yes, targetStepId: 'additional-id::reasonable-doubts' },
                {
                    text: no,
                    targetStepId: 'additional-id::no-reasonable-doubts',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIncludeIssue('additional-id', true);
                        reactorState.setIssueFlag('additional-id', 'no_doubts', true);
                    },
                },
            ],
        },

        {
            id: 'reasonable-doubts',
            type: 'options',
            body: true,
            options: [
                {
                    text: yes,
                    targetStepId: 'additional-id::no-reasonable-doubts',
                    onChoose: ({ reactorState }) => reactorState.setIncludeIssue('additional-id', true),
                },
                {
                    text: no,
                    targetStepId: 'additional-id::user-no-objections',
                    disableIf: ({ reactorState }) => reactorState.type === 'complaint',
                },
            ],
        },
        {
            id: 'user-no-objections',
            type: 'options',
            body: true,
            options: [
                { text: yes, targetStepId: 'additional-id::provide-data' },
                { text: no, targetStepId: 'base::dead-end' },
            ],
        },
        {
            id: 'provide-data',
            type: 'dynamic-inputs',
            body: true,
            storeIn: 'module',
            nextStepId: 'base::issue-done',
        },

        {
            id: 'no-reasonable-doubts',
            type: 'options',
            body: true,
            options: [
                {
                    id: 'concerns-online-account',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('additional-id', 'concerns_online_account', true),
                },
                {
                    id: 'other-reason',
                    text: true,
                    targetStepId: 'additional-id::explain-reasoning',
                },
            ],
        },
        {
            id: 'explain-reasoning',
            body: true,
            type: 'textarea',
            nextStepId: 'base::issue-done',
            variableName: 'reasoning',
            rows: 7,
        },
    ],

    hooks: [
        {
            stepId: 'base::select-issue',
            position: 'before',
            options: [
                {
                    id: 'additional-id',
                    text: true,
                    targetStepId: 'additional-id::start',
                },
            ],
        },
    ],

    defaultModuleData,
    offerToIncludeInComplaintIf: true,
});
