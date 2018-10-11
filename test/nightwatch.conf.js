const child_process = require('child_process');

const MAC_VERSIONS = ['Yosemite', 'El Capitan', 'Sierra', 'High Sierra'];
const WIN_VERSIONS = ['7', '8', '8.1', '10'];

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

const BROWSERS = {
  win_chrome: {
    desiredCapabilities: {
      os: 'WINDOWS',
      os_version: randomElement(WIN_VERSIONS),
      browser: 'chrome',
      loggingPrefs: { browser: 'ALL' }
    }
  },
  mac_chrome: {
    desiredCapabilities: {
      os: 'OS X',
      os_version: randomElement(MAC_VERSIONS),
      browser: 'chrome'
    }
  },
  win_firefox: {
    desiredCapabilities: {
      os: 'WINDOWS',
      os_version: randomElement(WIN_VERSIONS),
      browser: 'firefox'
    }
  },
  mac_firefox: {
    desiredCapabilities: {
      os: 'OS X',
      os_version: randomElement(MAC_VERSIONS),
      browser: 'firefox'
    }
  },
  // TODO: IE and Safari are currently misbehaving (IE doesn't even support very rudimentary 'new' JS features we are using; there seems to be some kind of issue with Safari on BrowserStack currently [might be related to https://www.browserstack.com/question/664]).
  // We will reactivate those later, once we have looked into that.
  // mac_safari: {
  //   desiredCapabilities: {
  //     os: 'OS X',
  //     os_version: randomElement(MAC_VERSIONS),
  //     browser: 'safari'
  //   }
  // },
  // ie: {
  //   desiredCapabilities: {
  //     os: 'WINDOWS',
  //     os_version: randomElement(WIN_VERSIONS),
  //     browser: 'internet explorer'
  //   }
  // },
  edge: {
    desiredCapabilities: {
      os: 'WINDOWS',
      os_version: '10',
      browser: 'edge'
    }
  }
};

const LANGUAGES = { en: 'http://localhost:1314', de: 'http://localhost:1313' };

nightwatch_config = {
  src_folders: ['test/src'],
  output_folder: 'test/reports',
  custom_assertions_path: 'test/assertions',
  custom_commands_path: 'test/commands',
  globals_path: 'test/globals.js',

  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80
  },
  common_capabilities: {
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
  },

  test_settings: {
    default: {}
  },

  test_workers: {
    enabled: true,
    workers: 5
  }
};

Object.keys(BROWSERS).forEach(browser => {
  Object.keys(LANGUAGES).forEach(lang => {
    let key = browser + '_' + lang;
    nightwatch_config['test_settings'][key] = Object.assign({}, BROWSERS[browser]);
    nightwatch_config['test_settings'][key]['launch_url'] = LANGUAGES[lang];
  });
});

for (let i in nightwatch_config.test_settings) {
  let config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
  config['desiredCapabilities'] = config['desiredCapabilities'] || {};
  for (let j in nightwatch_config.common_capabilities) {
    config['desiredCapabilities'][j] = config['desiredCapabilities'][j] || nightwatch_config.common_capabilities[j];
  }
}

module.exports = nightwatch_config;

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
