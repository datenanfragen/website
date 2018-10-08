#!/usr/bin/env node

let child_process = require('child_process');

let test_failed = false;
let argv_copy = process.argv.slice();
let user_args = process.argv.length > 2 ? ' ' + argv_copy.splice(2, process.argv.length - 1).join(' ') : '';
let envs_specified = process.argv.includes('-e');

try {
  if (!envs_specified) {
    let envs = require(__dirname + '/nightwatch.conf.js').test_settings;
    delete envs['default'];

    chunkArrayInGroups(Object.keys(envs), 5).forEach(group => {
      run(group.join(','));
    });
  } else run('');

  if (test_failed) process.exit(1);
} catch (ex) {
  console.log('Error starting test runner:\n\n');
  process.stderr.write(ex.stack + '\n');
  process.exit(1);
}

function run(env) {
  try {
    child_process.execSync(
      'yarn nightwatch -c test/nightwatch.conf.js' + (envs_specified ? '' : ' -e ' + env) + user_args,
      { stdio: [0, 1, 2] }
    );
  } catch (e) {
    test_failed = true;
  }
}

// taken from https://stackoverflow.com/a/40682136
function chunkArrayInGroups(arr, size) {
  let groups = [];
  for (let i = 0; i < arr.length; i += size) {
    groups.push(arr.slice(i, i + size));
  }
  return groups;
}
