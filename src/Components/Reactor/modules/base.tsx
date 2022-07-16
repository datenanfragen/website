import type { ReactorModule } from '../../../types/reactor.d';

const module: ReactorModule = {
    steps: [
        {
            id: 'base::start',
            body: 'Has the company fully complied with your request?',
            options: [
                { text: 'yes', targetStepId: 'base::company-complied' },
                { text: 'no', targetStepId: 'base::select-issue' },
            ],
        },
        {
            id: 'base::company-complied',
            body: "TODO: Make sure that's actually the case.",
            // TODO
            options: [],
        },
        {
            id: 'base::select-issue',
            // TODO: Change text to 'Anything else?' if the user has already selected one previously.
            body: 'Which of these options applies?',
            options: [
                // These are filled by hooks from the individual modules.

                // TODO: Disable those already selected by the user. Or do we want to allow them to go through again and
                // change their answers?

                // TODO: Show only one of those depending on whether we've already collected an issue.
                {
                    text: 'Generate a response based on your answers.',
                    targetStepId: 'base::generate-response',
                },
                {
                    text: 'Quit wizard and mark request as completed.',
                    targetStepId: 'base::nevermind',
                },
            ],
        },

        {
            id: 'base::generate-response',
            body: 'TODO: Generate the response.',
            // TODO
            options: [],
        },
        {
            id: 'base::nevermind',
            body: 'TODO: Quit wizard and mark request as completed.',
            // TODO
            options: [],
        },

        {
            id: 'base::dead-end',
            body: 'In this case, we don’t see an issue with the company’s response based on the reason you selected. But you can continue with another reason, if applicable.',
            options: [
                {
                    text: 'Check if there is another problem with the company’s response.',
                    targetStepId: 'base::select-issue',
                },
            ],
        },
    ],
};
export default module;
