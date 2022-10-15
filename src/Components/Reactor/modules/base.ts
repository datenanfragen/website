import { Template } from 'letter-generator';
import { getGeneratedMessage } from '../../../store/proceedings';
import type { ReactorModuleData, ReactorRegularModuleWithDataId } from '../../../types/reactor';
import { objFilter, objMap } from '../../../Utility/common';
import { ErrorException } from '../../../Utility/errors';
import t, { t_r } from '../../../Utility/i18n';
import { createReactorModule, generateLetterContent, yes, no } from '../../../Utility/reactor';
import { REQUEST_ARTICLES } from '../../../Utility/requests';
import { template } from '../templates';
import { reactorModules } from './index';

export interface BaseModuleData extends ReactorModuleData {
    issue: {
        flags: {
            allow_sharing_data_with_controller: boolean;
            // TODO: Introduce `not:<flag>` flags in letter-generator.
            'not:allow_sharing_data_with_controller': boolean;
        };
        variables: Record<string, never>;
    };
}
declare module '../../../types/reactor' {
    interface ReactorModuleDataMapping {
        base: BaseModuleData;
    }
}

const defaultModuleData: BaseModuleData = {
    includeIssue: false,
    issue: {
        flags: { allow_sharing_data_with_controller: false, 'not:allow_sharing_data_with_controller': true },
        variables: {},
    },
    additionalData: [],
};

export const module = createReactorModule('base', {
    steps: [
        {
            id: 'start',
            type: 'condition',
            condition: ({ proceeding }): boolean =>
                getGeneratedMessage(proceeding, 'admonition')?.reactorData === undefined,
            trueStepId: 'base::select-issue',
            falseStepId: 'base::response-or-complaint',
        },

        {
            id: 'response-or-complaint',
            type: 'options',
            body: ({ proceeding }) =>
                getGeneratedMessage(proceeding, 'complaint')
                    ? t('base_response-or-complaint_body_has-complaint', 'reactor')
                    : t('base_response-or-complaint_body_has-admonition', 'reactor'),
            options: [
                { id: 'free', text: true, targetStepId: 'custom-text::start' },
                {
                    id: 'complaint',
                    text: true,
                    targetStepId: 'base::complaint-check-time-since-admonition',
                    onChoose: ({ reactorState }) => reactorState.setType('complaint'),
                    hideIf: ({ proceeding }): boolean =>
                        getGeneratedMessage(proceeding, 'complaint') !== undefined ||
                        !getGeneratedMessage(proceeding, 'admonition')?.reactorData,
                },
                { id: 'nevermind', text: true, targetStepId: 'base::nevermind' },
            ],
        },

        {
            id: 'issue-done',
            type: 'condition',
            condition: ({ reactorState }) => reactorState.type === 'complaint',
            trueStepId: 'base::complaint-next-issue',
            falseStepId: 'base::select-issue',
        },
        {
            // Modules should never go to `base::select-issue` directly. Instead, use `base::issue-done`. This is
            // necessary for generating complaints.
            id: 'select-issue',
            type: 'options',
            body: ({ reactorState }) =>
                reactorState.type === 'admonition'
                    ? Object.keys(reactorState.activeModules()).length > 0
                        ? t('base_select-issue_body_anything-else', 'reactor')
                        : t('base_select-issue_body_problem', 'reactor')
                    : t('base_select-issue_body_additional-issues', 'reactor'),
            options: [
                // These are filled by hooks from the individual modules.
                {
                    text: ({ reactorState }) => t(`base_select-issue_option_generate-${reactorState.type}`, 'reactor'),
                    targetStepId: ({ reactorState }) =>
                        reactorState.type === 'admonition' ? 'base::generate-letter' : 'base::complaint-choose-sva',
                    hideIf: ({ reactorState }) => Object.keys(reactorState.activeModules()).length < 1,
                },
                {
                    id: 'completed',
                    text: true,
                    targetStepId: 'base::nevermind',
                    hideIf: ({ reactorState }) => Object.keys(reactorState.activeModules()).length > 0,
                },
            ],
            optionFilter: (o, state): boolean => {
                const module = reactorModules.find((m) => m.id === o.moduleId);

                // TODO: Do we want to allow users to go through the already answered questions again to change them? If
                // so, how do we display these options to make it clear that they are done already?
                return (
                    !state.reactorState.moduleData[o.moduleId].includeIssue &&
                    state.reactorState.moduleData[o.moduleId].additionalData.length === 0 &&
                    (module?.offerIf === undefined ||
                        (typeof module.offerIf === 'function'
                            ? module.offerIf({
                                  // :(
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  moduleData: state.reactorState.moduleData[o.moduleId] as any,
                                  ...state,
                              })
                            : module.offerIf)) &&
                    (state.reactorState.type !== 'complaint' ||
                        state.reactorState.moduleData[o.moduleId].fromAdmonition !== true)
                );
            },
        },

        {
            id: 'complaint-check-time-since-admonition',
            type: 'condition',
            condition: ({ proceeding }): boolean => {
                const admonition = getGeneratedMessage(proceeding, 'admonition')!;
                const differenceInDays = (Date.now() - admonition.date.getTime()) / (1000 * 60 * 60 * 24);
                return differenceInDays >= 14;
            },
            trueStepId: 'base::complaint-intro',
            falseStepId: 'base::complaint-less-than-two-weeks',
        },
        {
            id: 'complaint-less-than-two-weeks',
            type: 'options',
            body: true,
            options: [
                { id: 'complaint', text: true, targetStepId: 'base::complaint-intro' },
                { id: 'free', text: true, targetStepId: 'custom-text::start' },
            ],
        },
        // TODO: Skip straight to base::select-issue if there are no issues we can include in complaint.
        // ^ Actually, no. The user will always be able to add their own issues, that just isn't implemented yet.
        {
            id: 'complaint-intro',
            type: 'options',
            body: true,
            options: [{ id: 'next', text: true, targetStepId: 'base::complaint-next-issue' }],
            onEnter: (state) => {
                const defaultModuleData = state.reactorState.moduleData;

                const admonition = getGeneratedMessage(state.proceeding, 'admonition');
                if (!admonition)
                    // TODO: For debugging, we obviously need the proceeding. But this also contains very sensitive
                    // data, so the user shouldn't submit that without redacting it. Not sure what to do here.
                    throw new ErrorException('Tried to generate complaint without prior admonition.', {
                        proceeding: state.proceeding,
                    });
                const admonitionModuleData = admonition.reactorData;
                if (!admonitionModuleData || Object.values(admonitionModuleData).length < 1)
                    throw new ErrorException('Tried to generate complaint based on admonition without data.', {
                        proceeding: state.proceeding,
                    });

                const complaintModuleData = objMap(admonitionModuleData, ([moduleId, moduleData]) => {
                    const module = reactorModules.find((m) => m.id === moduleId);
                    if (!module)
                        throw new ErrorException(
                            'Tried to generate complaint based on admonition with non-existent module.',
                            { admonitionModuleData }
                        );

                    return [
                        moduleId as keyof typeof complaintModuleData,
                        {
                            ...moduleData,
                            includeIssue: false,
                            fromAdmonition:
                                moduleData?.includeIssue === true &&
                                (typeof module.offerToIncludeInComplaintIf === 'function'
                                    ? module.offerToIncludeInComplaintIf({
                                          // :(
                                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                          moduleData: moduleData as any,
                                          ...state,
                                      })
                                    : module.offerToIncludeInComplaintIf),
                            resolved: false,
                        },
                    ];
                }) as unknown as typeof state.reactorState['moduleData'];
                // It's possible that new modules have been added since the admonition. We expect their default data to
                // exist in the state.
                state.reactorState.overrideModuleData({ ...defaultModuleData, ...complaintModuleData });
            },
        },
        {
            id: 'complaint-next-issue',
            type: 'condition',
            condition: ({ reactorState }) => {
                const issues = Object.keys(
                    objFilter(reactorState.moduleData, ([, m]) => m?.fromAdmonition === true)
                ) as ReactorRegularModuleWithDataId[];
                const nextIssueIndex = (reactorState.currentIssueForComplaintIndex ?? -1) + 1;
                reactorState.setCurrentIssueIndexForComplaint(nextIssueIndex);
                return nextIssueIndex < issues.length;
            },
            trueStepId: 'base::complaint-issue-resolved',
            falseStepId: 'base::select-issue',
        },
        {
            id: 'complaint-issue-resolved',
            type: 'options',
            body: ({ reactorState, locale }): string =>
                t('base_complaint-issue-resolved_body', 'reactor', {
                    youSaidThat: new Template(
                        template(locale as 'de', `${reactorState.currentIssueForComplaint()!}::you-said-that::issue`),
                        reactorState.moduleData[reactorState.currentIssueForComplaint()!]?.issue.flags,
                        reactorState.moduleData[reactorState.currentIssueForComplaint()!]?.issue.variables
                    ).getText(),
                }),
            options: [
                {
                    id: 'resolved-include',
                    text: true,
                    targetStepId: 'base::complaint-next-issue',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIncludeIssue(reactorState.currentIssueForComplaint()!, true);
                        reactorState.setResolved(reactorState.currentIssueForComplaint()!, true);
                    },
                },
                {
                    id: 'persists-include',
                    text: true,
                    targetStepId: 'base::complaint-issue-changed',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIncludeIssue(reactorState.currentIssueForComplaint()!, true);
                        reactorState.setResolved(reactorState.currentIssueForComplaint()!, false);
                    },
                },
                { id: 'ignore', text: true, targetStepId: 'base::complaint-next-issue' },
            ],
        },
        {
            id: 'complaint-issue-changed',
            type: 'options',
            body: ({ reactorState, locale }): string =>
                t('base_complaint-issue-changed_body', 'reactor', {
                    youSaidThat: new Template(
                        template(locale as 'de', `${reactorState.currentIssueForComplaint()!}::you-said-that::meta`),
                        reactorState.moduleData[reactorState.currentIssueForComplaint()!]?.issue.flags,
                        reactorState.moduleData[reactorState.currentIssueForComplaint()!]?.issue.variables
                    ).getText(),
                }),
            options: [
                { id: 'use-prev', text: true, targetStepId: 'base::complaint-next-issue' },
                {
                    id: 'again',
                    text: true,
                    targetStepId: ({ reactorState }) => `${reactorState.currentIssueForComplaint()}::start`,
                },
            ],
        },
        {
            id: 'complaint-choose-sva',
            type: 'sva-finder',
            body: true,
            nextStepId: 'base::complaint-id-data',
        },
        {
            id: 'complaint-id-data',
            type: 'dynamic-inputs',
            body: true,
            storeIn: 'id_data',
            nextStepId: 'base::complaint-share-data',
        },
        {
            id: 'complaint-share-data',
            type: 'options',
            body: true,
            options: [
                {
                    text: yes,
                    targetStepId: 'base::generate-letter',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIssueFlag('base', 'allow_sharing_data_with_controller', true);
                        reactorState.setIssueFlag('base', 'not:allow_sharing_data_with_controller', false);
                    },
                },
                {
                    text: no,
                    targetStepId: 'base::generate-letter',
                    onChoose: ({ reactorState }) => {
                        reactorState.setIssueFlag('base', 'allow_sharing_data_with_controller', false);
                        reactorState.setIssueFlag('base', 'not:allow_sharing_data_with_controller', true);
                    },
                },
            ],
        },

        {
            id: 'generate-letter',
            type: 'letter',
            body: ({ reactorState }) => t(`base_generate-letter_body_${reactorState.type}`, 'reactor'),
            onEnter: (callbackState) => {
                const originalRequest = getGeneratedMessage(callbackState.proceeding, 'request')!;

                callbackState.generatorState.setCustomLetterProperty('content', generateLetterContent(callbackState));
                callbackState.generatorState.setCustomLetterProperty(
                    'subject',
                    callbackState.reactorState.type === 'response' ||
                        (callbackState.reactorState.type === 'admonition' &&
                            Object.keys(callbackState.reactorState.activeModules(true)).length === 0)
                        ? `Re: ${t_r(
                              `letter-subject-${originalRequest.type as 'access'}`,
                              callbackState.generatorState.request.language
                          )}`
                        : t_r(
                              `letter-subject-${callbackState.reactorState.type}`,
                              callbackState.generatorState.request.language,
                              {
                                  request_recipient: originalRequest.correspondent_address.split('\n')[0],
                                  request_article: REQUEST_ARTICLES[originalRequest.type as 'access'],
                              }
                          )
                );

                callbackState.generatorState.renderLetter();
            },
        },
        {
            id: 'nevermind',
            type: 'options',
            body: true,
            onEnter: ({ reference, proceedingsState }) => proceedingsState.setProceedingStatus(reference, 'done'),
            options: [{ id: 'back', text: true, targetStepId: 'base::to-my-requests' }],
        },
        {
            id: 'to-my-requests',
            type: 'redirect',
            redirectUrl: `${window.BASE_URL}/my-requests`,
        },

        {
            id: 'dead-end',
            type: 'options',
            // TODO: 'or provide your own'
            body: true,
            options: [
                {
                    id: 'next',
                    text: true,
                    targetStepId: 'base::issue-done',
                },
            ],
        },
    ],

    defaultModuleData,
    offerToIncludeInComplaintIf: false,
});
