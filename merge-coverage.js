const { createReport } = require('istanbul-api');
const libReport = require('istanbul-lib-report');
const reports = require('istanbul-reports');
const fs = require('fs');
const path = require('path');
const { merge } = require('istanbul-merge');

const finalCoverage = merge(['coverage-final.json', 'coverage/cypress-coverage/coverage-final.json']);
fs.writeFileSync('coverage/merged-coverage.json', JSON.stringify(finalCoverage));

const context = libReport.createContext({
    dir: 'coverage',
    coverageMap: finalCoverage,
});

const report = reports.create('lcov', {});
report.execute(context);