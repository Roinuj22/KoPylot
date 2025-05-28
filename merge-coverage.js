const fs = require('fs');
const { createCoverageMap } = require('istanbul-lib-coverage');
const libReport = require('istanbul-lib-report');
const reports = require('istanbul-reports');

const cypressCoverage = JSON.parse(fs.readFileSync('./coverage/cypress-coverage/coverage-final.json'));

const map = createCoverageMap(cypressCoverage);

const context = libReport.createContext({
    dir: './coverage',
    coverageMap: map
});

const report = reports.create('lcov');
report.execute(context);

console.log('✅ Rapport LCOV généré à partir de Cypress');