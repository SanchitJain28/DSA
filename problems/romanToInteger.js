//MY APPROACH
var romanToInt = function (s) {
  let result = 0
  const values = new Map([
    ["I", 1],
    ["V", 5],
    ["X", 10],
    ["L", 50],
    ["C", 100],
    ["D", 500],
    ["M", 1000]
  ])
  let i = 0
  for (; i < s.length;) {
    let char = s[i]
    let nextChar = s[i + 1]
    if (values.has(char)) {
      if (char === "I" && nextChar === "V") {
        result += 4;
        i += 2;
      }
      else if (char === "I" && nextChar === "X") {
        result += 9;
        i += 2;
      }
      else if (char === "X" && nextChar === "L") {
        result += 40;
        i += 2;
      }
      else if (char === "X" && nextChar === "C") {
        result += 90;
        i += 2;
      }
      else if (char === "C" && nextChar === "D") {
        result += 400;
        i += 2;
      }
      else if (char === "C" && nextChar === "M") {
        result += 900;
        i += 2;
      }
      else {
        const numValue = values.get(char)
        result += numValue
        i++
      }
    }
  }
  return result
};

//CHATGPT APPROACH
/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function (s) {
  let result = 0
  const values = new Map([
    ["I", 1],
    ["V", 5],
    ["X", 10],
    ["L", 50],
    ["C", 100],
    ["D", 500],
    ["M", 1000]
  ])
  for(let i=0 ; i < s.length ;i++){
    let curr = values.get(s[i])
    let next = values.get(s[i+1])
    if(next > curr) result -= curr
    else result+=curr
  }
  return result
};