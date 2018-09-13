import preact from 'preact';
import Cookie from 'js-cookie';

export const PRIVACY_ACTIONS = Object.freeze({
    SEARCH: {
        'id': 'search',
        'suggested': true
    },
    SAVE_MY_REQUESTS: {
        'id': 'save_my_requests',
        'suggested': true
    },
    SAVE_ID_DATA: {
        'id': 'save_id_data',
        'suggested': true
    },
});

export default class Privacy {
    static isAllowed(privacy_action) {
        return Cookie.get(this.cookieNameForAction(privacy_action)) === 'true';
    }

    static setAllowed(privacy_action, value) {
        Cookie.set(this.cookieNameForAction(privacy_action), value, { expires: 365 });
    }

    static clearAllCookies() {
        Object.keys(Cookie.get()).forEach(cookie_name => {
            Cookie.remove(cookie_name);
        });
    }

    static cookieNameForAction(privacy_action) { return 'privacy_control-' + privacy_action.id; }
}
