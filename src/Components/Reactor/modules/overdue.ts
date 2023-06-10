import { createReactorModule, dateFormat, yes, no } from '../../../Utility/reactor';
import { ErrorException } from '../../../Utility/errors';
import { getGeneratedMessage } from '../../../store/proceedings';
import type { ReactorModuleData } from '../../../types/reactor';

export interface OverdueModuleData extends ReactorModuleData {
    issue: {
        flags: { no_information_about_extension: boolean; more_than_three_months: boolean };
        variables: { request_date: string; reasoning: string };
    };
}
declare module '../../../types/reactor' {
    interface ReactorModuleDataMapping {
        overdue: OverdueModuleData;
    }
}

const defaultModuleData: OverdueModuleData = {
    includeIssue: false,
    issue: {
        flags: { no_information_about_extension: false, more_than_three_months: false },
        variables: { request_date: '', reasoning: '' },
    },
    additionalData: [],
};

export const module = createReactorModule('overdue', {
    steps: [
        {
            id: 'start',
            type: 'options',
            body: true,
            options: [
                {
                    text: yes,
                    targetStepId: 'overdue::controller-gave-reason',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('overdue', 'no_information_about_extension', false),
                },
                {
                    text: no,
                    targetStepId: 'base::issue-done',
                    onChoose: ({ reactorState }) =>
                        reactorState.setIssueFlag('overdue', 'no_information_about_extension', true),
                },
            ],
        },

        {
            id: 'controller-gave-reason',
            type: 'options',
            body: true,
            options: [
                { text: yes, targetStepId: 'overdue::controller-gave-valid-reason' },
                { text: no, targetStepId: 'overdue::controller-gave-invalid-reason' },
            ],
        },
        {
            id: 'controller-gave-valid-reason',
            type: 'condition',
            condition: ({ reactorState }): boolean => {
                if (!reactorState.moduleData.overdue.issue.flags.more_than_three_months)
                    reactorState.setIncludeIssue('overdue', false);
                return reactorState.moduleData.overdue.issue.flags.more_than_three_months;
            },
            trueStepId: 'base::issue-done',
            falseStepId: 'base::dead-end',
        },
        {
            id: 'controller-gave-invalid-reason',
            type: 'textarea',
            body: true,
            variableName: 'reasoning',
            nextStepId: 'base::issue-done',
        },
    ],

    hooks: [
        {
            stepId: 'base::select-issue',
            position: 'before',
            options: [
                {
                    id: 'not-answered',
                    text: true,
                    targetStepId: 'overdue::start',
                    hideIf: ({ proceeding }) => {
                        const request = getGeneratedMessage(proceeding, 'request');
                        // TODO: Do we want proceeding? You know the drill…
                        if (!request) throw new ErrorException('Tried to use reactor without request.', { proceeding });

                        const differenceInDays = (Date.now() - request.date.getTime()) / (1000 * 60 * 60 * 24);
                        return differenceInDays < 31;
                    },
                    onChoose: ({ reactorState, proceeding, generatorState }) => {
                        reactorState.setIncludeIssue('overdue', true);

                        const request = getGeneratedMessage(proceeding, 'request');
                        // TODO: Do we want proceeding? You know the drill…
                        if (!request) throw new ErrorException('Tried to use reactor without request.', { proceeding });

                        reactorState.setIssueVariable(
                            'overdue',
                            'request_date',
                            request.date.toLocaleDateString(generatorState.request.language, dateFormat)
                        );
                        const differenceInDays = (Date.now() - request.date.getTime()) / (1000 * 60 * 60 * 24);
                        reactorState.setIssueFlag('overdue', 'more_than_three_months', differenceInDays >= 93);
                    },
                },
            ],
        },
    ],

    defaultModuleData,
    offerToIncludeInComplaintIf: true,
});
