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


console.log(RecursiveFactorialTheOriginal(10));
console.log(RecursiveFactorialTheChatGpt(10));
console.log(NonRecursiveFactorial(10));
