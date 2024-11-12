import core from "@actions/core";
import { NotifyClassroom } from "./notify-classroom";
import { TestResult } from "./types";

function getTestResults(): {
  key: string;
  results: TestResult;
}[] {
  const runnerResults = Object.keys(process.env)
    .filter((key) => key.startsWith("ATLAS_TEST"))
    .map((key) => {
      const encodedResults = process.env[key] as string;
      const json = Buffer.from(encodedResults, "base64").toString("utf-8");
      return { key, results: JSON.parse(json) };
    });
  return runnerResults;
}

function getTotalPoints(): number {
  return Number(process.env["ATLAS_MAX_POINTS"] ?? 100);
}

try {
  const testResults = getTestResults();
  const numberOfTests = testResults.length;
  const maxPoints = getTotalPoints();
  const pointsPerTest = maxPoints / numberOfTests;
  const results = { testResults, numberOfTests, maxPoints, pointsPerTest };
  NotifyClassroom(results);
} catch (error) {
  //@ts-ignore
  core.setFailed(error.message);
}
