import { render } from 'preact';
import { ReminderWidget } from './Components/ReminderWidget';
import t from './Utility/i18n';

/* modified after https://codepen.io/danielgroen/pen/VeRPOq */
const hero_rights = [
    t('data-access', 'home'),
    t('data-erasure', 'home'),
    t('data-rectification', 'home'),
    t('objection', 'home'),
    t('privacy', 'home'),
];

function typewriter(text: string, i: number, fnCallback: () => void) {
    if (text && i < text.length) {
        document.getElementById('home-hero-word')!.textContent = text.substring(0, i + 1);

        setTimeout(() => typewriter(text, i + 1, fnCallback), 150);
    } else if (typeof fnCallback == 'function') {
        setTimeout(fnCallback, 700);
    }
}
function startTextAnimation(i: number) {
    if (i < hero_rights.length) {
        typewriter(hero_rights[i], 0, () => {
            startTextAnimation(i + 1);
        });
    } else {
        setTimeout(() => startTextAnimation(0), 20000);
    }
}

window.addEventListener('load', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
        document.getElementById('home-hero-word')!.textContent = hero_rights[hero_rights.length - 1];
    } else {
        startTextAnimation(0);
    }
});

const reminderContainer = document.getElementById('home-reminders');
if (reminderContainer) render(<ReminderWidget />, reminderContainer);
