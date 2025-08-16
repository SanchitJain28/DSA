// new Map() in JavaScript is like a fancier object for storing key-value pairs. But it’s got some perks over plain old objects {}:

// Keys can be anything — objects, functions, primitives, you name it. Not just strings or symbols like regular objects.

// It keeps the order of insertion — so when you iterate, it respects the order you added stuff.

// Has built-in handy methods like .set(), .get(), .has(), .delete(), .clear().
// | Feature | **Map** | **Object** |
// |---------|---------|------------|
// | **Key Types** | Can be **any type** (string, number, object, function) | Only strings & symbols |
// | **Order** | Preserves insertion order when iterating | Keys order not always guaranteed (numeric keys behave differently) |
// | **Size** | `.size` property gives count instantly | Need `Object.keys(obj).length` |
// | **Performance** | Better for frequent additions/removals | Not optimized for heavy dynamic changes |
// | **Iteration** | Directly iterable with `for..of` or `.forEach()` | Needs `Object.keys/values/entries()` first |
// | **No Prototype Pollution** | Keys don’t conflict with Object prototype methods | Risk of name clashes (`toString`, `constructor`, etc.) |
// | **Key Uniqueness** | Allows unique object/function keys | Not possible in plain objects without converting to strings |


const myMap = new Map([
  [1, "one"],
  [2, "two"],
  [3, "three"],
]);

//set method
myMap.set(1, "Sanchit");
myMap.set("Sanchit", 2);
myMap.set({ a: 1 }, "Answer");

//get method
myMap.get(1); //Sanchit
myMap.get("Sanchit"); //2

//has method
// The has() method of Map instances returns a boolean indicating whether an element with the specified key exists in this map or not.
console.log(myMap.has(1));

//size method => gives the lenght of the map
const mapSize = myMap.size;
console.log(mapSize);

//clear method
// myMap.clear();

//The delete() method of Map instances removes the specified element from this map by key.
myMap.delete(1);

// The entries() method of Map instances returns a new map iterator object that contains the [key, value] pairs for each element in this map in insertion order.

const map2 = new Map();
map2.set("0", "foo");
map2.set(1, "bar");

const iterator = map2.entries();

console.log(myMap);
console.log(iterator);
console.log(iterator.next().value);
console.log(iterator.next().value);
