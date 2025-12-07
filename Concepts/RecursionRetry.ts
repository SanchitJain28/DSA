function Factorial(n: number): number {
  if (n <= 1) return 1;
  return n * Factorial(n - 1);
}

function NonRecursiveFactorial(n: number): number {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}
console.log(Factorial(10));
console.log(NonRecursiveFactorial(10));

interface FileNode {
  name: string;
  children?: FileNode[];
}

function FactorialRecursionRetry(number: number) : number {
  if (n <= 1) return 1;
  return n * FactorialRecursionRetry(n-1)
}
