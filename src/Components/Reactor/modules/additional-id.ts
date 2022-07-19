import { createReactorModule } from '../../../Utility/reactor';
import type { ReactorModuleData } from '../../../types/reactor';

export interface AdditionalIdModuleData extends ReactorModuleData {
    issue: {
        variables: { reasoning: string };
        flags: { no_doubts: boolean; has_reasoning: boolean; concerns_online_account: boolean };
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
            body: 'Has the company set forth any reasonable doubts concerning your identity that could be remedied using additional identification data? Or are they apparent?',
            options: [
                { text: 'yes', targetStepId: 'additional-id::reasonable-doubts' },
                {
                    text: 'no',
                    targetStepId: 'additional-id::no-reasonable-doubts',
                    onChoose: (state) => state.setIssueFlag('additional-id', 'no_doubts', true),
                },
            ],
        },

        {
            id: 'reasonable-doubts',
            type: 'options',
            body: 'Do you have any objections to these doubts? Do you think the company can sufficiently identify you without this data?',
            options: [
                { text: 'yes', targetStepId: 'additional-id::no-reasonable-doubts' },
                { text: 'no', targetStepId: 'additional-id::user-objections' },
            ],
        },
        {
            id: 'user-objections',
            type: 'options',
            body: 'Can you/do you want to provide the identification data requested by the company?',
            options: [
                { text: 'yes', targetStepId: 'additional-id::provide-data' },
                { text: 'no', targetStepId: 'base::dead-end' },
            ],
        },
        {
            id: 'provide-data',
            type: 'options',
            body: 'Please enter the additional identification data requested by the company.',
            options: [
                // TODO: dynamic input container
                // TODO: "Next" leads to base::select-issue
            ],
        },

        {
            id: 'no-reasonable-doubts',
            type: 'options',
            body: 'Why do you think that you’ve sufficiently identified yourself in your request?',
            options: [
                {
                    text: 'The request concerns an online account but the company wants “real-world” identification data.',
                    targetStepId: 'base::select-issue',
                    onChoose: (state) => state.setIssueFlag('additional-id', 'concerns_online_account', true),
                },
                {
                    text: 'The company wants more data than is necessary to identify me for the request.',
                    targetStepId: 'additional-id::explain-reasoning',
                },
            ],
        },
        {
            id: 'explain-reasoning',
            body: 'Please explain why the identification data requested by the company is not necessary for the request.',
            type: 'textarea',
            nextStepId: 'base::select-issue',
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
                    text: 'Company requires additional data for identification.',
                    targetStepId: 'additional-id::start',
                    onChoose: (state) => state.setIncludeIssue('additional-id', true),
                },
            ],
        },
    ],

    defaultModuleData,
});
