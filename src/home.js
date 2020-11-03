import { render } from 'preact';
import t from 'Utility/i18n';
import Wizard from 'Components/Wizard';

// has to run before any rendering, webpack will remove this if the condition is false
if (process.env.NODE_ENV === 'development') {
    require('preact/debug');
}

/* modified after https://codepen.io/danielgroen/pen/VeRPOq */
const hero_rights = [
    t('data-access', 'home'),
    t('data-erasure', 'home'),
    t('data-rectification', 'home'),
    t('objection', 'home'),
    t('privacy', 'home')
];

const wizard_div = document.getElementById('home-wizard');
render(<Wizard />, wizard_div.parentElement, wizard_div);

function typewriter(text, i, fnCallback) {
    if (text && i < text.length) {
        document.getElementById('home-hero-word').innerHTML =
            text.substring(0, i + 1) + '<span aria-hidden="true"></span>';

        setTimeout(function() {
            typewriter(text, i + 1, fnCallback);
        }, 150);
    } else if (typeof fnCallback == 'function') {
        setTimeout(fnCallback, 700);
    }
}
function startTextAnimation(i) {
    if (i < hero_rights.length) {
        typewriter(hero_rights[i], 0, () => {
            startTextAnimation(i + 1);
        });
    } else {
        setTimeout(function() {
            startTextAnimation(0);
        }, 20000);
    }
}

window.onload = () => {
    startTextAnimation(0);
};
