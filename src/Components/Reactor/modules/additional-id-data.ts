import type { ReactorModule } from '../../../types/reactor';

const module: ReactorModule = {
    steps: [
        {
            id: 'additional-id::start',
            body: 'Has the company set forth any reasonable doubts concerning your identity that could be remedied using additional identification data? Or are they apparent?',
            options: [
                { text: 'yes', targetStepId: 'additional-id::reasonable-doubts' },
                // TODO v: Store that the company hasn't set forth any doubts.
                { text: 'no', targetStepId: 'additional-id::no-reasonable-doubts' },
            ],
        },

        {
            id: 'additional-id::reasonable-doubts',
            body: 'Do you have any objections to these doubts? Do you think the company can sufficiently identify you without this data?',
            options: [
                { text: 'yes', targetStepId: 'additional-id::no-reasonable-doubts' },
                { text: 'no', targetStepId: 'additional-id::user-objections' },
            ],
        },
        {
            id: 'additional-id::user-objections',
            body: 'Can you/do you want to provide the identification data requested by the company?',
            options: [
                { text: 'yes', targetStepId: 'additional-id::provide-data' },
                { text: 'no', targetStepId: 'additional-id::TODO' },
            ],
        },
        {
            id: 'additional-id::provide-data',
            body: 'Please enter the additional identification data requested by the company.',
            options: [
                // TODO: dynamic input container
                // TODO: "Next" leads to base::select-issue
            ],
        },

        {
            id: 'additional-id::no-reasonable-doubts',
            body: 'Why do you think that you’ve sufficiently identified yourself in your request?',
            options: [
                {
                    text: 'The request concerns an online account but the company wants “real-world” identification data.',
                    // TODO v: Store reason.
                    targetStepId: 'base::select-issue',
                },
                {
                    text: 'The company wants more data than is necessary to identify me for the request.',
                    targetStepId: 'additional-id::explain-excessive',
                },
            ],
        },
        {
            id: 'additional-id::explain-excessive',
            body: 'Please explain why the identification data requested by the company is not necessary for the request.',
            options: [
                // TODO: input
                // TODO: "Next" leads to base::select-issue
            ],
        },
    ],

    hooks: [
        {
            stepId: 'base::select-issue',
            position: 'before',
            options: [
                { text: 'Company requires additional data for identification.', targetStepId: 'additional-id::start' },
            ],
        },
    ],
};
export default module;
