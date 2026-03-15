// s = "bac" , p ="abc"

function isAnagram(s: string, p: string) {
  s = s.split("").sort().join("");
  p = p.split("").sort().join("");
  if (s == p) return true;
  else return false;
}

//here we go optimized
function isAnagramOptimized(s: string, p: string) {
  const map = new Map<string, number>();
  for (let ch of s) {
    map.set(ch, (map.get(ch) ?? 0) + 1);
  }
  for (let ch of p) {
    if (map.has(ch)) {
      let value = map.get(ch)! - 1;
      value === 0 ? map.delete(ch) : map.set(ch, value);
    } else {
      return false
    }
  }
  return map.size === 0 ? true : false;
}
console.log(isAnagramOptimized("a", "abb"));
