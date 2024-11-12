export type TestResult = {
  version: number;
  status: "pass" | "fail" | "error";
  tests: { name: string }[];
};
