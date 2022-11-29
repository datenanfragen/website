import { createReactorModule, yes, no } from '../../../Utility/reactor';
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
            body: true,
            options: [
                {
                    text: yes,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIssueFlag('signature', 'signature_on_file', true);
                        reactorState.setIssueFlag('signature', 'not:signature_on_file', false);
                    },
                },
                {
                    text: no,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIssueFlag('signature', 'signature_on_file', false);
                        reactorState.setIssueFlag('signature', 'not:signature_on_file', true);
                    },
                },
                {
                    id: 'unknown',
                    text: true,
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
                    id: 'signature-required',
                    text: true,
                    targetStepId: 'signature::start',
                    onChoose: ({ reactorState }) => reactorState.setIncludeIssue('signature', true),
                },
            ],
        },
    ],

    defaultModuleData,
    offerToIncludeInComplaintIf: true,
});
