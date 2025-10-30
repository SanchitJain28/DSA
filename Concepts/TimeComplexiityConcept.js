// 1️⃣ What is Time Complexity?
// It’s a way to measure how the running time of an algorithm grows as the size of the input (n) grows.
// We don’t care about exact seconds — instead, we care about growth rate.

//-----------------------------------------------------------------------------------------------------------------------------
// | Complexity     | Name         | Description                                    | Example                                 |
// |------------    |--------------|------------------------------------------------|-----------------------------------------|
// | **O(1)**       | Constant     | Execution time doesn’t depend on `n`           | Accessing an array element              |
// | **O(log n)**   | Logarithmic  | Increases slowly as `n` grows                  | Binary search                           |
// | **O(n)**       | Linear       | Grows proportionally to `n`                    | Loop through an array                   |
// | **O(n log n)** | Log-linear   | Slightly slower than linear, common in sorting | Merge sort, Quick sort (avg case)       |
// | **O(n²)**      | Quadratic    | Time grows as the square of `n`                | Nested loops (e.g., bubble sort)        |
// | **O(n³)**      | Cubic        | Time grows as the cube of `n`                  | Triple nested loops                     |
// | **O(2ⁿ)**      | Exponential  | Doubles with each additional element           | Generating all subsets via recursion    |
// | **O(n!)**      | Factorial    | Explodes in growth rate                        | Traveling Salesman brute force          |
//-----------------------------------------------------------------------------------------------------------------------------

// 1️⃣ O(1) — Constant Time
// Definition:
// The execution time does not change regardless of the input size.
// Example:
// Accessing an element from an array by index:

let arr = [10, 20, 30];
console.log(arr[1]); // Always takes the same time

// 2️⃣ O(log n) — Logarithmic Time
// Definition:
// The execution time grows very slowly — usually when the input size is reduced significantly (often halved) in each step.
// Example:
// Binary search in a sorted array:

arr = [1, 2, 3, ...1000];
// # Find 37 by checking middle, then half, then half again...

// 3️⃣ O(n) — Linear Time
// Definition:
// The execution time grows directly in proportion to the input size.
// Example:
// Looping through an array once:

for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// 4️⃣ O(n log n) — Linearithmic Time
// Definition:
// A combination of linear and logarithmic — often from divide-and-conquer algorithms that process all n elements over log n steps.
// Example:
// Merge sort:

// Split array into halves → O(log n)

// Process each level over all n elements → O(n)
// Total → O(n log n).

// 5️⃣ O(n²) — Quadratic Time
// Definition:
// The execution time grows with the square of the input size — usually from nested loops.
// Example:
// Checking every pair in a list:

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    // work
  }
}

// 6️⃣ O(n³) — Cubic Time
// Definition:
// The execution time grows with the cube of the input size — usually from triple nested loops.
// Example:
// Processing all triplets in a list.

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    for (let k = 0; k < n; k++) {
      //work
    }
  }
}

// 7️⃣ O(2ⁿ) — Exponential Time
// Definition:
// The execution time doubles with each additional element — common in brute-force solutions to combinatorial problems.
// Example:
// Generating all subsets of a set using recursion.

// 8️⃣ O(n!) — Factorial Time
// Definition:
// The execution time grows extremely fast — considering every possible ordering of elements.
// Example:
// Brute-forcing all permutations in the Traveling Salesman Problem.
