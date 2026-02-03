---
name: test_creator
description: Generates comprehensive unit and integration tests for a specific feature or file, ensuring robust code coverage and edge case handling.
---

# Test Creator Skill

This skill focuses on ensuring code reliability through automated testing. It should be used after implementation or during TDD cycles.

## 1. Identify Testing Context
- Determine the testing framework used in the project (e.g., Jest, verify with `package.json` or by looking for existing `.test.js` or `_test.py` files).
- If no testing framework is present, propose installing a standard one (e.g., Vitest/Jest for JS/TS, Pytest for Python).

## 2. Analyze the Target Code
- Read the implementation file to understand:
  - Logic branches (if/else).
  - Edge cases (null inputs, empty arrays).
  - External dependencies (requires mocking).

## 3. Design Test Cases
Create a suite of tests covering:
- **Happy Path**: Does it work with expected inputs?
- **Edge Cases**: Does it handle boundaries, 0, null, undefined?
- **Error Handling**: Does it throw/catch errors gracefully?
- **Integration**: Do components interact correctly?

## 4. Implementation Steps
1. Create the test file (e.g., `Component.test.tsx` next to `Component.tsx` or in `__tests__`).
2. Write the imports and setup (mocks).
3. Implement the test cases.
4. Run the tests using the project's test script (e.g., `npm test`).

## 5. Refinement
- If tests fail, analyze the error.
- Fix the test (if the test is wrong) or fix the code (if the bug is real).
- ensure all tests pass before completing.

## Output
- The `test` command output showing green checks.
