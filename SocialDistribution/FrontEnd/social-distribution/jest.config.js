module.exports = {
  transform: {
    '^.+\.jsx?$': 'babel-jest'
  },
  testRegex: '(/tests/.*|(\.|/)(test|spec))\.jsx?$',
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  "testEnvironment": "jsdom"
};