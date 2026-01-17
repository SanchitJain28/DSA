const groupAnagrams = function (strs: string[]) {
  const map = new Map();
  const ans = [];
  for (let i = 0; i < strs.length; i++) {
    let sortedString = strs[i].split("").sort().join("");
    if (map.has(sortedString)) {
      ans[map.get(sortedString)].push(strs[i]);
    } else {
      map.set(sortedString, ans.length);
      ans.push([strs[i]]);
    }
  }
  console.log(map);
  return ans;
};

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));

function groupAnagramsRetry(strs: string[]) {
  let map = new Map();
  let solution: [string][] = [];
  for (const str of strs) {
    const sortedString = str.split("").sort().join("");
    if (map.has(sortedString)) {
      solution[map.get(sortedString)].push(str);
    } else {
      map.set(sortedString, solution.length);
      solution.push([str]);
    }
  }
  return solution;
}

console.log(groupAnagramsRetry(["eat", "tea", "tan", "ate", "nat", "bat"]));