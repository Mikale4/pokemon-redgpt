/** Minimal test harness shared by the RedGPT test files. */
'use strict';

const assert = require('assert');

/**
 * `REDGPT_TEST_FILTER` runs only the tests whose label contains it.
 *
 * Unset in `npm test`, so an ordinary run is unaffected. It exists for
 * `tools/coverage-controls.js`, which re-runs a suite once per control: the
 * engine suite takes about two minutes end to end, almost all of it in soak
 * tests a control has nothing to say about, which put a 29-control run near an
 * hour.
 *
 * **A filter that matches nothing is a failure, not a pass.** Reporting
 * "0 checks passed" and exiting 0 would make every control downstream vacuous —
 * the harness would see a green suite and conclude the test could not detect the
 * bug, when really the test never ran. That is §11's rule in its most direct
 * form, and it is enforced below rather than left to the caller.
 */
const FILTER = process.env.REDGPT_TEST_FILTER || null;

function createSuite(name) {
  const failures = [];
  let passed = 0;
  let selected = 0;

  function test(label, fn) {
    if (FILTER && !label.includes(FILTER)) return;
    selected++;
    try {
      fn();
      passed++;
    } catch (error) {
      failures.push({label, error});
    }
  }

  function finish() {
    for (const {label, error} of failures) {
      console.error(`  FAIL  ${label}\n        ${String(error.message).split('\n')[0]}`);
    }
    if (failures.length) {
      console.error(`${name}: ${passed} passed, ${failures.length} failed.`);
      process.exit(1);
    }
    if (FILTER && selected === 0) {
      console.error(`${name}: no test label contains "${FILTER}" — refusing to report a vacuous pass.`);
      process.exit(1);
    }
    console.log(`${name}: ${passed} checks passed.${FILTER ? ` (filtered to "${FILTER}")` : ''}`);
  }

  return {test, finish, assert, failures};
}

module.exports = {createSuite, assert};
