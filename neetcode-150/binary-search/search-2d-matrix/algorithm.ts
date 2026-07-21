function searchMatrix_(matrix: number[][], target: number): boolean {
  let m = matrix.length;
  let n = matrix[0].length;
  let left = 0;
  let right = m * n - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    //! Doubt : I was stuck at row and column , so extra focus on that
    let row = Math.floor(mid / n);
    let column = mid % n;
    if (matrix[row][column] < target) {
      left = mid + 1;
    } else if (matrix[row][column] > target) {
      right = mid - 1;
    } else {
      return true;
    }
  }
  return false;
}

// You are given an m x n 2-D integer array matrix and an integer target.

// Each row in matrix is sorted in non-decreasing order.
// The first integer of every row is greater than the last integer of the previous row.
// Return true if target exists within matrix or false otherwise.

// Can you write a solution that runs in O(log(m * n)) time?

// Input: ((matrix = [
//   [1, 2, 4, 8],
//   [10, 11, 12, 13],
//   [14, 20, 30, 40],
// ]),
//   (target = 10));

// Output: true;

// Input: ((matrix = [
//   [1, 2, 4, 8],
//   [10, 11, 12, 13],
//   [14, 20, 30, 40],
// ]),
//   (target = 15));

// Output: false;
