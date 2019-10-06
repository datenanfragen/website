const child_process = require('child_process');

let branch;
try {
    branch =
        process.env.CI_COMMIT_REF_SLUG ||
        child_process
            .execSync('git symbolic-ref --short HEAD')
            .toString()
            .trim();
} catch (e) {
    branch = 'unknown_branch';
}

const LANGUAGES = { en: 'http://localhost:1314', de: 'http://localhost:1313' };

let nightwatch_config = {
    src_folders: ['test/src'],
    output_folder: 'test/reports',
    custom_assertions_path: 'test/assertions',
    custom_commands_path: 'test/commands',
    globals_path: 'globals.js',

    selenium: {
        start_process: false,
        host: 'hub-cloud.browserstack.com',
        port: 80
    },

    test_settings: {
        default: {
            // TODO: Test more than one language?
            launch_url: LANGUAGES.de,
            end_session_on_fail: false,

            desiredCapabilities: {
                browser: 'firefox',

                'browserstack.user': process.env.BROWSERSTACK_USER,
                'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
                'browserstack.local': true,
                'browserstack.localIdentifier': require('os').hostname(),
                'browserstack.debug': true,
                'browserstack.console': 'info',

                project: 'datenanfragen/website' + (branch == 'master' ? '' : '/' + branch),
                build: child_process
                    .execSync('echo "$(git log -1 --pretty=%B) : $(git rev-parse --short HEAD)"')
                    .toString()
                    .trim()
            }
        }
    }
};

for (const i in nightwatch_config.test_settings) {
    let config = nightwatch_config.test_settings[i];
    config.selenium_host = nightwatch_config.selenium.host;
    config.selenium_port = nightwatch_config.selenium.port;
    config.desiredCapabilities = config.desiredCapabilities || {};
}

module.exports = nightwatch_config;
