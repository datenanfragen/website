import t from 'Utility/i18n';

export let tutorial_steps = [
    {
        text: t('request-parameters', 'wizard_tutorial'),
        selector: '.request-parameters',
        position: 'right',
    },
    {
        text: t('company-info', 'wizard_tutorial'),
        selector: 'aside.company-info',
        position: 'top',
    },
    {
        text: t('id-data', 'wizard_tutorial'),
        selector: '.dynamic-input-container',
        position: 'left',
        style: {
            arrow: {
                // For some reason, the default styling for the arrow is broken in this case. We need to fix that.
                left: 'initial',
            },
        },
    },
    {
        text: t('next-request', 'wizard_tutorial'),
        selector: '#generator-controls',
        position: 'left',
    },
];
