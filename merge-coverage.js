const fs = require('fs');
const path = require('path');
const { createReporter } = require('istanbul-api');
const istanbulCoverage = require('istanbul-lib-coverage');

const coverageMap = istanbulCoverage.createCoverageMap({});

['coverage/coverage-final.json', 'coverage/cypress-coverage/coverage-final.json'].forEach(file => {
    if (fs.existsSync(file)) {
        const content = JSON.parse(fs.readFileSync(file));
        coverageMap.merge(content);
    }
});

const reporter = createReporter();
reporter.addAll(['lcov', 'text']);
reporter.write(coverageMap);