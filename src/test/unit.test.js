const test = require('tape');

const { addUserStatus } = require('../controllers/middleware');
const { jobStatusText, jobPrefIsPublic } = require('../views/helpers/index');
const makeFacCohortName = require('../lib/makeFacCohortName');
const removeArrayDuplicates = require('../lib/removeArrayDuplicates');
const githubApiCalls = require('../lib/githubApiCalls');
const lowerCaseArray = require('../lib/lowerCaseArray');


test('UNIT TESTS', (t) => {
  t.ok(true, 'tape is working');
  t.end();
});

// MIDDLEWARE -- Add User Status Function
test('Test addUserStatus - registeredProfile: true', (t) => {
  const originalRequest = {
    user: {
      id: 1,
    },
    session: {
      registeredProfile: true,
    },
  };
  const request = {
    user: {
      id: 1,
    },
    session: {
      registeredProfile: true,
    },
  };
  const actual = addUserStatus(request);
  const expected = {
    id: 1,
    status: {
      login: true,
      signup: false,
    },
  };
  t.deepEquals(actual, expected, 'returns expected result (deepequals)');
  t.deepEquals(request, originalRequest, 'not mutated original request object');
  t.end();
});

test('Test addUserStatus - registeredProfile: false', (t) => {
  const originalRequest = {
    user: {
      id: 1,
    },
    session: {
      registeredProfile: false,
    },
  };
  const request = {
    user: {
      id: 1,
    },
    session: {
      registeredProfile: false,
    },
  };
  const actual = addUserStatus(request);
  const expected = {
    id: 1,
    status: {
      login: false,
      signup: true,
    },
  };
  t.deepEquals(actual, expected, 'returns expected result (deepequals)');
  t.deepEquals(request, originalRequest, 'not mutated original request object');
  t.end();
});

// HANDLEBARS HELPERS

// jobStatusText function tests
test('Test jobStatusText', (t) => {
  t.equals(jobStatusText('red'), 'Not Looking', 'jobStatusText(red) returns correct result');
  t.equals(jobStatusText('orange'), 'Open to opportunities', 'jobStatusText(orange) returns correct result');
  t.equals(jobStatusText('green'), 'Currently Looking', 'jobStatusText(green) returns correct result');
  t.end();
});


// DATABASE HELPERS in Lib folder
test('Test makeFacCohortName', (t) => {
  t.equals(makeFacCohortName('london', 12), 'FAC12', 'makeFacCohortName(\'london\', 12) returns correct result');
  t.equals(makeFacCohortName('gaza', 1), 'FACG1', 'makeFacCohortName(\'gaza\', 1) returns correct result');
  t.equals(makeFacCohortName('nazareth', 3), 'FACN3', 'makeFacCohortName(\'nazareth\', 3) returns correct result');
  t.end();
});

// DUPLICATE HELPER in Lib folder
test('Test removeArrayDuplicates', (t) => {
  const arrayInput = ['javascript', 'javascript', 'JavaScript', 'Node.js']
  const expected = ['javascript', 'Node.js']
  t.deepEquals(removeArrayDuplicates(arrayInput), expected, 'removed');
  t.end();
});

// LOWERCASE HELPER in Lib folder
test('Test lowerCaseArray', (t) => {
  const arrayInput = ['JAVASCRIPT', 'javascript', 'JavaScript', 'Node.js'];
  const expected = ['javascript', 'javascript', 'javascript', 'node.js'];
  t.deepEquals(lowerCaseArray(arrayInput), expected, 'changed to lowercase');
  t.end();
});