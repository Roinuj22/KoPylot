const withTM = require('next-transpile-modules')(['@cypress/code-coverage']);

module.exports = withTM({
    reactStrictMode: true,
});