import core from "@actions/core";
import { NotifyClassroom } from "./notify-classroom";

function getTestResults(): {
  key: string;
  results: {
    version: number;
    status: "pass" | "fail" | "error";
    tests: { name: string }[];
  };
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

function getTotalPoints() {
  return Number(process.env["ATLAS_TOTAL_POINTS"] ?? 100);
}

try {
  const testResults = getTestResults();
  const numberOfTests = testResults.length;
  const totalPoints = getTotalPoints();
  const pointsPerTest = totalPoints / numberOfTests;
  const results = { testResults, numberOfTests, totalPoints, pointsPerTest };
  NotifyClassroom(results);
} catch (error) {
  //@ts-ignore
  core.setFailed(error.message);
}
