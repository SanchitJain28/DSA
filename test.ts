const queue : number[] =[1,2,3,4]
//? Remove first element and returns that element
const shift = queue.shift()
//? Add a new element in the front
const unshift = queue.unshift(2)
console.log("Updated Queue : \n", queue ,"\n");
console.log("Shifted (removed) : \n",shift, "\n");
console.log("Unshifted (added) : \n", unshift, "\n");