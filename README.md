## Atlas School Autograding Reporter

This repository is a fork of [https://github.com/classroom-resources/autograding-grading-reporter](https://github.com/classroom-resources/autograding-grading-reporter)

### Overview
**Atlas School Autograding Reporter** is a plugin for GitHub Classroom's Autograder. Use it to report the results of the test execution to students and GitHub Classroom.

### Environment Variables

| Env Name | Description | Required | Default |
|----------|-------------|----------|----------|
| ATLAS_MAX_POINTS | Total number of points tests are worth | No | | 100 |
| ATLAS_TEST_[TEST_NAME] | The value is the result output from the runner. | Yes | |  |

### Usage

1. Add the GitHub Classroom Reporter to your workflow.

```yaml
name: Autograding Tests
on:
  - push
  - workflow_dispatch
  - repository_dispatch
permissions:
  checks: write
  actions: read
  contents: read
jobs:
  run-autograding-tests:
    runs-on: ubuntu-latest
    steps:
      - name: "Test Case: Test One"
        id: test-one
        uses: classroom-resources/autograding-command-grader@v1
        with:
          test-name: test-one
          command: 'echo "Hello World"'
      - name: "Test Case: Test Two"
        id: test-two
        uses: classroom-resources/autograding-command-grader@v1
        with:
          test-name: test-one
          command: diff "lsdfkjsf" "sljdhfksjdf"
      - name: "Test Case: Test Three"
        id: test-three
        uses: classroom-resources/autograding-command-grader@v1
        with:
          test-name: test-three
          command: diff "lsdfkjsf" "sljdhfksjdf"
      # To use this repository's private action,
      # you must check out the repository
      - name: Checkout
        uses: actions/checkout@v4
      - name: Grade Report
        uses: atlas-school-classroom/autograding-grading-reporter@main
        env:
          ATLAS_MAX_POINTS: 50
          ATLAS_TEST_TEST_ONE: "${{steps.test-one.outputs.result}}"
          ATLAS_TEST_TEST_TWO: "${{steps.test-two.outputs.result}}"
          ATLAS_TEST_TEST_THREE: "${{steps.test-three.outputs.result}}"
```

### Example Output
```
🔄 Processing: ATLAS_TEST_TEST_ONE
✅ test-one
Test code:
echo "Hello World"

🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

🔄 Processing: ATLAS_TEST_TEST_TWO
❌ test-one
Test code:
diff "lsdfkjsf" "sljdhfksjdf"

🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

🔄 Processing: ATLAS_TEST_TEST_THREE
❌ test-three
Test code:
diff "lsdfkjsf" "sljdhfksjdf"

Test runner summary
┌────────────────────┬─────────────┬─────────────┐
│ Test Runner Name   │ Test Score  │ Max Score   │
├────────────────────┼─────────────┼─────────────┤
│ Test one           │ 16.67       │ 16.67       │
├────────────────────┼─────────────┼─────────────┤
│ Test two           │ 0           │ 16.67       │
├────────────────────┼─────────────┼─────────────┤
│ Test three         │ 0           │ 16.67       │
├────────────────────┼─────────────┼─────────────┤
│ Total:             │ 16.67       │ 50          │
└────────────────────┴─────────────┴─────────────┘
🏆 Grand total tests passed: 1/3

Error: Some tests failed.
```
