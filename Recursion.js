// A function calling itselg
// let count = 0
// function hello() {
//   console.log(count);
//   if(count===100){
//     return
//   }
//   count++
//   hello();
// }

// hello()
let result = 1;
//factorial - THE NORMAL VERSION
function RecursiveFactorialTheOriginal(number) {
  if (number === 1) return result;
  result *= number;
  number--;
  return RecursiveFactorialTheOriginal(number);
}

function RecursiveFactorialTheChatGpt(number) {
  if (number === 1) return 1;
  return number * RecursiveFactorialTheChatGpt(number - 1);
}

function NonRecursiveFactorial(number) {
  let result = 1;
  for (let i = 1; i <= number; i++) {
    result *= i;
  }
  return result;
}

function normalFibonnaciSequence(limit) {
  let array = [0, 1];
  for (let i = 0; i < limit; i++) {
    let sum = array[i] + array[i + 1];
    array.push(sum);
  }
  return array;
}

function RecursiveFibonacciSequence(number) {
  if (number === 0) return 0;
  if (number === 1) return 1;
  return (
    RecursiveFibonacciSequence(number - 1) +
    RecursiveFibonacciSequence(number - 2)
  );
}

console.log(RecursiveFactorialTheOriginal(10));
console.log(RecursiveFactorialTheChatGpt(10));
console.log(NonRecursiveFactorial(10));
console.log(RecursiveFibonacciSequence(10));
console.log(normalFibonnaciSequence(10));
