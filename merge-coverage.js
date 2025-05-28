const { createCoverageMap } = require('istanbul-lib-coverage');
const libReport = require('istanbul-lib-report');
const reports = require('istanbul-reports');
const fs = require('fs');

// Lis les deux fichiers de couverture
const jestCoverage = JSON.parse(fs.readFileSync('./coverage/coverage-final.json'));
const cypressCoverage = JSON.parse(fs.readFileSync('./coverage/cypress-coverage/coverage-final.json'));

// Fusionne les couvertures
const map = createCoverageMap({});
map.merge(jestCoverage);
map.merge(cypressCoverage);

// Génére le rapport LCOV
const context = libReport.createContext({
    dir: './coverage',
    coverageMap: map
});

const report = reports.create('lcov');
report.execute(context);

console.log('✅ Couverture fusionnée avec succès');