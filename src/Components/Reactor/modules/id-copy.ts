import { createReactorModule } from '../../../Utility/reactor';
import type { ReactorState } from '../../../store/reactor';
import type { ReactorModuleData } from '../../../types/reactor';

export interface IdCopyModuleData extends ReactorModuleData {
    issue: {
        flags: {
            user_objects: boolean;
            not_linked_to_real_life_identity: boolean;
            concerns_online_account: boolean;
            ask_about_redactions: boolean;
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

// TODO: Hide additional ID step if complaint.

export const module = createReactorModule('id-copy', {
    steps: [
        {
            id: 'start',
            type: 'options',
            body: ({ reactorState }) =>
                reactorState.type === 'admonition'
                    ? 'Requiring a copy of an identity document is an invasive measure that poses a risk for the security of your personal data. It is only appropriate if strictly necessary. Do any of the following counterarguments apply?'
                    : 'Requiring a copy of an identity document is only appropriate if strictly necessary. Which of the following counterarguments applies?',
            options: [
                {
                    text: 'The company doesn’t know me by my real-life identity.',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        setCounterargument(reactorState, 'not_linked_to_real_life_identity'),
                },
                {
                    text: 'My request concerns an online account.',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => setCounterargument(reactorState, 'concerns_online_account'),
                },
                {
                    text: 'I can provide my own counterargument.',
                    targetStepId: 'id-copy::explain-reasoning',
                    onChoose: ({ reactorState }) => setCounterargument(reactorState),
                },
                {
                    text: 'No, none of the above apply.',
                    targetStepId: 'id-copy::no-counterargument',
                    hideIf: ({ reactorState }) => reactorState.type === 'complaint',
                },
            ],
        },

        {
            id: 'explain-reasoning',
            body: 'Please explain why you think a copy of an identity document is not necessary for your request.',
            type: 'textarea',
            nextStepId: 'base::issue-done',
            variableName: 'reasoning',
            rows: 7,
        },

        {
            id: 'no-counterargument',
            type: 'options',
            body: 'In this case, we’ll assume that the company can legitimately ask for an ID copy. Can you/do you want to provide a copy of an identity document for the request? You will be able to redact all information that is not necessary for confirming your identity.',
            options: [
                { text: 'yes', targetStepId: 'id-copy::redaction-info' },
                { text: 'no', targetStepId: 'base::dead-end' },
            ],
        },
        {
            id: 'redaction-info',
            type: 'options',
            body: 'The company can only require you to provide the information that is necessary for confirming your identity. All other information of the ID copy can be redacted. Has the company informed you which data you can redact?',
            options: [
                {
                    text: 'yes',
                    targetStepId: 'id-copy::attach-copy',
                    onChoose: ({ reactorState }) =>
                        reactorState.addAdditionalDataField('id-copy', {
                            type: 'input',
                            // TODO: Translate these. v
                            desc: 'Copy of ID document',
                            value: 'attached',
                        }),
                },
                {
                    text: 'no',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIncludeIssue('id-copy', true);
                        reactorState.setIssueFlag('id-copy', 'ask_about_redactions', true);
                    },
                },
            ],
        },

        // TODO: Better process for attaching ID copies.
        {
            id: 'attach-copy',
            type: 'options',
            body: 'Please create a copy of your identity copy with all unnecessary information redacted and attach that to the message to the company.',
            options: [
                {
                    text: 'Check if there is another problem with the company’s response.',
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
                    text: 'Company requires a copy of an identity document.',
                    targetStepId: 'id-copy::start',
                },
            ],
        },
    ],

    defaultModuleData,
    offerToIncludeInComplaintIf: ({ moduleData }): boolean => {
        return moduleData.issue.flags.user_objects;
    },
});
