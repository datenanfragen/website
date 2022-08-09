import { createReactorModule } from '../../../Utility/reactor';
import type { ReactorModuleData } from '../../../types/reactor';

export interface SignatureModuleData extends ReactorModuleData {
    issue: {
        // TODO: `not:` flags in letter-generator.
        flags: { signature_on_file: boolean; 'not:signature_on_file': boolean };
        variables: Record<string, never>;
    };
}
declare module '../../../types/reactor' {
    interface ReactorModuleDataMapping {
        signature: SignatureModuleData;
    }
}

const defaultModuleData: SignatureModuleData = {
    includeIssue: false,
    issue: {
        flags: { signature_on_file: true, 'not:signature_on_file': false },
        variables: {},
    },
    additionalData: [],
};

export const module = createReactorModule('signature', {
    steps: [
        {
            id: 'start',
            type: 'options',
            body: `Companies are not allowed to require you to sign your request because they cannot impose their own formal requirements on requests. Besides, signatures are obviously not an appropriate way to identify you.

Does the company have your signature on file? Note that the company cannot require your signature either way, the issue would just be even more clear-cut if they don’t even have your signature on file in the first place.`,
            options: [
                {
                    text: 'yes',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIssueFlag('signature', 'signature_on_file', true);
                        reactorState.setIssueFlag('signature', 'not:signature_on_file', false);
                    },
                },
                {
                    text: 'no',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIssueFlag('signature', 'signature_on_file', false);
                        reactorState.setIssueFlag('signature', 'not:signature_on_file', true);
                    },
                },
                {
                    text: 'I don’t know',
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIssueFlag('signature', 'signature_on_file', true);
                        reactorState.setIssueFlag('signature', 'not:signature_on_file', false);
                    },
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
                    text: 'Company requires request to be signed.',
                    targetStepId: 'signature::start',
                    onChoose: ({ reactorState }) => reactorState.setIncludeIssue('signature', true),
                },
            ],
        },
    ],

    defaultModuleData,
    offerToIncludeInComplaintIf: true,
});
