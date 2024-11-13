import { TestResult } from "../types";
type Input = {
  testResults: {
    key: string;
    results: TestResult;
  }[];
  numberOfTests: number;
  maxPoints: number;
  pointsPerTest: number;
};

export const getMaxScoreForTest = (runnerResult: TestResult) =>
  runnerResult.max_score || 0;

export const getTotalMaxScore = (runnerResults: Input) => {
  return runnerResults.testResults.reduce(
    (acc, { results }) => acc + results.max_score,
    0
  );
};

export const totalPercentageReducer = (
  acc: number,
  {
    score,
    weight,
    maxScore,
  }: { score: number; weight: number; maxScore: number }
) => {
  return acc + ((score || 0) / (maxScore || 1)) * weight;
};

export const getTestScore = (
  runnerResult: TestResult,
  pointsPerTest: number
) => {
  const { tests } = runnerResult;
  const score = runnerResult.tests.reduce((acc, { status }) => {
    return status === "pass" ? acc + 1 : acc;
  }, 0);

  return (score / tests.length) * pointsPerTest;
};

export const getTestWeight = (maxScore: number, allMaxScores: number) => {
  if (maxScore === 0) {
    return (0).toFixed(1);
  }
  const weight = allMaxScores !== 0 ? (maxScore / allMaxScores) * 100 : 0;

  return Math.round(weight).toFixed(2);
};
