const core = require('@actions/core');
const github = require('@actions/github');

function getTestResults() {
    const runnerResults = Object.keys(process.env)
        .filter(key => key.startsWith("ATLAS_TEST"))
        .map((key) => {
            const encodedResults = process.env[key];
            const json = Buffer.from(encodedResults, "base64").toString("utf-8");
            return { key, results: JSON.parse(json) };
        });
    return runnerResults;
}

function getTotalPoints() {
    return process.env["ATLAS_TOTAL_POINTS"] ?? 100;
}


try {
    const testResults = getTestResults();
    const numberOfTests = testResults.length;
    const totalPoints = getTotalPoints();
    console.log("Test Cases: ", JSON.stringify(testResults, null, 2))
    console.log("Number of Tests: ", numberOfTests)
    console.log("Points per test: ", totalPoints / numberOfTests)
    console.log("Total Points: ", totalPoints)
} catch (error) {
    core.setFailed(error.message);
}