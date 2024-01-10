import { default as math } from "./index.mjs";

function test(description, fn) {
  try {
    fn();
    console.log(`✅ ${description}`);
  } catch (error) {
    console.log(`❌ ${description}`);
    console.error(error);
  }
}

const testCases = [
  () =>
    test("math.add can handle numbers", function () {
      const sum = math.add(1, 2, 3);
      if (sum !== 6) {
        throw new Error(`math.add did not correctly add numbers`);
      }
    }),

  () =>
    test("math.add can handle complex numbers", function () {
      const sum = math.add({ re: 1, im: 2 }, { re: 3, im: 4 });
      if (sum.re !== 4 || sum.im !== 6) {
        throw new Error(`math.add did not correctly add complex numbers`);
      }
    }),

  () =>
    test("math.exp can handle numbers", function () {
      const result = math.exp(2);
      if (result !== Math.exp(2)) {
        throw new Error(
          `math.exp did not correctly calculate the exponential of a number`
        );
      }
    }),

  () =>
    test("math.exp can handle complex numbers", function () {
      const result = math.exp({ re: 1, im: 2 });
      // The expected result of e^(a + bi) is e^a * (cos(b) + i*sin(b))
      const expected = {
        re: Math.exp(1) * Math.cos(2),
        im: Math.exp(1) * Math.sin(2),
      };
      if (result.re !== expected.re || result.im !== expected.im) {
        throw new Error(
          `math.exp did not correctly calculate the exponential of a complex number`
        );
      }
    }),

  () =>
    test("math.multiply can handle numbers", function () {
      const product = math.multiply(2, 3);
      if (product !== 6) {
        throw new Error(`math.multiply did not correctly multiply numbers`);
      }
    }),

  () =>
    test("math.multiply can handle complex numbers", function () {
      const product = math.multiply({ re: 1, im: 2 }, { re: 3, im: 4 });
      // The expected result of (a + bi) * (c + di) is (ac - bd) + (ad + bc)i
      const expected = {
        re: 1 * 3 - 2 * 4,
        im: 1 * 4 + 2 * 3,
      };
      if (product.re !== expected.re || product.im !== expected.im) {
        throw new Error(
          `math.multiply did not correctly multiply complex numbers`
        );
      }
    }),
];

function testRunner(tests) {
  const results = {
    total: tests.length,
    passed: 0,
    failed: 0,
    errors: [],
  };

  for (const test of tests) {
    try {
      test();
      results.passed++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        test,
        error,
      });
    }
  }

  return results;
}

// Run the tests using the test runner
const results = testRunner(testCases);

// Log the results
console.log(`Total tests: ${results.total}`);
console.log(`Passed tests: ${results.passed}`);
console.log(`Failed tests: ${results.failed}`);
if (results.errors.length > 0) {
  console.log("Errors:");
  for (const { test, error } of results.errors) {
    console.log(`Test: ${test.name}`);
    console.log(`Error: ${error.message}`);
  }
}
