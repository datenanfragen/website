import Cookie from 'js-cookie';

export const PRIVACY_ACTIONS = Object.freeze({
    SEARCH: {
        id: 'search',
        default: true,
        dnt: true, // I have to decided to enable the search by default even for users with DNT enabled because the [DNT draft](https://tools.ietf.org/html/draft-mayer-do-not-track-00) explicitly focuses on actual tracking, not mere necessary processing by a server. As someone who has enabled DNT themselves, I would personally not see a reason why a website should disable this feature for me.
    },
    SAVE_MY_REQUESTS: {
        id: 'save_my_requests',
        default: true,
        dnt: true,
    },
    SAVE_ID_DATA: {
        id: 'save_id_data',
        default: true,
        dnt: true,
    },
    SAVE_WIZARD_ENTRIES: {
        id: 'save_wizard_entries',
        default: true,
        dnt: true,
    },
    // TELEMETRY: {
    //     'id': 'telemetry',
    //     'default': false,
    //     'dnt': false
    // },
});

export default class Privacy {
    static isAllowed(privacy_action) {
        let cookie_value = Cookie.get(this.cookieNameForAction(privacy_action));

        if (cookie_value === undefined) return Privacy.dntEnabled() ? privacy_action.dnt : privacy_action.default;
        return cookie_value === 'true';
    }

    static setAllowed(privacy_action, value) {
        if (value !== privacy_action.default)
            Cookie.set(this.cookieNameForAction(privacy_action), value, { expires: 365 });
        else Cookie.remove(this.cookieNameForAction(privacy_action));
    }

    static clearAllCookies() {
        Object.keys(Cookie.get()).forEach((cookie_name) => {
            Cookie.remove(cookie_name);
        });
    }

    // Before implementing this, I was jokingly thinking that there is probably a one line NPM package for this. After actually looking into it, that would probably even be justified…
    // The definitive way to check for the Do Not Track setting would be using the `DNT: 1` header — we can't access that.
    // So instead we have to rely on browsers exposing that header through JS. There is currently no [standard](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack) for that; Mozilla, Google and Opera use `navigator.doNotTrack`, whereas IE uses `window.doNotTrack` (expect for IE 9–11, where it's `navigator.msDoNotTrack`). If that wasn't annoying enough already, Mozilla used ('yes', 'no', 'unspecified') instead of ('1', '0', 'unspecified') before Gecko 32.
    // In older version of IE there also [seem](https://testdrive-archive.azurewebsites.net/browser/donottrack/default.html) to be the additional functions `window.external.msTrackingProtectionEnabled()` and `window.external.InPrivateFilteringEnabled()` which we might as well support, too while we're at it.
    static dntEnabled() {
        return (
            navigator.doNotTrack == '1' ||
            window.doNotTrack == '1' ||
            navigator.doNotTrack == 'yes' ||
            navigator.msDoNotTrack == 1 ||
            (window.external &&
                ((!!window.external.msTrackingProtectionEnabled &&
                    typeof window.external.msTrackingProtectionEnabled == 'function' &&
                    window.external.msTrackingProtectionEnabled()) ||
                    (!!window.external.InPrivateFilteringEnabled &&
                        typeof window.external.InPrivateFilteringEnabled == 'function' &&
                        window.external.InPrivateFilteringEnabled())))
        );
    }

    static cookieNameForAction(privacy_action) {
        return 'privacy_control-' + privacy_action.id;
    }
}
