import { createReactorModule } from '../../../Utility/reactor';

export const module = createReactorModule('base', {
    steps: [
        {
            id: 'start',
            type: 'options',
            body: 'Has the company fully complied with your request?',
            options: [
                { text: 'yes', targetStepId: 'base::company-complied' },
                { text: 'no', targetStepId: 'base::select-issue' },
            ],
        },
        {
            id: 'company-complied',
            type: 'options',
            body: "TODO: Make sure that's actually the case.",
            // TODO
            options: [],
        },
        {
            id: 'select-issue',
            type: 'options',
            body: (state) =>
                Object.keys(state.activeModules()).length > 0 ? 'Anything else?' : 'Which of these options applies?',
            options: [
                // These are filled by hooks from the individual modules.

                // TODO: Disable those already selected by the user. Or do we want to allow them to go through again and
                // change their answers?

                {
                    text: 'Generate a response based on your answers.',
                    targetStepId: 'base::generate-letter',
                    hideIf: (state) => Object.keys(state.activeModules()).length < 1,
                },
                {
                    text: 'None. Quit wizard and mark request as completed.',
                    targetStepId: 'base::nevermind',
                    hideIf: (state) => Object.keys(state.activeModules()).length > 0,
                },
            ],
        },

        {
            id: 'generate-letter',
            type: 'options',
            body: 'TODO: Properly display letter.',
            // TODO
            options: [],
        },
        {
            id: 'nevermind',
            type: 'options',
            body: 'TODO: Quit wizard and mark request as completed.',
            // TODO
            options: [],
        },

        {
            id: 'dead-end',
            type: 'options',
            body: 'In this case, we can unfortunately not proceed with the problem you selected. But you can continue with another reason, if applicable.',
            options: [
                {
                    text: 'Check if there is another problem with the company’s response.',
                    targetStepId: 'base::select-issue',
                },
            ],
        },
    ],

    defaultModuleData: undefined,
});
