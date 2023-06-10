import { createReactorModule, yes, no } from '../../../Utility/reactor';
import t from '../../../Utility/i18n';
import type { ReactorState } from '../../../store/reactor';
import type { ReactorModuleData } from '../../../types/reactor';

export interface IdCopyModuleData extends ReactorModuleData {
    issue: {
        flags: {
            user_objects: boolean;
            not_linked_to_real_life_identity: boolean;
            concerns_online_account: boolean;
            ask_about_redactions: boolean;
            controller_requires_unredacted: false;
        };
        variables: { reasoning: string };
    };
}
declare module '../../../types/reactor' {
    interface ReactorModuleDataMapping {
        'id-copy': IdCopyModuleData;
    }
}

const defaultModuleData: IdCopyModuleData = {
    includeIssue: false,
    issue: {
        flags: {
            user_objects: false,
            not_linked_to_real_life_identity: false,
            concerns_online_account: false,
            ask_about_redactions: false,
            controller_requires_unredacted: false,
        },
        variables: { reasoning: '' },
    },
    additionalData: [],
};

const setCounterargument = (state: ReactorState, argumentFlag?: keyof IdCopyModuleData['issue']['flags']) => {
    state.setIncludeIssue('id-copy', true);
    state.setIssueFlag('id-copy', 'user_objects', true);
    if (argumentFlag) state.setIssueFlag('id-copy', argumentFlag, true);
};

export const module = createReactorModule('id-copy', {
    steps: [
        {
            id: 'start',
            type: 'options',
            body: ({ reactorState }) =>
                t(`id-copy_start_body_${reactorState.type === 'admonition' ? 'admonition' : 'other'}`, 'reactor'),
            options: [
                {
                    id: 'unknown-id',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        setCounterargument(reactorState, 'not_linked_to_real_life_identity'),
                },
                {
                    id: 'online-account',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => setCounterargument(reactorState, 'concerns_online_account'),
                },
                {
                    text: ({ reactorState }) =>
                        t(
                            `id-copy_start_option_explain-reasoning-${
                                reactorState.type === 'complaint' ? 'complaint' : 'other'
                            }`,
                            'reactor'
                        ),
                    targetStepId: 'id-copy::explain-reasoning',
                    onChoose: ({ reactorState }) => setCounterargument(reactorState),
                },
                {
                    id: 'unredacted-required',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIncludeIssue('id-copy', true);
                        reactorState.setIssueFlag('id-copy', 'controller_requires_unredacted', true);
                    },
                    hideIf: ({ reactorState }) => reactorState.type !== 'complaint',
                },
                {
                    id: 'none',
                    text: true,
                    targetStepId: 'id-copy::no-counterargument',
                    hideIf: ({ reactorState }) => reactorState.type === 'complaint',
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

        {
            id: 'no-counterargument',
            type: 'options',
            body: true,
            options: [
                { text: yes, targetStepId: 'id-copy::redaction-info' },
                {
                    text: no,
                    targetStepId: 'base::dead-end',
                    onChoose: ({ reactorState }) => reactorState.setIncludeIssue('id-copy', false),
                },
            ],
        },
        {
            id: 'redaction-info',
            type: 'options',
            body: true,
            options: [
                {
                    text: yes,
                    targetStepId: 'id-copy::attach-copy',
                    onChoose: ({ reactorState }) =>
                        reactorState.addAdditionalDataField('id-copy', {
                            type: 'input',
                            desc: t('additional-data-id-copy-desc', 'reactor'),
                            value: t('additional-data-id-copy-value', 'reactor'),
                        }),
                },
                {
                    text: no,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIncludeIssue('id-copy', true);
                        reactorState.setIssueFlag('id-copy', 'ask_about_redactions', true);
                    },
                },
                {
                    id: 'explicit-redaction',
                    text: true,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIncludeIssue('id-copy', true);
                        reactorState.setIssueFlag('id-copy', 'controller_requires_unredacted', true);
                    },
                },
            ],
        },

        // TODO: Better process for attaching ID copies.
        {
            id: 'attach-copy',
            type: 'options',
            body: true,
            options: [
                {
                    id: 'another-problem',
                    text: true,
                    targetStepId: 'base::issue-done',
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
                    id: 'id-document-required',
                    text: true,
                    targetStepId: 'id-copy::start',
                },
            ],
        },
    ],

    defaultModuleData,
    offerToIncludeInComplaintIf: ({ moduleData }): boolean =>
        moduleData.issue.flags.user_objects || moduleData.issue.flags.controller_requires_unredacted,
});
