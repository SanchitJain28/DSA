export function getTestCaseNumber(): number {
  const args = process.argv.slice(2);
  let testCase = 1; // Default to test case 1
  
  for (const arg of args) {
    if (arg.startsWith('--test=')) {
      const val = parseInt(arg.split('=')[1], 10);
      if (!isNaN(val)) {
        testCase = val;
      }
    }
  }
  
  return testCase;
}
