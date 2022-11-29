import { createReactorModule } from '../../../Utility/reactor';
import t from '../../../Utility/i18n';
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
            body: true,
            options: [
                {
                    id: 'wrong-transport-medium',
                    text: true,
                    targetStepId: 'wrong-medium::wrong-transport-medium',
                    onChoose: ({ reactorState }) => setReason(reactorState, 'wrong_transport_medium'),
                },
                {
                    id: 'web-form',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => setReason(reactorState, 'not_form'),
                },
                {
                    id: 'wrong-contact',
                    text: true,
                    targetStepId: 'wrong-medium::wrong-contact',
                    onChoose: ({ reactorState }) => setReason(reactorState, 'wrong_contact'),
                },
                {
                    id: 'none',
                    text: true,
                    targetStepId: 'base::dead-end',
                },
            ],
        },

        {
            id: 'wrong-transport-medium',
            type: 'options',
            body: true,
            options: [
                {
                    id: 'email',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueVariable('wrong-medium', 'medium', t('email', 'reactor')),
                },
                {
                    id: 'letter',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueVariable('wrong-medium', 'medium', t('letter', 'reactor')),
                },
                {
                    id: 'fax',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueVariable('wrong-medium', 'medium', t('fax', 'reactor')),
                },
                {
                    id: 'other',
                    text: true,
                    targetStepId: 'wrong-medium::other-medium',
                },
            ],
        },

        {
            id: 'other-medium',
            type: 'input',
            body: true,
            variableName: 'medium',
            nextStepId: 'base::issue-done',
        },

        {
            id: 'wrong-contact',
            type: 'options',
            body: true,
            options: [
                {
                    id: 'privacy-contact',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('wrong-medium', 'wrong_contact_privacy', true),
                },
                {
                    id: 'dpo',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('wrong-medium', 'wrong_contact_dpo', true),
                },
                {
                    id: 'support',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('wrong-medium', 'wrong_contact_customer_service', true),
                },
                {
                    id: 'other',
                    text: true,
                    targetStepId: 'wrong-medium::wrong-contact-reasoning',
                },
                {
                    id: 'none',
                    text: true,
                    targetStepId: 'base::dead-end',
                },
            ],
        },
        {
            id: 'wrong-contact-reasoning',
            type: 'textarea',
            body: true,
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
                    id: 'wrong-medium',
                    text: true,
                    targetStepId: 'wrong-medium::start',
                },
            ],
        },
    ],

    defaultModuleData,
    offerToIncludeInComplaintIf: true,
});
