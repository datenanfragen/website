import { createReactorModule, yes, no } from '../../../Utility/reactor';
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
            body: true,
            options: [
                {
                    id: 'too-many',
                    text: true,
                    targetStepId: 'excessive::too-many',
                },
                {
                    id: 'additional-copy',
                    text: true,
                    targetStepId: 'excessive::additional-copy',
                    hideIf: (state): boolean => state.reactorState.moduleData.excessive.issue.flags.controller_refuses,
                },
                {
                    id: 'other-reason',
                    text: true,
                    targetStepId: 'excessive::other-reason',
                },
                {
                    id: 'no-reason',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('excessive', 'controller_gave_no_reasoning', true),
                },
            ],
        },

        {
            id: 'too-many',
            type: 'options',
            body: true,
            options: [
                {
                    id: 'one',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => reactorState.setIssueFlag('excessive', 'first_request', true),
                },
                { id: 'more', text: true, targetStepId: 'excessive::too-many-more-than-one' },
            ],
        },
        {
            id: 'too-many-more-than-one',
            type: 'textarea',
            body: true,
            nextStepId: 'base::issue-done',
            variableName: 'reasoning',
        },

        {
            id: 'additional-copy',
            type: 'options',
            body: true,
            options: [
                { text: yes, targetStepId: 'excessive::additional-copy-prior-request' },
                {
                    text: no,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('excessive', 'additional_copy_no_prior_request', true),
                },
            ],
        },
        {
            id: 'additional-copy-prior-request',
            type: 'options',
            body: true,
            options: [
                {
                    text: yes,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('excessive', 'concerns_different_data', true),
                },
                {
                    text: no,
                    targetStepId: 'base::dead-end',
                    onChoose: ({ reactorState }) => reactorState.setIncludeIssue('excessive', false),
                },
            ],
        },

        {
            id: 'other-reason',
            type: 'textarea',
            body: true,
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
                    id: 'not-free',
                    text: true,
                    targetStepId: 'excessive::start',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIssueFlag('excessive', 'controller_wants_to_charge', true);
                        reactorState.setIncludeIssue('excessive', true);
                    },
                },
                {
                    id: 'action-refusal',
                    text: true,
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
