import Table from "cli-table3";
import {
  getTestScore,
} from "./test-helpers";
import { TestResult } from "./types";

type Input = {
  testResults: {
    key: string;
    results: TestResult;
  }[];
  numberOfTests: number;
  maxPoints: number;
  pointsPerTest: number;
};

function round(number: number, precision: number){
  return Math.round(number * 10 * precision) / (10 * precision)
}

export function getTableTotals(
  runnerResults: Input,
  pushToTable: (a: [testName: string, score: number, maxScore: number]) => void
) {
  return runnerResults.testResults.map(({ key, results }) => {
    const maxScore = runnerResults.pointsPerTest;
    const score = getTestScore(results, runnerResults.pointsPerTest);
    const testName = capitalize(
      key.trim().replace("ATLAS_TEST_", "").replace("_", " ")
    );

    pushToTable([testName, round(score, 2), round(maxScore, 2)]);

    return {
      score,
      maxScore,
    };
  });
}

function capitalize(str: string) {
  return str[0].toUpperCase() + str.toLowerCase().slice(1);
}

export function AggregateResults(runnerResults: Input) {
  try {
    const table = new Table({
      head: ["Test Runner Name", "Test Score", "Max Score"],
      colWidths: [20, 13, 13],
    });

    const totals = getTableTotals(runnerResults, (row) => table.push(row));

    // const totalPercent = totals.reduce(totalPercentageReducer, 0).toFixed(2) + "%";
    const totalTestScores = totals.reduce((acc, curr) => acc + curr.score, 0);

    table.push(["Total: ", `${Math.min(Math.round(totalTestScores), runnerResults.maxPoints)}`, `${runnerResults.maxPoints}`]);

    console.log(table.toString());
  } catch (error: any) {
    throw new Error(error.message);
  }
}
