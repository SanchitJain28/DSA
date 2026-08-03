function groupAnagrams_(strs: string[]): string[][] {
  //? Initialize the map 
  const map = new Map<string, number>();
  //? Also intialize the result subarray
  let result: string[][] = [];
  for (let str of strs) {
    //? Sort each string
    let sortedString = str.split("").sort().join("");
    if (map.has(sortedString)) result[map.get(sortedString)!].push(str);
    else {
      //? if no , push it to the next index
      map.set(sortedString, map.size);
      result.push([str]);
    }
  }
  return result;
}

groupAnagrams_(["eat", "tea", "tan", "ate", "nat", "bat"]);
// Given an array of strings strs, group all anagrams together into sublists. You may return the output in any order.

// An anagram is a string that contains the exact same characters as another string, but the order of the characters can be different.

// Example 1:

// Input: strs = ["act","pots","tops","cat","stop","hat"]
// Output: [["hat"],["act", "cat"],["stop", "pots", "tops"]]

// Example 2:

// Input: strs = ["x"]
// Output: [["x"]]

// Example 3:

// Input: strs = [""]
// Output: [[""]]
// Constraints:

// 1 <= strs.length <= 1000.
// 0 <= strs[i].length <= 100
// strs[i] is made up of lowercase English letters.
