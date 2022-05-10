import t from './Utility/i18n';

export const tutorial_steps = [
    {
        text: t('request-parameters', 'wizard_tutorial'),
        target: '.request-parameters',
        placement: 'right',
    },
    {
        text: t('company-info', 'wizard_tutorial'),
        target: 'aside.company-info',
        placement: 'top',
    },
    {
        text: t('id-data', 'wizard_tutorial'),
        target: '.dynamic-input-container',
        placement: 'left',
        style: {
            arrow: {
                // For some reason, the default styling for the arrow is broken in this case. We need to fix that.
                left: 'initial',
            },
        },
    },
    {
        text: t('next-request', 'wizard_tutorial'),
        target: '#generator-controls',
        placement: 'left',
    },
];
