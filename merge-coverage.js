const fs = require('fs');
const { createReporter } = require('istanbul-api');
const istanbulCoverage = require('istanbul-lib-coverage');

const map = istanbulCoverage.createCoverageMap({});


['.nyc_output/out.json', 'coverage/coverage-final.json'].forEach((file) => {
    if (fs.existsSync(file)) {
        const content = JSON.parse(fs.readFileSync(file, 'utf8'));
        map.merge(content);
    }
});

const reporter = createReporter();
reporter.addAll(['lcov', 'text']);
reporter.write(map);