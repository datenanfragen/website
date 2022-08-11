import { createReactorModule } from '../../../Utility/reactor';
import { getGeneratedMessage } from '../../../store/proceedings';
import type { ReactorModuleData } from '../../../types/reactor';

export interface ExcessiveModuleData extends ReactorModuleData {
    issue: {
        flags: {
            controller_refuses: boolean;
            controller_wants_to_charge: boolean;
            controller_gave_no_reasoning: boolean;
            first_request: boolean;
            additional_copy_no_prior_request: boolean;
            concerns_different_data: boolean;
        };
        variables: {
            reasoning: string;
        };
    };
}
declare module '../../../types/reactor' {
    interface ReactorModuleDataMapping {
        excessive: ExcessiveModuleData;
    }
}

const defaultModuleData: ExcessiveModuleData = {
    includeIssue: false,
    issue: {
        flags: {
            controller_refuses: false,
            controller_wants_to_charge: false,
            controller_gave_no_reasoning: false,
            first_request: false,
            additional_copy_no_prior_request: false,
            concerns_different_data: false,
        },
        variables: { reasoning: '' },
    },
    additionalData: [],
};

export const module = createReactorModule('excessive', {
    steps: [
        {
            id: 'start',
            type: 'options',
            body: `Companies can only [controller_wants_to_charge>charge for requests][controller_refuses>refuse to act on requests] if they are manifestly unfounded or excessive[controller_wants_to_charge> or if you are asking for additional copies of your data].

Has the company specified why they [controller_wants_to_charge>want to charge you for your request][controller_refuses>refuse to act on your request]?`,
            options: [
                {
                    text: 'They claim that I sent them too many requests or sent requests too often.',
                    targetStepId: 'excessive::too-many',
                },
                {
                    text: 'They say that I have requested an additional copy of my data.',
                    targetStepId: 'excessive::additional-copy',
                    hideIf: (state): boolean => state.reactorState.moduleData.excessive.issue.flags.controller_refuses,
                },
                {
                    text: 'They have given another reason.',
                    targetStepId: 'excessive::other-reason',
                },
                {
                    text: 'They have not given a reason.',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('excessive', 'controller_gave_no_reasoning', true),
                },
            ],
        },

        {
            id: 'too-many',
            type: 'options',
            body: 'How many requests have you sent to the company in total (including this one)?',
            options: [
                {
                    text: 'one',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => reactorState.setIssueFlag('excessive', 'first_request', true),
                },
                { text: 'more than one', targetStepId: 'excessive::too-many-more-than-one' },
            ],
        },
        {
            id: 'too-many-more-than-one',
            type: 'textarea',
            body: `You are allowed to send multiple requests to the same company at reasonable intervals at no cost. What is considered a reasonable interval depends on the particular situation. For example, social media platforms tend to continuously collect a lot of data about you. As such, a shorter interval between requests like three months is appropriate. Conversely, if you only ever ordered once from an online shop and they already provided you all data regarding this transaction, it is unlikely that the data they have on you changes frequently. Either way, the supervisory authorities say that a one-year interval is reasonable in all cases.

Given the vast amount of possible cases, we can unfortunately not automatically generate a reasoning on whether and why the amount of requests you have sent is reasonable. Please write that yourself.`,
            nextStepId: 'base::issue-done',
            variableName: 'reasoning',
        },

        {
            id: 'additional-copy',
            type: 'options',
            body: 'Have you ever sent a previous request to the company?',
            options: [
                { text: 'yes', targetStepId: 'excessive::additional-copy-prior-request' },
                {
                    text: 'no',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('excessive', 'additional_copy_no_prior_request', true),
                },
            ],
        },
        {
            id: 'additional-copy-prior-request',
            type: 'options',
            body: `Companies can in fact charge you if you ask for additional copies of your data. But this only applies if your request concerns the same data as a previous. If, however, you reasonably believe that your new request concerns different data (e.g. different data types or a different time frame), the right to a free copy applies again.

Do you believe your new request concerns different data than the one the company has mentioned?`,
            options: [
                {
                    text: 'yes',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('excessive', 'concerns_different_data', true),
                },
                {
                    text: 'no',
                    targetStepId: 'base::dead-end',
                    onChoose: ({ reactorState }) => reactorState.setIncludeIssue('excessive', false),
                },
            ],
        },

        {
            id: 'other-reason',
            type: 'textarea',
            body: `In this case, we can unfortunately not provide a pre-written response. Please explain yourself why you believe your request is neither unfounded nor excessive.`,
            nextStepId: 'base::issue-done',
            variableName: 'reasoning',
        },
    ],

    hooks: [
        {
            stepId: 'base::select-issue',
            position: 'before',
            options: [
                {
                    text: 'Company wants to charge for request.',
                    targetStepId: 'excessive::start',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIssueFlag('excessive', 'controller_wants_to_charge', true);
                        reactorState.setIncludeIssue('excessive', true);
                    },
                },
                {
                    text: 'Company refuses to act on request.',
                    targetStepId: 'excessive::start',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIssueFlag('excessive', 'controller_refuses', true);
                        reactorState.setIncludeIssue('excessive', true);
                    },
                },
            ],
        },
    ],

    defaultModuleData,
    offerIf: ({ proceeding }) => getGeneratedMessage(proceeding, 'request')?.type === 'access',
    offerToIncludeInComplaintIf: true,
});
