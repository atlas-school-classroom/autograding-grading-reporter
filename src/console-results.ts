import { TestResult } from "./types";

import { COLORS } from "./colors";
import { AggregateResults } from "./aggregate-results";
const { getTestScore, getMaxScoreForTest } = require("./helpers/test-helpers");

type Input = {
  testResults: {
    key: string;
    results: TestResult;
  }[];
  numberOfTests: number;
  maxPoints: number;
  pointsPerTest: number;
};

export const ConsoleResults = function ConsoleResults(runnerResults: Input) {
  try {
    let grandTotalPassedTests = 0;
    let grandTotalTests = 0;

    runnerResults.testResults.forEach(({ key, results }, index) => {
      // Fun transition to new runner
      const maxScore = getMaxScoreForTest(results);
      // const weight = getTestWeight(maxScore, totalMaxScore);
      const score = getTestScore(results);
      if (index > 0) {
        console.log(
          `${COLORS.magenta}🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀${COLORS.reset}\n`
        );
      }

      let passedTests = 0;
      const totalTests = results.tests.length;

      console.log(`🔄 Processing: ${key}`);
      results.tests.forEach((test) => {
        if (test.status === "pass") {
          passedTests += 1;
          if (test.line_no !== 0) {
            console.log(
              `${COLORS.green}✅ ${test.name} - line ${test.line_no}${COLORS.reset}`
            );
          } else {
            console.log(`${COLORS.green}✅ ${test.name}${COLORS.reset}`);
          }
        } else if (test.status === "error") {
          console.log(
            `Error: ${test.message || `Failed to run test '${test.name}'`}\n${COLORS.reset}`
          );
        } else {
          if (test.line_no !== 0) {
            console.log(
              `${COLORS.red}❌ ${test.name} - line ${test.line_no}${COLORS.reset}`
            );
          } else {
            console.log(`${COLORS.red}❌ ${test.name}${COLORS.reset}`);
          }
        }
        if (test.test_code) {
          console.log(`Test code:\n${test.test_code}\n`);
        }
      });

      // Update grand totals
      grandTotalPassedTests += passedTests;
      grandTotalTests += totalTests;

      // Calculate and display points for the current runner
      if (maxScore !== 0) {
        console.log(
          `Total points for ${key}: ${score.toFixed(2)}/${maxScore}\n`
        );
      }
    });

    console.log(`${COLORS.magenta}Test runner summary${COLORS.magenta}`);

    // Calculate and display grand total points
    AggregateResults(runnerResults);
    console.log(
      `${COLORS.cyan}🏆 Grand total tests passed: ${grandTotalPassedTests}/${grandTotalTests}${COLORS.reset}\n`
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};
