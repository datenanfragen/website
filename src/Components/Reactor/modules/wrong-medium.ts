import { createReactorModule } from '../../../Utility/reactor';
import type { ReactorState } from '../../../store/reactor';
import type { ReactorModuleData } from '../../../types/reactor';

export interface WrongMediumModuleData extends ReactorModuleData {
    issue: {
        flags: {
            wrong_transport_medium: boolean;
            not_form: boolean;
            wrong_contact: boolean;
            wrong_contact_privacy: boolean;
            wrong_contact_dpo: boolean;
            wrong_contact_customer_service: boolean;
        };
        variables: { medium: string; wrong_contact_reasoning: string };
    };
}
declare module '../../../types/reactor' {
    interface ReactorModuleDataMapping {
        'wrong-medium': WrongMediumModuleData;
    }
}

const defaultModuleData: WrongMediumModuleData = {
    includeIssue: false,
    issue: {
        flags: {
            wrong_transport_medium: false,
            not_form: false,
            wrong_contact: false,
            wrong_contact_privacy: false,
            wrong_contact_dpo: false,
            wrong_contact_customer_service: false,
        },
        variables: { medium: '', wrong_contact_reasoning: '' },
    },
    additionalData: [],
};

const setReason = (state: ReactorState, reason: keyof WrongMediumModuleData['issue']['flags']) => {
    state.setIncludeIssue('wrong-medium', true);
    state.setIssueFlag('wrong-medium', reason, true);
};

export const module = createReactorModule('wrong-medium', {
    steps: [
        {
            id: 'start',
            type: 'options',
            body: `Companies are not allowed to impose their own formal requirements on how you send requests like requiring requests to be sent via a particular medium.

Why has the company refused to answer your request?`,
            options: [
                {
                    text: 'It was not sent using a particular transport medium.',
                    targetStepId: 'wrong-medium::wrong-transport-medium',
                    onChoose: ({ reactorState }) => setReason(reactorState, 'wrong_transport_medium'),
                },
                {
                    text: 'It was not sent through their web form/self-service tool.',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => setReason(reactorState, 'not_form'),
                },
                {
                    text: 'It was sent to another contact than they want.',
                    targetStepId: 'wrong-medium::wrong-contact',
                    onChoose: ({ reactorState }) => setReason(reactorState, 'wrong_contact'),
                },
                {
                    text: 'None of the above.',
                    targetStepId: 'base::dead-end',
                },
            ],
        },

        {
            id: 'wrong-transport-medium',
            type: 'options',
            body: 'How does the company want you to send your request?',
            options: [
                {
                    text: 'email',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => reactorState.setIssueVariable('wrong-medium', 'medium', 'email'),
                },
                {
                    text: 'letter',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => reactorState.setIssueVariable('wrong-medium', 'medium', 'letter'),
                },
                {
                    text: 'fax',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => reactorState.setIssueVariable('wrong-medium', 'medium', 'fax'),
                },
                {
                    text: 'other',
                    targetStepId: 'wrong-medium::other-medium',
                },
            ],
        },

        {
            id: 'other-medium',
            type: 'input',
            body: 'Please enter the transport medium the company wants you to use.',
            variableName: 'medium',
            nextStepId: 'base::issue-done',
        },

        {
            id: 'wrong-contact',
            type: 'options',
            body: 'Companies are not required to answer requests sent to random contacts not involved in the matter, but they can’t only answer requests sent to a particular point of contact, either. Where have you sent your request?',
            options: [
                {
                    text: 'privacy contact per their privacy policy',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('wrong-medium', 'wrong_contact_privacy', true),
                },
                {
                    text: 'data protection officer per their privacy policy',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('wrong-medium', 'wrong_contact_dpo', true),
                },
                {
                    text: 'general customer service/support contact',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('wrong-medium', 'wrong_contact_customer_service', true),
                },
                {
                    text: 'another point of contact I believe is reasonable',
                    targetStepId: 'wrong-medium::wrong-contact-reasoning',
                },
                {
                    text: 'none of the above',
                    targetStepId: 'base::dead-end',
                },
            ],
        },
        {
            id: 'wrong-contact-reasoning',
            type: 'textarea',
            body: 'Please explain why you think the point of contact you sent your request to was reasonable.',
            variableName: 'wrong_contact_reasoning',
            nextStepId: 'base::issue-done',
        },
    ],

    hooks: [
        {
            stepId: 'base::select-issue',
            position: 'before',
            options: [
                {
                    text: 'Company claims request was sent via the wrong medium or to the wrong contact.',
                    targetStepId: 'wrong-medium::start',
                },
            ],
        },
    ],

    defaultModuleData,
    offerToIncludeInComplaintIf: true,
});
