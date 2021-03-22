import { render } from 'preact';
import t from 'Utility/i18n';
import Wizard from 'Components/Wizard';

/* modified after https://codepen.io/danielgroen/pen/VeRPOq */
const hero_rights = [
    t('data-access', 'home'),
    t('data-erasure', 'home'),
    t('data-rectification', 'home'),
    t('objection', 'home'),
    t('privacy', 'home'),
];

const wizard_div = document.getElementById('home-wizard');
render(<Wizard />, wizard_div.parentElement, wizard_div);

function typewriter(text, i, fnCallback) {
    if (text && i < text.length) {
        document.getElementById('home-hero-word').textContent = text.substring(0, i + 1);

        setTimeout(function () {
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
        setTimeout(function () {
            startTextAnimation(0);
        }, 20000);
    }
}

window.onload = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
        document.getElementById('home-hero-word').textContent = hero_rights[hero_rights.length - 1];
    } else {
        startTextAnimation(0);
    }
};
