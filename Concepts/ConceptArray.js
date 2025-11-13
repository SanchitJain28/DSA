// NEW THING
Array.from({ length: 1000 }, () => "");
// GENERATES NEW ARRAY WITH THE DESIRED LENGTH

//HERE IS A SYNTAX
const items = [1,2,3,4,5]

Array.from(items);
Array.from(items, mapFn);
Array.from(items, mapFn, thisArg);

console.log(Array.from([1, 2, 3], (e) => e * 8));

//CHECKS IF IT IS ARRAY
Array.isArray([]); // RETURNS TRUE
Array.isArray(2); // returns false

//returns true
Array.isArray([]);
Array.isArray([1]);
Array.isArray(new Array());
Array.isArray(new Array("a", "b", "c", "d"));
Array.isArray(new Array(3));

//retuns false
Array.isArray();
Array.isArray({});
Array.isArray(null);
Array.isArray(undefined);
Array.isArray(17);
Array.isArray("Array");
Array.isArray(true);
Array.isArray(false);
Array.isArray(new Uint8Array(32));

//Array of
Array.of(1, 2, 3, 4); // Takes variables and convert them in an array

// ? To conduct a lopo through an array or iterate through an array use for of loop instead of the normal for loop
//?difference between for-of and forEach loop is

//? for-of = Arrays, strings, Sets, Maps, etc.// This is fuckin netter BRUH !!!
// *  Can use break, continue
// *  Supports await (with async)
// *  Slightly better performance
// *  Cleaner with async functions

// ?forEach = Arrays only (technically, array-like)
// ! Nope, gotta throw exceptions instead
// ! NOPE, doesn’t wait
// ! Painful af
// ! Slightly slower (callback overhead)

for (let element of iterable) {
  //?DO WHATEVER THE SHIT YOU WANT
}

let array = Array.from({ length: 10 }, (e, index) => index);

for (let element of array) {
  console.log(element);
}

//This is more like foreach loop

//to conduct through a loop through object keys ,It gives you the property names (aka keys).
for (const key in object) {
  // do something with object[key]
}

const person = { name: "Sanchez", age: 20 };

for (const key in person) {
  console.log(key, person[key]);
}
// Output:
// name Sanchez
// age 20

//?two - pointer method

//? Two pointers = using two variables (usually indexes) to iterate through a data structure, usually a sorted array or string, from start & end, or side-by-side.

//EXAMPLE
function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }

  return [-1, -1];
}
