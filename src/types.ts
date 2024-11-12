export type TestResult = {
  version: number;
  status: "pass" | "fail" | "error";
  max_score: number;
  tests: {
    name: string;
    status: "pass" | "fail" | "error";
    line_no: number;
    message: string;
    test_code: string;
  }[];
};
