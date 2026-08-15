# Top K frequent elements solution

**Created:** 6/20/2026 10:06:49  
**Updated:** 8/13/2026 19:17:46  
**Exported:** 8/13/2026 19:24:21  
**Link:** [https://claude.ai/chat/4079f876-517b-4dcb-b053-b97b2a5d05b5](https://claude.ai/chat/4079f876-517b-4dcb-b053-b97b2a5d05b5)  

## User:

> 6/20/2026 10:06:49

```typescript
function topKFrequent(nums: number[], k: number): number[] {
  const map = new Map();
  let result = [];
  for (let i = 0; i < nums.length; i++) {
    if (map.has(nums[i])) {
      map.set(nums[i], map.get(nums[i])! + 1);
    } else {
      map.set(nums[i], 1);
    }
  }
  const sortedArray = [...map.entries()].sort((a, b) => b[1] - a[1]);
  for (let i = 0; i < k; i++) {
    result.push(sortedArray[i][0]);
  }
  return result;
}

is this correct solution , i know it is quite unoptimized
```

## Assistant:

> 6/20/2026 10:06:58

> Verified correctness while identifying type gaps and optimization opportunities.
>
> - The code is functionally correct but has issues: types (map should be Map<number, number>, result should be number[]), and complexity O(n log n) due to sort instead of O(n) bucket sort approach.
>   
>   Let me verify correctness: counts frequencies, sorts descending by freq, takes top k. That's correct for output but not unique guaranteed if ties — problem says answer is unique in any order, so fine.
>   
>   Issues:
>   1. Type annotations missing - `map = new Map()` should be `Map<number, number>`, `result = []` should be `number[]` - TypeScript will infer any/never which is bad practice.
>   2. Time complexity O(n log n) instead of optimal O(n) using bucket sort.
>   3. Could fail if k > unique elements but that's not a constraint per problem.
>   
>   Let me give a direct, concise correctness check and point out the optimization with bucket sort, and fix typing issues per their preference for best practice.
> - **Done**

Yes, it's correct, but two real issues beyond just "unoptimized":

**Type safety bug**: `map` and `result` are implicitly `any[]`/`Map<any,any>`. Fix:
```typescript
const map = new Map<number, number>();
const result: number[] = [];
```

**Complexity**: Sorting is O(n log n). Optimal is O(n) via bucket sort (bucket index = frequency, max frequency ≤ n):

```typescript
function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) {
    freq.set(n, (freq.get(n) ?? 0) + 1);
  }

  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq) {
    buckets[count].push(num);
  }

  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    for (const num of buckets[i]) {
      result.push(num);
      if (result.length === k) break;
    }
  }
  return result;
}
```

O(n) time, O(n) space. Use this over the sort-based version.

## User:

> 6/20/2026 10:07:48

what is the classic solution for this problem

## Assistant:

> 6/20/2026 10:07:57

> Deliberated between heap and bucket sort approaches for interview contexts.
>
> - The classic/canonical solution for "Top K Frequent Elements" (LeetCode 347) - typically presented as the heap-based solution using a min-heap of size k, O(n log k) time. That's the standard textbook approach taught in most algorithm courses/interview prep. Bucket sort is the optimal O(n) one, but "classic" usually refers to the heap approach.
>   
>   Let me give a concise answer covering the heap approach since that's what's typically called "classic" in interview contexts, and mention bucket sort as the optimal one (already given).
> - **Done**

The **heap-based solution** is the canonical textbook approach: maintain a min-heap of size `k`, push `[count, num]` pairs, pop when heap exceeds size `k`. Time: O(n log k).

JS has no built-in heap, so in practice:

```typescript
function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) {
    freq.set(n, (freq.get(n) ?? 0) + 1);
  }

  // min-heap on count
  const heap: [number, number][] = []; // [count, num]

  const swap = (i: number, j: number) => ([heap[i], heap[j]] = [heap[j], heap[i]]);
  const bubbleUp = (i: number) => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] <= heap[i][0]) break;
      swap(p, i);
      i = p;
    }
  };
  const bubbleDown = (i: number) => {
    const n = heap.length;
    while (true) {
      let smallest = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && heap[l][0] < heap[smallest][0]) smallest = l;
      if (r < n && heap[r][0] < heap[smallest][0]) smallest = r;
      if (smallest === i) break;
      swap(i, smallest);
      i = smallest;
    }
  };

  for (const [num, count] of freq) {
    heap.push([count, num]);
    bubbleUp(heap.length - 1);
    if (heap.length > k) {
      swap(0, heap.length - 1);
      heap.pop();
      bubbleDown(0);
    }
  }

  return heap.map(([, num]) => num);
}
```

O(n log k) time, O(n + k) space.

**Practical takeaway**: bucket sort (previous answer) beats this in every case — O(n) vs O(n log k), simpler code, no heap implementation needed. The heap version only matters if you're asked to implement it explicitly (interview testing heap knowledge) or `k` is tiny relative to `n` in a streaming context where you can't bucket. Otherwise, use bucket sort.

## User:

> 6/20/2026 10:31:46

Encode and Decode Strings

explain this question , dont give any solution

## Assistant:

> 6/20/2026 10:32:01

> Deliberated on clarifying encoding/decoding concepts pedagogically.
>
> - Explain the problem without giving a solution.
> - **Done**

**Problem**: Design an algorithm to encode a list of strings into a single string, and decode that string back into the original list of strings.

**Constraints/requirements**:
- `encode(strs: string[]): string` — takes a list of strings, returns one string.
- `decode(s: string): string[]` — takes that encoded string, returns the original list back, exactly as it was.
- The strings in the input list can contain **any character**, including:
  - empty strings `""`
  - spaces
  - the delimiter character you might naively choose (e.g. comma, `#`, etc.)
  - even sequences that look like your encoding scheme itself

**Why it's non-trivial**: The obvious approach — join strings with a delimiter like `,` — breaks immediately if any string contains a comma. You can't just pick "a character that probably won't appear," because the problem expects your solution to handle **adversarial input** where strings deliberately contain whatever delimiter you chose.

**What you're really being tested on**: a self-describing/length-prefixed encoding scheme — i.e., encoding metadata (like the length of each string) into the string itself in a way that's unambiguous to parse back out, rather than relying on a separator character that could collide with the data.

**Edge cases to think about**:
- Empty list `[]`
- List containing empty strings `[""]`
- Strings containing digits, your delimiter, or numbers that look like lengths
- Single string vs many strings

That's the core of it — want me to walk through why length-prefixing solves it, or do you want to try designing the encoding yourself first?

## User:

> 6/20/2026 19:45:11

```typescript
function productExceptSelf(nums: number[]): number[] {
    let result : number[] = [];
    for (let i =0 ; i < nums.length ;i++){
      //left side
      let left = 1 
      for(let j =0 ; j < i ;j++){
        left *=nums[j]
      }
      //right side
      let right = 1
      for(let k = i + 1 ; k < nums.length ;k++){
        right *=nums[k]
      }
      result.push(left*right)
    }
    return result
};

how to solve this question ,this is getting time limit exceeded , i dont know conncept of prefix sum
```

## Assistant:

> 6/20/2026 19:45:20

> Assessed user's TLE issue and determined prefix product explanation with optimized solution needed.
>
> - Explain prefix product technique without giving full solution code? User asked "how to solve this question" - they want explanation of concept. Given prior pattern, they want explanation, not full solution necessarily. But they also showed code and want it fixed - this is more of a "help me fix/understand" not "don't give solution" request. Let's check: earlier they asked explicitly "explain ... dont give any solution" for a different question. For this one, they didn't say don't give solution. They said "how to solve this question, this is getting TLE, i dont know concept of prefix sum". So they want explanation of prefix product/sum concept, likely with solution help since no instruction to withhold it. Given user preferences: concise, precise, best practice, no unnecessary comments. I should explain the concept clearly and provide optimized solution.
>   
>   Let me explain prefix/suffix product technique O(n) time O(1) extra space (besides output array).
> - **Done**

Your current solution is O(n²) because for each index `i`, you recompute the left and right products from scratch with nested loops.

**The fix: precompute prefix and suffix products once, reuse them.**

The key insight: `result[i] = (product of all elements before i) * (product of all elements after i)`.

Instead of recomputing these products from scratch every iteration, build them incrementally:

- `prefix[i]` = product of all elements before index `i`. You can compute this left-to-right: `prefix[i] = prefix[i-1] * nums[i-1]`.
- `suffix[i]` = product of all elements after index `i`. You can compute this right-to-left: `suffix[i] = suffix[i+1] * nums[i+1]`.

Each is a single O(n) pass instead of a nested loop, so total time is O(n).

```typescript
function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n).fill(1);

  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }

  return result;
}
```

This is O(n) time, O(1) extra space (excluding the output array itself) — the optimal solution for this problem.

## User:

> 6/20/2026 20:14:19

![1781966654431_image.png](data:image/webp;base64,UklGRq4rAABXRUJQVlA4IKIrAABQuQCdASpIAsMAPm00lkgkIqIhI3Ka2IANiWlu/lge41/ANMJRn5e+Ur8w/y/oE/ln9X/4uqll00v8AfoBIUdpf8A9AH8F/hWrmlLeJf51+OfmW/P/7B/Xf2d/tfp7+NfLv2P8qP7V7GP8v31vMP2j/Afmj7hfxX6y/dP6/+4/9p9nP8Z/Tf2y/p3oT8H/43+mftx/cvkC/Iv5b/cP7F+3/9v/er29/4D+gdyZqn+U/x/5mfAL6y/Of8R/Yf8L/1v8N7Xvqf9x/M/3L/MP6f/kv7f+4X97///4Afx3+X/4X+6/uh/iP///+/rr/B/8P+0eQp9e/w3+6/t/5M/YD/IP6V/pf79/m//b/pvpO/hv+d/jP8z+0/tB/Mv7x/yf8b/pf2i+wT+Vf1D/c/3r/Kf/D/O//////d3///bv+5f/6/7vwcfs///bmc2V7tMp/wO3Fr7MH9UH8E0vKyjd3kRezNKaXlZRu83mPFrD5knm8SouND4z0jfruyuQ8/CvVzIDE5U3ura7VB5Qh514IvZmiHnrEBUQkKac0Q8/Iuq0lKTD5MbW3fY4rOwL07PsjH/wfBKYzyFhJvkMHTHE4BZx+v0kiEziittnLkeeXZXycBzYN0+bGwCo3ROJR1WWjStmvWVpijHKXdB1R64Yk6vhe/TPekNOLRX4E+BrwmsQExNf1XhiGZQJXhYzLeblNosDpcJEafq6tnVqbAS7sD6++rlG7XQiMbaq7CX4bHuoOXGlzUmIvY21l76lcxo+cjIfBd08X64eE8w2I614qSmIqNm95RXuDeyPWW2/gb7M3wP7wA07GmOiwE9vQSRHpohowFey1lDGgZLwttO/Evai3jq1jhuRxyYxjZiNL20Gv4AehjcbOLQ3lSQ7ra0kflWJGXhUsy/TT8trZUTfVwABrtfgOl6PR8Yt9APBRbs91cdJl5RDz22nTu0wpG/XdldesVeTAwOnKN/VAMBrBAYnmnKkJG/XJ0d9KLZ/1gBTe6sErGKvq18mnruzNC7vQQUqK5cbdSzNC84SNCpouqWZinbMzgk7yiF/vT537iKS6H6pWuF7kHwJHC0wKCYk1+V8FYBBGw4guENgpXPsm6qB3PzgOvD1CKUF8J6MIB8jgSC5Y7NRVzzlo5kRxVe85Owm9vb70yDfCLZyvjUMIeDo+DolMcsyWXN6S7grfUJ8Sn9vPyl7y7YTbwtvvdbUIqUINTvo76ji4bk47zvhLToPmavnTIjM+Ib04fgiirGencza3ItG8VLUIn2fZWQnOy1WbYfeMKvknwdBZ/TlPbE4hUFZ+rARwF6t8au1SSN9ncGYZom5sKZnn6z51gUm+61YiDn6C9HsLrXgmPwAofIECggJW66g8QLYWzxq5islJTuFi7BGnk0B4Vpx15p5dJg2AJx0toXtnt7Zj8+nayDDjbJM+sAORVIiMdASIZjJ2hDNv5FTfE4cMEigvpVdOU7ZG/XdmYswgx9GHpG/XdqgAcaCaan4bqXk8nzVrY+jzvh8zwOhYJ3v3QUfie8iu/fsGXT3ndwai6OGNo6F0CZ4yOksguGECPHXxiOuRvzrN1t+pUuFMyjbpHrRXBCfee0pj+g9B1D9lmy5ghu6JdF4PhUGosmND4qxPhMy2i8HUc7OvEeYdyYLjYysTBeKCYsbshVaYs7tTj6LFA0txukX9MpitMCfIjV8VZMxF0gO/oNPZrcONFK90O3jNl6RuIskUFKnb1LdHddDRSTFuGmSFSAR2xpJyyqS3M3ZXd6RtNJrJA23/NAYTJoiIZSRa8LyxqXVgXABHqVfGFq4alUFXMhh4dpVejpWomY/Xyd9OD01eNgNcNBRL5oSUBpyjqPxUFbbtiP5q/sqUjcUqj8qHZUpL078JdcqCvBY6trzpR7xe3Zh7ts8AUyx84L0emIogy6gvFGZWTZMAu+PjMG6c9/HRj9e3pF1LM0ounKm91bd+m3RD05U3urbqWZoh8sQGIAA/v8S85lKiYGqBs3UgMs/0jqDVow620DxJxzAVyyYEzRrqNHC06UEVDni3QsaO/GDmArlkwJmqC/XPybzBZXrb0lcZ9TkzSPfy/K6i9X+PnYckA+BjyoL9c/JvMO0ttA8QW9w137msgTK77g0tAv+3vyWhR1fAD5qgv1z8m8w1ZaBL16ZoI5LvHjBL2D3pOPfOqd/Q8hAPndfMsGB09+amZdw+MNLNZJGzLHosag6JoKAIIJ3XjG/++pTCFfuLlsEbFfCP/RtiApbNJsBd6XxNj1xvA3GvKeOHqphunoEMIHK6HqfVyUTdEbDcKZaPQKLE2gFcErBXLLTRq64NZaXprsV9ISbs3HLwWxeHAZLbm1YeSeNBadAUeIhX0ENwT5whMOhLhQ0l7cOvKxmkXJMn586Qj9CHyYV5oCHU2J+Iaog6G2rOlPywZ3kZrDgNuxWLxkBmqvX47pjrZ5MoA0MCpBn9OS474dssL855MzHyg5GNWoyQ9rGllWZyHf054JnuNRWciiGoR2Kp0j+TTd0C5FIS5d6XfhGITOTfS/fDyjJk26CpjsjxJc6bXS5lrA07y39GQb66Ibi63aBe0Y8ra2MGCnp9RQ3c47N0mTGSs/+W0jUaWqeFDdAodOMjZ/ZW3A0L8VS3MK3cOWPFksfXl4cTjZkK0JVWBI2FCnaHHgJin2mqXIGddaYxoOwI4fg7Q7SWahOghqzW8s1y/gyAD1MiT0yk7kYdJV+geLmGNx9cvkh5+Hs9se7JY3ymkKuIII/PMayTCLfk/OVfEqvdHE5MYZ1zk9KRPWjjRFj9r/tAEjFzUSH2U0WFD0NLpvyEJGoDOLuHKzBwfGKgbMrAe5FopuPHfK0P6sov/Xvj7FBSGe5D89GOT9O1sRigI7CcWHFs6j3eics8EKeeEpKGY5CEqWX+hefuITLj1E69t4gLhYC73Z4xn2CPnY/ld7SPE2c0cS84Sla2BXCN2dAKYO5reWa5fwY/kDahP5gV3ERut2GeKc8QRyeYHVrp7NqYOkT2SxvlM6OmcxILbUKoAEjVx85Xux/iDePxeTo9D5R+5WDIzxiPwtCWL/lZZWoNA6079Ws50Q9xo4UPx/60uJoOKHhpqb2FBYo2E++Rsz6Ush6dCc674tfN2zdXN9hB/sdUj2D3XX66Lpe+MyJ/hLOq+dEXVc5igG22GpKCZJf2MR7A3MkXS1wUgWRcDZp+b0nQgHFWjyEMTzXEW4hy9XFFRDxsfgyO8W577nK9c8M0VCfp/Z27Vaa4Q5nFF0fRvI9YQulFS0vXSL4xfxZYnV2JRm1Qp8bEYKE7D4E24S6cJzfn9QPwKLnYOCHXJiYvKrnn+XvSmpWOx5XA/36bMH5QUk3vrB0RqvN5Bm6HP3OqiXHKHBv4WKMzuntiBiXV8AgXfcn2cB/pXPijnXrFY8O42nmVVOd+vgHKNoo3+XQMwyc4Qz++BCL7IYofwGiuEdCuo8/Dj0uBo4NcZrVAL5kxLkd+53/bLKYgJjXOOGyFfZG6oDIUYqLp/k8s9ef4R3BNwpzaGkFzeUWXIb5J5jHo3wBe7bprDHDg4Fkcj7EoQgA+R98DIWD5rywGN7DgPRZ4WJhaZyIaWTbtLGR5FAweNZTmuI38GKOHT5cGGWIBTGZnBMAr5UUrVc0CVVoMk93vR5w7pgyFR5aulQ4zoyBdA5eot+ElOxcQduUX/r6aaX8DVcIKBvcUihN3uwOHorIo/KDM5FvKs44kE6uCbGfsqIQGZDQ1zvzfu8wI4eltyDqzkEuqBJEhMYa/cbeB1+RcqYoUvLrURh34L0sDyPPxSLtehRlg8t2FF6rJPSS3QuP7Aj6LrAGM3U7EPfBybGd8+zzXznC80XrOoi537KeHnVPN/ZPM9PfTX8rlgDEFMeZ6HvPEE3b3EWc1HTySsVYR2rCZUp2FCnqNO2aZzd2ijlYvVp8eZ0FDWpN3yv7DuyTFKEd+oVVeIvg8OU6uxrxFTHowFGZX/Ik9WOhfkqgv/UCN25PBddGLLnz2t1XV97BFJMDlVLFNFbgl2J8R4IMb+SDzKhVJqdzlN01pQ3hZ2/z4nOHMf3th7DenInNaiEBu7Z473eD2A9gPpaP9lSE63V6u9dWzb/9MKGloe1Gd3NECvXYx+qRnnX9vuE7NGlUWmHZAqfPwVzSscfuVRGbhiP7fpgg5OwvphrmBKYgUEPgL5ooOCps3gyqcitsb4/qN7oDl7aDswbdy65zbhAnnopTxLPIyfYKCPAgmN8J6wVRKIeokDR2U4TvJ1G92HPsL5aY1W2InulrK/YAca1OP2p5NBug3W/hz+ejd0AKoMdyDx+Big9BF9Am5yD71HaktJxYA5WWxMiN5e3IUgE61HHE25MunS2AWc3dGwRW4DYr/pbg276ETXbE6V/ZECy5ei8QVcGTA6D2sQmFJf3rwcYVneQx0pQI4gfK82tbdMDAz20cvEqSx2rvdrJ9f4/FMwKxU80B+o/xr54pBFLYncT4XY7TQYEgvs8oF2VHzb3RI/Nf0It5kEnTt2X+eU/v+fZ1SoLxwxxDp3Fr2X6plST/lQZguVDrKYI6QDLUVY2CbS6kqdDTRYPmFqcwh7+RQpLhI3l9m2imfM3pXqwT0SFC5OSf4kAJdw7RyxvhTfhGdpZmm6TnGH/NmQv3L6D0JxeWaDQ2XA6ov10bcPEFKzEGf+buoccdacP3mSQn1Jx+mI/QB0lNaEp2e3uTpIquWxCmXJLoy2e900FTrraGPav6Ka96iCgxTH9zjaIu+GuXHmMIdetgn5YypHkYQTxIpEv0jrfhQexBbcxEZdLuOGLxl9B2Qv/ehPotpolUqulNkkRGUTQrYxUGyreog080AFI72ERggg+UILOIyF4DqVqGMX05kjCkRuau9smKCeQuGaf2oOlU0XV9PzsGcisePZqpWIuhIzxkTNbjmg+C8p1RGQOXCNE9C1G8aBKZsW0+P9ap4dJ23fFpOzYGl/oz3xrxXfkq2xG43uuPEC3EPo/wiS0DYzKYs0VF8J4I2rm9yFpZP/NAo2zOAB7tnbgf8OkkNUFWmn5IiL4dmqX4WvPmGNHkCVPKjJhzohAAEZBA81LuUdFRwbIHcxmeAtyPqIpYNvoF+kvUj/9vfmP13v/I//b8t9//hr1W3/mRPhSk8F//zcUX4kSK/5q/LJ7hx18IrYUof5pKlMS+eW4uCTUiiREk+GhbpTt6qGydn7PLXNWmqPOezFFyzq1TVHyCssRy7NBc1E52gWCtqUCgNRuQCOR25e/6pg8xxZVLwBIoypPJ0kCDGCSzbtKvh3A2rL0plx+InZfGsRjqXkEYtPVgkjqZYJRRJEDGDj0CA0fSRhGK/4pdCjE+XsxKFTVMhD4yYXv/5r7AQrXdxBjaUpNgMl0LzoDlKaD+E3srUcTDyqyVW1kQCgRxgLy/IMci6snNRrUs4IEgfKTlQsNKsOX3ibX3JCboRniS+kvrshnZBRuizaXtHVpTtp2JOxDJvtql9Cx9F/pKLbDbgH0TxFgQnGJVvw4m59cIrNjYS4v5xYuSc3g0eFBRjUuPVXzAD1UnhdkRfAedVEoDN9obwke4zNGAKSRc10bQw7uRzHONsqNNzRLRfOdRt3sK42E52i6+LmFpPwnk0vi/pAPeIVl9JJiH0pWfyGQQsujCFj2lUOzEcXkQpF975fTTA4KUHZ9dHwTWDAIfiCgBNuRp9wjvyukGjDQM/X431mFk957WDNs1uU7Moai1JzEgdvWrrWZSoic/l6CfayFeJklVEInpm2V6Hg06P+3MPUdSugyLA/g5UvMbn1DsSVhRfLiCVa5CwKXwmJFhCa1oYesmNyIe7ZmwKtlLRWWh4VJ5rzfytcfe6Blz9iSknU+AP9XXTJABVVKZJrE4wxIdVA2/cMRkyHmfQMiT+KV2E8ose0XoGIJvtMSCV/cTaMO9/xwVyh5uT+1ySsruvtNyHyNZ8MoY0267d3yJqX1X260zafc/CEIpubHhxYcyaTZFX3Z5MQfRKw+uknI84nuL+K88WfbHGPtXdwuqrjhQ9U/qlLDTC4B+zuxAdIq9eS74SlogxkXO7GnvStT2qM2UKmBj0C5X9Lna6fV4awz/TRgHHYMsrzNa8jq2UXRvNXUOCDF9IdvxW9Q7x+a/CJrMHYgfHo8LEz/mozql8mENk8K1hP+WNIfMO3Z7zVrlKVppwYUDXfKFNIHE9aSOeyNkKV2Xx6al2e+UpIOML12QVGywdI6yXbnYmD6i5a+BD7XqGvgUVqjCX3SYZ7GjH+gHEkPytx6qTzGC2nM4+p+BH/4YDbAgsEEJM6zjnTfPdft5dn19s/cMbWxfO+P6WF1/vZYbf7su1KIZTU+d/vRTUoZjsmxufAoIwXKkX6RjtbbORMIS/TUVeWnqbfEWYsMVvkjbdObmjIod6T+7SND2UFVuWjACVnaZacFNb7bdnRaMna5feSHyTTgk92UaJ8euX3wyl4LqtCFlc2RL3R67oSMBF4S3ivSfym+3RUqyVPolMbKd4rLWP9/fHe9W/ySA748BpkNQCV4TMaA+k02OGdHjP8bm3A/JEdaks4thpepK4nFnbOA0dn4og3MOovaM9pJWOXJV1C/drSCLNXsAPrO7VGwl18z3AcHZAY4g5a2X5gUb9rJvTVJ2Cd1bx92IS8dA6HrRujBTshzjkhlORSc3CbjFwUv4P5mh1Zpwpwpu2e36TImB+J4mRHmSeNAFnf5aubIgIAPAbA+aeBX8Ja4c6b4WkZDZMssWqmowYcpQ8cpxw4sr19bWvOlgBwyMc/i/T/AEKtb/ZZrugSQVG8v9ilMRTDVMMy93rnlq0gEurZydfd6K6fuzNbRdEm5LNr1Jj37cmEBMKzeEIoml1SE5IbZQx4Ck1dbhM74lj86CNSCr7xnE/khnrKucHpRqCNWGBvbKT6p/40lj5m2C0IexuGQ7SsIzuX92SmAjBe3MZhhd6F39lZcGPQV41qEaxA+FIcT5kR/zuj3ObBjs6aoM1byUiMbIqcf8TvmWuHl45fJZdUHzXRwpHHzhqkwuqwCwWWNU25rYjKOew2tXsn6iyR5yhEXgSms6/30WMdMA/VjdaE/XcG42tSEeE6ddF/r4J6WDbzlK1OQZ5YEetUcdX1ymBb0M/CLvx8b3AKfKJehynibjTUB1PeJCu5DbPKI3w+Vr8+/3DR5ykrwOkQCD/E34X/azvAZtlAoTZVkDJCTovzzTiN61YLTK0F3bykxbfGpYv2ZjP/E0iJhzy/F9eEvXjn7uWM2/Mq3i5psOEPv9Lgm4fmQmTRLHCes+TA8OGhQgq98p5rUvR3ismbWnEXkqRuETAnkIWAGDIDsnXr5GcvweZT0plyCxWTrMrAlusdnpWDQPXUvpnHjA1X7ZC6VgE8+8TNRByFdllA5mdR7TVTkaMxLpnSwq6lkQYe6cIIVN4JfCwrtviXgeb4kLTgcriFKlUOZfWnnDKkhY0SNDMG9JGcD6EgB5yHYGJMAkKfHk5zSjJv2OgateAJZzi31TxVnFHPjhHwwlGf3Cp7AxbPdvk7i12AM/RW+iIioTYtiIghm0ASfZZiFue8r7jc5I5iOeaJbnhRLzA++AKZMs3cMXTH1F+DhrJyTeaPnDRlYpI+007zvENjxULaBI4kVwuKSZorutTZ3WcWeeUCQMSKst4z/VJfEi2flnz2vnZVVaVOz5OB8p0jj/AiLbGe/qhPy9gIv34yaSukZ4uJ5FikZeiSiufqaYVR5s7So4F6I6p6U9zCyLlX6gmt7soYD7INSb0+dQOC8Rqoi/7BmyriFHMlzLxwy/sjeVxHeb4zVR1oUZXdK+0Fx4A8vSqBis31KFl/ux/v02YPygpJvfWDojVebyDN0Ofuhf4LU++5phb4a8h/lRZlczJHWuebGN4Peo+EeTeaBbnqKniDi/UrfpWWKhL+F6NxKMpqJ/GiggRY9KvW5zuhqecuyicBI2aK+L6zQUGd/274kUEMtPJuci0z+to6nsxgw+qt3YyQyBsn6p/Ja07s23VryslmxDOAjRW6ZUaEow9/E0n/lry0+mlc/IQCBCMNol96JjJgBky7StJvOc7KaE5vzN9NEA23acfW13nlg6InhwcwVg4V9QxXZmlSQLPINapWJhuDcns+O9awyHHsjKhyPjGuldPS8IAc6lFsJPJqZ5n/bGUyOvA2PXJ9AJ4t5UVA53AP2cZDWVV13tQfSthWZL85yVIh72VDTz689JJKMp6wPqP5KvT9ULRpjPHEIWb04/Botw8h0Wln5IILHV8gzAr74JreNdEvPveS1tN8qTNcuUL4uQZ3puBAAAuf05O1lsycMdGb34TLGKVqqLMWPR/W6jv/UE8xBViRSHYOQQpLrwjQnr0/D/PvN5cG1wOyZWzfHGg3/IN8LB1pLrCrNymqOtax5NywtGSx3cdBYW153AlYE6UZt2ICxTi9WN/W6XQwNL9zBWHqn3dPdR7E2WWPCiNcEo5PEMDUKnVNXWkei5aq0cYdCTkn9t+eSgeoNIjq8lL4eFh5pcJ8DGAqHw0X0rTxMMmVz5ke3Om0mT0lU3TGl+OadS6ijSu/EPNVQFp+186r8nnCgnmfHnBu1C2vX/WL+yPGaJj4RYPFznhsSwRtXV/BZJWlLZDtRKnYkm9CsfgRp/+hz5ja/VrGml+EIu0MMS1VlbD+Gqy+/RhldjElKe3WyIh+uajBPKIMjcl1rGkBzWSZELCpsqaTGxS1neafh3hB5HdenZTdjPY6lXYO0J4OI5GhKksMY/nYimjBdleM7KD7YR+i8WE6dDBld7cH4Xt3rtdc6I74XK6/u8ZIf7/gge9//uv5lo1ysuh+9/hzAp8/5I6sn4lLRG9u9vnlcvyaKrxZnzO4VopB0hpRchJbTVaR4nkQu8hgBocKnLocdPETgbmIF/mldIxjf7lrBpqxMSnYBSdVrzAyZ91NXwDSVg4oALVPt3R1dUTIguXw8Dps+0zSkjg+ecq3j17ChBt4qfOjDF+OoUfjhAYhHRSqibtcBdo+WoRQXL5zn2oRSB92Vuf1JJGDsAD1N260dleAmxLdQgZwUX71B5N++TUgwBYueUTKQAJB5Gzqb2FCtjELLqVRXi39tDSfwR5ZaYIbeQRNHamhm7THdNnnw8bC+dSpNxi3FOXANdQW2EM61H+L0XqfLVPQdJJBmdeJ507utJsul+fJpbBrfY2X/MrMIMkIDZPywTpVktZEBlhKe9v1gGXjd/uFfNpdpaNl3ATvmF5IjoBf6VLwWFFN8zi6sZTqpcYIoNyhFsraZy8sB9mM2B1MykvQelAS9bGACDoo7iNt4prJl1atTR5cDgQQLInUAMUF/BxBMD2cBhF85W25n212wp28Gpdri+67J6D9IMSirpu59YfNosK1zZ1/7z2kBubyyPfC392waySK2NdB0pDp/+uSWrzEvALvF+QIg83UchP37aqd9Ex+E1mk6Xemk6hU9Pi343D/x38x+YtcQ9Z5IAx6FF9LTcAcY9WIktk8UXQY2h4bH0lFq7cVIjycSHGyzqi/xI8wy+40Gkt8K7Y0W2QbJskXRcs1VJ+4nUq2ffSLxW9Q7x+a/CJrMHYgfHo8LgXS2G9gxHRvUAUTmJcbfcskbRYfzHpiRzFY5JdI2pSeSK41Ti+2E864ryvLPr7QqKhKhdbSNQ6dpKx6QwLXCrkkxbJo79XcK6PSAA1ZfZrZPnQhDGpdOVqgLVOv6NLvRh+uk73yYQcbDyXgpCmCQn/6yXdrvrB3HDEsI2YJjedxm72OxVzQr9WoGcYz9ZFBSW9T94DuIMAE4bihSdsDRL9oJ82eWQ05NPZEVO1uf5cx2sMhiCB8Ba53XwEFhQXUlvXDmjchINv8poPmBhQcAxvPkR8TP4gUBsuri3Hcsh9SrgBIFdVzTqhxcbTSF15Uef1h9XWA3NFlQIMAUfsNIiDldk2sdI4df+zK4HfY6NYvotVBoo6Ioou5kjBOYiIfluM9rR8W9E72i04J2uHmYswLVkJdNBwct10A63Uc7e1s/ZH28kNs2D+E/1x8ESmtDsRbElBmxZP25JIxxdYf+JTc2H1/Io02eRpE8eYAw1BtR/W60nQWRfAp9Q5Lz4wFvdxJ2M6imzay/KiLSTGo47iuFqkybyMbQpfFxy7+XXwXRxUAsWLr7/iVQ/CLPBrX+jm1KBJ9RQrVTvZsSZfzvnX7nxvLq00vkXuLfpIt/3rtcWAbRkoXU7T6nLi8XJqF1CVK5cEg4ygpnfH+L0HgFmAihwfW70cfAjpfrB9ZbgQCfU8UfqNcs7SZTKboksCyipnqz84SCFoIV/uzjMvfyOIz8yo15QIGf9rP9I8Z1Imldv8Yck2Gpppq4uUuWRvnEL7bYBxrS64bcPk81xTvBNzLDVpB9pjMZYcnB8HDziv8WlJZrrw0Ck+G4qU6s33g1COPA+fs5SLi5ig2dJLQFMKVTEGi+alxifkKUvAMuWnCvbQDaaCYvclN+fnILsjARIOieADRL9Fbt7IK/fDG7yrLEN8Z5z7CDlpD1gZcSHKUCVPOu/GzPsu0fXkFI5MYyHx2apSJRdHMeImLyp2qLTfXv04tY7HwBvMRNLp0EYCbglNGCVCUu5mxcGu6bH/viHyU/7zLYk2OEwivZZd7KDetg6dKnHv+Jpn8lqh7CLQPDICxxgRAugXr8vc6uzltnTiNNBRnh/O48+lDaA7qMOXYIQXNOgN3B9mY9BVAh11UQY1lv/sCHDrvJCnCaFg7yoSAqCKgquCudwVeO3HkQZYoODRqJ2zrhGV/wayYHNzvhsN0fBiFsnrp8548iH5Lt/OshohuB1ERx+ed7Tv9uys2R3lO0wVvYGfijEo5JJ2YCVU/kWuqbgsk8CJCtRfpyiz6p7K9ny3NvZkouysEwAlCxpzpERozX1GuqzIheSlujTQuGjdlTKN0NpE1jCbYyO+vODm6qBZfUhZU7KjNKhNRB+uKElEtB5+gfFRLZgYj1Ldox6DYKB4LtlP54aIHxfmt+cNZm+aJYGt+YvZ0kgpZMnzMkPkc2imSutFWjiJowjb9cUce1+RV/BDV+2+0Eh578E7w73Fj3J3VJRNlV5vq12iFovXYayZiO2e5FzT4CX0q9oNBBhBhoGoIovMn4OLjcvZMLrk0/1VguYMToJYsQ53v97v66/fCP8B7I/fFbY4te8vqAVvD+TyB0JXQEFIiO/lJzFtI1JHlW2molo6MMVbA0yPb6N2bEpcWFBUZVr7dT4xAa4i5ujcH0v+B8xL3b1CBMGdOn4W+5ZGlWPCw2qeZ92Ssavex0MkWdLVwLU44bnC7UbVNT2H07cD1heNN/fzS4wtkRRdmhn/n+FUq6t6W8fs8lLJE9svISDEmQR3Wh7N5mUBlC175OG9ONKl0BF0MZ1BZbuz6kDJmDU4BjgeAjtcRDfJ3SOMjgyXOdQOsnrGjSO2ElaXjoCof/mzy4/ax6nBXbsahryAcmjWhc7b1Gs9i3okx7+0kLGC8aLrIctemg1Gx7e6ArQWPhmU+nABzZfcETB4k3cydwSMvvaI6dGY2NpSUBeX4RoLCwH5TH6Ka8FvEztJPymcAsKCNIqAMFVw6E7yrR6b8PbjIJoTw5XAkrkeqXHxdFc/kIzH8D+ZDrMWS//rY1LzKad+KnXxKQ9DShqtNwK8N1hOHDQCSdOxcfgpDbPXmaNVJC4TKFaBSQjvkvEVjokj74a4ltV+O1H8cG0bn/fDXvy+bXJpmRbA2yzOI4RajwILQYVjDtEqheL6SymYQ/F7p2Io/ooA/1Ju8Xpi+AC8ThptSlhIWmv5yjA4rKeEGQSldRFDZ4AOxHjE0gK5DzEvUSrBDstROqgypUdjk3kL3M1Qw6dk9J9OoxBlQYuKjy7NZ4fEhoviVKCNvMqiDzrJc3CL2CEvm/ucG75XcL1Nac+6wftNTSgRLD+V1xko4wJQadhRfsoHGSaIV+9Sxzuq5YX6LaFsmjGITLW2jT0wNNzBla3aPkEj3fy8A/uIbF3UuPP+SXZoJt4OhBFU10U1n/ji83y7DlGgLcu7goKyTaozzJnCtubU5M4pASK6pUoZCR0wT+KwSkje8l1v7VvfyP3zgDv1eg0Fa+8TbEvEGKgPSnXb0QMLmEXjcSxBzwhnsniIXspZq1w/N0LgT0k2Os5fH6qOMIWzWR6FK2knI6PD9CqJ3jdZGdTSg2Vn5Ng5J74ltLqjpPX87648h/Hn35QsvFVQV0VUa76BjQcOZCnIbm3P/LHonAagoJvmwMqofm5/3soDubD/VP8zQUfDXqm2lCK4DcZO6C5b8T6/QDe7/DYmUMBOzZy1AVTIVINqFqhAjWBahl8IIt0wxMLvNSDkVza42FBGEus+HfihJWozfNYNzd4WE2D+Zn3SUUTiwAp8ASZD1QE/ueBZ78+b6hJ1RhkghxN+8ULT98FsIdezop1zduPhoewD99WEh+0Yvcp27tUGpk9o3EhKUWIT4e/H+ndUekHxTKEzEpVMZLnJbY8Q+Qlpr2NfKk75NKAPolI5JspDcdtawYI3PXoOyCfBjpra3sqpP5MB8V3jhzWRb8nT0Tx/SJRLSRFtnXcpwDLy0yNshTYd2kmT8suWWPKh93sFDbTD2A07AM34WaIw8q6Fpjggif4Djaz3Gb0LjEG2P8U4Z4ev4DyxcnTFvm/CwftRJ3QYc5tyus6RanRbrwgUshh5obW1nmVKeK7sOaFUFykJ38orDzQxQ+oGEy4aXRU1H4j32rQf2fXQ3f1NyZjQNbxT3Xadzf5PW6F0Xa4vUbqN0Gmzk3Phb6TWkMYLEOYQ/Q6/+u4INROXvhBAYUz9XqYYbsXtP58XQdLM8RnTwU69NIz4Sq79piRHxXz2KmQpVm6ViqI0jvn+/9iPFnhQEErvmTkIdCSEOPccX0NHI5GxyITreoebVT0V1hrl5y17tmF5kU6RGc1GR8huBYxfjS4CADipvlfZGG0YnBkDeJf+aY/SArEDqCucpuGRBiaaYrUz8TXaxWQ37B0w40J6rkMGSQ2FrzxCcf4ctCzy/tl/lK0aO0ISMCYi+wGjbKiYkqWtcbxl+OUtxkyKYDs4qP1DicNWBQ8wqGhJqejgp0W2nkhmMf0rnKTgt6LJL5ZFQjW/hTAA9ZTkKfrj0Qvs7ybXjvYEbmA7OOZ6RQ2eSS4VtM1TOpNHuA7CxGiNJdahPMlfKd2/YhxFej4Pf48NOwmeLSrkX8nNU1rVn1w++TAbxUMr8rMEmWLcdq24wuMOGbsdXdagiCZpoVTcZf+Jjxa6oC9JrJdgpKmWUygieDFTLKelRmoCMhC1HmkQ8KXqiPNNXL48GFB5GNuexz4gLVAUJoEIHF5ZlYdAQJvF0nwsXQAWoxbEODgqpeDeJ5qRMJOCnk+xL0yvifC47nae1GY2uSGrM/xbGr6OX3TEh/YnIgDFBn32hgCffHgvWjmk+o8oM/rj/CH2fn6iY5+tIe1iFm5qIXtQdvKKO1GS0MIrLsqMYHrlmw9qb/J2jAgPD71gcjQnUavTbMgDhc+YZzR/m0BAmx0kgDXBRPv7qCRXTB9F1kD18MWnw0FyOdkTpvTHuoGBX1RWFNVYCuA15t26mgkrCgUjzNAaqu2UyltAdql2PZtAE3J43EYE8myoE8wEkKtI3onzO19L5q89vtAq3O3MVTsdEo66RdrCyBgf/q5wanswmP8m/O+T0lfgIlh/K64yUXxOxZsBhuKJGCXyOmPlsmgqLEHEyoC3t9vLnOJPplqaQjwqxB3RfYSBnm/3GRLeatvJoKuECXYXBz7Wr3DJuUCoi5kg51xHOpOJqzA8TVXzyaQgAyHPVPVy0L9N0cJ/eL/BpeSCuufnBw9E7vh1bFZSwIrlvoqAL80bB/16tApWsLNQktlEJWEdApcj9tjTRcgwF/rIElKxuOI8xY7Qi9+cvoK1ghyFYh/ObqDkjQ/c1xS+ea9065JfxmUxc99KbeRMAGOArsZK/Lyddntp0RHaIID+6x4AsYNGuA+nunb5PTsO3af/A3ZNF7bFnsP8fWTpTxvG2NGIvfdPX+6RNZhwabXIJu3Dndl5NznDj/ehCougG/UfmyyMKmiM7U1A4HVq1TW6wGr9tnocWKuYmVBLNKgVBYmc6zXx6ApbzbRrHJ9l3q6lILfNqiReqEn6LsDrGPVEBcgbngcAg97D3jNeBBv2XHRvYh+76pBWK+N9SCX/jUx8SRz1eY3lE6Ss4DPrETF+DlzbbeUusCr8+EqH//A//8v9RjmA9QNs2vwGlCRD/M+S74O3as1qvbz3IOtw2Lw4xPLm6gQF/mCSgPeVMRprWZOgsiKqrS50vdQTyLyziV+8yeHUqyrVS4Y+bp5myA66xTDO1c020RCWhDkJ4KPTtdvcgDWmUDHakAD3S1dlkCuZfcD8AfQoHTeOHQFW+TT7HJiymz/1TKsBZ3vwPk9Tz4MAS0eWp5HDiBmKX8yqUCP9/p4+kTmmunwnBIE0i2DipZnZ23jYwVifXutfstOebgWSWiSjyUmienPzquKGT44VVEJw8Oeni14Jq2E+/Of90GiRbaxD2HB/l9btlHZoew0QXCxoTS8fin3Kkf+6H8Ss3GwKR4VQOtfn0wnPcy+S7ybUyqXbISoWb0zyqopsgSTNAYRdCK4RqbSc72SW6wiiNsZHte5JrwRPsHZYIko1iOpPhIhWL8trJki3mUr3H99BCUFQkYn7AQPSR4iLpP/IAVj2ad93F0iRBcK8dqySjFTfnXLzCF06L/BrHWMTIzQ/vw0yojVIIppU0JdPhIeQzdiCVuBKRWwpC1PrpfBBqCF+f9Nu/jdZMcCgX6iYoPmSd0wUOE5BcanoxooZMvd+fEYzy2o/h5obKA7VToFv/5FTDb2cofKAExJiAAA)

is this incorrect

## Assistant:

> 6/20/2026 20:14:39

> Verified algorithm trace matched expected output correctly.
>
> - Let's check the trace. nums = [1,2,3,4]. Walk through the algorithm:
>   
>   i=0: result[0] = prefix (1); prefix *= nums[0]=1 -> prefix=1
>   i=1: result[1] = prefix (1); prefix *= nums[1]=2 -> prefix=2
>   i=2: result[2] = prefix (2); prefix *= nums[2]=3 -> prefix=6
>   i=3: result[3] = prefix (6); prefix *= nums[3]=4 -> prefix=24
>   
>   So result after prefix pass = [1,1,2,6], and prefix ends at 24.
>   
>   Now let's check image: frames show result building as [1,1,1,1] : result (first two frames), then [1,1,2,1], then [1,1,2,6]. Wait let's look closely.
>   
>   The image shows 4 frames, each with nums=[1,2,3,4], result array, and below "result = X, prefix = Y".
>   
>   Frame 1: result=[1,1,1,1], result=1, prefix=1
>   Frame 2: result=[1,1,1,1], result=1, prefix=2
>   Frame 3: result=[1,1,2,1], result=2, prefix=6
>   Frame 4: result=[1,1,2,6], result=6, prefix=24
>   
>   Hmm, this seems to be tracing through the loop iterations, showing state at each step. Let's think about what state should be at start of each iteration i=0,1,2,3 (before assignment) or after assignment.
>   
>   Actually let's think of it as: before the loop runs iteration i, "result" variable shown = the value about to be assigned (i.e. prefix value before multiplying), and "prefix" = current prefix value before update? Let's check.
>   
>   Let's denote the loop body:
>   ```
>   result[i] = prefix;
>   prefix *= nums[i];
>   ```
>   
>   At iteration i=0: before this line, prefix=1. result[0] set to 1. Then prefix updates to 1*1=1 (nums[0]=1). So after i=0: preffrom=1.
>   
>   iteration i=1: prefix=1 (carried from before). result[1]=1. prefix updates: prefix *= nums[1]=2 -> prefix=2.
>   
>   iteration i=2: prefix=2. result[2]=2. prefix *= nums[2]=3 -> prefix=6.
>   
>   iteration i=3: prefix=6. result[3]=6. prefix *= nums[3]=4 -> prefix=24.
>   
>   So sequence of (result[i] assigned, prefix after update):
>   i=0: assign 1, prefix becomes 1
>   i=1: assign 1, prefitx becomes 2
>   i=2: assign 2, prefix becomes 6
>   i=3: assign 6, prefix becomes 24
>   
>   So final result array = [1,1,2,6], matches our code.
>   
>   …
> - **Done**

This is correct — it's tracing the **prefix pass** of the algorithm correctly. Let me verify against the code:

```
prefix = 1
for i in 0..n:
  result[i] = prefix
  prefix *= nums[i]
```

| i | result[i] assigned | prefix after update |
|---|---|---|
| 0 | 1 | 1 (1×1) |
| 1 | 1 | 2 (1×2) |
| 2 | 2 | 6 (2×3) |
| 3 | 6 | 24 (6×4) |

This matches every frame in your image exactly:
- Frame 1 (after i=0): `result=1, prefix=1` ✓
- Frame 2 (after i=1): `result=1, prefix=2` ✓
- Frame 3 (after i=2): `result=2, prefix=6` ✓
- Frame 4 (after i=3): `result=6, prefix=24` ✓

The array values shown (`[1,1,1,1]` → `[1,1,1,1]` → `[1,1,2,1]` → `[1,1,2,6]`) are also right — unprocessed indices still hold their default `1` until the right-to-left suffix pass multiplies them in.

So this is just the **first half** (prefix pass) of the optimal O(n) solution. The full result only comes after running the suffix pass on top of this.

## User:

> 6/20/2026 20:17:24

![1781966837112_image.png](data:image/webp;base64,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)

is this correct

## Assistant:

> 6/20/2026 20:17:45

> Verified algorithm correctness and identified array update inconsistencies.
>
> - Let's verify the suffix pass. After prefix pass: result = [1,1,2,6].
>   
>   Suffix pass:
>   ```
>   suffix = 1
>   for i = n-1 downto 0:
>     result[i] *= suffix
>     suffix *= nums[i]
>   ```
>   
>   i=3: result[3] = 6*1=6, suffix becomes 1*4=4
>   i=2: result[2] = 2*4=8, suffix becomes 4*3=12
>   i=1: result[1] = 1*12=12, suffix becomes 12*2=24
>   i=0: result[0] = 1*24=24, suffix becomes 24*1=24
>   
>   So expected final result = [24,12,8,6]
>   
>   Now check image: frames show arrow pointing at index 3 first time? Let's check images - arrows point at index... first frame arrow at index ~3 (last element, value 4)? Actually image shows arrow over [1,2,3,4] pointing down at some position - need to infer from values.
>   
>   Frame1: result=[1,1,2,6], result=6, suffix=4 → matches i=3 step (after update: result[3]=6, suffix=4). Correct, but result array shown is [1,1,2,6] - that's the state before update? Actually after i=3 update, result[3] should become 6 (same as before since suffix was 1 multiplied). So array stays [1,1,2,6]. matches.
>   
>   Frame2: result=[1,1,8,6], result=8, suffix=12 → this is after i=2: result[2] = 2*4=8, suffix=4*3=12. Array becomes [1,1,8,6]. matches the listed result=8,suffix=12. Correct.
>   
>   Frame3: result=[1,1,8,6]... wait it shows same array [1,1,8,6] again but result=12, suffix=24. This should be after i=1: result[1] = 1*12=12, suffix=12*2=24. But array should become [1,12,8,6], not [1,1,8,6]! The image shows array unchanged at [1,1,8,6] for frame3, which is incorrect - result[1] update isn't reflected in the array shown.
>   
>   Frame4: result=[1,1,8,6], result=24, suffix=24 → after i=0: result[0]=1*24=24, suffix=24*1=24. Array should become [24,12,8,6]. But shown array is still [1,1,8,6].
>   
>   So frames 3 and 4 show stale/incorrect arrays - the array isn't being updated with the result value, only the "result" variable label is updated but the array snapshot isn't refreshed. This is an inconsistency/error in the trace.
>   
>   …
> - **Done**

The scalar values (`result` and `suffix`) are correct, but the **arrays shown in frames 3 and 4 are wrong** — they don't reflect those updates.

Let's verify with the actual algorithm:
```
suffix = 1
for i = 3 downto 0:
  result[i] *= suffix
  suffix *= nums[i]
```

Starting from `[1,1,2,6]` (end of prefix pass):

| i | result[i] *= suffix | array after | suffix after |
|---|---|---|---|
| 3 | 6\*1=6 | [1,1,2,**6**] | 1\*4=4 |
| 2 | 2\*4=8 | [1,1,**8**,6] | 4\*3=12 |
| 1 | 1\*12=12 | [1,**12**,8,6] | 12\*2=24 |
| 0 | 1\*24=24 | [**24**,12,8,6] | 24\*1=24 |

So:
- Frame 1: `result=6, suffix=4`, array `[1,1,2,6]` ✓ correct
- Frame 2: `result=8, suffix=12`, array `[1,1,8,6]` ✓ correct
- Frame 3: `result=12, suffix=24`, array should be **`[1,12,8,6]`**, but image shows `[1,1,8,6]` ✗ wrong — index 1 was never updated to 12
- Frame 4: `result=24, suffix=24`, array should be **`[24,12,8,6]`**, but image shows `[1,1,8,6]` ✗ wrong — neither index 0 nor index 1 reflects their updates

The final answer should be `[24,12,8,6]`, not `[1,1,8,6]`. The `result`/`suffix` scalar tracking is right, but whoever drew this forgot to update the array snapshot in the last two steps.

## User:

> 6/29/2026 17:18:25

```typescript
threeSum(nums: number[]): number[][] {
        //we will sort the array first
        nums.sort((a, b) => a - b)
        let n = nums.length
        //initiate the result variable
        let result: number[][] = []
        let target = 0
        //we are fixing one number 
        for (let i = 0; i < n - 1; i++) {
            //we have to avoid duplicates here
            if (nums[i] === nums[i - 1]) continue;
            let j = i + 1
            let k = n - 1
            while (j < k) {
                let sum = nums[i] + nums[j] + nums[k]
                if (sum < target) j++
                else if (sum > target) k--
                else {
                    result.push([nums[i], nums[j], nums[k]])
                    //we have to avoid duplocates here 
                    j++
                    k--
                }
            }
        }
        return result
    }

is this wrong , just give me a hint , where i am missing right now
```

## Assistant:

> 6/29/2026 17:18:29

Two bugs:

1. `nums[i] === nums[i - 1]` — what happens when `i === 0`?

2. When you find a match and do `j++; k--`, you're not skipping over duplicate values at the new `j` and `k` positions before the next comparison. Think about what `[-2, -2, 0, 0, 2, 2]` would do after finding one valid triplet.

## User:

> 6/29/2026 17:19:17

```typescript
threeSum(nums: number[]): number[][] {
        //we will sort the array first
        nums.sort((a, b) => a - b)
        let n = nums.length
        //initiate the result variable
        let result: number[][] = []
        let target = 0
        //we are fixing one number 
        for (let i = 0; i < n - 1; i++) {
            //we have to avoid duplicates here
            if (i > 0 && nums[i] === nums[i - 1]) continue;
            let j = i + 1
            let k = n - 1
            while (j < k) {
                let sum = nums[i] + nums[j] + nums[k]
                if (sum < target) j++
                else if (sum > target) k--
                else {
                    result.push([nums[i], nums[j], nums[k]])
                    //we have to avoid duplocates here 
                    j++
                    k--
                }
            }
        }
        return result
    }
```

## Assistant:

> 6/29/2026 17:19:20

Bug 1 fixed. Bug 2 still there — give it a shot: after `result.push(...)`, before the next `while` iteration, you need to skip duplicate values at `j` and at `k`. What condition would you check, and where would you put it relative to `j++` and `k--`?

## User:

> 6/29/2026 17:19:32

how much percent problem is complete in percentage

## Assistant:

> 6/29/2026 17:19:54

> They want a rough completion percentage estimate of the fix.
>
> - They want a rough completion percentage estimate of the fix.
> - **Done**

Roughly **90% complete**.

What's correct: sorting, outer-loop duplicate skip, two-pointer logic, sum comparisons, pushing the triplet.

What's missing: the inner duplicate-skip after a match (10%) — without it you'll get duplicate triplets in the output for inputs with repeated values (e.g. `[-2,-2,0,0,2,2]` will push `[-2,0,2]` more than once).

## User:

> 6/29/2026 17:27:26

```typescript
class Solution {
    /**
     * @param {number[]} nums
     * @return {number[][]}
     */
    threeSum(nums: number[]): number[][] {
        //we will sort the array first
        nums.sort((a, b) => a - b)
        let n = nums.length
        //initiate the result variable
        let result: number[][] = []
        let target = 0
        //we are fixing one number 
        for (let i = 0; i < n - 1; i++) {
            //we have to avoid duplicates here
            if (i > 0 && nums[i] === nums[i - 1]) continue;
            let j = i + 1
            let k = n - 1
            while (j < k) {
                let sum = nums[i] + nums[j] + nums[k]
                if (sum < target) j++
                else if (sum > target) k--
                else {
                    result.push([nums[i], nums[j], nums[k]])
                    //we have to avoid duplocates here 
                    while (j < k && nums[j] === nums[j - 1]) j++
                    while (k > j && nums[k] === nums[k + 1]) k--
                }
            }
        }
        return result
    }
}
```

## Assistant:

> 6/29/2026 17:27:44

> Identified critical infinite loop bug in duplicate-skipping logic.
>
> - Check the bug: after pushing, the inner while loops skip duplicates but never advance j and k past the matched value itself. Let's trace: nums[j] === nums[j-1]? At point of push, j hasn't moved yet, so nums[j-1] is not the same as nums[j] necessarily (nums[j-1] is the previous element, not the current match). Wait, this is the classic bug - they need to increment j and k first, then skip duplicates.
>   
>   Let's trace through: after push, j and k still point at matched values. The while loop checks nums[j] === nums[j-1] - but nums[j] is current value (just used), nums[j-1] is the element before it. If they're equal, it skips. But this never increments past the original matched j itself before checking - wait, since the condition starts checking at current j against j-1, if nums[j] != nums[j-1], the loop won't advance j at all! So j stays the same, k stays the same, and next while iteration recomputes the same sum again - infinite loop or duplicate push.
>   
>   Actually wait: the while condition is structured as "skip while current equals previous" but it doesn't first move forward by one. This is the bug - the standard solution does:
>   ```
>   j++; k--
>   while (j < k && nums[j] === nums[j-1]) j++
>   while (j < k && nums[k] === nums[k+1]) k--
>   ```
>   So you need to increment first, then skip duplicates of the same value you just used.
>   
>   In the user's code, they removed the j++/k-- and replaced with while loops that check nums[j] === nums[j-1] without first incrementing. So if nums[j] !== nums[j-1] (likely scenario), the while condition is false immediately, j and k don't move, causing infinite loop (since sum stays 0, will push duplicate result forever).
>   
>   This is a real bug - infinite loop in most cases now. Let me also check the k loop condition: nums[k] === nums[k+1], k > j. Same issue.
>   
>   So percent complete: this introduces an infinite loop bug. Actually let's reconsider — maybe they intended this as replacement for j++; k-- but forgot to include the increment first. …
> - **Done**

This is now **broken in a worse way** — you've introduced an infinite loop.

The problem: you removed `j++` and `k--`, but your duplicate-skip `while` loops check `nums[j] === nums[j-1]` and `nums[k] === nums[k+1]` *before* moving forward. If the current `j`/`k` don't equal their *previous* unprocessed neighbor (the common case), the while condition is `false` immediately — so `j` and `k` never move at all.

Trace `[-1, 0, 1]`: after pushing `[-1,0,1]`, `nums[j]=0` vs `nums[j-1]=-1` → not equal → loop doesn't run, `j` stays `1`. Same for `k`. Back in the outer `while`, `sum` is recomputed with the same `j,k` → same result → pushes `[-1,0,1]` again, forever. **Infinite loop.**

You need to advance past the matched element *first*, then skip duplicates of what you just moved past:

```typescript
j++
k--
while (j < k && nums[j] === nums[j - 1]) j++
while (j < k && nums[k] === nums[k + 1]) k--
```

The increment has to happen before the dedup check — dedup is about skipping repeats of the value you already used, not about comparing the unmoved pointer to its neighbor.

## User:

> 6/29/2026 17:28:12

give me solution now

## Assistant:

> 6/29/2026 17:28:16

> Marshaled comprehensive solution delivery.
>
> - Provide the full corrected solution.
> - **Done**

```typescript
class Solution {
    threeSum(nums: number[]): number[][] {
        nums.sort((a, b) => a - b)
        const n = nums.length
        const result: number[][] = []
        const target = 0

        for (let i = 0; i < n - 1; i++) {
            if (i > 0 && nums[i] === nums[i - 1]) continue;

            let j = i + 1
            let k = n - 1

            while (j < k) {
                const sum = nums[i] + nums[j] + nums[k]
                if (sum < target) j++
                else if (sum > target) k--
                else {
                    result.push([nums[i], nums[j], nums[k]])
                    j++
                    k--
                    while (j < k && nums[j] === nums[j - 1]) j++
                    while (j < k && nums[k] === nums[k + 1]) k--
                }
            }
        }
        return result
    }
}
```

O(n²) time, O(n log n) or O(1) sort space depending on engine — optimal for this problem.

## User:

> 6/29/2026 17:29:31

means , the problem was i removed this
j++ k--

after finding triplet ?

## Assistant:

> 6/29/2026 17:29:34

> Resolved loop increment-decrement placement issue.
>
> - Confirm directly and clearly per user preference.
> - **Done**

Yes, exactly. You need `j++` and `k--` to actually advance past the matched elements. Without them, `j` and `k` stay frozen on the same pair forever — the outer `while (j < k)` keeps recomputing the same `sum`, pushing the same triplet infinitely.

The dedup `while` loops are a separate, additional step — they skip *further* duplicates after you've already moved past the matched pair. They don't replace the move, they happen after it.

## User:

> 6/30/2026 11:45:46

```json
{
  "name": "sliding-window",
  "path": "/Users/sanchitjain/vscode_files/DSA/problems/sliding-window",
  "type": "directory",
  "children": [
    {
      "name": "MaxiumumSubArrayOfSumK.ts",
      "type": "file",
      "icon": "📘"
    },
    {
      "name": "characterReplacement.ts",
      "type": "file",
      "icon": "📘"
    },
    {
      "name": "findAnagrams.ts",
      "type": "file",
      "icon": "📘"
    },
    {
      "name": "findAnagramsRetry.ts",
      "type": "file",
      "icon": "📘"
    },
    {
      "name": "lengthOfLongestSubstring.ts",
      "type": "file",
      "icon": "📘"
    },
    {
      "name": "lengthOfLongestSubstringKDistinct.ts",
      "type": "file",
      "icon": "📘"
    },
    {
      "name": "longestOnes.ts",
      "type": "file",
      "icon": "📘"
    },
    {
      "name": "maxVowels.ts",
      "type": "file",
      "icon": "📘"
    },
    {
      "name": "minSubArrayLen.ts",
      "type": "file",
      "icon": "📘"
    },
    {
      "name": "numSubarrayProductLessThanK.ts",
      "type": "file",
      "icon": "📘"
    }
  ],
  "metadata": {
    "generated": "2026-06-30T06:14:53.504Z",
    "generator": "FileTree Pro Extension",
    "version": "0.2.0",
    "showIcons": true,
    "maxDepth": 10
  }
}

i want to revise sliding window , i did not have done for months ,so what questions to do such that i cover all concepts of sliding window
```

## Assistant:

> 6/30/2026 11:46:01

> Analyzed existing problems and identified missing sliding window concepts.
>
> - They want a curated list of sliding window problems covering all concepts, given their existing folder. Let me give a concise, well-organized answer per their preferences (concise, precise, no fluff).
>   
>   Sliding window concepts: fixed-size window, variable-size window (shrinkable), variable-size with at-most-K condition, monotonic deque for max/min in window, two-pointer with frequency map, prefix-sum combined with window.
>   
>   Let me map their existing files to concepts, then point out gaps.
>   
>   Their files:
>   - MaxiumumSubArrayOfSumK - fixed size window
>   - characterReplacement - variable window with frequency map
>   - findAnagrams - fixed size window with frequency map
>   - findAnagramsRetry - duplicate
>   - lengthOfLongestSubstring - variable window, no fixed size, shrink on duplicate
>   - lengthOfLongestSubstringKDistinct - variable window, at most K distinct
>   - longestOnes - variable window, max consecutive ones III, at most K flips
>   - maxVowels - fixed size window
>   - minSubArrayLen - variable window, shrinkable, minimize
>   - numSubarrayProductLessThanK - variable window, counting subarrays
>   
>   Good coverage already. Missing concepts: monotonic deque (sliding window maximum), subarray sum equals K (prefix sum + hashmap, not exactly sliding window but related), permutation in string (similar to findAnagrams), longest substring with at most 2 distinct characters (similar to K distinct), minimum window substring (classic hard variable window), fruit into baskets (same as K distinct), grumpy bookstore owner, max consecutive ones, k-radius subarray, subarrays with k different integers (exactly K, harder), max points from cards (different angle - fixed window from both ends).
>   
>   I should give a concise list with the concept tag for each, prioritizing gaps not covered by existing files.
> - **Done**

Based on your existing files, you've already covered: fixed-size window, variable-size shrinkable window, frequency-map-based window, and "at most K" pattern. Here's what's **missing** to get full coverage:

**1. Monotonic deque (sliding window maximum/minimum)** — distinct technique, not covered by anything in your folder
- Sliding Window Maximum (LC 239)

**2. Minimum Window Substring** — the hardest classic variable-window problem, combines frequency map + shrink-to-minimize
- Minimum Window Substring (LC 76)

**3. Exactly K (not "at most K")** — requires the `atMost(K) - atMost(K-1)` trick, a different mental model than what `lengthOfLongestSubstringKDistinct` teaches
- Subarrays with K Different Integers (LC 992)
- Binary Subarrays With Sum (LC 930) — same trick, easier intro

**4. Permutation matching** — closely related to your `findAnagrams` but worth doing for the variant
- Permutation in String (LC 567)

**5. Fixed window from both ends (not a contiguous middle window)** — different shape entirely
- Maximum Points You Can Obtain from Cards (LC 1423)

**6. Subarray sum equals K (exact target, negative numbers allowed)** — sliding window *fails* here since array isn't monotonic; tests whether you know when to switch to prefix-sum + hashmap instead
- Subarray Sum Equals K (LC 560)

**Suggested order**: do #3 (atMost trick) and #1 (monotonic deque) first since those are genuinely new techniques, then #2 (hardest synthesis problem), then #4 and #6 as "does sliding window even apply here" checks, #5 last as cleanup.

Also: delete `findAnagramsRetry.ts` or rename it — having two files for the same problem will confuse future-you during revision.

## User:

> 6/30/2026 11:51:21

bro , i want to revise , i dont want to do new question right now , i am trying to get my form back

## Assistant:

> 6/30/2026 11:51:28

> Devised revision strategy to rebuild confidence.
>
> - User wants to revise existing problems, not new ones. Give a revision plan based on what they have.
> - **Done**

Fair. Here's a revision pass through your existing files, ordered by concept difficulty so each one rebuilds the muscle for the next:

1. **lengthOfLongestSubstring.ts** — basic variable window, no frequency map needed (just last-seen index or a Set). Warm-up.
2. **maxVowels.ts** — fixed-size window. Confirms you remember the fixed-window template (add new, remove old, no shrink condition).
3. **MaxiumumSubArrayOfSumK.ts** — fixed-size window again, but with sum tracking instead of a set.
4. **minSubArrayLen.ts** — variable window, shrink-while-condition-met. Different shrink direction than #1.
5. **longestOnes.ts** — variable window with a "budget" (flips allowed) instead of a count — tests if you can generalize the shrink condition beyond simple counts.
6. **numSubarrayProductLessThanK.ts** — variable window with a product instead of sum/count, plus the classic "count subarrays ending at j" trick (`result += j - i + 1`). This one trips people up most after a break.
7. **characterReplacement.ts** — frequency map + "budget" combined. Harder version of #5.
8. **findAnagrams.ts** and **lengthOfLongestSubstringKDistinct.ts** — full frequency-map window, fixed and variable respectively. Do these last since they're the most involved.

For each file: cover the body, re-derive it from the function signature alone, then check against your old code. Don't just read your old solutions — that won't tell you if the recall is actually back.

Want me to quiz you on one at a time instead, starting with #1?

## User:

> 6/30/2026 11:59:17

will this cover the full revision of sliding window ?

## Assistant:

> 6/30/2026 11:59:25

> Weighed coverage gaps in sliding window revision comprehensively.
>
> - The user asks if revising existing 10 files covers full revision of sliding window. Need honest answer: it covers most core patterns but not everything (monotonic deque, exactly-K trick, minimum window substring). Be direct per user preference - correct, not just agreeable.
> - **Done**

No. It covers the patterns you've already practiced, but two important sliding-window variants aren't represented in your folder at all, so revising only these 10 files will leave gaps:

**Missing: Minimum Window Substring pattern.** None of your files do "shrink-after-match" with a "have I covered all required chars" check (frequency map of target + count of satisfied chars). `findAnagrams`/`KDistinct` are close but not the same — those don't have a "found a valid window, now minimize it" step.

**Missing: Monotonic deque (sliding window max/min).** Completely different technique — none of your 10 files touch this. It's not a variation of anything you have; it's a separate tool in the sliding-window toolbox.

**Missing: "Exactly K" via atMost(K) − atMost(K−1).** Your `KDistinct` file only handles "at most K", not "exactly K" — different trick.

So: revising your 10 files = full revision of *fixed-window* and *shrinkable-variable-window* patterns. It is **not** full revision of sliding window as a topic overall.

If your goal right now is just "get back in shape / rebuild confidence," your 10 files are the right call — don't dilute it with new patterns while you're rusty. But know that once you're warmed up, you still owe yourself those 3 gaps before you'd call sliding window "fully revised."

## User:

> 6/30/2026 12:00:56

ok , let me revise these 7 or 8 question from my files, then i will do missing topics , because i have not learned these topics right now

## Assistant:

> 6/30/2026 12:00:58

Sounds right. Get the existing patterns solid first, then tackle min-window-substring, monotonic deque, and exactly-K fresh — no point learning new patterns on a rusty foundation.

Go ahead and start whenever you're ready — paste your attempt for whichever file you pick first and I'll check it.

## User:

> 6/30/2026 20:09:39

```typescript
function lengthOfLongestSubstring(s: string): number {
  let i = 0;
  let j = 0;
  const set = new Set();
  let longestStrLen = 0;
  while (j < s.length) {
    while (set.has(s[j])) {
      set.delete(s[i]);
      i++;
    }
    set.add(s[j]);
    j++;
    longestStrLen = Math.max(longestStrLen, j - i);
  }
  return longestStrLen;
};

is this correct ? 
```

## Assistant:

> 6/30/2026 20:09:51

> Check correctness. Standard sliding window with set, shrink while duplicate. Loo…
>
> - Check correctness. Standard sliding window with set, shrink while duplicate. Looks correct.
>   
>   Trace "abba": i=0,j=0 set={} ; s[0]='a' not in set, add a, j=1, len=max(0,1)=1
>   j=1 s[1]='b' not in set, add b, j=2,len=2
>   j=2 s[2]='b' in set -> delete s[i=0]='a', i=1; check set.has('b') still true -> delete s[i=1]='b', i=2; now set empty, has('b') false, exit inner loop. add b, j=3, len=max(2,3-2=1)=2
>   j=3 s[3]='a', set has 'b' only, not 'a'. add a, j=4, len=max(2,4-2=2)=2
>   result 2. Correct answer for "abba" is 2. Correct.
>   
>   Type: Set() without type param - should be Set<string> for type safety but works.
>   
>   Looks correct overall. Should note minor type issue.
> - **Done**

Correct. Logic, shrink condition, and pointer movement are all right.

One nitpick: `const set = new Set();` is untyped (`Set<unknown>`), should be `Set<string>` for type safety — same category of issue as your earlier `Map` problem.

## User:

> 7/1/2026 21:10:31

```typescript
function maxVowels(s: string, k: number): number {
  let maxVowels = 0
  let i = 0
  let j = 0
  let vowels = 0
  while (j < s.length) {
    if (isVowel(s[j])) vowels++
    if (j - i - 1 > k && isVowel(s[i])) {
      vowels--
      i++
    }
    j++
    maxVowels = Math.max(maxVowels , vowels)
  }
  return maxVowels
};

function isVowel(s: string) {
  if (s === "a" || s === "e" || s === "i" || s === "o" || s === "u") return true
  else return false
}

i know this is bad , can you give me a hint
```

## Assistant:

> 7/1/2026 21:10:39

> The user has a fixed-size sliding window problem. Let me analyze their code.

Th…
>
> - The user has a fixed-size sliding window problem. Let me analyze their code.
>   
>   The issue is with the shrink condition: `j - i - 1 > k`. This is wrong.
>   
>   In a fixed window of size k:
>   - Window size = j - i + 1 (when j is the current right pointer, 0-indexed, before incrementing)
>   - They want to shrink when window size exceeds k, i.e., when `j - i + 1 > k`, which means `j - i >= k`
>   
>   But they have `j - i - 1 > k` which is wrong.
>   
>   Actually let me think about this more carefully. 
>   
>   At the point where they check the condition, `j` hasn't been incremented yet. So the window is from `i` to `j` inclusive, size = `j - i + 1`. They want a fixed window of size k, so they should shrink when `j - i + 1 > k`, which simplifies to `j - i >= k`. Their condition `j - i - 1 > k` is equivalent to `j - i > k + 1`, meaning they're shrinking too late. The hint is that their shrink condition is off—they need to check what the actual window size should be.
> - **Done**

Your shrink condition `j - i - 1 > k` is wrong — work out what the actual window size is at that point in terms of `j` and `i`, then figure out when it should trigger.

## User:

> 7/1/2026 21:16:10

```typescript
function maxVowels(s: string, k: number): number {
  let maxVowels = 0
  let i = 0
  let j = 0
  let vowels = 0
  while (j < s.length) {
    if (isVowel(s[j])) vowels++
    if (j - i >= k && isVowel(s[i])) {
      vowels--
      i++
    }
    j++
    maxVowels = Math.max(maxVowels , vowels)
  }
  return maxVowels
};

function isVowel(s: string) {
  if (s === "a" || s === "e" || s === "i" || s === "o" || s === "u") return true
  else return false
} ? 
```

## Assistant:

> 7/1/2026 21:16:24

> The user is implementing a sliding window for maxVowels. Let me check the logic.…
>
> - The user is implementing a sliding window for maxVowels. Let me check the logic.
>   
>   The window size should be exactly `k`. At any point, the window is `[i, j]` (inclusive), so the size is `j - i + 1`.
>   
>   When `j - i + 1 > k`, we need to shrink — i.e., when `j - i >= k`.
>   
>   So the condition `j - i >= k` is correct for triggering the shrink.
>   
>   But wait, there's an issue with the shrink logic. The condition checks `if (j - i >= k && isVowel(s[i]))` — it only decrements vowels if `s[i]` is a vowel. 
>   
>   The real problem is that `i` only increments when `s[i]` is a vowel, so if the character at the left edge isn't a vowel, the window never shrinks and gets stuck. The fix is to always increment `i` when the window exceeds size `k`, regardless of whether that character is a vowel — we only decrement the vowel count if it happens to be one. Let me trace through an example to verify this works. Let me trace through the sliding window more carefully. At j=3, I add 'i' to get vowels=2, and since the window size is now 3, I shrink from the left by removing 'a' and incrementing i to 1, leaving the window as "bci" with 1 vowel, updating max to 2.
>   
>   Then at j=4, I add another 'i' to get vowels=2, and the window size becomes 4. But here's the bug: I only increment i if s[i] is a vowel, so since s[1]='b' isn't a vowel, i stays at 1 and the window never shrinks. The fix is to always increment i when the window reaches size k, regardless of whether the character being removed is a vowel—I need to move the increment outside the vowel check.
> - **Done**

Still a bug. `i++` only runs when `s[i]` is a vowel — so when `s[i]` is a consonant and window exceeds `k`, `i` never moves and the window grows indefinitely.

Fix:

```typescript
if (j - i >= k) {
  if (isVowel(s[i])) vowels--;
  i++;
}
```

`i++` must always happen when the window exceeds size `k`, regardless of what `s[i]` is.

## User:

> 7/1/2026 21:18:07

ok , got it !
is this ideal solution ? or can be improved

## Assistant:

> 7/1/2026 21:18:19

> Evaluated solution's efficiency and identified refinement opportunities.
>
> - The user is asking if the fixed-window solution with the fix applied is ideal. Let me think about this.
>   
>   The current approach:
>   ```typescript
>   function maxVowels(s: string, k: number): number {
>     let maxVowels = 0
>     let i = 0
>     let j = 0
>     let vowels = 0
>     while (j < s.length) {
>       if (isVowel(s[j])) vowels++
>       if (j - i >= k) {
>         if (isVowel(s[i])) vowels--;
>         i++;
>       }
>       j++
>       maxVowels = Math.max(maxVowels , vowels)
>     }
>     return maxVowels
>   };
>   ```
>   
>   This is a valid fixed-window approach that runs in O(n) time with O(1) space. Since the window size is always fixed at k, you could simplify it by initializing the first window upfront and then sliding it, but the two-pointer approach works fine. You could also implicitly use j - k as the left boundary instead of maintaining i explicitly, but functionally it's equivalent.
>   
>   The isVowel helper could be cleaner using a Set or the includes method. More importantly, there's a naming issue where the variable maxVowels shadows the function name, which is a bug-prone pattern in TypeScript. Let me refactor this with a cleaner fixed-window pattern...
>   
>   Writing cleaner code...
> - **Done**

Two issues:

1. `let maxVowels` shadows the function name `maxVowels` — rename it to `max`.
2. For fixed-size windows, the cleaner pattern is: initialize first window, then slide. Avoids the `j - i >= k` condition entirely.

```typescript
function maxVowels(s: string, k: number): number {
  const isVowel = (c: string) => "aeiou".includes(c);
  let vowels = 0;

  for (let j = 0; j < k; j++) {
    if (isVowel(s[j])) vowels++;
  }

  let max = vowels;
  for (let j = k; j < s.length; j++) {
    if (isVowel(s[j])) vowels++;
    if (isVowel(s[j - k])) vowels--;
    max = Math.max(max, vowels);
  }
  return max;
}
```

Same O(n) time, O(1) space — but the fixed-window shape is more explicit and easier to reason about.

## User:

> 7/1/2026 21:35:31

https://leetcode.com/problems/subarray-sum-equals-k/description/

* MaxiumumSubArrayOfSumK.ts — fixed-size window again, but with sum tracking instead of a set.
* 

is this leetcode problem ?

## Assistant:

> 7/1/2026 21:35:39

> Differentiated two distinct subarray problems with contrasting approaches.
>
> - The user is asking if the LeetCode problem "Subarray Sum Equals K" (LC 560) is the same as their `MaxiumumSubArrayOfSumK.ts` file.
>   
>   Let me think about this:
>   
>   - `MaxiumumSubArrayOfSumK.ts` — from the name, this is likely "Maximum Subarray of Sum K" which is a fixed-size window problem where you find the maximum subarray of exactly size K.
>   - LeetCode 560 "Subarray Sum Equals K" — find the total number of subarrays whose sum equals K. This cannot be solved with sliding window because the array can contain negative numbers. 
>   
>   These are actually different problems. The file you have is probably looking for the maximum value within a fixed-size window of K, while LC 560 counts all subarrays with a target sum—which requires a prefix sum and hashmap approach since negative numbers break the sliding window technique.
> - **Done**

No, they are different problems.

- Your `MaxiumumSubArrayOfSumK.ts` — find the **maximum sum** of a subarray of **fixed size K**. Classic fixed-window, sliding window works perfectly.
- LC 560 — find the **count of subarrays** whose sum equals K, array can have **negative numbers**. Sliding window fails here — you can't shrink reliably when negatives are present. Requires prefix sum + hashmap.

I actually mentioned LC 560 earlier as one of the missing topics — it's specifically a trap problem to test whether you know when *not* to use sliding window.

## User:

> 7/1/2026 21:36:15

MaxiumumSubArrayOfSumK.ts

so which LC problem is this then ?

## Assistant:

> 7/1/2026 21:36:20

> The user is asking which LeetCode problem corresponds to "Maximum Subarray of Su…
>
> - The user is asking which LeetCode problem corresponds to "Maximum Subarray of Sum K" (fixed-size window with sum tracking).
>   
>   The classic fixed-size window maximum sum problem is:
>   - LC 643 - Maximum Average Subarray I (find max average of subarray of length k)
>   - Or it could be a variant that finds maximum sum of subarray of fixed size k
>   
>   There's no exact LC problem called "Maximum Subarray of Sum K" for fixed size. The closest is:
>   - LC 643: Maximum Average Subarray I — find contiguous subarray of length k with maximum average
>   - Or it could be a generic teaching problem not directly on LC
>   
>   Actually, the most direct match for "maximum sum subarray of size K" is LC 643 (Maximum Average Subarray I), since maximizing average is the same as maximizing sum for fixed k.
>   </current_rewritten_thinking>
>   
>   LC 643 is the closest match on the platform, though there isn't an exact problem with that specific name.
> - **Done**

LC 643 — **Maximum Average Subarray I**. Same concept — fixed window of size `k`, track the sum, maximize it (LC 643 asks for average but maximizing sum and dividing by `k` is identical).

## User:

> 7/1/2026 23:14:31

```typescript
function findMaxAverage(nums: number[], k: number): number {
    let sum = 0 
    for(let i =0 ; i < k;i++){
      sum+=nums[i]
    }
    let maxSum = sum 
    for(let j =k ; j<nums.length ;j++){
      sum+=nums[j]
      sum-=nums[j-k]
      maxSum = Math.max(maxSum, sum)
    }
    return maxSum/k
};
```

## Assistant:

> 7/1/2026 23:14:32

Correct. Clean fixed-window implementation, nothing to fix.

## User:

> 7/1/2026 23:14:57

minSubArrayLen.ts

which LC question is this ?

## Assistant:

> 7/1/2026 23:14:59

> The user is asking which LeetCode problem corresponds to `minSubArrayLen.ts`. Th…
>
> - The user is asking which LeetCode problem corresponds to `minSubArrayLen.ts`. This is LC 209 — Minimum Size Subarray Sum.
> - **Done**

LC 209 — **Minimum Size Subarray Sum**.

## User:

> 7/2/2026 21:46:49

```typescript
function minSubArrayLen(target: number, nums: number[]): number {
  let minLength = 0;
  let i = 0;
  let j = 0;
  let sum = 0;
  while (i < nums.length) {
    while (sum < target) {
      //expand the window
      sum += nums[j];
      j++;
      console.log("EXPANDED", j);
    //   console.log("ARRAY",nums.slice(i,j))
    }
    console.log("SUM", sum);
    while (sum >= target) {
      //shrink the window
      sum -= nums[i];
      i++;
      console.log("SHRINKED")
    }
    minLength = Math.min(minLength, j - i);
  }
  return minLength;
}
console.log(minSubArrayLen(7, [2,3,1,2,4,3]))

give me hint
```

## Assistant:

> 7/2/2026 21:46:59

> The user wants a hint about what's wrong with their solution. Let me analyze it.…
>
> - The user wants a hint about what's wrong with their solution. Let me analyze it.
>   
>   Issues:
>   1. `minLength = 0` — Math.min(0, anything) will always return 0 since any subarray length is positive. Should be `Infinity`.
>   2. The nested while loop structure is problematic — when `j` goes out of bounds (past `nums.length`), `sum += nums[j]` will add `undefined`, causing issues.
>   3. The order of recording `minLength` is wrong — they record it after shrinking, but they should record it while/after finding a valid window (when sum >= target), before over-shrinking.
>   4. The outer loop with the inner expansion loop causes the window to go out of bounds — by the time you record the minimum length, you've already shrunk the window too far and lost the valid solution.
>   
>   The core issue is the timing: you need to record `minLength` right when you find a valid window (sum >= target), then shrink from the left. Instead, the current approach expands fully, shrinks completely, and only then records the length—which is too late.
>   
>   Two key fixes: initialize `minLength` to `Infinity` instead of 0, and capture the window size during the shrinking phase whenever the sum is still valid, not after you've already made it invalid.
> - **Done**

Two hints:

1. `minLength = 0` — what does `Math.min(0, any positive number)` always return?

2. You record `minLength` *after* the shrink loop finishes — but by then `sum < target`, so the window is no longer valid. Think about when exactly you should be recording it.

## User:

> 7/2/2026 22:09:59

```typescript
function minSubArrayLen(target: number, nums: number[]): number {
  let minLength = Infinity;
  let i = 0;
  let j = 0;
  let sum = 0;
  while (i < nums.length) {
    while (sum < target) {
      sum += nums[j];
      j++;
    }
    while (sum >= target) {
      sum -= nums[i];
      i++;
    }
    minLength = Math.min(minLength, j - i);
  }
  return minLength;
}
console.log(minSubArrayLen(7, [2,3,1,2,4,3]))

please give me solution , i have given 30 minutes , but i can't solve
```

## Assistant:

> 7/2/2026 22:10:07

> Diagnosed sliding window logic flaws and reconstructed optimal solution.
>
> - The user wants the solution for LC 209 - Minimum Size Subarray Sum. Let me write the correct solution.
>   
>   The issue with their approach is the nested while loops structure. The correct approach is:
>   
>   ```typescript
>   function minSubArrayLen(target: number, nums: number[]): number {
>     let minLength = Infinity;
>     let i = 0;
>     let sum = 0;
>     
>     for (let j = 0; j < nums.length; j++) {
>       sum += nums[j];
>       while (sum >= target) {
>         minLength = Math.min(minLength, j - i + 1);
>         sum -= nums[i];
>         i++;
>       }
>     }
>     
>     return minLength === Infinity ? 0 : minLength;
>   }
>   ```
>   
>   The key issues with their code were initializing minLength to 0 instead of Infinity, having a problematic nested while loop that could push j out of bounds, recording the minimum length at the wrong time, and not properly handling the case where no valid subarray exists. The correct sliding window pattern expands the window with the right pointer and shrinks it from the left while tracking the minimum valid window size.
> - **Done**

The fundamental issue: record `minLength` **inside** the shrink step, not after it.

```typescript
function minSubArrayLen(target: number, nums: number[]): number {
  let minLength = Infinity;
  let i = 0;
  let sum = 0;

  for (let j = 0; j < nums.length; j++) {
    sum += nums[j];
    while (sum >= target) {
      minLength = Math.min(minLength, j - i + 1); // record before shrinking
      sum -= nums[i];
      i++;
    }
  }

  return minLength === Infinity ? 0 : minLength;
}
```

Three things you were getting wrong:

1. Recording after shrink loop — by then `sum < target`, window is already invalid.
2. `j - i` after shrinking is wrong size — correct size is `j - i + 1` at the moment you've just found a valid window.
3. No `return 0` fallback — if no valid subarray exists, `Infinity` gets returned.

## User:

> 7/2/2026 22:49:02

longestOnes.ts — variable window with a "budget" (flips allowed) instead of a count — tests if you can generalize the shrink condition beyond simple counts.

which LC

## Assistant:

> 7/2/2026 22:49:02

LC 1004 — **Max Consecutive Ones III**.

## User:

> 7/2/2026 23:57:58

```typescript
function longestOnes(nums: number[], k: number): number {
    let left = 0 
    let right  = 0 
    let frequency = 0 
    let max = 0 
    while(right < nums.length){
      //increment the frequency if we found one !
      if(!nums[right]) frequency++
      while(frequency >= k){
        //we have to shrink this
        if(!nums[left]) frequency--
        left++
      }
      right++
      max = Math.max(max ,right-left +1)
    }
    return max
};

give me hint
```

## Assistant:

> 7/2/2026 23:58:13

> The user is working on LC 1004 - Max Consecutive Ones III. Let me analyze their …
>
> - The user is working on LC 1004 - Max Consecutive Ones III. Let me analyze their code.
>   
>   The problem: find the longest subarray with at most k zeros (flips allowed).
>   
>   Their code:
>   - They increment frequency when `nums[right]` is 0 (falsy) - correct
>   - They shrink when `frequency >= k` - this is wrong, should be `frequency > k`
>   - When `frequency >= k`, they should still allow exactly k zeros
>   
>   Wait, let me think again. The condition `while(frequency >= k)` means they shrink even when frequency equals k. But we want to allow up to k zeros, so we should only shrink when `frequency > k`.
>   Actually, I need to trace through the window size calculation more carefully. After incrementing `right`, the window spans from `left` to `right`, so the size should be `right - left + 1`. But I'm second-guessing whether they're computing this at the right point in the loop.
>   
>   I'm also spotting what looks like a logic error: the condition for shrinking the window should probably be `frequency > k` rather than `frequency >= k`, since we want to allow exactly k zeros in the window. should be `right - left`. So there are two issues here — the shrink condition using `>=` instead of `>`, and the window size calculation being off by one. The shrink condition is the more conceptually important bug to focus on as a hint.
> - **Done**

Two bugs:

1. `while(frequency >= k)` — you're shrinking even when zeros equal `k`, but `k` zeros is still valid. Should be `> k`.

2. After `right++`, the window is `[left, right-1]`, so size is `right - left`, not `right - left + 1`.

## User:

> 7/3/2026 0:00:02

ok got it 

```typescript
function longestOnes(nums: number[], k: number): number {
    let left = 0 
    let right  = 0 
    let frequency = 0 
    let max = 0 
    while(right < nums.length){
      if(!nums[right]) frequency++
      while(frequency > k){
        if(!nums[left]) frequency--
        left++
      }
      right++
      max = Math.max(max ,right-left)
    }
    return max
};
```

## Assistant:

> 7/3/2026 0:00:06

> The user has fixed both bugs. Let me verify:

1. `while(frequency > k)` — correc…
>
> - The user has fixed both bugs. Let me verify:
>   
>   1. `while(frequency > k)` — correct, shrink only when zeros exceed k
>   2. `right - left` after `right++` — correct, window size is `[left, right-1]` which is `right - left`
>   
>   The logic looks correct. Let me trace through with an example:
>   nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2
>   
>   Actually let me just verify the solution is correct. The approach:
>   - Expand right, track zeros
>   - Shrink left when zeros exceed k
>   - Record max window size
>   
>   This looks correct to me.
> - **Done**

Correct. Both fixes are right, solution is clean.

## User:

> 7/3/2026 0:00:22

how much percentage i was there , before asking for a hint

## Assistant:

> 7/3/2026 0:00:29

> The user is asking about their longestOnes solution before asking for hints. Let…
>
> - The user is asking about their longestOnes solution before asking for hints. Let me recall what they submitted:
>   
>   ```typescript
>   function longestOnes(nums: number[], k: number): number {
>       let left = 0 
>       let right  = 0 
>       let frequency = 0 
>       let max = 0 
>       while(right < nums.length){
>         if(!nums[right]) frequency++
>         while(frequency >= k){  // bug 1: >= should be >
>           if(!nums[left]) frequency--
>           left++
>         }
>         right++
>         max = Math.max(max ,right-left +1)  // bug 2: should be right-left
>       }
>       return max
>   };
>   ```
>   
>   I'm spotting two off-by-one errors: the shrinking condition should use `>` instead of `>=`, and the window size calculation is adding an extra 1. The sliding window approach itself is solid though—they've got the right structure and logic, just these two small mistakes holding it back.
> - **Done**

**85%** — structure, pattern, and shrink logic were all correct. Just two off-by-one errors (`>= k` and `right - left + 1`), which are mechanical mistakes, not conceptual ones.

## User:

> 7/3/2026 9:24:31

numSubarrayProductLessThanK.ts — variable window with a product instead of sum/count, plus the classic "count subarrays ending at j" trick (`result += j - i + 1`). This one trips people up most after a break.

which LC ?

## Assistant:

> 7/3/2026 9:24:31

LC 713 — **Subarray Product Less Than K**.

## User:

> 7/3/2026 9:34:26

![1783051455596_image.png](data:image/webp;base64,UklGRnrqAABXRUJQVlA4IG7qAACwcwSdASo7BGAEPm00lkkkIqIhIpPZwIANiWlu/lq/xfoO5z9XL79bN6gX5J/Rf6rrx+S+gD8Zf4/gMZLv6wfhn0m0hPgMe8/9H7Jf0n/V/93/Fe4v+Yf3D/paz3TPbAKX2b8EfoBRwjbZ4BvqfQL/gGwAbQByKvzj0Dfwb+C/9b+0/2vjAP0A/Gb5/gPaki6HI6rizMX+Vm99/k/UZ+kPYA8cv1J+YP9o/VX/5fqa9AD/F/6PrE/8H/0vYT/bn04v3g+D7++f+j9uPaq1Wz5R/Uf7D/Z/1x81n6b/gP7b/jv9d/gf/l60/kn0H+G/uH+M/33+F/bX4jv7P/DfuN5YPRv3v/Xf4v/Rf+X9////9Cfx77Mfjv7D/kv+p/h/3z+8P77/nP7p/i/+x/gfSH4gf1n97/yP/O/yPyC/lH8y/xP9l/x//R/v/72+5r/df6n/M/+T/MeN1p3+k/4n+i/d/4BfW76D/qv7r/k//V/jfSC/wP77/lf/L+//yP+hf3D/cf3T/Oftb9gH8m/p3+1/vf+V/9v+U/////+1/95+1HlF/e/9n/8f9N8Af9G/xX/w/z3+1+Fz+q/8v+j/137je3H9F/zv/k/0X+u/cL7Cf5z/b/+n/jv9J+1H/////31////6fCn95P///8vh9/eT////ag5mMyTglE2JAdrYunIg1Vlw7Z2J6gvulAJpzGEK7POgrn7WSQULlbqnw5kPLi9G1kG/iJvXqXUFXi5/ZVL6aWgGQe9HZgTTZgKuhPnn5AY1HT6qvar2I8yJ6hBxCAeAPFmF5N0gUgKQFICkBSApAUgKQFICkBSAo/mi0xsZVoxnr+PcbRuCpUEbFGr3VftAnFxYyU+17dgLLZXMUAog9nYlRkM/WB3CSqBZGqjVUIFmA8znKbL+ikxbGWxXOFNFSZILW3Hus7eZVZVH2e0pVP6TnhNGKV8GfcApKrsdOTgWxUf8RxSQIeBESb6cCokHGu33SOOSH+1ilYQzioHxNSKfsJ+Wn/asP7zfPiYzU2puot/FLeq+x2FYqLlwtp+Fh+gW2xQaSZuz4+g6XO16bh8hNiCWPEDEjJV42lXjaVeNpV42lXjStB6v2y6471RzDGw1HrmeMzrYZvpHhvAVfpArOShUkgEDm4JgBUAmRIDmzY6ciXIBg1JgVzmXV/Ok42yNh33dYDkTDOi+7Enwx5o3tK/HAHdPZn2b8BLNKvG0q8bSrxtKvG0q8bSrxtKvG0q8bSrxn/Mbo338UE6UaFKxtHGsUsu03J6ijTtXWIuPnS4HpXQmtkYG0etkYG0etkYG0etkYG0etkYG0etkYG0etkYG0etkYG0etkYGrmtjoyka1kYG0etkYEyAleSTTwaAswR9yTX+GpupaOPM1Fb5QgsrFLM4bzTBkL4EaAgRisb/7C1gV+WWzZeeBINpBTqsbuJo3AkBmVWmCgpvt+WKKY+VG5mwRVEEYCiDF6NphJvWEpaCtwda6t1POGyfljpnF9i0xHnhzRjhrvWJerQgGMgCxPkJebrldPEaY4n7QFN4AucPotFjMEmBAmsxqMv8V5sMCMv8uxkDhTEamywze8xxpV42lXjaVeNpV42aTkxQOh2UD0HlAYETBicrPYXkHxs+EnBq/dE9SQBF0yoBvzn3HYAV6JXBXfP/kpas/cz9NSD8/Srh8KLm5AM+eVikzdvYgDZ9Gu87t1N/BW0nHvQf5eCuD/9FwfFGd9C6YofRa3qHgUFsFfMnVOgqWMgAsB4vY0ey/yb5YJLB3eRQ1/R6a8BUbe/MxJH2BUwmhC/U3qSSEg1MtEFNDYcrM7AExbla4vWtBlkjvMG3yKvrAo4aQB959+/w7ZyeZbBF1gOGOaCNsQAmx3AQO/7xvnkn/vA0rnjTuN/EuE5P1Ub+q50PBWc0M3bYRzJRE+5EaBWrgJrt40q8bSrxtKvG0q8bOY3BoZZ2Ld8bmiZPOIChQoR1ZUKXi7/KxQeoxNCaKvMyJLpZ4ILno8zIkulngguZBCGKrdz0eZkSXSzwQXPR5mRJdLPBBc9HmZEl0s8EFz0eZkSXSzwQXPR5mRJdLNu7OqYyx1jLHWMsdYyx1jLHWMsdYyx1jLHWMsdYyx1jLHWMsdYyyKqi7su1r+pnjHwjV/3+sDJJrkNv25deR4+hVfl1M9smqQDa97gN2wvUBL3wnJwyVHp9Tb4cCP8JVmDtPRER26hUvvBe9EOKmlVRw2IqCP1m7uOUA9c186H4WEkqc8/riq5lj8p626kzRIXxqjA+/XHtQ5YNxkoU03Gp1XR2QAnBhsjJgj6nm3gwaqz6Quru1IowIY/ZUlfOapTNNYYTYMSCH1xwZW1vlbW+Vtb5W1vlbW//dEhbLZhmem5fRTE0rL5xBq6VPOVTJMo6iIksRCL6x4MJmGCGXb3LGLUSB0B1ssyszO4D2qhbzR4nPMqwcdwLjgJDZHzia0icacZmoPvbQvidAeiSCk184Xb0EzgNQDhBUuaMEgHQXJOyGi0/AxTkFBnOV3WJ1v3+9AXAdb+UF7EvFzhQ0/kOcH2U/TWOmL6wPEnDQfSH6BbwVz7dlprBPHnUMW7iaDA06wG3nefYtwFVhda8yCfaKAENeFYl6vTzmM+8V/RY/37GXZ49hU+R/2Su6U6Loyx2kPx8qsdpkCl4UYToTLAvfxg/AYwssNT3F6SwM2Iw38reVtb5W1vlbW+Vtb5W16oYk3UbaEp8GM3Anz16Adgiy/+FLOSSfRNEy+ZE/PGVGr9oITdAblyOMCAKHW9RbkVBJageWJBkfE+P68p0PGlJCwlsQNAM0mjRoIeMASm72lKM9BFC48J0VUY8SHfOaX95msO23CGd00z7aSUCies5xPWzQZxaVeNpV42lXjaVeNpV4+HX4eEfi8BQXOxrtCz8XgKC56PMyJLoGQgueiKvG0q8bSrxtKvG0q8bTODNib2mceLt15DBwwmu1pxuN9I+yYO+X2J+jt3KDlx338ANwEjgpoCzR27FfUR9WzvHMd2r7AMVe4LezIwAQbNsM9HytrfK2t8ra3ytrfK2t8ra3ytrfK3K4Uk3Q0q6jbCI2Ct3BEHtSCagmw/5RRyxhlC9nMIOuz+dSe2OwZg1R1+SZne3VFNXG3p9+NbqtFMvCn1O07R7BypJMW3tStFP8R35qvh2UVd+Lr2K0yw/KSD3GkwczYm6AFcaCtnwKiH6lw2K+5yJCpQ9FYzcgBvcduZO5wsqFGAl38StD19BQZ0ROc++ETVJ+9qkIr3K6Ta3ytrfK2t8ra3ytrfK2t8ra3ytrfLAMTeb4Da3ySt5HKfxO8Wl92gNvQfmwtt8LWeU3PKgdCCqdN+lrwNwBugSmBvJxpV42lXjaVeNpV42lXjaVeNpV42mcGcKt8ra3ytrfK2t8ra3ytrfK2t8ra3ytrfK2t8ra3ytrfK2t84FQdI5u2TM/8CLrjJe9jn47bGzutK4Zrj6shMraQpzEttmMiDNFCSvyQVBamHFS7d0KxqGVXm8zucqBlpdLyeYKbKgSWbTlbD7BolPAZHCTWO8Eg4pskh+p8QU8xb95qQBpzeTbB2eicJ1cd+MgMs4Iyr8hQQfTSVO5PqKzqsGCBtmc9cimbW551SpysHDuKsDEp7WKvX/XS1wzhVb4ojtgDgIBTAPdNcCeKepV6C7wrYskyqTWefyzWtf3yhY3wm0EKA88qwzbTB9HhaNhwLzB0luyLx3oJIJvN3b2UzZ0ea8L6auG3O1Th0wXAj6jnNnBAXcQ8apOBdg1ZhAMSgWPuq5vorfHb7yS24+i2/d2Zaq9o4EFdtCym+t2j9LeCtxTc8aslc7ZTLrhE0/NCcs4Wt8rcrhRTaOsjstoSc1XXVPfFPz1ADgIrYO0gH/vb5KGJEM65kkgUKCkUN0oS7fIT4SKWCLpvNvq3SMJ39AU/LuSuP69TJzJDVv2qODH/BFFp/f5FtvJSB8aF+jFJbynxVtjNqRvqqlwD/QhHQ3qn+C6VHsvX2eP5QD0fcLv93naG8I9yXHEqrGv3lJ+y6R4kAfjAUffc9Q6s+nz/rnfL+hJe4H19YjeQLs0uWuCS81zwTaFgOuA/wtIaFGKSUKkQpZwM12R6eaWrigMyDvfKyOLL7KYcrk9bN6qTEZm5Aw4iE4Uc83xyGmIDYhi2uxX6Lf9azHbF5Ythjxng9b5zfFsM6Qg61AEn5PPnLWqF/G4FKdwCvh3Elfkz1oes//f747TSpJgaMtMZYozI3QP7sk9ikP/YNfoRhpL8J+tUBRBzufureswquKDnKh+U2Cr96KvkC3B4Gvo0q8fDr8PBtKvG0q/RgwoTejf8TmiCQdSlZbeNKvG5cyJLoGEaEDpk1zytrfOBUL3WMsdYyJK9hovG0mwlgxyiSjcFkiz+VZ3LI2HCdy8SvG0okxUXSNFd/TGIemU2mF5/ymY4NiQmxiAzIXA4ihjkGMBcBc++t5YDnKZwGPOKq16iTW9lMOByd1A4yScgZmgt9wCBAnvvJ7a3h2Cy2YvJATZ0ukVqcClWvpYZprATd5POFKdTYIHsQo64DTAWIG8n53gpWeBYUEnHJqLFZgfsFBS+04DODE7oherIooqLPlHUKvsMylX1OUUynkDgMdFEQ+wHUC9EEgJ4qEWM5Q6q/RaEoC67xSUgQiYJAUmt72t1k+BCyjCQwlmpOB3wnal9e/q9Ew0Uw8oP/qceN6CGBxIZ7Mg30x1gZCJL0Z0lW0EkFEsYl+GZ4b5X3XVL0xhMzoNTYuSEXo8XtCX/A8TeZi0/pUM4uPhNy/CXiqGIOgyjoOGiBgwzT7g1FNjfkvo15l38zqPamWX9Tpl4Sm/Aqc9zu4nBu9VzUw9mV49HeqONBzISVNp0TbkcOupupbkxpD+/wKFvrGqm0wADzBUYHY64oo3KJ0Bp8jaD+PXlNXMUHk+OZ4bnYPUTQJhCRwIJo5nUtCkVHIo1xsdDq4CfyuJMGcOSguOP43edRopzHjiF9+tJlhtwcAJC8tXH7gXYHEhS9ZYlCa7jD1FMgqHibJtvlr6/sXbHwSYKV7+nnuCpcg/VoqEOtLLVPyga1D4kdNPyIDkk6/syKK5ID95c73cZxd+hV+ZET9u5K5YgpeV+cp2VAGo4nTTsAiWgNcEmz5T63/Pnf7y3dLFMiZkoyC0AwhjAbxsgi7aH1S+cl9F6yD+aE5RsUHJJUPyBpydhXHnglERKPB0vca4jq3ECvycmZ5rm9GHfK/+WvyHP5s0hn2GQkPnJfOS9MBwzT3ORM0YegZz/ucmKG6G7A1BHckvN8FWo4m9RcboZukvOxwx1qi8NZF/LaXdKYCgotGMqMw8GC49cuTOLgFAUqT3t7fBAiftnK0+G0RGCKHguV4mEsBPb7tQAkAWosR91RG5eBhmEZWRd93sQhR2Ah9xAaFmE1PuHdTkodSZgVuBclRb3Upgj/fL0QieNUpXjUje82ncoqdAKbh2C6JxAdFYBphsFoMXzOHD0YOv/p6DqIssdYyx1jLHWMsdYyx1jLHWMsdYyx1jUY3ibxa/Ssr0TvJZmBi2wP/xw8G5SxxpV42lXjaVeNpV42lXjaVeNpV42lXtY4cCxxpV42lXjaVeNpV42lXjaVeNpV42lXjaVeNpV42lXjaVePh17VFt6JKZ3KzIE/Ds1aeivXMG+n31/9tYzJsFH5uQwpAOX+0+sHKqVJpcA3Zsim8zXsMXpE28osBMUWLzfq/8YMom6bjzTBsfQTk9aVVjb+m1gjlvcUGiujgbds5VNPQ0idDO7sEygun8ujiK7RhzwhjLtTU+5u7pOrW7ndwSIg5jtXF5ofk7jwgrkaHy1omby9QEQxEvDcqTd1NAFjmtRRkhaHJXiMK1ZsKUYl93MRHfDY2XxK9yWwIANiyKF7iyO3UqvOsTPYhzO6Y+s9OWYoVmlx+eE/KTLBc2oxywbJz/Eiy4U+36b9oByZR2jpUugvGRpXIyXvG/RxFf0MSnHk7dasZPlxBMayJldHDQI+NrH3t1SKWVzlXZvUc7s7O/Cq2MQZkgfb9+cZGh9DSA2OQ2vWj1GSHU26alhwVSVL0c0DrLMZzuut7W2W4zHBrtgITOtbA+96oMyzhaT8XxkRGPHlCLhhszbi7zrhGjGggFFGsHlYbtqTA6qhpZvELQN52P3T/8TADKj3ObrZE8U6O/ECzkTSvTy0vL1nWUJ4ZEawrTfv08bMH+/ALaNFiDfHvlO6uSE8hfQq5+PVWH7cevrj30NO/Y0t/6Qco2qw+ITr2uO02kUcqtDAYCnqIXK1+4Wq9owJ6X3ABSljstYCADmH5FAroCWaUwIgiMlohcXevf46f5ICbAp7lnwjxsk5dbXtCBaJBKMcgw46w/xdBQPIpd72tLTGnANDDZSQkF4axEAovitsvgF5bea4qsxfoKvzy74MijrkfaLfdW/ZqURpYdyx9Xck95IJuxb1tc+uRHTDuONmDegAobQYWD1SjQ5UlpdHKeDc1/2iMe8p9LLfjgImZR3wyd3VaUe1IxGDEp0eaWSpZ8nG8Bi883R7tiA4gRJxIUpMoeap4mCcluOh9tNWYIPTIw/DjuNpV42lXjaVeNpV5C15ONKvG0r3RpV42lXjaVfOjeTjeAxe200WA5loMFTEleinZInmfntFZMLSp3SmYuLxrGNI/YaVeNpV42lXjaVeNpV42lXjaVeNpV42lXjaVeNpV42mcGcKt8ra3ytrfK2t8ra3ytrfK2t8ra3ytrfK2t8ra3ytrfK2t84FQvdYyx1jLHWMsdYyx1jLHWMsdYyx1jLHWMsdYyx1jLHWMsdY1GN4ljLHWMsdYyx1jLHWMsdYyx1jLHWMsdYyx1jLHWMsdYyx1jLjjqmMsdYyx1jLHWMsdYyx1jLHWMsdYyx1jLHWMsdYyx1jLHWMsiqo2yx1jLHWMsdYyx1jLHWMsdYyx1jLHWMsdYyx1jLHWMsdYyx2jeNEFDMgtzcHQ3+XcbFbKT79ccfM5NtSn9pXnD5skO+/AFFi5RRTkdeKZNzO0IrAJtb5W1vlbW+Vtb5W1vlbW+Vtb5W1vlbW+Vtb5W1vZiPXs6YyEDOXiENlwLSUszv+UollAgNgOqhswIuIu1ygbDcDO74+MRq0+NEm9/yEU1z/k40q8bSrxtKvG0q8bSrxtKvG0q8bSrxtKvG0q8aWaV+HhC15ONKvG0q8bSrxtKvG0q8bSrxtKvG0q8bSrxtKvG0q8Z+PR7fhV6khKsNodpkiXgCliCoqZr52rIKpkFrYpuQYeI4ncrygjxn6eU79Hh6BJn/k40q8bSrxtKvG0q8bSrxtKvG0q1zHQSc+biGObr51yLqK9RVBA6HoARo9bghGbfIAYIftBUpqFs7chnQPuGu3sVMnGiGaop1USMh4htZK8s7Njs7S9QScPYgReQZzdW1gb0+/0/SuVcAfFC8vAdShurILfQu+stFbRDxjL9nqGEEEad/x34blYIjF0+X2NJEx2k1ui//Pm2A0G1QXLyihsEVW0aOHG5UTdazxBhfjoD0iXcK8qiTClXjaVeNpV42lXjaVeNpV42lXjaUZqo3hsmSqC4s3tj9tmx2afdZUFpp3xXhMGLjKn+2bE1eGm5bfSnJJdBhrU7M1IIxsmTBaNRf7b5W1vlbW+Vtb5W1vlbW+Vtb5YBicc5Tr4Qv6vGQQ1OHiwLaGDJ0DKX1f22NW9ECsa/S0R1CX1ODb80vaBN7YDnBUk7Drf0JRDNZjLHWMsdYyx1jLHWMsdYyx1jLHWMsdYyx1jLHWMuOOqoNrkzcfqco+pdocRPpNKshGgUtJSEbjAfwCltj6tZXj6/4VK3reQ8hu0k+20NItfq6mKeV1PUuYhFZp1gRcIJQ/jUmS2cIIGfvEsD47Q6EUSuy29pmBRDflx2ikqJtw6fkDwK8sjsJlx+qDUIgXZfQceHR9GspPQDQOqBPKm4vFr0UqwY6slRphXDRAz9cqspM7XgrKowBQqBuGaToP8tjM64SPC9nrrYu8KihYAx+I7zJTTrFsv2KHlAwVC9awErBCCxSgAGemqGJw20cnSeToYho2NwgEIuoSix/I/th+s0JNggkIjKvIbk69UMRXDP61C3obqPRUkhhKgyKhrwS9OtMG5WUgIkmY7JSpRKYsOBiPGg10Hxh0f3TrAtz3VQmhNlYmdtdU3EYnG9Zow4woSWbJjbfy+SeaIieAhyPHBNQh0S5G3R3acml+2slvy2B2JRK4M/dPB2T7OSYkTaXsOUQk1fnPxnwrRoZtD3XGbEMzohtslKajrmvCEfUEiA9bwoiQJ/yxXZQkX/NMbPP5FLsg/N1qX6vb8dKqfZMwpmf75qi/PjMnAIHmX2HFoI4GSlUvSgNygLzEzOklEYCNnfZcThDfJ+E0v0aPNO5V4aGreJULx7xLRSTyqWEwYe6ArAMoCypBAOEc7hkOknzBh5sMH1EDO9Vq+0jfMyw2lUJ3jdeJ6n728LA6K/gmbnWOL0UnPJBYj3KcBwzieft702EldFf75dpqzLQt4C/55i3jP67w7kqCEuApypE4npDDPR8ra3ytrfK2t8ra3ytrfR89H0tGlXjaVe1jh1vvjoaI/SStQhcFPg5h9xlJ/pjzlIhLgMDvYi8NlRWRwH8wbSrxtKvG0q8bSrxtKvG0q8bSrxtKvG0q8bSrxtM4M4noLL00DQN3QOPDXL51/AD4yojmj7Sv6PK/j8F4N1hTd9cuDG4eFWR1z8HN+L7gxRhz/hi/VdDxa1ltck1CaELMNSO+lj2yNJ+FCOJrRz/KjuWlHuguYpOuxPIFTTsWSncDa8whpN3uZ21d86cq+bZ0pZoYM0Wrfqsbp11lvFA0aAS6/xF/CVfaN7Wr9JvWWMbfM3CdC7JGh8DttqHZraYMJcw4g3aK9L0+V6MDaFxdCSmzxjwU394Fa+lnzjKOoaOQuH2pxGaVWEjLfqBchZwqomxeATExttZkCDFfPU6ZLK5r2fqSm6DnCqHNHtUPyBP4f27tRWaUTnMAIw7kgbk34k+NRSU6QpWtfmNz4ufVZRBjsUkR2GStHl3Y3AESS5TMhwI8gimqtkG8bQ4QIQC2WF6FMUCIIMDpW1ifSEdKkPWHdmlTR28WmxVZ04ea9VHiQGib4w+Lh0WFEW3q21lsM8VFqfFWlNn2KOMi+Yvevhx3meePnMDAxok2vNgjnxB2cj53OM+Ub5PnTNGPeQXKKjT+PsOcWpB/9PLK8KooyB74c44eeXS/ROT6mlrUjZsP5bMKuVX6T2gVjtBOH0P2/mrpJoBjWzvoFDR7B8j06TBCWgEGsWPBeL0cXCq35T2yIw/Gco71AjJ1yh45UBWEJ3qwLyT/HIIXMJF4DboWzE0FLWJ1UOC4QGwesxCF/ePZwUpqB62pg7LIqqN4bYtSq7Z0za+l9ZyW9Q8xpcGmSH8fDO0E1BwAKzLwEK6sfroEqULl/A0MvudhjdOFtB5tUrQ1i21Hlfvef5Ho4GMviy+ssbneUr+NwFRtwxP67zqusEWhRiQw0v2R+IFO8q/bUI+cXCLLNPv/05jy9IUQ702H09JfP2fI40q8bSrxtKvG5cyJKy28aVeNpV42lXtY4SUdhEVilupIX6OwYHIjeEO/pOn7STzojvoyAbwoOuJNFN6XNyhoVqkg/nHaRCj97bt2ZYhFINkq9RRgLKVFshsZY/7WoQyELcOx54EUdtNujLHWMsdYyx1jLHWMsdYyx1jLHWMsdY1GN4loUNA7PU0LwFBc9HmZET/ycaVeNpV42lXjaVeNpV42lXjaVeNpnBmp5JdPXvtSY3KS/o1Z4eIemgYfEX75TN3rjgQl65DjSrxtKvG0q8bSrxtKvG0q8bSrxtKvG0q8bSrxtKvaxwa8SZueSDGNn+srnrtXc/1D42FI6PE82pT+Eoq0mIHOic/xdC4iwJUOr53+xb+9iMJGtfnQ4loYH8+jCqhlbW+Vtb5W1vlbW+Vtb5W1vlbW+Vtb5W1vlbW+VteqGJZY6xljrGWOsZY6xljrGWOsZY6xljrGWOsZY6xljrGWOsZY7RvGvpk91/AytrZMWMr+jAm1vlbW+Vtb5W1vlbW+Vtb5W1vlbW+Vtb5YBicc6Y+NQarst3LZVNGDW2T9O0CidWsnJ5EkOrZ0gqUjJ/At22f1X2B7NWvrZL4kYuOqjG2Z/r77sy+xvN/qPPjAPzivQ0ybj4BCD3ma2axCXdBB5SSjWYgmLXqbKYCVC+dAbU6YykcrYtA4V51RQFmACAtavgyPDTbplQRsRkMXESznJaJezIG8nGlXjaVeNpV42lXjaVeNpV42lXtY4db6/xL1VtF50IYAx+l9mAhZYSv52xkuVKcWe1rTqEydbFVd2abAfzr/57DLw7uDHaFLTjOEhyWk/Jl5BUOGgcw4BNZ8VG6Pqnwz2juU9HytrfK2t8ra3ytrfK2t8ra3ytrfOBUMSYG3/7EAFC6NEuCfsuySLjvKjMlg8Plyt7AdbDJ6i/r0WU8jPnmbj7wg3JtFnc+hUa2p1NRt5pqLb6BbjSviz8XAjGWOsZY6xljrGWOsZY6xljrGWOsZY6yzmEUIIqdu8ZL5FMVFUUm9mY+H2uW9Z8f5sWVWgHr0bJYTVsamMsdYxo0jGNmkqKu40q72CqnsrLVT8fYYShrfK2tRL8qj1hpeGpvcIHjbkT4VVBkQl0imwfEw9QKncwHIZoR11OMw9d/I/6JkpBbv6ozXd19TI8gTVKmT8kAEQn3hS3g8RVkf0lNaGAZjw+D10/0n5apJA37803bNlQQ0SL41kLn2YjL5VfpjQYGftnWWmNGg9l5nyAg0k1S2Hrenz29wSquw3W+vqeWWWmaMl+h30d/+0P2G209JnKpacIl9HsTCQBFQWDQJKcyk/ryknELs1GaHvESZSGdcCb4eAnq/PLg4zbjac084rLDLsCZbeLTW0fVNw/HxApCkmMNfAJJeDlGWWbNQuftJoVSOd7ikJV8rccM0IPXupkqO0B8m+xgmIHnp1p8meiObT+y/JG8Ms9sLG7YtP+qt4YnSlgF24+X/e0aVFWWL/Y2ga0NNmW574a1tiZmVlm4yK/A1uiazgOmaYDTyA85JfX97EA9wN4o7k6t1udtsntQwmw6/CxUjBWEAy9tXhSNaG+CtpUB4lgKBruQUoLnwsxRDptgYIw8dmBNm2bkfKTukTkzf4XnW732VgXW4fkGPvtkh479rl/GFjKm4UNa5xQKqSY+iMbiywiW4EgFS9v2g+fl9p20xFYGs6XXKzFB9WwP3wmHsDQAcGVtb6ADgseTQIaDK2wMiej5W2BkUAhkXsyGjF43YWONMhIdyy3Ss3k40q8bSrxtKvG0q8bSrxtKvG0q8bSrxtK50aVeNpV7WOHAscaVeNpV42lXjaVeNpV42lXjaVeNpV42lXjaVeNpV42lXjyQcxuNhpV42lXjaVeNpV42lXjaVeNpV42lXjaVeNpV42lXjaVeNpV67MFct8ra3ytrfK2t8ra3ytrfK2t8ra3ytrfK2t8ra3ytrfK2t84FQvdYyx1jLHWMsdYyx1jLHWMsdYyx1jLHWMsdYyx1jLHWMsdY1GMW68zFuOt4cwa8OtzFWPWgOhLKrqJCLGTX862kKbQ5IDwbBV/0f9b6qVcPC0dPJHOZqqnF7QSxFB8j/GdJ08SyiKsCcxKldjkqL/bfK2t8ra3ytrfK2t8ra2PqvBnpiYydiyPzwtSuONIhm0DUMQ/rqtT6WdsLkYRHnc3pVBN+/i4zAysKL6ieAPA13gmUH1+pp3a0tusjhFrVc8QJBXSNfze0MSPprVsa0SYlR6bSAMXEaU0WDaKaaYImOvqQpn8ShoJoHHEQnUXOwzNlBL0qw+e75YmzZcpZ1IXRLm2a2nrOTWg/CPezKy1Xx5aTytiL4etN/k40q8bSrxtKvG0q8bSrxs1G9p63q3TrQX3Z/N5ZuDBa2J91mgFFNSa939QR/PzUwKXTEAHBFYahoHZoMHdVXAs1DKeyPgNWaIEMDceGBk8yqGRRFm4ia5Md4W/QEWvByvgGks2P3fEBoO3zP55YDLcL+THaUFLpZ4ILno8zIkulngguejzMiS6WS9H9r1FpCqeSLNtsyDot64OV0K71Cz4zXxua6PMuFLa54ILno8zIkulngguejzMiS6WeCC56PMyJLpZ4ILmN240wAA/v3ebVNgAUezWFKKxSSE3Q8TNDtPxiJUB4tUSvMljocXN6kK+MIVwpfzvHP9A8M1d4p3k5DgACQr//ZqOdsrzCDvAhX67p9t7xmuatYoLoCEvr0BhtqLh44oJ+X63h8h2kQLLWzMmVCAj90AMVu9CPt13uyYj6fS/nvKTc7VyQag8CEDdgjcgqFLaA/WrQszlOBJWpjCiZJD4IBz/4H/RBwNtJtzqIdRhpRRj4sPk6kPhrTTrx3uJ8dcGosebHIpP2bgI6DeE39BjQ2PBfJ9VhpitEwz34Ao6twOj9YCY24fTAavcf61OnuTCVoUvlqJowo+9qaZvk78+h4FvZZdCVJyb9fYPLkVi5xTegjjQdtvgg5i6uyoiE3IsW1Mwf2hKN4U8ZEXIg30DtehSOaa01dVy4AOZZrf4kQr2p+zowEqsdK3/Z/7838ZW79C8YVdtstQwiYz+CIq/9lHwdfPUjZMZSp9LXzEFqEk0N/LbPk5ZM3S/ImEEeHAHvvG4XH+xaY7Ph6UmlqpUhiHitsmv13GJfRIOQzDDJ1a+JQbPExS2Dbn1v7Us0YZ/aJU+Cm0x/F0ylkqW69qW4W+ugoK0LJIYIRn9agCUPWVxL0Cz2TxwsYW56BQLemMX0WkJSkNSf7dBW3JJcmLnEPB51mdXmcGLdwKeFliq6FMqZ34b51aaBfjLVTjzbEbQLaAxRakgAxZ6K+Ba8jceREfM3pm7jif4EoUjLc1laNJMPgojlS8gSXeEKLuVILhjOWh6eQrX8jnzWoaBWmwWM1FzWtKLCP0NDT/NfVV1VdVXVV1VdVXVV1VdVXVV1VdVXVV1VdVXVV1VdVXVV1VdVXVV1VdVODw6LA7MgPGykO4nc2KiDNaWLnFRHFYsP6zEV6HYxerTtwtoHWBlCJe//KeIuz4L53iRLMhcpb2TW0giPT+zOrHwYnpYldMYJYNpVWFsJH4hCYxYDFOkI+7nlvm7WmNC/it7aPOfi6KoLr9YXRi1+RkhAbg99XqLkzDJl3K/sb7kJxYmoy/izK4JLN8fhjB+nOP+vc8Xt9NmM7tb1C3YQcJlBI4pskfX76BVjhcvhphY/xrLXOB9yh7CugOb7M7o8m3xG3cIpNdcrwaziCRof2e6bzF/P+Q2v7MMuzqGX5/1QKBbQlf0PgpIcuitktdLwmKtAx+geedVb1JZDkkUJMciK45JFCTHIgnzsTjI3k//AArQ8Y2/dpaA00wL/DTjyXcV2HL6zmvY+BOplqZnV7C4+/9G8T93AP1V0EW1a1spbM3yYN4RpwakTEXSor1XfPXEJvbRshlZUqwXjKzwmff1J0DGWDKYsrc6eMTsejiGdPGJbXE/mpBuejN3YV3Dk47D4cjd1KsnosR2dn+TDhl+1ct9xYd74GGuLdEHIMQUR+7VRTJNpJS0jrc5Ms78h7N3ZQwK2DER2hZgwCO09UWK8psri+2QLmuGQm/GkjJlTYUzXeYUAG3ahqFHwiuwIMDz8xOf1Gc7zIhR0W8mUxjvYCrxzVdGjpcK9eUrKSx/eY/ZyU/+kesOlIwsnVwtQ6iUua91ErLwawyz2XlUpMAhn1Pov9wm/iKCZf44StBS9jc1mRCOEcPt7mzEywLEPnkt210jOUHhaUwHsbIyTnur6/pe+ldrNZ/TkD3Af0BtlQcix2LWy0Bv1yjflLL4iBF9axp9Z84DwjMFa1rfJ1wZ6b3BTxAd2zKDP8N2uZksl3MP9sDiQX7Na04iDJ44jlgKLyek2Lbp9HofRzRTB4TJCCGdKCwBuGzwLMxsEb19rr7B3lyj7DQnNAkRdDqldFCGk7aBjORMnU+cKTl4hnuQc3CEoHyu0fHiDe1QNudKoREiJxq3jtf6Rs/cKYkwCtcTlm9cEc0alqxlz1eewaY1udeYVKGH/jlOqFtxsaAfLibsKcm2UvhTvCpZtuG66UqBrAN6tSXn3BzpOvbJS8hqgsEL7US+YrJN2pRLt5W/X60NqRtREzCxAHeSImITzf5qxSE7lHVYwuW1lgEUzjb3gNXA1rsqrZRoQIuGd6nb8IxQU4+H4xKH36Dc4qUq/n/IuU6Ev4XlVFpRiAYe7bbsMfhRKlcrxUQJUsX6G9+1Gxh79ctNhxPZS3Yqo0B6JaWDiKMhxp5ugOC1D8OB2woyt2eAkNY3lhA7zvTL8S78UVALU2IYJScf+/igu3/NgPjqkE28LLacDTGtqrJmDl0T2CVMKFb+TZ0QVsqqLOZU+PPISEcBVbaCAb1FRkwH4vK2W4hjDzMIK1mZeK6Amz630vABVbJjWI1aZlfLC8vworxCawgtwfze6Qw7HGuCFcQar+vmTbq2rypq2Tube0g0Wc9V9N8QzRlmss3Z2Ur1czlnrptHBtMg7wqMJ8cFTXpUs9uMFUtCA+detLCNuJzliq1hzCgPJqDn0meb9yC0UvRKL3kXUjvW48/8gJQSLUS77Q17F/M4eDmVXirSnu83VbX7e4ZVzqlsuqLvGB7DBLq2dPtwuBx7UqRWEpOHDsVHCFylphggBMePgb/pIYxzUMNewThn80rGHrjPe8KE5FUqhAr0KMnTB8gRnwYBIU5EGLrCI/wxzAEy4QrVBRcDcHD1hemRNB55sKTWlEFRm8DQ6YYPmmOfQ+Ht5PH+NlUF3rpc9ncrxFEHrvYbG62pLwLio9ButB4MrPS+dmgIcqLEApbcJKIIA4KKzSm4ngCFMDjjxHE7dUE2r+CnDnhqGucMJGbc34pqq0ip0DpMW5jX6HmZwqAgHOktE/rx3fQW1rfcrxBRXZ5BLQKC3jALaX/Oo1dOXRAoPI9F+XJHpGywkN6vAmub7RHnVwAdvF+LQ+wBUgijdSEp/vdxe0HRlBG5GWGXf+8zS8J+sqhQCwunZDvJL5k2T201iAqMV+zwpbk66PlcoIb4qOrzyLU56ipsJcuM3v8O7gawFGBsjTgmkjnxQ2DuXNuUzyJ/9Vy5EJ6O8Y3H3umSAgFwc3d6XDGMzLquuaMAjSFvJo8mCuig4XBu/GVI0uH1W3iQVdophXFxomT5bBWtxkvcs7+U6WgdvGu/8HxvXJAMlMvS6Tl09vw64ZO+tomvmzazzKXuribQJZ8V2aD/0gXVVURRLqGC0Pp6fCTvBmY2VXvuoYP9nhwlYXnkJfeCxq2vNQIujnpwgFNgHwGu781jWe/PJfD+ra1p5ovmXnLXQn+tmQcArD2eGdtk/e+DtNA/rYUjf4Z22T974PCaMleyD7Dqz9d4o0p7GN0+l7Di05nVEAEDs2VFsa65yQS9r5zcx/F0DknwzNPgR46ubREWTm/YaVDsQ8wCbaybyLxbpWO30VjS4eMQkI+mtVhjHB3gf7Ip9Xac7zJLZxwXhsU4K2RY2ich7yJc9A9OjfKrn2fktNxyxqQl1F0zJBujtWwyK7K7195nMGaBG0eOznkcZi2GgmK1fvRqQWhJvpuRVFRTUaSx+IGzqjdV7J6P/vrTjuYDMsnogGql9ZbMedkjb+Jgm65u0IT8f1X6h3QaPZCqwaucr72KfVi9Ziu4SWHYkldb4qIZWpxH494Ddfx/ghiWZylFs9QQqNTFvQEQI9/PzBiqu7WWbgTX5o6XZv0TihJH2swGRvQVOqIQPit2ELgq8bQY0KdfClhxuNhr7SkOEHgEhksitATkNHAZwrcfezKcKGxGbxguwoSTorvEo5VJdcVLoRCIFXR5Gicwx1nvRR8j/0TKLZH1UExuqH3J5nDAUWCG1udTiJgExa+aJFJ8asJbPNnO6hbHhVwwp5kOkoZLw8wQ8qO2S45882QaYwNqrHdoSWIGnUZmpm9AiDuCY4TbRk3iBHubscSL7XFMgIex73hEBJ1Q11zAmSAUXzwJQmbZb7ZD5MMrJkqimCWWoLdnf11PHkKh7+AJ+4zeNQAfhDOI8khweWOCdlwzSGdWd+lBXTLjpoP/9eL75mJr/UzkwFwIkdR8zktq0CnzcXA3JX5LTNZfax5eY8VWF9Y6Amdm00pRazGyNN5b6UVnE6lN5Z3GaHbJgftxsxHjfyuT/H3OGO6Vuy2G91p95nwCCj9Eh7ahg+Wd0AN1NSS3c8C/Q0JJB6jXd5xViK7DNNeIebOlnWx2jufwukUxEv5NRH1a9gzOPdu4cVIkCd6ISzibZLfbL13Tsux0Oqf488GGhI0WW6TvZGIP/TfAgoZtK665+636eq8wn3vipVmgRkgvF2VGTYfSf35MGCa4Yy+TkSDOFPdcfDMyaXrtwaoPY/tU63jiYL1zeBk0lUkLPuCql0/b2GowFzm80vVv37hMOtrEn1j6knNXn7ktA2EiiB2ZgBlpsytK8xPpFt1a8flEGQfSL4FQGWSiGQwEPlugY/s+fKhyIqiRfGPrwxS5PlrvmOg5WS3Qylvu2Zu/QLmFbRGrorB7EWgpJGoexTXT9PT2z1DbKPN5N0OKUC1mAoAuscCX0fnG3uB5iF947skuPgb5wY/17V4r+dEYOwUv7Av6IxIhGLB5O1xMa4PrHISz+oWhMq/6LByvxBPysUmQ1v4gVgI2+5bfYORWcj6LnbXWm5PsqLdFO3i2OdSFVM6i7iKsxQFkx3WIylnGsHsVMj3qSA5giRaMe95EGHofDooqgtKD/J8pp/fChJ1dvOQxQruPn/YJuFxlowPFKTzrAM4qIOjhbuW0uRxe46awkqN28P5gjfHQqRFHZ1KDOScKDKnKEA/gAPtZ1GCYRGV6ljHL9C9YmFU3xJ3PIPMcR77zzUzpg2SHUElr0v/K9/Z4XsopY8cp6mtV4aM+EEG7lELHNeVxKMCCSyWtXpVQwYVnF8KyvhCRwg18fLvdoE4tfZVQ/rLnT02bdOeQCxlgoyqZJtg2wgv2hJ4xTXpXC4O9ODu4UC5JNgNPnji6C4avh4rSvc6xs52OqozmzM2DSkvFmsS4/3so1c9OL1j2WuBPTyNRbytxzrJoyP9yqU3kEfQF+p0aCZ7OIKAdVGZzDGburV1wxEXy8CTMRmqfV6s/ly9QmjkBmgB0ufPW5KdAhw6oKhTMkfpdo2YQaXFd7tZEoAoTgnEkcGYtynqdkzwkHVdWuqX1fWTpLV1KhRmCIyAB3OoiP3ZMXELF5Oo7UD1hkL/mpuJq8O4Gc3/2+KhxZCM4rVbAIDlQoh1uEt8yNFs625ivuBsDyuNEH5ElzdgnEPYa41uqJX2IW98qxj2nZm0SW7DY0bR1MsMaciw1dfI/Apzan11GNB+0HDm8nJCWGkldI2ssBU9CRH/YW1QVODbiOvBGJ7NA7yMArZmPULbTO12MJF6fi0Tgol/OoJztaH0o++y7HTvFNA7MmGFDY0p7IaSVl33ohjGJFEafNQPYZIgdLcMpb/wBkAlhnsPvpiCfF1xGxBChYnElJPvmKyBwIN40aPmresPtyWAA832go8wTwe/TakVZnA4ZDQfQqTCKKqwg6ERtpiudznzhTyxXB2zQ9C9QzyhY3opyTsAiDbeB+IkaZnEf9lcEO3wMBpAwjwTvlUc4rd4aenWi31POPrb8Nxb6V/ITaE/avcEQUqdkx4wIA90EoyPSsRD5AQQHoKFX5B9Cxu5MOFGS3P4N2FI9JlwHlSXHMrbDOyNxKWeLo/fC8uJ9IKtwMSPLDMVNhdu3ma/6YQcCp2s9snfWDYH7uiatAeQS1ZMoZg2nwqxrtSoX0bM1hU5GUfP11Hvbm9l4bOq0+pZWUjbVBguuZakGO8tX1AepqESuKSWyj8lWvTmPuQnIWoNC9uL49n9CYSXgyBRQ2oj0TV86ZU8VVFf1rRIuYg02RgsmlgJDpNiZY2vL2kL+1QHSGjwHFIjDEe08kMJzNn9IS5UhNAHzeiGPo66NyjtPz/E2MZhqpLE8DzLGBatWo5aXI+8q6JenjlPdftCoDOBi+1cCD3Lu6XbCPbHnd8JAqfD8ps2jTJXmso+5zzL7cKkdAqSP6yV+zcl2r/T4xmOjooz4B+c/rU2yllIdfj4egAnJK+WveWSlbGzcJOgPxJkiSQFSv0iCUWmyZ9X9cXeHMSlqYz9xmtcZ3gFtd9F9qasGeGa1otntyIKI7L89nlxrFUXT9Se2RBONZb836tv77bAGwbhSIVMj918G2x2zoKy4Q35EDiJ/tCl+TQlT75If/ks7Y2oEIDXxm6widLMLW7uibltiHUo52SovGTnEgI6mFjyWrjjKSAuvEGzIhmaD7c0H7QwH7vRWxRWN3OKYOtkJVeLQASHRR2g3xU1ozh7/2l0gEnEfWTF1sDeCPdokxZOaJoevJsN7H7v6XpLraIn/7HHVrwELELGoA2L6TdbMclCi3S9fxqPCuxWkndoU0h/VilzWwvtm+rsxY5YQjSTQNvQxmqLw5AcQsIulrB87rn6W7JII0DTyAqknXgkkB66W4So8HlM0UsbIoh4mF5IMwLeT0S2gZ8YLMBUVHuR87PVjGNREFF2JHzxAd74e7yfGixYOu3VQvvdH+zBgggoXBC+l/1sxQx1hGcvtYmq4GKR7ExulNqhc2BQY8Cq3PieuNovUB1VKzjoBYMfxILisHl44btoFnPvITcMPQZinVdhE2KG4ZgR7xB6omX+aNwPfwBiYs5nWmS6zXBARc0pkKIw5EIMlBZt7EE6fN+qUAgfoEQswyjbrFBcDcGcHtmGrIyBUQ+bKHC9sLtg4p3rxO1j+0ZzmNYdxFxIrITzVtxpo4PMehXLefS5c/3n/zZkXWi/u4XtIurO9Gb/ornRUIMm22vOlaDW9p1qti2LgkF46H4SyXcwO8XOJKnHOWbJcczU7JiemakATK1cXn5a17xgcY/6j0By0ZCDWQvY/V5ExefFdsAH1ckYeMKfQqDWWikZNTC7nv9FwO2jWyAB5nqDDW/tmleMuQCBCnd18b59mwKbp8xG7yxXLnWhLmugzgvsW5z2W4qqiJeNkBRJ195V1gz2klEZIMijnPSOUjfrjgzix0nxpO6eoyGVH3LO+TkeVvaOt0Q8S4SNdT3PYZKX46G2X2+MUrUkP8YbkmoWOPiJbPtyqhRVEIfwy3HfXPPqS6SuPR3KjcR3eRrX9K8SAjLZr3h2ydqoX29f5V5U6cGLsFWIBSTLQoES9TOFzTsUCxnaPnMrG1UNAC0k2Ivjp0yzHsGmqoAQBQ88fx77OvzwRygfbRkZkh641lXsBUizrwwhMT5+8DfXKYfYXHHxVRBHzoG7wq8Dw2XkZ1dVovkioAxcOWnbx92gDV5QBe4d2HuvClmQ8jAvlT3yU8SbVnH/9pkVGeqfnuhq64njcL2WERSr77Xevwm/JcVkBtkdsdz23lOKtKn5Vnj0Z5GkVlgkWBmWqTX0rLbRTCAoPl4PSLbOg4rNIud/y/i4h5CikHTZHthEuKuzHga0shAl4i1HzYG8FW0UmtjoaBEZpQO5GAtL9u/+3MuU3AIPAGzOVmSIdHx0V/vv3Gol4mMdD3gLY1GFWGBilwnhQG1Ua+hhjDgMvhxnTmr04NnaM26eCZnFFNJ/k4OO1I8oUQH9SHY/sWkNpFtYFYJL6L5ufBIeufW9CkDhSAJaawT3fN9h3vBH4AliM8M3M44y2BV3IaYSlqq2zW08bV1fp/LfDOjJtgWI9jqX///TRBkP9AGLJ7IyzjCndaacmg+yVelFWGgmmkCaM4krFeltj2Cq3rx1o/NW3GcsIK96zhMgYIjxqjZP6umgDbZeFx3sHfVm4QFSJjKjuxzODvHL9l8aPeGbvenaawT3fN9h/BBkROclkwnMmt7iZnhmazYxw5DHt4GRrtmrhT2GvqISRDQUJ+p7/DnueIOHnbivMryUKYPxxjZB1cNxLjwukGPkKkpaKJaC0D3kXjoqpx+a/7oLgA8dZA7x8yhCIsVcDuHjEymiX5H5hpYGUJcJihUr4cE7ckW9B7Uax9Ljksev+JFQbbpUXpam7xWpVSzLX7zjN2WvDRiv9Bo7LtRpSBjvzgVFGvyQUFXVdASUV9dd1WIvjfiqa33VBbjJ3iQJy8bT/0wKYVdUL0bTzY3WueFeQYTbBjL/XvfWO6b1wE9qTjFB15aGojQfSyUliw2/32GxSjbcitw6ZncJgcZ3os4VV91yM3yVLPwE2hVS3sNILDZrIv+OwlGWmU//qhEFCs5SxeOLkqv3e410Zb+9QzOvnHFHiRiiq1rmbXpQ21MhoVmVqKlT49N7TvO9SJYHEllNoE3LUafGfflVZllnsm0JlPND6AMWXh61NfTU3fa2fFLqEtUYAc7JlB/Ycv/lzVGEyS+tpVh+gWfl+kHgjUhCOJPFYXSfqeJ0KSmQ/9z6w+qMgHHi+/1/pC69ou8D5Bv2NJInKZL3PnmuE1R75EkoLvyzb9khk2KBTEjRabrcz09kemdsjXNdz1tzVXBeFMvn5GcMhovC31JKCx/71/ZVv/NRLQg/KvZH+SO4bFbG55s6/bwWxN3wpbzBM2H7dSBhZV77M+UcrMOTB8cxCUBj/3ZvPx9oRf6eOjotgo3vuifdpbIP1whVYKWAlX87TMrWnInZPxvpIm7nNIMXlLk9IO7gb4gdixdIMEdDQ382yy5rEq1OU2xlbNy0OdJvlxvGpWnpViDnjh8t6JIIK7YLPDpobVRbdd6jBm0larE7gBQx7R0WaT0boZL4v+HbjB8A6MO65xTMn/sB9aYIWGpgsYAzXTYshYhpwt23hoS/D75tElG5WgfAz3sSQcdKZqVMQ9yydtW1Q514sva+hrEuZKjuyEAyebUk1VIh6DWgsCIMnxflt5aMp2Qv1L7YfNMj99bj7RHcvMoHKXfwfzsIBLipnVn5ta7xl9R4oMSr2eT5uJPBMrMV55tkfDg7bHag9r3dF44rMqpUfOKuNZcJWDZM7xKH5kl8vrFkr2rfsiHXVmYapYbbJueZlv1UJtD8d42D1xRlNVcuuZGdLaAw/hRu0Rm0KNSZvxB/TtpqNp24Kot7UZPDWa+S7PvBmnbvCGJ7wxG8sTkquRny+xlxkg1TqzAjt1293WSBV/3kcC+Cdn1xoHuOdcf50a/im1eSjYIg3KflFk6vfQbjZbol1LL+TmSkOGPFt6qWZh88C+JKUyxAMEZPsq/14XuAiLA0N3zWrBUXT9vflNQugXhNFLUBOAZIPVA5Bji2IW/T37E/JrA7zkN/j9+aY6LpnGbujFcsKyyRFHxaTVKZPHp+LEreGFb5V6I6Pv/iKZHDgs4b9pM1nOOWZFxZFqPDX57+lsT9jEF0+tClRvpmOuIFs9TzG1ZL/ZHiAscBO3ctEx7grRnMtXYZVrbMo3GVezRRkWpP92P4RqarNrJkWx2ewni0HH3EaMhnt1Xcft43Nmriu5Wk2+rGPQYbC2OqAPqVHpz2I3qkhwEDO3RJlq3jwWQRAl43gK+UTdfTJUAEvSB+TQhaiQKzdRPcJjlD/CvuhrV7dFBRQA8gPlrzIwche1+gOiRG2xevCESig6CJA+KD9NfL0lWxVC+4gOkJ2sBKezIs9EXwVj2TAzpkpdeC/H7O9xinnZAqr4GEQJuKe5WQ4Y7YRyD+YlLExIBkz5qYlOBKGUV4B+g89PIVDDpc1FH3AOMSAD8lU0iaf8nuwmKKE0U54qPsl93lSGCxEFaKRO8Y9lloEFLjqfa7ClSPiAyyI1iT3yNchRHm1VC88cPii1s41llyczPmnJakVQ+xCvAF/mFiRvKtS5OPpgiczyg4ulC42CVg+JNsrK4AnCbU8CtsiPqA4NKL/K334GFj5Y+SInGzo8taCzF9bZHYY48haPxAUsDIcEb5iTF7ySbqoE/Hk6B0wWvLK9HVMk90qGIQ4vq+mnqHygisXkJcftWXXo+PkHg4MWb4TGYqBn5xemYemva71hNEk42DpBgL4HRy8KUU69EuJKOD41T/H3XuC+ymv/g9kUBXHv64IfpFHjAevSYzisoPqfVS/EROouFAeScV+ITksentAAzGb/aEdFxUFppVZcxhJ0l6xykB5pRwFd9Bd84mVmSGJ0qPJ45nvcPuAhWCDdM0np8OmqAgB3zA+QprX0n7Lee44zAeJhOurcJweuc9vr8kvtDb4MAKGTllgLFJs5q3b0QQ4+RYbc3sh+nnsLr1j65F1hkLE8C3rYdJXmu21w0wMSZ7i3vEDNLASJT8UFLe+wGey1HbgD6myqLmUhUwz0cJ6ZWzlk8Wgx0oNdUDRVZa+4Au6xRb0KhIlbHJckrGi/N4b6AAZGmvJZ6NENbc8cDUuAaHi2CpamO0gdRoIFcXbMmTKypowX8Iz+bvuwM7gtXMMP3zaFvobZvFfCHLDI3838pmuE4maRitQ+6wNBtzmavGoUXEJFvaZyhiiLPOS2gK2RjdG512Ja9Glg6Hwhh/EUYUvIQCmjtm7+q7LTkXS2VIc5WMPRrtrqAf/6BdeCxm+zHOApQIgqizebaSxfciHz/h+Z0mIivzEOKrtD1xEpfbR2t1LFjqO/K6mYi70ybSUeZ17yZ2pEP1VtsCLV0vCGob6+HgULA4q6hI7q/8gSTT5yVw2WY/bJwWVjHDbfWZSY0BWEDquhbkXtMkiQdcC8/BwDpRurqFe366aD1cwL7OId9VQtortHmZPtZOqK6DnUfXLMrCEWBsLEBCkEVeqwO8g53HNFYQTmUY/IBgZOmSijtsZ5jk+MI6jS1857FRSIS6avdbxgSmVuoPOCTPcM+Y9yEisSypTwu2D+YpWinr8OT0M9AibOCRY7m0m03m+EFJ2lE3xtZ6hh+jVBr9nU24/0m/KD80niDeObqLZIyNCxo0Z0UuSaJot1IBrS7NyMMts9asNYkFxRomjkWRKcCfTaCacESrXG3pHxu/YCS4u18T7RdAqWW2A/flCumuvApJWCtkUntnnxZjxTbLEyWTch8KQhWPrkIJUhXZzIGKNN27WS2cxUzRX/baZPN6M3swGTcBoA0jyxKl+UCNuKGVL8UA8XvDHEwgVaFfkpJELMzWKsnMKlr5zLP63uqRtBolkmoQIae112rJzy8xOt66khW7QJFqoohj5A1fIo+4gRpp0sgjZGzlucd0QK1E2NzQSjo2so823+bVcnZxdKC3Pre/A3b4kf1bJq3CEdiIoqnT5vzdibVtsxbzGDDLSa52Yd2NLCz0rUt1O0GvtJr7y7EAFpaCQet6A8LQPYOddp44vnY9/uDzh8oygf5wzFLSRkv0u+tXkMoXFbm7my/H9HJZcbHhkKp8otOo6dMsXi3NGDMkp0LyKbqJZCXNn7f3R/TdGFM9+sDTnGphyxTkiPyA2Li2CUoedOGPLgA/7IbniKf/nObTdNN/dLRQdMerBMC1CAtcQoZRikjE05K59+xJKliWKyGY9S87pjtl+WR9FLKYYskS/mXLJL4ckYIO+aMtDNpNZYZ06f1KI0RC5rQ5MmIHJZj4gD0MSH9WZyoSl3xgqqOu2peTfZ1DgWCQ9/31ajtO1eMKuG1DSPh0wlv5UXbKbTLARVCVEpSkJJMJ0CwFZpotWUouQgLPNzj1UaGRX8pVMOrGRcGc9A/5xFXLA8EzGeYhqwuNnBAJ4Ir5IHsy9LpKGM5QMxtdz+bcELKjtPDogg32O5WA+wN5bzb1lku/rqbRmM1P2q1ZIih68DC4LQ1aw4VsZBVE+uKn074/sjsYrX1hJZQ9badNnMd2cKvbQwF1dgbQBcg9f8eBouwCa2ctoH0cwdoHw3S2r1qK1LjxLcbgeYXhSn8NI0+XsfsyYu3+4U1Z3Pzk09WIQ0S+3Jfa3bjSb1FRwTnjKge3o5ntmvM78lMhxl4PmCwuakNf/he3vp1vJRmLLz+BtgGKbFp0SUvmFDjGFB0EWqCWPsU5QHpZwuXqPfuaphKNrQzbqwu16cfi57uuSiQkqQMJ/gOkTgybd6+3Qy81dIoTYu85jHpH3up7AIHaq9kf+DUzTKieRGPyd6lBu6JeTT/xXDskULeyjwtFdtNExb0lIrAeFDXQPAxfmoKdvwDh3pQlcc7U04rgJTGNL1yPRxBGjae69F4RObeBkHEriy8BmHu2eHvoETm+wSbh08FlaWNxPQuNu+t4y/jjVDmIjKaU7KmF2x+3WaYi2IMSpOMNoBtnqQfeR8/z8EBVuXrIW9zl0HbmOBwt4Rb1hvV05mvUBnx6+SKo3IsMlOlGNk10M3Ik7mDvGfeX4gs3RxoA/PiXyhhAdlAjF3LelJZIS0Klena5GKTgm3qddl8ImGgfie4hqsfPEKueRGKrf1Gdd2/gC51G3BI3qiP5Gca72OXsDMlPE3FOtXhzMPs7nId1OFdzB8LoWt7PHSGHC+P2n6B9kMbXMOECZIpapr3wxWx/Md9m6CXg72YO1kJ4MyEa79qYCLH/ufnnPtoh6eCe3AQJXCEHp8vohd4W4kz0rY3LNiGtyioP9BOw8wEG8lBTfBvVCC9IJfotJHh6XEtn3IxTREQhbVKuNuJXv4yhlHICpFpHZdY4U3vzTLSr0SfZvdmHfwrTfMDSaNNDp1u1xxW7vms2ArBg/g3keZEajq+pbK7GHMn4R3RjOlxZteqhZEA9p4d8fa2JjVRv85V2a+t5oAhjsUDm1yRwmS2iA5ucRKbpLSsVHhYmo10aV6q2iwcnQ1YQPbaWWZDQIAiADxoRtv3AOGPnzry65DWIk4YCcwr4qqaW6Ce/sCbFJNc7PuJ5z367/IsV14jZ4WG2wiV8oUnI373hlcyQX+2WCjkVnrGN1Ze9AvUzFdPcSF+yxM0yy8pn7w6dj43EtSBR52giFZB1wizKU2UbawooSYRZNIttYBTIe08cBgt7QObZ1srvnLJnhNhGO8SmN1tzpqald3DqapKi+EJFuB+OLC0KU0xquKZpfYHd+EwtGzvCfiSZvgOxAOdDpvrs8teMJAskVyad8MML9X1/0GD9M9KpA01sI8qnPfqajgO8mFIaKR3+CM2eUZJMOXKJoXUcQIi53cjhi8oU0W+xU+Ix0xLz+30170EQStubgebkV57j2fhglNswbGSNVOIcuZp2SnuEf4rL0emKNV0/66bxnhthvzkRkw3B+PUib3RGmRymUn1O66Hm3QhO+dwH28OZN/gMhL1LvgUlMsQgLVcYMIhSlepxKkHmGYN3DLphpSvNuBtbD8dii/CsHKoeCXJAZj5WGvptxMf4oVXZO7uFHcSnQYuiX8XEXGfgsq7kdrATP9A7Rtt4IaDU+pyaSBeg4uz21Sl8zTG7Hixbj9AlJHwlYkQ/wwTuRP0IhcfHUC50Qp8OlmiKVWDn3VbW6M3prGugcx92VfkI/yeHyeG9dunX9QKedimrk7KnMFtDYlWqIB7rSI9QclPFCptIZwnQabW3HJCgkW/xvy9mXquLw5BDItOBeKWHjbSKIPSbS0WUQca8I0BVQ1VBTk1o8fjnvXHqcRFuZ+6xmncViy2GRRZvYEG/TUC4hG+1k78znMJufk+FaLMOIsHCuzCyPgvzhAISranKSm/58q2dpmRZsTU+grONdSocEFN709ERg507jv6nIo/bZa0W5bljFDLARYST+rnzxXyzjqlTEw2T9gR9Mm202G/DP5bC5n4ODmnza46WrPfErpv/Sob9Nx863fbdGpQm01Lx4txwbraNCGQV48Oq/bD+GNrWvda2n3F0KW1tdvWqb7+g/ho9OnA9uAZt/QzGB3McOKSAv2C6D34Y/+YRPr1CkBdR3kxcQdO3imFFGsLxr9PWEN4PeRtgECZyc7HbJiZ500J0Yszt+bD2XsjRYcYYFPCdoIbnjjyVqnCg/HIup3sQ0o6mPJQDEZgfhfxsjLVNoUmiwnSPc5941tKCQOJGz1EmL00tynjNP+cLhL3jcYNoFYIF230vDMo0QGI4n3K8d9Cf3KY2ELYWe1MTkg+tHUO1BPOuW9JEHNxBmDfRKRIpAfDD+KqbS53JrBwSeyHVyoWwFkgM4Izesgz2VXgc/Yfv/9NREi3E3662JOXIlOXc6zEizs1SCC27iRqTZRDYo2vrMpPjkV32MOT5JW1D9RdzlMozVqf4PhhhFpT4RB3DMuKQRX7/oeoOYQlIHh/yspgZ406BWwmtOYXUEAsNRUuJtuzt3Kpg2ivlyXTU4TaLZGKy1Q22nI9aNvuLTSr9jLbd5QXpjfAQQ6/byYQQj5sk1T2L4XoVig83sCEs+/vfMNQeiFldlpQTTJ8y6FKA43xUuPDGdPdIwbXOkBmc6oDiAgs3mNR0hf4KMnBzUIoGqcijPn2qUBahmvwAbBIHayHL1XOJ57TZ63b7n/iERnz3qvzaG1QxrKdYftGueKxUMmgryLTkjCIP218UM5N93bhX9YpK/MXSuQoT6YTRcFpLgnv/Je3Y0SIOn3OCc5jUFgvUZ3obt88wNUnW98Zr/S8N+GZU7c4knCeSWrbbW7XqjhYWiJFz5EiCq3OuzmViduVQlw9Vfq4fkcW7If63vItBsj5OIu/2/pvlAJBSIe5+DwobOOxhr1pxOyNpi1VCjiDDNFCZ8q9c1wGmrMKWXm0yOHaBtGJSYo4Bh/Vcyj8ptxML+9gvx7Ft8VEdnNrqRAYQtDZp7yTBMmirmURopBgoyGk0jwP2FnDIWe6LpvfgQR/ByRA8UI2UBmG3u+aOtjaa0JpjXqJZI07iyy4DzHuzQXBULxU2rhN6CIWv676IgRwcSTaNgt5t4LK4XQGN7njURHSdN4/XJsZ7ZonAcSm7s0A1R/yFgmuPhtQTP0jdAdbA3wDnFnEh6jd7K4yiNup/bTgQQgxs82yJdAB7IXBoSZxweL4qRgyJR0NY44wuxbYVkpPKFC/pJUXzjyZnzzt+M18MtqnK6mWz5xhInx/7B25t3zodi6LopwHicnBl22J92KK7MkRGZQax0c+kDejPfe3YjIaJ86w8188hadsebJHZExaYW8uLsceCu3rIRBHkNZ+qrOOS1+amY3XtB11NPQrjmpYyo2dR7G+c8G4JbG4f3dc/K7dniyMkv5apqcX0Ujhzg2r3RQa+FDJJS59cILfrWDOyIQL0S7d/6KGO5IdpJznelG98FP+u1qQ1V7ha3HcJNMsVbwhcWbOZ6TL2SqaDG6BVkfLbA0jGllprQSfjPXutw87umgca3vICb3zvbVtDJRFjIjXoknqr/1kgabqSxDHe3r1cFVLKqnGKXpNsBJckttfeGLQNILSPGssljEacx9uyV41aj3re2S3oWoPyALawqxXWV1ldZRFX7Oa3DfiFDzLVOWmNimcAHLD6eMFnLbWGht5pCKPILEfiKUufz6F5euQvZouejPCIZMmZ+oCQIY7iJ2JCJ/HDRB9onV4RtrP+0jb8YwQm7xLTBfB8+fz/wW3rBKhO5xa/7mh+aY/F5WNELTYT8GrlVRm19nBKsQCIu5N0/9FZC2VOaB8wQTcdNVWijjLPpkte3H5E1jf8qhMgp3NM8Dz/bOk836SCEa4QPTY5IYUJG8WVz3gPJFHt+xIGDr7FtRjL/WBOj20qOH2oUDaXSYo6x78C8KpiFdHpHyS210auEQQfexg1/QSCBvp9b8ewnCoMaRENlzDNf5V9jymzn1ISuLoD76PvzOEgyVYEEmohi14oxnlF5Dzs1RkyXY/C8n8VQpYX5Ho8yCSLcbTkacWguLPA7VLYpxrgzsQTLKNw7BckfloYsuluJ0JIHvSKLi3mURJY64OYha72juLU/scWMWPPJdtif/jt2O12hynIEZ5daErtEmnom4MvMRwhSgji+Scjn/0oqsEmXsAwn9k1HmpFE6voyP5TgjjdDUqDiFte9ajC0ApGTl1HH02mimG7lfI0lt11UxvIZdQHCndK4odj/LfGmlP3GOf6w+WD7fXbDRVWLaPxBLDtZS0zINz4US0bIsgQTmPmBx0/BZZ4hS9yz6JYAgJaS76bvGwtJKthS3iaiW+QdBjVHoMl19d5eckA5vajY3Z1AYyKxXTHkZvxhFEQlkeMVRKxc7QBsHi/HWaAGTs3oKtm/DmPnQjZdzXMJTSjYhOlMudc2t5TGzIod5f7AotFCQh+olmJDahpGa014uGPhTqc2lOndVL7x9tXRA82EEeHCS3bGhhAasdiPWA0MQa3vmFaZ76QUO1oYQZrbDOoJlP4GGv9ek9J1bjOIb8Pl3gMdksxL0C+pDd3IOO0PMgI0BZv7YUXGpbQr1Ck0ZqqPre804ShbNHw5jcuBrKjRCd8yET7zomDrr3G0xS3os7qxGwflfwwq2w6jIdnl7tDl8DodvQDprQSLmSNv+VVPTl1Dnk/JywgZBKKmOOglVfd9DuoN55F+cQZ+bvtQTqPGBNpFlLfv92AqUY+5MVVWNsoSKJGCt5EUtt7oUIrIhgrBW4LYuGffljNTTbdkg3kfW6acayf1XdTfFDc0c2lqzjg1XU2vHzfRV/vEFVw/9sG6mD46LYmhrHQGLM5+wxgycZ/0SqIzr0uX5rly2wbtaUc9sI+nY0xVtuJIbNJuqzNmO73XqHcm3yv4hHUgqBuUknX1vXChVzLTu5uskKpVmEhSFp5qxJyFAc6ma41uFVjtBrSj5utWxc5MI2/tlF+CPuu6mK6uSRAfzEND9QuM/1rxPtSI30XEMqN8yWVq4pl57l4K54tlGTNkNmZZnpCA69FBoqycTh5ovF4lq6lO6qYZwW0kxbseuUS2SL7rJkbBzU8wk3nTgzTVv1J8zpQu6TKSDpd8Iwnl2NA5PM36vdWJRvNu6s0KgswUYS/g1JQSNZxVVaNEQchs3gGkJy3FOW0sgxHKZBnEyFUL6klquCceTExlrglT/NAC1yT1nVtfKglRz2DITF0FMIppU3GBwPPY+pezJb8Ksk3bDtM4HcweCPSAGTCQSgSctAk6H2eiLY29YMYbOd+gDJu9/DSaKnsRUbU8tOODIPNpY/AdpvSj2n+yb6a/TisTwdChCa7C+kVR3q7odluOLDlIV6a4EeMinY8448umACeLXRPqW6qgJBaL13gOH8s3tBSwo+EG7yDaeRI8Wy7zKF2nXESbHCrus3OZqW4UzrKejjaQcVIYmvsijhyYd64sI6kukq+I6MwMWm3Sxq4p9UOmw5NTZgDEZwHT2FtKIsr7I1XNiPegSN7ymw8yvtLac2uGWxMBrQmul0tcu3YbktmZKkc1S942LhVDXF02mSgV1n3Njt1XZsuZHn9RAXdpjyu21LZE4WdiKYy1BgAvt8POI3hn/zko9hWNY7vk0tc8Vs0wDtvCguOE68jdWXTvCe4h+H35d4aVA1QNigHyUe2qMDZyK+gjAczMz09CK7BT9Pogm4dVzKu5/0BehTAlCoPzeAXdLWIuNeGQ5oHPXp6nXP9u7zyFhf9vdV+sqLoS60R7CGeLS1GXyGKsd4+XCWjwUvFrCvSL1PE6BCkQKU94zJ6cGTYnM4IQndF/uLaggwpuJ13v+bYuYsZ2QmDaSgztsriQ9Kdynjbhk1FQmU/a4WvczxnEgbTGEu8YUVmUu0ZDTMz1xcj6m7vEkPgdNcYFOqPwNavdoFqRboCOEEY76JqRomswAHiCsHVDqykJdMSwyLf1b05dN04VzeHTsocE72eVTxclfo29d/wGGDZJKots8qPrOi/hg5An1HvntsDAN/Qh7Qt/486EWQcVCuBUuuSauoCoibhkLnot+VXeeeOe4D5JEfFoVB6t3okr94DfKy9AKUC1pe/3wHAuEq6rlYf2ZhBIl5Pa/yxdslm5//Ew7M4UY4eYktPJR3fu7fQ6S9arCrQeDawIJE08n7I9O4mEEPcbbijtE48BvLJbx2jKngKvcXbKabT4VcVo/hcIHJrpZq+yl3ef1R94eCcy6KaUP7frZ/JhtaxwpLVLXe0mbsqM3Ef7A0dY9e3187swRj9cbzkBzUVEGTd2RrBRYq1pPuOylnrNgXtr93t3kkmK62tAlZmXBjEkQLXQ3f/2O2DDI7m7dWeXEX/rXyhBXtgnqllR8oUM1BoH275NQDjKuM9pLmvSzE3clQRfXMlyUhmpKG42pdbGcbYTC9EHh0I9R/bij7P/o1z6RVxSs2bWg9YR9spiEzMkn3MBVQ7MqqJct2GVeQFAIGV3eyXqfiJzy8QxHygOTW6ALToyip/jWc2/rzPkUU6o2JitLD3x8abca3Vmkxw0BszDf4TNWAPP8pUBOh47zUvqyEa6YFk9zbuUaHqnexJNEQyZ9J1MFcCPKUKKqopS3bLMOAPi2OLirl3tT8YvZSbdE2SB4j1+J89xy63ImX+7WK+F0TRp4ql/S/Fao1/sPOHJ667cNwNdw1r+xODWwpRj7X0Xo/iRzg57/mhuw75h1P2ZkOQ3HyuJl3Yh/ANNSaWt6pjRuqTX1yoC84Gk/796gPYBkm8dHfeA1/YX8GPfO7e1frDmYHHiyFIadMwtd0r3fw51H/Uy+l/OAuZpNlWr7VbYMe0PDB+H1UkcKqgvpa2/WoWAksFe1CsW3nEVZ9f34/BoxYnGn+foQWWg0LYpbLLT4Ad40n/NbaKWgmA+HTIua9I7k9zQmE0ZtRdfvk6ngKjwFzlJ5i3xj8fQgZH/8N7BuucQ2tSMSEYPW9oB/e0Tnf7CiroMJm7eGG/uKWo+dJHHSK+zMSk+tMUncMe1S6pX1WVgHMU9sPZdECWrxNx0KsG1uJWNFHDEmkY5GPJSiVFUfjB1zLkfp0OSLZJDi7V3fXcf085VtgkJciY+XcR4s+Yfj5UYfMMDi2RUc36hx9Tr1NwGbV74dfzBMDk6dllZTaI691+reKeKduIvMlXidAQhTuNJZ+XON+rVwQRN7/5IjxLUCWDWsAVxbOgCoiWDrfbf4SU0Lh8XUxYD7/6Fu/bMv/QM1BdTJETsfYCoW7OUS9l9u/r3eexImUwRR4FY/AeZcfnFTZx4w94pFzxXWEkRFgefBL2ZJPz+9072pbuOWadxsrOFu8GInHHU4W5/L7A/2hu5CKo80eikXGgHw6g5adse0WU0okiXWIpUBYZSow8G65eYeHtPjKFHptdHUUxNmmKn/pyJZQnUnrnn0MTv42B9niiOkfiYSr1pWB4hjK6ScxMfvws7Mx0ewcZo268AehlEsjwGU5ZfXKSyUD3ZutBlwm2VWyYylBJqK+3A/c8d1F8SeY6vMiULcd+2vD8sRhe4vzVgMNpezCnPAD9xb94f2tnWy552HhFWEXQVAgQSwsC038DzEUX+ht0OdglIgYzpjV4gVIyaYcDBkhxjdf5rpy8RAH5ouCb6oTRLuKFKND/gUHCS2TBuHp9tWsJAHUaF93llmeuCRS3Js9VqnBtRT2gdY/CGdswrMyztZukrx320+AuEKoldcQOrFH4dfCH8oYftgWwzcfnN/B16ZAxuT2x2gupprXJm3AMtZNUFVp51pl/RAL+FRwQWWrqJf5Y/VeDfK9UoSlW0yr9hhmdBTzec70EFEHPFM+SMZUsYENo6epoyK06iGwuOHo4YkLbCP2YMprXfJz0TU/v6WusYPKt/y8flJFjv19kRpGE+0kMYSViKO+UTMC5bGGT+s7KQOy6Zy1mV6/Lp8YNCsZRyX3B80MQ5MlXe/50u7TN3BR5p5KMeZ3U9mWjMJWJH60l4wJmAq4WuIlBE/mk2Ybo1xADAsEs0q7xDfVZJgYMLlUV5ki25w3IHxE7llRDaMlzm3lZWR0Wtkoik3XBlIUEJCbZakmmpqtjs6LjDEqBpE3QgIDY6QrQ3ymTRECo0NOC5hyaYrtrdYgeJCJ34uJ834supXvYJL8YA/fJFYqRVPP+4oWLKjo8/Z7EVbV+DTYDgnLZIYju72/zAH1W/lRbnvrKBqDs2DgZRxAUUxWfX0SvohIVAqsJSrlZikz0Km0t9+3fTKnWhUUv5IAkM9X+B95sDY4mNW9YDAxB+NDr/7iri4DQ4nPrwycuk9qF4iDMxDOxc/ZFUx8Pm+NZP3qTZkAPcEvULI0HkM7qhJolwySEMQtqacc6FNBV0QOt1OYD/h4CUPY7oeq2TfHUc6Lox279sqq+bTs14TRtGEMjejxe9c8yrQCwkFx99CUwxYmjeLd/ZdIAPaOMmRMkVhNIfdCkVWLqKP3BX72OOFUm3SNe+z6CK60FT3ZiwldqY2zmcS4/Hy9xobJ0bo86rPmVeIvBf10FffaVFK5rJTfmr0oxGWgywpAQ6wQsTwLFOG9ismGlMiZOB20950jzSqhnJANWBDAln3N+gIT0dC1QC46LHKdqDnFmQHEJG2loojGKRhbvBBWgh4md2Z8Og1SwvlJVaAXaxFNxQ7mX8ee8cag54P0B3HWnPjW62mFo8l9uNMnzjntW4MZVXS65t2ZKYWjC+YLxeRxOQ20CFlI85FpF6Itau+W7+qEo5z5lI4H+SdUkgdxzw8gQcctFEYLRuXMeeudLUWVCReqbC9wCrWSLVRVZ05P0f+hK4tJQIm7OATGpMNmEPvf3frn2PjtR0wuSyElLbtXj7ha/ZMbaJ918sJyFMst+hmRTDUuFQxy06gygIQtRv+0AYuyr8pEac4+LDr/9ckpm6EimPzGP0HeTaRj5WhHliSxbw8hlLOJ86FRoPqDWmi7t2dfOqQKhhZjXPHWuKtXYYQWuK2/7z2k4Q0FQ5hPnhvzPdYTY3Kz5jjh50d2gcy6ScTd+e7moiwV3ZxgifQXlgZxyLvAAmj/XPMS0tZxpOmuyf3k3M7BtkainqWYtAitaZRaboZzz8vPDbU0CGnwIkvs6fQI0SMBzg7aPFtAw18YtEq+jPjPYPrn14V2+3E1oz2CjnxQk8sRK76BMBtRu+POy+IswnxnNRAIwBJhvpDoX+dDsu/QAXoVVx9mL8UevdZVH8jeLMr1sT4z93YIQSqHvYvkSXI0/6o1393yztyUtnynOUiE+PWTbazBPp5bTe61Ih5//V0mUnn3Y16zFkfMa+A9Qvvn+fSzSUny8J6hotUu4zRgieeyg2E3SwzsU8DcfUcb1U7RetHtiJg2UoMWmOhO2G1Zao0JjwsOIz/YhgxELWAd2u7gDCx/eMIxAXuizGInVpa1xr8vye0P04/qwzPcQ/MpBMWVzB3wDkjtHpgUyOlY3Nar0Qut2UM7s9CDMeLbmpnuEU9hLGvFliUtfLtBwi0srco0hXtj3Pu4P2fRAuzpL/rMiwLjkQ4Vocc8EZzIJMPuLlb1qbiJ2qF5hocM3znBLuKT0WOs2C5nM1ZDtgTWoukpQKc0xo2eWmQUq8qaCwQ3vw3sn0b/pUuWTXboPf2+4n923YRLRIhl8TrAAGufK6e92SQRw59ATAmKOKy1gPMaAYFkygs0Z0DVxd+ZsBKeIBJy9RdhjBaQD6HiV9DLmEzvHhARrf/r74KZ2VTS7s7DPfZc8B06SO0Zj8p21J19VwE6thKCVLqlmeBFSxATkOOr8l80xoqQy4d6+SkNPfcFf/e1EKvgYtLFN/0tXOFPs6ufTiKRfoAd32nnqz4FACMbRVfrjYfo0jBRmfeqaZ/QrinAz6WG55b7Q2n9Eun9d7DWyHyON1Leu3NAndFtaOBeNJokKcdHkG/3lhT2hbLuGClcnw4uiLiisQMk/RAOXk4+R8RmVKY5Mbtk0f98k1wqtudEkFyenet7iadQlHheRJXQhipREWmJGbeycyZfUdGb+VmcgwMrAvL3ubCjL2O7FL1BCXyOCssrhikrqlmlCcwGZUSj0gPg2kqPtQqoQImch84zqB31gyArWqPNKL1V46zfFMgBf09FyibF8r+xAwblKX7NAlsiHKHv0QlWepY5veukO+g6gbkpV1Pb0YbVbMYTPqOmGLiEBUSVUp3ORTcqBaLc1jK0ZW0YBcotsf3sKbkPDHpiwgxgTKrPhwg5lEGYRQyaCi1SF0fzma69hKAirAJdpHh0URPqw4CHXWTPWqkX3ay8AVMxl4lxDT/x9LF5cr/0T1ZRh3S8t2nqiFRBglzYAPn40Zl/TWrEdpenEL2/phh1/9j3+kpgc6Zr7eYoDEKjEoSkNTGRetEfGsusoQ06y55uvCPbGjWYf90v94dD6kTt3QyJt/e0bp4pUn7Eka6JzAdiGt7fFR7W0zqZtgPoDbPjzbks7kwVcrQVlKfduUp/lz77Kr/wbftzP3+1tvlCwcohU9QCim1u9meaRZe9VPgKzo9SY20qcWGBqSfSOrrK1JyY1EW6+J+IbOrKQkhHSCuxgCoLfCAMsyH5t7/24m69+VWpbHcShhgl/TPOWRgMaC/jAP1z8YIfABfHr8aSSF47z5Q5Du/0etRfNFcvQS7ntvDY8lkfIutuymeb/0Br/xzMKcuLrbspnm/9Aa/8czE+1AmU+ZNxN18T8Q2dWUhJfXvrcc8I7PU2kCELTMpfoc+2i1Z5sxZt/mrfv9+doPMl/CMy2rH/hA3slT/vw0Sb895RFK4SmDbMzhHqan8yj3MswY5JAMqG43GidBFLouANggPjQi+8y6vgD/y5IdVG+UajPHDjvvW4LCHJ28+JHoah9ChJmgfHGU0NLUiYzJ4YWBq1YPdApk/1UTN2dZscimSbmYpuTN0+EZcndOyib/80gdUAwWJqb/7ERf6ljuRTfVVS4J4FCQtuyHn5Hsg5uhUPlbfU/50CTRZHOk6kB3LdNsw4XXo+RmgHE0NnqYyQkMvvz9/9y0J4sqn8q1DeDBfPBcdE7hA9K0h6bEEOCW/lcQ7PLIbPZAShHfwuzqHhjVGDNHXuyb8xOP9HXX5EP8rDwqqljptyv9suZGraHGuYiMMzL2dyREGGDtugsOdYBIu/dqrXCSnfx8KA4Gjwq/sTCwYqqrVKkbnP59IQLJQYQU9XPqYBTirQMMJhijNyE7o/Y+XYkjy00UcNfZ5B1/Iri6oq7uFl6w1yf9VQ92Nd3Bewy0pngZsausNBJJkqsOz3/cv7Z0bG265lgP8w33xwdQDZ3Dm2JAuy+8t9XWRq+pZ5CuVFI1Js7k0gF3wB+hnclKP3B/7KRZgT8nMQvWUoqbs00jrJi897J9GmtUfidXuXHoY6Sb86CzWFJICuvKqmgCcSMTjiYBndwUq22hccp4u/RTLhHDXuOP3eQdIHipNqWJIyzy3doulqduzhEKuAuuqJFo1FNrG239caLe6ii6cXwVWbpeKwEEvjH2A1ESH5RzzBjfzjr7XIqyQQjJenQVKGvVk5jMKCjIpfWCGzgfn9n1ZKeF0WN7hiXZM+168XFbEQ2QZuYWdjMoEKN93d3MXCVAIi8fY6Gpl0Snxy6+vAfBQPO8hwMD5WnJpvCb+i7KEM2rSeD0UiNB/01JfJaYc3hpX1ybU+H1agADs/JtlAhfxG0etqhj3PlXfvZt+4cADRsgo5Z+fVDBJgaWO4UdWVSZmbLLju7P0KekwXoAWXvkVAmvLE+WL9l7w/MkifrKlFdX1MuLPnEGP8hBAf2Q4EY8HiP6gkzlp/4fdyME2gHtYgbal1qThNbjq7YomJVDp1HVFQxe0oSJLU3Sa7Co6bclnYKXxOO1WBSZwwP52PZAWO0BgEm5hhOis20IH6IPyXUpwTZIhLszU6MWlGR+HNIdG5GLMrj7oPV2letWsIBiMo+o4hl8PY9rI5emCoD6In/0gkwTjTFWCGAHTbft8r7P+io/EgNxCAn0qLPwkPosJuGHEuzd4xj4AxTd/e/R3Iy1sAK8JWqLnH71Adp+A65plo06J01mHhk2Gx3Z/gVcXii5xnUvKoqJpEsWqyQJ7dmGV51qX37ZajBk0ioBShtimImV7iUs9tiyoKAKW2xLhjz7vGswCH601tg/zyMHJnLhi6NCRC4jbynXyK+6EUzfl6y+t4kzA0hI8cCMq7liOvf2bEKuI3kf47K6Yp0blYiC8Z2aDkRt5XxIVlgXzSJSOcxUikPzHz0EZmg2FO7MKn+7X5/W0YrvTAH6qmjpPipwCZEkmkPrfHYjiJnhbeH6Nr1pzNc1B6TUd1hdYDB97EGD3233a5msJ1njeXOZI8OCEVpa99UNbvJm0NguIoLGaXsSYjqLgrsp6sSwJYOebmO/FmvNz3QHk/qYRjJ20gmo6gSwmDVu+AcS/vkkPXAzv4b9CS/7b3ovm1iTn8JKfFImMsDNA4BJvzgrYwnvY8mfBRyVWsYa+TNkPx1WfpUjG16uwV2bfXhXGXl/LgQymin+XneCVtS7PG6cSPpYoXrXhxyC1FWD5PQ2SodJspGAJmrrcl4nR+ONuXHUzdNL+E8EfVP8Jm4/pl7iBulUOVAU0Xp/cuuGmXzbicO9Ih2xBcAIrStpo2wRv+ipbKyqN3UPo2umqYsp4aojorG7KCNWdwG+oFrLOJU4DX0pCCco8UGP1SWMW5neV6KaO16idYcFg32oUZs37Mb258gfvaJS0+m4I43aDTYkSV6IdOlqKxiht6llkBESzupu0ER18O1TLzu14B6nWR6EaX9fUzOo0Kf3O3p5cTNMMJgpPgZ/XpR/5YdjfUbzgSuHLjKnQ8bMllWncLsd6FQTrqwgQVvbjhWMUOf5UzkkRrTStO29DGHbuXnvZcFktcpNipUnFZganTHpK6W6jrSPAxRnwPfwtRT0f5KUUlmURr1bh2S3SN2cRWMxmVjfVwCWBoMcRXKAyXx+e02V0eHZDFmiipUQOoVk/Rsql2X72lfZSTapyRrpNaIkUVnV/dVBPVfK6BsHOlTTHg1fHmFWAhqZgXySsByjkgNqnR54jAHojskPEoET3ISE+MhywLodvbmPhOy7ffIQHStwyk2LoIbphUtoZfYWmswVpor1Mzhvrzypv3qclbj306dednGMMHqno7k8sfX8FH7n96UyCjd4KJNvE6wNS48UGPTQLc+r/Ux+n9QXJ9TXNmvkumOspE7TLPpCqHe3ipIIEqHMpZjnO3+qQdfAQggcz8orL60rueQRJuNebew/dnPTbkXs1ssp7X665eb36mQHnrgQcgSmU22TVWsTI50LnLi3u4eocxxRcJ76hVhUz9U+xlewZ5WuqToQkuFczkVETT5TD7IG8DeZ+ESRxrw4HlyQWuDeLduDIhOyImzWRh+Oi/pbUGnKklkDMUi+Sqe/xM5DHPXk5lsIh6AUxmVLIc6iFSsADE6QAhV6/omMxvPRhN4lFwlus3hz+z6OCXUAlMiYTUFauYaH2fW747hbbjU3657vmgr5VvIxMviUnemS78R3mKDhMI3nxvsIYGxDPmTtyr8e1oKEiYO1D1qDhxrPautCPL9zuohnnDVUtmSOiA7tq8crwIYBsqmS2hFCbemycBftTnq9u9PmLgDyIUooDDDSdDAvr3l7hKYaAHHDmrCbXtSe1UmHDy+R1KXJmVF0WG5d0XIeYT3z/ct9uxUPJVtUPH8vSIiMFEQuA4XXlVK0kM5bX45gX7BuPbswCRUmjXWc5A/3nb1XDW8/Qfl3lKE4txkuMc2NqNzGwZmjJU6xoFtbAMFNop218RRJWzDAW7YUyahOTLfCE2MFOz2j0/5qPPUY++GObu+UBABMQ9pgpw0B5rahtiyZ1S597a4a7/WqrU36qOe3AXIMpFmy227XCHC5o0bBHb2KTdCb2i76CJVgxIcD2ewp/cmT3ZtkWn+vXME2C3FyqkI7gax/boKTetyj2a0no5vJKz2OHw+cIB/3vjSOB4RrOcYoC7338uv/5Q+VqdrRTCYyHLDKSUNCEEe4TzOSA28PsustD1TnRkc+imu1GQ3wSw1yDpFXqaG8Ta4LxVSK7P5bB/y2dWuZrL73Zmfr0OZ2uXHMJvcbeax4elH6cS8Pq856QA6Uz7lLUfWu1ma4iQLDU6SjXjcM/NRRW8idEXvO4lUzAcMLVaVYfBJuSQEw/HUrIryJeF+WvDH6lVE9xkbGBXvwE1Dc/7hr+d1Pl+ZD5wQ0dZCshXNLo/ClUJyxeYbKlrksK0QLGVh4JJL1ot4vjOf8z5rbCbV+Wh1k4YozA33FxpQBWAgf6rzu5ZSbLbakEirUcaeFJEeAc6rUqemD3q7RMAEyjSSi24+IvAMKg586avXKiwJpaPFynPEImus5dOq3LZJVH3F5P2LknMEStAjkDu5ScDF91ao1JjQG21KjiU0dq00BmK+VYtoymoHspbzEwRZyr+n2RdjoM+y5YoZE/qr1J2JLNwRWXmhatZklzyHLax24/8d4YMdoCncWBd8UFVETFsTiVGcsAXIQAWlNtM5A8UYVK4KmopMzVodf25URn2SVksVPM9CmMKD6fKpLclCQZWeUfM2fYW2H61hZPEwf0eMwKVoUm3+lKeBJ76/2wFXZjCBCWaS1bx/R71VWxqfqmlhFJSPz4ZLsz9yWRj/pozmgooHuZpyUoXYb7iTv+IsnB5w/41qZzLCfZAldIqlGLUDmk/TdGhUGkjndIWu9m9S6jIcEhp4SVMH6mbEXFUmAmRT7U1t14HuaHk/THmgsBiRqdjS414TowsLMLpuH9RIFUC98SUh5EZpKhm0yJ4pf5fxthMf1MlzpK7r8NGMslHqET7k4aaqUJZmDmzxJXWwe8vP+jqJXnpHB7RR589aatCp8nX/gzUP765x8BpoIMru+30tkSYMgzt9y9M21WE7ZvZalyoi8kMgJfevcJaZyGeRj8Xmrdt+0UrQAma8OFfWVkxNpJnfa4WMB09+UynppNrZCIyfGl1lkpKvs4b9Y4e+/H/lPY5Q9F5xEASWiNQ1uED3JU3Sbwcv5LvM8c06ZlNdoDJVowdLGRwy/x7kIb6nHRAGdE9dywBkxfEHCl9S9+jnQUF5oKsZHGSflRsfd6Y/lRTP5cJlzLH98Dwj0+XAdv78Xm0nAR+zC2uTafYuIrgyyTfFV5zyuWyMw/SqZoXaabfiRa6/GqkN969B5/UothPgeWkfaxyz3gpPeIkcTLKloewRsDqH1O3Pgz3Yd/M9PQSA56Z9SXNlBTww1SF66sZGM6MqGbWUvE9tSGy+aswuGoZTc0SZSNF9S1VcaGB0O+FqSrcfrROQFQ/TAgxWvqXMN26RFRUZkZE+UjgIjALk3N5356dRYULKR3azyOHTl9LqfCV3KJXnDy+TW6M7XfzdVsYQDo4RIsZoi+uH5Yx5d8QWogrpK2Fi3xveQjF6/Wi/gZsNgO3AISEwW/11BVzq+Pd+P5AGiPtqQMDs8xX982Gs0AYcO7x2HhJSDwG7i7E8LS03rWoWWdsYW7cbP+jMnQLUt/96/fecl1vkhDq75c178W7LndxM4M0yA/ajHCrE7G70LkU7Y1i70cJllgUE3j3ZTAepEGF8uv4r8jyMdShakW4ukritcvsQlsq5JpmQsoC5xQDOMsPXDnXMeR6+rKlFdX2j8QBTPP0c2ibTu0kfF6xdkwLqTxzF/eU2HpxJHcDOyqHcjy0zb1VEIlW4npy8O7m75QE/xO8xNEykrDVpIpPBxlikvMfqdmNsHOW1jv6rvGxWPignbnkd4JdY7QqeKY7zL2yr7fJMKLrB3xmEtQX1sZJ3A3PXwnQYgfiFpwTG8eU6IYWrIG2Az6tGOsFE8sDLlo2/mMGOZMoIvxGssXCdyuwRyD3ChHNvMD3ZwT6RVHfSF/AMUIu81R9K/vYCvcbuAE9HRBM7pHijH7V+P1i4wZQmhYgbjM5Rw6jge3iASYlwVIH8sECU03NQUY4YJfROUVbBh+fYb63lY+iRbOSENVozHKM0sqJV8gL2wLRu74G3MvB6eNJR8CnEhXPfP7+tDyAk1nhE7/TFGYtMQ9yCSR7vLtGZDxbMs/JFjAVAd2wyVtiZqFP/2NAYaRYWWhH/IIti/7zoZbv/Jo1bwo90ccJvDZrxnO1y/iaNCUZ4Wp59GieDmE7G97sR3EI82SvJzIocqTjoSHC2AywLkpzCqtduKrqrUZk/w8975LKukCqWpgSmWgg9YrHGUZyMF1xYuwXMb5BpFJSdrb/z1jbFBm0Jd2PTZs3vzk8bR7abdvz56gkWivwb97tvFIZaA40eBwmkl7eKnO6tlSrgKYQ0DYxplmXVs4h+IDXVIMeGYU6XGtEilAnn3Tibktwuka1GPcnzDUDkveOL7v42PnG0xClzWl1lDrKydYrc+VFFV5OCESti6kMIFIpp/9oR7jw1xfCXAy/+IG2fQ/NAq56xthT6Y8i/mu8tdq2BO9rJO9s97aQdM0+ZWy4rp+aLcimYO8W613y4FTxljeLQgLVebL6YaPxQHEAJhpHYR4VFqQMoTKrgv3s/xAKwdT/YlXvP8frv3p9KDqeT5OmEyA77iIzXpDcrmHTXJKSf81/fanPV7d6fFFv/+WYXP1ahdwhH8TjsGvaFjFVws+OBRCOxW+P5mRzu36kt9uXGeN9gUY6fQAcqt7EaX8px3X3AOuMdrTVDaIvnnkmL3fSagnlea4LYuKcGkdgpsaQd+buHzQOEVBjl7m8jpv0H5d7AlWsB/5MLNZulleyzeniZ4qPZ1crbIOB7MkIwEIeNzdE1n/PtHYz+Lqv1DITDwKTTANoTeKl9zTZWEJA1gGJiNG1t6fioNhXQJ3gPwHJKc2VdNPkblvkNkP3oOH2lkLSrwRHZwUXCSmyk6v2BkvuwMULxOcrVq458ZbXopvwn6IQQRkmJ1WMWh8O4i0Nn5JG/InJ8dSebbfaVJs31o72NgSXrwxD+dC0qQPwZ1NOqIuIBfZwnHJ/Dn/0R3nui6CVBUiVqfIXlv3effb/OuVZVuaBofSc7pqOet7ppZNymnNGOk1ezJMfwlxkrVXsewOAPK1oWSOEGD+FwSBEopz/3ykwU+qrvDFALImhlS0maDqnFQj0VuGZBml7jv1AWXAm+QUBh0uH4RRaa1i95GmwoJIMomcGNwwZGJoe29p7+aqV8C/CddEUi5R9PKN13wLvlFDzFpIOepbC39Yk+Oa7Z7+FPnczx4gZ+4y8Cpsl36oEYXLUVcbSSPJNKrtrEHa+wY+PIpSm5EkwP7Bz6q6aEk82if8Cw7Ibhuf5NJe0JppcufpPqwP1zZuICxmkyY2JhG83+v+8gkpd65Z5k/TrhADJHA3YG+r1vB9nqGkpDWlJw5wODZgfGBPwvZqDvEptRCYLrV9m897GM8w97GVSv1W9yqQQPbuYpIn2w++dRDkQvJuQeMKqXFxao6X6wqZzfLUipd57TbJoJK5ihvaoim6HwwtTJTodMBrSzGf09kI6EZ2kzhKevWbyhP/kmxkzhkCMTE0XaPttLRBVDyFUx6Vfe4fKbOwld8BKa648ZI2aMjQx1rUYmpH/eloQb4U8SYQzeyyzg0KQLJwrU6euCOzHjlv35hh31t+ua1YB2URAF9AJlPcyieHz/iK9iyWggEQavpEV07GmNH233o6NPHgwxEKbPhxm5562IV+OlZuYLyYODZ75a15jWljtxIB9XAmdCMH/vyuDp4/Li2oP2irkavfEOusSPW7ZeNfa3m+1/Hqyrn9/+O2jZkLGnC3lUw94ws/WV6e/e3qX9U/PU07cMfqICnZ6SLcyZ290Yp++0kwGBLVi2KqnUU9bb22rP/pa4Qc9ct2qBSttsBBKlYLTToQaYkViDxmFd9PTiDSxpmOzWHyrQ9fWDpCLGaVEOCDfq1vq2aAaBba42cMWhd5hO4mECb9IbXBi6SoiHG98lx9gx0N7ipx0KUcXJj6Y8NFmKP+EY29IpI8yfvbGLjFEau2xvBNiwnoEpxMsuzLBnLOpLq8jzpAwQ2TeEzcmJmCqA4+rs5g07N90tb4fb6vKrzhl3gEVrKaYAn0Eehi/uCxu2RalG/HtyephnF3f/agJFigD6ALed4Zw87sIHp5sbnIE8lASo2zQ/GNiotZ0B+skKQ8EozluxJ+QVGKv0++m/VmrUpAQkS7s7sWu/ZpIyj5rZ15MWlri1dkOcE0xZNe39JoZmcZs63Rxnhp8UsxK0S+SFqB13H0QMpxBuQC0jwdq1hlcczdeKnaV2MiW7HKCSnexb0XIDjf2ZrcvM8X9hZnavho53p7KDz+b9LRcK69ElzEca+qqZUSMFhcQq0Q7TTaLJk0bpVtGv6fZeM5LbICVNWvU3PIgnVG5CRQCeIxx5zBiuL9Z6mQvRTAEQgm90KUSU++89ceZFL2lltdddvzV7as2bzGu94TF8QVaQKvfvonp7uLbVsCjqK4TV1RdBOWs3dXVaqQJeNfAOIOAeZuqXgN8A4UNbYP3Hh+DV2PKgAthjwOdUiP++Q8fTDqXxewsV92VqRxV8CbMYpShr//084HJz0N9pybB+ZkJ0gprwZxwxYaD9eRmj6FgvNapbNRIXFGueIquvdXO7V4VtqWybi8Vv/vCXFM1GJsrahxuNSnMd/g1tfJULQuuSwa4upmPsob8AitkvCSUFKXTclA/bDn7Y++VTGdz0d6C6Ve0bzChfo/ddgdMW6E7gm2k7IBR20+jbQjwSsQHoJuqeKrIoikF4O6Zf99fYZTrFSqf0DWN/7UyNnybOBsfIUJeRYkP6h2WmLCG+mxjSFEocHomph23PO+DxViM51PswSLmi2C5KLBQ+PzeRJxib381Rg0+PgsIOQCqQvgFIUFwtDhlSQg8acK/SsN3eoK73GPcrti+jSEu4U5sX4417pttBSaU343+la8t0oejnhQY+r0jgQnoh7Vz162gQFE9wUX4JPIPKSHJCvUMEHpSjlEqqSOP95fXO2wRHaufOZWpuYSbqV+F72SlL6+fKjwJz/ySiCeerL4C6c+7AwfXCUgIP/5Ady/ULFRdGjOp33dCa0dksdnoxRiP4Hsq+xjH9p5zIyhBIh8RNYzmqZYMXgEdqajCw9eJg7XjjH3f3j2OrsQiwODf8XpoS87J4+gCdF5Yp9s1uNuuZg+ABTSdQl75Ev7PxyVuAJIz0Nj75Wtz2jGpS90wddrY6nErlDRY+qSlHj7X9NEPHoP+UzIu7zOse1if3xQiHxQva4PhDcmVjwPRVxxrnY+UgAWfr28sfuY7fYnrN9LMomKum4BkL9D8A7jfAXjP2bSrR3puiZgoCrMgkc5n0Re+rQSFOAgkYlIGui3haom1zey6EVvchRz3plu4zfxLZMhB3iY45uYNTzgJAx2xv2ou5N50Zw18Llu2TN8lgTEdM4Oc2wx8VoAOBjHplHdC1/dU9c/ax5bWooB8SZwh+DfSfO6M/Q1PiwQ8q+jgkC+qenfdgHmBCgk6YXqaJeX/CKR2HukVoX4FjAaOIyd1GajhCyqY6vRHXvrJHYljrnc1Sd/ng2QBDhl80wolWYSjMVw7dnNM5Ce+YSy/E3j6kiR59+kJNWujIpAXMoDGA2/w07NXr+jB09O3EQieEEgXd8thF6XsD0TmokmGHLco17cWKT/jFgI2rZMwp1GV0K4Rt6Yj6Y9Yy9UB7Gak7xXWD/Y3pq9vWVG8tuAmr9OVTX5z2bhusg2JGRTi5l1KZ3cWLk9iAlltvZPS3lDs3JZcd5RhPtuvRywFmIz0JNIMiWACyJd6QQoEC3i+HfQeNc27safhAgoAfrGVO6JRdJJo5bje0/WWgq7OLW6X3ixx65RFnwwbRJ0bLk9lI230ePNtRjtkLUV6xiMDtTzMOD8HwM4jaD8hdiWfsgTMBm/OBIK5pLruKoiYbWO/QD/0I6pKxfkxeDUM76jA52dKaYqBO4tFJJhhb/cZ0sB3czItS0X6BpYAQcroFpyCFim6Z/P+6seNDzMsmej30Ft3PFOiVDFiXbCtf495xeD/IUXUpCE1Py5MYABscuab8MjapnsO5QFCm58HCV7TheRKc/7EM1fsZveNPjLAo+zPEqtvFpshPGQwZ7sdYMj/Qe1JMkUUo9/61ppP7HALpkwtw9aiNFHifhlVAMrWRnrym3J0inLFth+HtS3aW8ZR9HDnT7pteHHdfWmBlhSIcmhsF4TSHnMbpnRtVTXLMzk5E+QMDSd56kYdfgAJArF0c6zIRhdp1JAaeoEwnB5mLUL/GuLVgeataOrqh5LNKnhutMgStCTKHte+o7fgGWihqeXEZ2UJ0vfbY4W9cNeKRNuWEXN3fpGsPOxtpFrnxhQKpzpXOhFQVODTit/cZe4XGgxKPiiYFEagI+7DM4oyCRjtxzkN1KSQPyg+/WiWIIFK5FrP/7UXpTI1EHQToqNtz6NuFtPqbWuvGq/w4OWpc/z1EDdeNxnhtBqu8Wptp+LccwJ8cXVrf6HFV8sR+9/bJVGihgzaslNfNKCm/Hi0et1t0WOjgmuPlDGJ0jWmWRA9e02kCsItqgysHhoP6vASxpmzonlPoig00gDJ2ZIZ0JmXFgZdQPH7VjX3MX4RDkv/8LAmUNAtO1CnojtsJ+B+DHwH+59oEODMxq2PyXzaJkdqbT/Ll0vKEd/vCP9SR99ToYw3uq5+tEcBvqsSBaYHFejVKAgVeTV3WNvnZD1IaCjvgqP3bIjxrM37TpPpl4Go/cBtrPResysd4hV+cKSiUSJv2BI0/kzt0W6+CitteyBJ6mI1JVNGmQ5snmjGhb3b9oYhq4862dM6hsKnyXcPk90E7nK01cEQvGXYEZjPs0IoA9Oaqc7Tmue11CSAXLHOIIjVfr0kSbJ+lbtn6AE5Q+YpLBawzHm6Akik0niNBQm+amX52TkbdnBjgaWiCUVzrLLOzVQrH599JPv2+pWNShxfT0YcbVqjRI5yTW/o5y7XkCZC6oid1gnkxg/0vDH8b+yUGaK6hUuN8ooS1azAmOkp/E6I1PXwTdwmLr3yF75BtOrzUlAuIJC66U8o3N1fczbm4787EoroTCajy5G8Ng13t8BtuNyGT/wkUREAGrd/EDP+J352t4pZA60Gg/wQtzmXwP6a4KHuXEWyJB2Ja34Z8NOC0yRLvG7EHF9oiz5yVVhQSezj5qYH0/YK22j5+44vqOgT5Pnl9xBzouFMfqUsV3giDquzNoeFvqOlzcQ/4n6/lyCbZ08SFksgrWHRGyo8RX9mn1EuWv2vitvUXq/nByBlov4WC/SDGLmkY24n1RbC1JZKbtV7y6SsXmAxskxZrYgTTLdmsb3ht/Qf6XfsJOfx1KoLWttTyZ2hbHpBmu8sHGhI7KqmGUipR8khuVkn7S6SA2n0OzwTpxP6ifRS4FLDy3nLI20gYOSWQVmkRkPnMOEl2ioaNU0WWQK8DI0MMV3vJ8mUJK0/kvRXsOv7Df2GeDO/6+DCNg5KI2VoBklV75bQ0/84be4UVzaBEwe4KEW1BSBuzqmU/lV2IX2zcUrXE7EbCIzHFF2kY3829rkQvfOINc78Yd4k2fbXWJfPvEje9PFccr+C7G9Qxu0k1/goCkA5j6dCiToBhzFbLskOcpBy9iIr4f9QWUeBwq8UOdH4biCrM+kt9v+Jo1L6BUJWpQ6hxxD4OXiD4hfYb9AZFelbcdHLhANYqiYfs9nJZn/IVDbGg83i8OYevZi83meWqLLexWSPCEbK9rHDi7ulXAxjzkx7gIvy7iNzeXraEyGO1EaddlMVCOLEsAJOQMzO1VUr2GTzdZeAwOD03uRHdWZkSpx5ITjnL2/m8Z8kJuugsbFAjpZl1l5Vksds05gyMxnDVPvEfYLJ/0RBMEBqBwa5WM8SdQcljuwnE4x7q8Nl4YW1pDPxZGopGqr3TVo+ilzgIRecK0GiztEokKkl9j9Uhi/Axy+mQXOlm6YgQxVpTtoY/af71decFdS6pA46QIIbY3WKaCEDrD3ArNuMiPvVQFuJc/57313erO7prXeAUM1mC8kF3/832CwzvKbth4JGFVpT3o8bvXdSa6xfAJFc/ydCA4rlvZAyUmVInpTi93G1UD8C1p7yaMwGGDxqLKZXKpccrG+KtRRwC497/YloLh07ea+yG68PKNokaSMNt8qiLIKIORp3DAKZv1UHXZsfZZ5bWNaEq11HKdwwfqAJ4h80zd/+v8WJ9dvI7VVnJPc0GpjB3LQNo9QNMFTPY/y1mw8kdpj85jv9yHO1D4VrDSnP1bd70CF3QETws526x6myBRficBumxntbUh9xhRQPLxdzwflYwmDJozfxDrpyjO0Vb9S+7eIOGnTZeGnMxc+aVZVvele2MnHQofA53BQICA/EKhHb1UT4ybZRmDBct+BOfJZg6yRnFxBo4DuXKoI6swDQrsN5ssvQu823NIuN0ASIjNEpKxYg7yV2ByzTml857GxWrnVIWO1xLBdNxWUQ4UjXA9NZPpwOVLuHJqHhfY175dPp08EcURpDiKR4Md71Z+2wTT8PE1V+teDtqQP188zXOr9v6fw+XPNNpYu7VHXhCnqoCzZ4EtC8sF1LDMyuOSy84VcUojMUg/feV+5Fp+VUy7lLRO7yVZLaHuxDR0Dh5Ieo/oOzKmCX6ndLduE0bqo7+7+ha7QjLzX0uaTbzaAWleYclm0SQGiuEwMewSk6sanwB9DPAumE+S0USGRGuYcCppdnB7jOr1iNNFaZraybEQt9iUzWvMpVcjIwQDgWa53Eq1n4S7K1PDyivwDj/0a+Tb1zmGlZMaZeyBvzK5vSXp71uD2FLiRYoy6LH3Z6P4RFnr8IRWwJKrILjY7Z9bAN8m9zk56s0w0lUQiyuGoVGEJJFeDi1nACd/OHevW0xSFHTLyuW2XzisT1kaZ5kjBl2cJ2TD/DIkcqqrYdT11GSgpY0WbU9GxLI+fEfLl0ejT0IJ0Lmebw7Q1zWSywBEVLx5AxDHLVYLxjlmcoaNILEL5CkE9w+hesCK9XjHLtsdnuFnejaLk+ejgbL+LXcoPyiA8OxP00vxyNF8V1iN9c0R8Rqey8zTtXfb8mEB4jyqeLK0er6MLsPZxxooUUwsQzP6fY3f3tGSXFfnehG/4Re1XoMzwU9SeuUHQe83+EQNbUFnYmG9eNzKtBWKTSKmjaOma5quklrIDhNgSLCqK7jRDp+gURC1Zv4+murHGG+8y0NIKbZ7+wyjtsOVkNwCIxgeOCZeYQiPUXuKjDlhjG5Jfmvww8+zpD/bx4i+qIiVwt/qeP5hevCIJIEPQp6sQNsCzKtpkqqgdsS6qUl9qmTADifv79xCiLb8Xr1kO7KXZ4L65ch5sH1umVniwiwd3HfnnMXrpUgBVoRYOzatgEV/FY/qHS/AP3tjbVCx8uU4PO1ID+mc62nDD67j3Wk0RwFNcr1jblzvln3JccUQ6tfSZWbOZMUjwA9qcD2Tyg1gACJg5ILituTjRV2jB5OiYqeRB59givwYKClRHERGF4BaZvY/Wd4mMC046lSLe4Bg8Sb4u/Drb9ufZmnRgNiJHR3oByWrRFhpktnIKr0Del/xYcm+JolUV1A+1e1aD1v/vqOKEJZ7qCU2wgLvC8e9Ix//HAKxtFIrJ8gALJpmo3jE1duf6eTTYm64wX6u823NLcx4UeH9ys/ZJ+t1YTVsPgklLIfmYv9eF6e/O4eH7DMmK3MjZDEGj/9cAzFwifKVNo28dH5OnuWlcjOLRn1wzpE0/4XInXSOxghn3niZf5XKD7kd3usibuEMY/KwvijRHBKq6mVRk5KixkGPj30+9CGAHOOMu+rCpc3M0MX6d1T8pZRuujY5ubWemk/Nt9ueclb65cuvGMxTWTSARbj+1ILmQwR2pdlpr6JxN2GzGE635TeUMVFGnBriRzabTxuCkHTVpXxj+XO2MvymsYodPOZd0+sIFIvc4kbeQhxH39eq4TrmkuBuNPasOqh/G1/t8YWDx3rxVHm0Lqh3XMCnOq/7yn0mYrzW0i+x0x0Liawj436zbmLoIVTrTK+9+UlgLjG17WRxpseyNRbAv9ZUPvj7ApP5b7vqBUxeQHj3xKWdnl587RArdD7ZRu05na9D4yEHxDWyk520xqdFKEty/YksWXMUizY19zngCifyW9xH/vHC62WHQpo7Rv37MMqcozOGz+DdvFpQS0GAOvAbm3VpoIxW52qaBwFdf0VUZ8k0yfjg6e7Sh6pVGrBcaOp4jn+3HQfAw3Swo3iEbnSRF5BRYBQvi/X6xmmHIkfO9P4YdfolTq23Y5c+D6ZXLPSmP3KFahYKfp4cXIZU5ReFKoOgxxn3LogkYNisVKNb2+b9APxUZeP08OHoX+AM4t+HzvhcWv+rkB3g4Wc59ikOg+qVklYt4BrxbYlBMGbgJ86MxMqRhAB+qH2Gk2Z1805A8A81CHz4RV/e9gFjitCYr45xX1tJeFiFnMWLn7WZCktB7NPCOVLGOMged16doolgr15Isl9dmyP6wx2Qoj3jJJrcZVG2dr4XipuuF9IBIq/aa+hoow4VBDrrDvpGf916D1atBxKR4btGEilVnanw4ynJsrKyjXL+qKNSs397uNJ32U285UjyjppGH3eK2WQIRdA7jF5wK04S6ctZCr++fDDhmNGXMs6rz7GN+FcTJtjIiKiPNwN8dwE6hhfQ4PVs7C4DI06BsvaVU4s1IE2Ve9fb79ZcDJh3Z7nAcEVzBYurOF43+4SaRM/E6Z5iyin9jI1+NbelNZea13OxPNCLovMAKyPsy7R75Grzzp+WTrVMRisvpO/O3S0ZO6fWR9zxgwgVCroW3VzhGMBAK06Un7t+ASUcAVjgnmoCStXvm1fx4tFAO60PHzzi1QM5YVI41QMd3J2Eg8sl46kT8eo5t7/JIdEIKIEiSdEgWdhmLbB15C8QDGi0iBwyzqEqoARr/LDF3ooVZ/Fz18owj+fb6OPJRVP0vRMPZjdOS5T/ds9RzfXjtmeLhMlKJvKayjvPWtUcoJ+QtojwbqgQnxOEFmcpgrDfFac3ZGZErUsC38lIxPsca5oRLhnJfQDkFK79Lf/3uAtAzcs0sERA8KIYxyhkXav51Jhy8v0Z/RHLjkhlBUuZhqStNiJtj7z0lugMtUJ68BtMZw3i+j2/M2lKa8Dbl/whxzdWMkQfxpzXdHJwtjz0TQAx7t9XLoRBfge6BI7d+Dr4Oe/9Sa704UMdAiXMjSh7KmfTdZkyuxeESgvUDhmgb4Jj6oYW+mR69yFJMUjFlkeost/Rsfyl0KGuovDsPytoFjupN7A5KFZ+FV7nABraIOdvINcENXJJ0Z4VzH6IXim4i4VL78vE1+esetvu+b9ynflL96vHzjMEdaSvUnkzcLkhLlfDyLMHRIvAKkrdrApuJFSkvl38fjXsDZPf5wDVGjRyOPyClt3VZlICzbKI5OfNFCiyB0bd5exX3Fg3kCZ0CTGyZ+Ip4OxxTDlI3LGb/km4DhZ8AR4/CiXVAO7oX1wOSNGuIDKcT8vKk1Hx/MkPRQu1JwceDXCQTHqqcsCUPBlpCXta3F+On5S/ZFUvqLCtUs5pkgtfMkadVJ2SLmUyFNufpz4tMMwyDYA8Fr85jB7nZgYF7ANQdwcP6iOZAJsWsw2Gw6wHgITSeASWQBnid/F7d2HSmjpPg1ChqQFmbfg5gV+jix1dad50+id1huYZvV/xnLni4AvuVssv24uxip/RnEKIip6nN3kQcLEeaC5YfuLGzX8qapCrLSyTOjQM3JCpq9yjbuWZ4ozBvY7iiAhXcbNMlZw9Ng2yHLP/gV+tOPLZ4yzoTRPp+xOMgWmJRKncFqzsB09kIlLX6kQuOOJbxtDY7cFMiScgzr/EJd+0MBadrlG0b09fYlISlHT1HFPGpRNvpdSQy5061qU2pvwllMHpY2XBUHNXXlyaV/EyVp/B23//xHu0n3pr9Dh0yCaTnlpklbqH3zq7PS2Hze5IUWrhg8BCDYnHyvSTdquCKx6d50Hn7suKGo30a3ly9KWI9yt27jKEftOoG3l4YT2AI6v/8Uu5RJItmwGZp0cxw2Xg5af6LdDko5jGIznRPSH4PQEu2CBjl1k9hBqk9g2TtXx891wxgnDUgqqpCQLbH9U9AaP1fCqs2vDvQyfVknKXPCwu6tlW8ILC9nZ6f4f3TOIFINs03vi7TCsleW2bZnRXqTS3e5anuYYMQKg8+kiSrT0R4yBeYktYkAAb1LOMlaMZyBTwFiX5HXd1pBh59EGMANqpWhyd9EHdyfHWp5bNY1qbsDpUhRPkhcWlZKWJXSkot4VyPLuV4NP/iUFJLg6L/nG/oXFnE/sJlbn6p9MNp+3pqtnOhAm0WO2Rp1qrDduzmQT4/ByoAKAfvspbMQnYp//rz4NFGja/Sk9K2nKlZQep8TTkDIUYn+mz0p1Ow1ujhJnSX58k8+MPMOIsmhMdz5QLxWx4ZVbWoo6sQMHPlTHlizNTtaWM6BOXbeUX8CTSewDeHmrvO2R0FbshJMikeluqCtIRaeyI6WvvxiOkUOXSsl5lP7vf/PV4bNvy62FgKsPi9E/Is3w9l/c7wZ3Wk858dBw4aW+K3mOJlR+no19GQFFdzPkyUZKq5253cfNehlPbccSEQGxVzzD5kO4PSIipQH03NXFs8ExX7Agy9zilx0hSq7MJPQgvlT2h+MD2QSmijjO0Qfkhc03SnNosBczJCWjPGa0iKf0bV2QpX5KtCvg++yRgazJP8pXJZ8K/y8Ez/xtGzSByjKwVfy85g+72MY/n0bn+9kvlvYQ/MvyEjvmUdR8/FLX0FoEFXVd76yieLp+KhVPpVf91FqxBezTtqIjpJ0xCoC8nUqK4IL9g6BlMuIeJadMIazcILWQxL+n6BniVixOv9KFoXXWfwySn2tYmcWFDdU3TgJWdP5dqoofI37xJriMccMscD9xdYOo2ATeCp7IsNkWXngQhrIlc8emCXpf/lYrPbVYZpVpwVzUrQOsKXg82WS/r/t/uCqd5rWlKiiIzWuIlpz5Wk+wmt/B63R9Z5HkYULqjRdLwj5YCi7p/dUr5hu4vPHZdvPF63QfoCSUHXmYw5H0Px9MBsRwZNsxwENuTINOqI8aJnuRwciL7hzPMOcIK8RwrJ5l/PT9IrTxlwXqMAz4WsO2+EWdCP0TZXQvypQ7zGBsfzPir7CPrXRu3ueFb2Gz8s3iVWVlEnhz3jPXjyy6W/gJAYiENb2uD4A5L5dmnV8fkNiFmAYs2D3dl9injnvGVxmdmGOSW1EGl5hpBTYNP1I8wAQ/9LC2jeOZT/k8K9d6jneV+CCEF83/fnZJh3o6+iAqXN1nTJMfxoUq9VeKtvRWrRHkNfq0AlqeWUUOkwbgOm2vykBov69ny84o6IunkLQ+f41eT+tMi8pzeSma6Mo9YXxrJKOi4Wd9Ut4/ck+FxrIjCWkmwrFd8QyYUhiTkVRMUu+iarlV37kxefA9PwTjeThidTZgrKJAWMwRbq5QUFAsNAaCSrSPqcxFhLdBzsa9lvCfI91e8bnerfmLASxm78jlHx1OapCIPfl/ncs0e9z+O/iT2mGWhrmB+TCLEZFOb0jDEgR7/eKE+U3weV36hmHVutpposLp6QEwYLn1jfThSFlpwc/wYrfxggubGHYzqU+JOXLn0Oz/QRLxzsOD09VLZTafViMu3sNRgLkL8BIcrzrsx8Qt9HyURDWHHC+LN1OgzTXIXUBAjIKmfqOcHbNdMgSdZ2hW6zSZdy695OfMEY2Gyo62ygnV2RInLhIj7Ne4GaxMB19WJA65B8CeyUUNncGlwH2sAEDekrMApenD4iHIkrz2vWNuukQhSKuv/nLtwxGnsaDtu042qtYzSCT5Mv+aqS+sN2+T88fyeFN3mB/ItFN0Dz38sbTKERsN9h32IpgAHSWSurPpFIPGNC3kjbgIlNY5R+VGZ3Jz41K34cJuRNPfLbgk6fy1ezhSl+7TXNGqx8kN7KmFHAC3ScQkHcMbiKI+dcMsfL4mNW6W8mlt2eJZ6lqZoe2uhOMit8fS7tglMrhmgHPWkx8YnmL1MJKGJFCvEh7wblPF2jh5k79Fyrzf6D6SBEgbo58JcMA0vfvaNfA9n85D9Q/Vc4GhyknLfyGdRrS4DtTWC6buVrGdiBdIoSpr4I/eEF3G0XKoQREjMI530Cju32PHW73mvqIrZt0+rQvdE1JQezwRoqzfJZmvPLNqN2+P/gM+Yu4jDcCDQmoVq7kw5/DhgqqoX1WoC17tQp49bBqHn2lZeRC4rz1oBoDbw/WaNTadooIdsofqwO0xqDRcO9fpDf2Ah1eU6izhKtJhk6sgaCDa0gCt4hnkYwztB8S2hJji5HuiCkNZ6tMlxKUvH92j1JXuKDUBQTkezdbfYrLhpETKwOxnlCZ1xbnLNfdrOErBIT9rI3K0tphCjdqBgk3/92mVF66pZuLYxM3B2sSjBHtDM0PrZe15v3JKoFNx+fHGvguibWWjFS0wnQRoNKWVC0zwn5jI52BIjofIPR1hWiGvSlJA80Cbe53MV6ezZ+V6QHN1TnzEpo3e4+3nI7sYs9PKAr9N/pOjkUSMLfZP2zjSWVS/aHCKiscpVrMRz/8HcfqvGKLV52eEwB/mqHZEG5FVrMhniZsQcNKXWWWm3kacK4IeedL/ajuhgQP1fOrMoP5yNlodv9yz6rvZoAKML2uWMgYQ+rGf9ujoyAtf2utB6OmTFBs2ey7xLjqaXmszjtsLJxV/PqM1IIC8iRBbR8si+5fmIgz9fwspDHpauvgyhvjTQ4Bd6R1/4hxJna6D2v1xB7H+fKXelEpPNDEAAZO7t+aYN+hwIRr8bno0Ppd8nb0I9BuQyyG0Y46WyuwV/kpZoorKXWCVEr71JLvDszWM6ZEJOuDBksjnucCgj/ASTNmIWXlsD0ILB1hpBeDqjM6iT2Hq3WK3L1uWkpzYBwXE2UyfoPDTVVwogTUOHnxV/eaEIWwA+c//+jNgHAdjRUJRtwxvyd86yRBtsxOzgK80VERqolte9Bpr3jsX7FKTmTe1Rzdv2pxxqJyR1IcdwN3McYqxGhZcvIpOy8XXzlt00yI6WinbXlcFHxTaXS/xMfSxX0GRo201YGtKijO6gJwMgSEBuAU90SJ80G4EJ4elYNmsiwB8FtvSY/2jyK1cPbEvHU1Wfhzmv1r7j+SRa/vNu7xXygqKLYV10QZQp3QckLc7gyAkA0FODcOc4W3UNQid3kkQbMdRa+UV/e5fI7OupL+zawonWQEyGy4gQdG6fTIa41qokQpeYr4So6LUN2cfiPVv8RDZnNTZIQyqsYugKzZWTN0RK5KKFoTWPizSJ7fyLcpdDwCFSOdY3ujcoBNlh6oj91eTiUiKrOR2cypqM7De1PQ+SHxa1lwo3gpMIuTzVO20ipPYiXY7chcjLlN2wd28UYB/LNjiH+cl7EaqaZPrrOXo0W3StukkDfEOpVNRAAuEzDrVuU2/UIvamXW5GebbM/HY0M8tBTNSMjI2dCiev3+IKPNDlN4Tc/ZzX0nyoOBhY3IZzkld1UIlHjeN+Rpgdc+lHI2r/6XOSbUUQpayLbnPgQ7ED0DbigEeso7HGicVUDk7pbsMU50VAe+R2PlKM8MjBRtwStz6LxOqXftIa+eqAM+aiIn9ZD0IFduTALUBxcSVWnFLIzEr44Pi6KqGnXnwdB2P7u6NT/lK895J4nnyemQDaGHZHuRqxp0mdZ4QJhN7bUMlTpsF72Wc7oSLmChpWIxm90iFGJGGG2CwG9BzoMUTgMnWMi9orZB/F13pIY/SJzZEJbZxzlfOL3QMNm5/aYtGsf+yzrKE0Ju9wWdZJjDFuSqx97W0UXBiIPfFHDQQiuJy3qBi7UpegwQ6lnL6AXIhWnOPkIK85UjVp+S2mrH9eVkDCR/gb3i1TV0FE80uhl/9pzjNhhJSPXFzavUoRRpm4kwhnGC16yC7GPlLsgir28d1N+wygAp6Dp8X7QlOUwzk8VBng6RRw58Kt/+i2uHdUwK30loAxglqIp7sytN2vEuy1XiM96Khf64wM7KUy1XsqHVF1n4tKRoPdlCb1xZ0p19PDBQBCxNx67wh7ev9SMFcm9T4wQPZ593JTX+TIwIg9TI6Vv3ojw/YpRizy6LocJ9lejhsP4qBS6jrcoe+QjGZK+yRyjoicj45LZUk/FWAw7B8n5D39taUzNxVb5P9LL9IejOzM3slnbZhKs9gBXm0czxWpFZD9gG0lzDSmpF8OzXDJUp4m2vSylnvqAOjC2OdbZHlN3lcba9wyBaOOfZvwl+eKDL8geUB9QbfGXFa9M2kz5CVWGkdFXMsxfbXm6FrXYa1v7GEeDJ9inTTjXadSb3IYCQDLCn64i3yb3grl2XxDH0eIuV6M0E3S4D0k9qM+M+WW8MMXIinZxwVhFqFUJ4xpooye3gB2DtZx1z8XZzgH2bTSe/NLrJGnNxpV0dYXPcxo/siMDbWBoUkEnnv/a+qjJ9zTvZilazVR70xhEbXKX2DZ0qpEPgossk18rNciD3dFb+VIOTuumU3PKfIPjtuWvyjgZtRG0bH1Hz52l+zvGi7CEFiZIv8nL9/t+uR/cxsTGrNENYxGFxcEceaS3wpjp5qsdseAxTUhARgKWfNukHD++PM0iAHivzvXRXBf7VN6ni8m20s99Dfe78g4LpGGJz0BsO7SHEwn1u8cY9Iz8l0kZCc4/jtvioH4Zn4YktIlE7XuJCBH2L+BrMS1Cfc4tcAuDr5r3vo33bHKb3E1w14bV+bRXDw5OV/amtyWGuHLomcuiZn5/v/96/Q/v/H6Hv+/qW/7+uZO/x24tZv/5fYjvGpZKJXKPCrB4LBNZlZNbau6zbc7Tx1Sg8Jt/8pKjSXYu7+TSdtXgLJv1/WOLutnR88fZTRilfTzcLhPZ1sP7RMymbATW2aAW2KmCDJKOC46jHKFG+ovhsjX/RLfo6La1329eEYVvHjtioocLDqBDx+XrsnDfDTLbP0faPvpYhNXhGCELIkUEYBS4dc31D1xTE/gk0fdmVHmes2iWeXgBgsdkSqeOSB2GmsGWaY1byOKNjuiETkEwcdh5134ZpWGj2Mjwlvv8Ire6Y089R7cBuz1niFoKCkVYq48w0qo0RwS7Bn3wSR4N23Dl+3KJazwGXn9q5OFeN97BJAqTxWOYTlORUf7M31RsvSlzv0PbZpZ74ZMKULLinoT6x1Qy1G5Kkp8ns5K8NXltyNJ721XHy9llDM0zXiwEMhhPbtKblYfVlLZHkBCglCRPVpS6S9E/XiuRL90LEo+mvVz0q8z5VPFKc3258eFYgWQI/eLLok226GBmSy3ohjvyIgqAuexurJXu0jdoFtXit6+4bLnECj8MBpYAe8T/6CWVclc/O6NfAu3iPRz+49xk52yqOYHDjOljovtHGR7OJ4OSukES14/rIRDj/5gw+uWedq1FH6vrX1EFpyOlBefGahHwjFOHbzlcBxzwK6PypJYM15w6ZJfo7l+TKTST7UTU+2A0RfJ1nm0HbzCTbPnY22oz362WTJd0jCOgwF0T52SKocekShI6Wfdvc2VMouaeZvNPNlWOkaNEL5NOdebVnlHK8RqwksOL9t2JJdT6aqnoK6WX0IXBam1JQER3Upd8/XavTYiGi9kHKd3ViFevU0sdWfUraKNYIwzyrtHgY8Mre+VZiP7BdLweJBFGtYC5z5sTVHB0F/bMAtC4CvNl3qjgIbNvgZLWA5Sa5uLQsjzfNKNa+J0zkMwKkUHt7e7sx5Uv7cOwuD91QTJvkzOPynCZaDQ5j4tjmFQjfexGzBhkj6boE5f8mdOOd0GqLTISNqurLOi1YoUIPUxjsZkMRB3oewQM77ljAu/sQtkm/tB4wt+H3N0sbriC0g5mPxRK6EXM4WMAF3AVJFcrC0+J3mXWM5CJIw4PJ+HHUAHu3MM9NhUHnJu3pwbL83mnkJTgPCvAYTLLbTGWqoilJCzEB+P2CWVoRtXQUfiB2KtgP1+O2WJ53Kpfu8He8GHn2xN8euv+XzpQcDtRfhGTxThKHlZNec2r3OkgQWCGOp60hX86dZ0z5H+FB+0+JpM++Q0xRUwy1WDS9JFykDAwCYY8kTfT8qtSATLobSjD49tb3kJamG/asj2/WUx+jVnkp/4ti1sxjH+QBF06RzFWCB2nfPFkz1W6u+YBYLIFwYry83MPl4O9OAggHrVGgGXMZTZcVYI7fhAkXxkFFcl4nFceyG0tm2NXeje8+t0RHfum4EWCbjP8Mi8ObUhJVSCVvswc78sH20kdAqMJyx5Aw4OiapDQpstzYy6BTXrBSbRRWrHM62HTDvIOUg22TPd6UihJ/Jy71CI9PAguu3TMd+ew5Xzg/YuXAV49rqSgHRg4Dt5+YK5vugSAJpr1icRn/42AUutfhDR7zVUH5TDkJ9TiTFlctlfBJ1saYb1n102Qi7ZSvn+U+PoE+0+DXBhaLgs7QjseCV7VkcvJNUNP/N8UL1fiD7f711N4e1ZPc7Gk452gQF37o2nulSGT7ZCNeFFcLpxE/2AtZLPIVRs4mC0eWHA+waBxzAod2ZF2pl+ou2N35quNRSQjjVF/bO1r0FTW6k1UJyzH0m9xqwm2zRpMYQ+XL+yQ7gHG22GSDAKOFDUy3XnRmeGgRx9+4V7RhV8jduHfsji6/t/JzT5+e2n8QG9GPpdvCjEmQG5av3UhXbVQs3ps4Uu4qAJGBakNN+qJ90aK8cMxOj8nodKYFGO1goVdyb3rY1dlYONbxpasC1RK+NhQAPPcypQtIGnXFdmdSGy5ckKI/yLOSAJGNxIIOIF5+UZxwQElC4BasY/oLURlk2DnGRKQiGcckJ67G5O5VH1eCW0Jx53f7HjflQ2EsAq5Fu9Ct8MWZ63lyOmqx8ImIzJ39PlpBat2Yh1eWpcKc9z6b1Oe2lUOnyEQ5h5vIS+5Eh8A48Y1rYD86FGuHUlZxKWDFaINl/bgQLHb12T6WV6E1G46733JDf8QqVxPZuHx+7hExwpKb2XqhCkkHIyu0kHGFnRF3X0LaL7o/mb90n7AO+0D3ZBdASbCKtLTxDbdPC/Vh/Fzq1UKrz54MbeqO/IZcGycXJaR1u0olZjYGwKDtdK+0r5XgJ7Rw1yQJVzgW4eY/X4EEJUj0zMhWSS0iOZDv2isdfeo1pYUblSbDgPzEszC6qzAn5uGbsANChuXuf4mlxD/Ufcevshy+HQgQYfFDBlBGWR9tMC2m5vFJnR6nwtlfDiin5ekPWp2NYIaaKpgp10yCD2kBAybI/QCWGrPhV2HqnzY1rHb1KRemDL0snrvCPG+66oH6/UvUUX0dXlQcSFhGZHpuxO1cjccFgGfNL4Mm+1iiBnhWA3/GKlLEcKrWTnFVOVNeB5/QRfh5sy1Okou53yFsG+MOloz8Er28SkIF3JrmciS1dtaEikh+68FEFkx9drgJt3FAZ9Y8nsXbg9/0vXdwZJY0cLIWYkmkG2sj7NVoluLZtR+59JmtAaU0FDB3smBdF2BiRMnn7ES4BpYlMjAdMhewXGN0bQeyjyU5Nx6OsDpFxswPyMDQX4VOjRvihlhuJQwxmyhQGSU0/35+uxUgaeuCIl1Q/NELMhMY36aMIFxEWdz9VPyYXHVUaYn9e+S58wyLVnnb6nwDRridBr1uwR8bI58r+OjOQXASjgbrUd4XchMoJ6VyveFNc4TlwOBOzeH70HfwFCjBfFDWK2okC4/PmMGZ0UB89i2FeKgNUO9CNxYZERxqyxYYDJAyg/1sRLRSSzebdu7jnrp35F7SnW1N1yphDGWdtMzQ8whemlz2qh3O3g7pGIP8mjP2eE0Axqy/rFPTBk4YJsihM6ES4RcubYgjP5Tw72aNngdGq9qhgG+WBEWqgNox8uk9yCtg1UL3jCDK8puMRfkf1BTcM3Z6NOd9QEiZvvquAkQZUN741KffdCPLkt5Vs1GhwLXnQRnAwOmrQKh2IxVXDcY6mGRDHx9f+Aci5hS9YD21pDiEJC8Vk/enZuMQmhjjzNGyzmSYNdFHFfqwnF7TD9k4uj6Qx3yjqyhNKxau8bJ3Y6RNBR7nxzeNcYLSSrdRE7QbniI4s0NisaPga4SBrWvwVPNehvKTAA0ZyEp6W0JTd9iyA911SV5M3y7ADJ9WFP4D5FdJ/A59ymzyWAOtbRgjoxwfBL3b/gg/G8CJEdWvp5nFszEbEHess0+pizkNQicnNChuc3rgHdf46OGvtxIcnl3ycPeBp0flb0o/CsUmOsJw+5YPldI7pL2TjEuB/XqHl8HwZsKtQEInYU4q2qRwNd7FhKURZkCg2rqp+HEOU+r0nyuVnbhuPFmfGxAlpFWvAufX7vFxyH94+bgpT3H/oGhJh+8Zy8+hh+n5RrbphBHCPcjONxzTGhrOV53H32s51mIZI7A/BqktNrXQHK0jNq11xE6W9T/ExnXLMIMAktz2Ewn0B2jyzMbdEgPEov8+bfCdHghnmzGmgYU+l+8Y941eBFCnmGmX/HuDMqwhJlQ79RNDSP4zr3uZRJKaYcrV3WCZtU7gBClRR5d+UzbOnuVm7FbCMZJScwYhB+YF3KIDaj7SEfOd7+xwniMiNEsQtleYf+7qgJhzPW2LbHYey4hwUh+Zmgun+FYewrVVbltWrLzzk8E8T3Hs5dw66FcX6bWM5ZN5sQsJcCGUNMvHgnlizK9E6t5TnpJd0c/Bo43ZFu5erI6rw6VywAV78DcX3urJytiQNZk5ZLwCTOEKGWrYI8B9B/heT8r3TeNcjyLH6ZiwNrJOr8Sa7PJpvKfq1BuX4hP99REtAgW27BGW6nij2XbK7F7x7NZlxdrdqrMyuPQsJXwUb/3viQ/VEHRforxtJTEPZ33pnvcrkf64YfWx91If67tM9I6hbDa61WYJceq59q+RVxHM/2tvZyyEZBspdxCErmuzyKRLE7ccRaqw3q4WF3KiVtxvz3fdF0+9OkfcO9yzvar+S+NTFQWWgRgTySsmjD4PqR9Pja9JoXe9/KmqEWsaaj61G9vQB7/kTtIVNLQS+OZwD9/uHie6JwMezMT7J+ONkYrZUTLLNfJ06ZfGqCgeUmne6KF/cDsfzOKiCOi6DTwgzcIk00ZTSg+UQ/ZZxDz6o9fW6dhJuDUXnBGYHQelPyOS9PB8Bb/mYEKyhLsjCCRkkoawkKMmNRFi5wcT06UGPWh4dqvZvli2Ji/zZx5OsdJBTVy4hj2Dv62D4mt7D5XsGXpqRDvGxthakj5RxkgJsGrFodN058N+65Pr3U1VdXR22dMtazg8VmBPT8vrzmUKpN6Q9D1PUb1MoNM1iKd9+EQiIgt3Ah7KdJ0ROsGjrs67R5N57p2FyFGTtVjatJQObPzD2C9hCNu6NdHu2RLxss0O7517RVKFX4O96943vo3AKCB7GmIlNNjeKwcJkJ/JKRCprpn2HGOz3zGH0+GGriQA/Iw5O+tzaDAfx+hBPxrY0ojmqF6RKKWnuEvFglA8K6W15vkaVlhwo28rR08VwOCrujKuon0iQiIggCWoKGE24h0wXzZUnLXM2ll3KjMOllLwiNPpifPTAwwMw8OIbrJ3kklpnLkNbBCvfyr9Ffv4gWmOHio6zbCdGQ0u8ps78uE2IwCRwVSwMxCI/3l99Cg9XZWREU07AZNsFP0cxGM2stvCApjeXLuaFP8hUC1Vk4BdyUiswiPBps1e8MNIPF/AZBdcgItqAuKDAuXqAxdrK8h8Qub5oROu3qv/Nn3dlzmtTxlAKz5FMXhtFcFsRs+8L87uuBAcMBaaT//F1LX0mtZ91j3dfeclr+OyIWTOMEaG53j8iUWRZ6zHqWDs45ncSCG8YdhrMDIU1fldfcHfpmPKWz9QMzcsContpoebJxxqOsXr68IUtAQbvrsxM7tXhzZ+ayJCh3qZYAehjnWYhISgNFCt+Q1HVY6KnMFpnxNojwDdPFRb736dEHa6sHraIVkXp7E41IJiQ18gK++qcYTBq4R7vcANUQKG7o8ahZA5KSrYejv7RkPsVgSkeXaYHu4vdb+NjG7tGT6UvnLc8O7N+6EdcGMHztErwlxn5QZAE4XWGZE4ZIIBBkfbtofK2iFmgFoDS5ma60mMwUXT/WjfACHLWMXXySaZPdPpZuZiOZD4DBdkThvIuqDYTePmvPJqQd/i34yWa1P+GQEHiFUXg3MSCffVnbaxYZTw+9Y3HyIwYCni7WA9sCNjaOGqa2AXn1UFz450WD1lANhOBH3E2ljjET9ZId8E4H/ZG3VC13WFq+JQtaUV5BglW8V3hrJeTkJBNnKlAHbCgZoSElTNtTlTf+ehtzjD87zPbaQqaZjUna1ufOHMmCjTeQ6hAJhqrKvu65+tgKuIYA4EIyn3pbUx7poPpddV0dD76FaQDrFhlRD+sz4VCv2kQ0asvQM2q0pMTPh6ShcOxCrKRnqNAunoqyME2qeee8/IgvwN0D0kxxD36OT2JHuwzjMn+uEEr3o47GVSRGJfhc6dI3lQWPa9Wu8+Q3RoTAi43E/JMKK3AquT2x9S9jmZL2767UGoQRAxrnWRWJ9yu0QqvStGvB6yDnWrpl6ZKohq6n+8Fc91SheoOKzwa+C3X/L2limKB7IuySEBdkg1He4tejIVzT3QuP/mkj1XBQX0yRvxiqGK3cFR6H1e5OCz0Im7TjUiZdO+cKUjvlW3Ny0kxWIOVeE23KQVfihvUcF5ZdiTtJVbZqdtmYgm+RitdXnkPpAfSGFMQNA7opzQzSohoDZlsWrSgPprlhtNsaw4sW7Pbadvi8+v5m9hjhiVYPmUq/v8E6+vPWItnpMXjYn+R1OdHJGHmSqNpRWXd+NK3XA7a+vJEJPrJwrKYahMmWsDyfhcgZNtgpcifoc+6DRZNXiowtkow8u06T4eD7SK8xNIIz8J2mYClyXKAdT/zauDwc09YNljIoER3ammnXMV5J/Sn5V/VyMgqUJuWisdwCdon+RYu+4T2cUCDm3NBfK7cSs9tPQAN8DjLfYadgm/aeOwKzyaarnBR2TNFiPHdviv9k5ck0FNlI3X5gya70HWt/IDXRMYNK3/018KcNEP3EeDwgoi6xekKtVdOP15ECiklYg11FtR8yf6wJLoYMuaTw1B74GRH+ueNstAWY8KZj6BC5MJCb6Mswhn9CYOQmgowRkU+jIOir9/CiZ/GGcsXjXv1V1Yo0okeOceptlzAzS3qBIdY5ss/c9+NM17rpR5y4L72OoipkNvMlLtOM0x1lERGvYYv/K9WZPzZsrNFJzQ+NGmN2kS/AfSj9dxxB+FX2iKLUIl8eBHPY+OPjEJmfYtTTzTcQ7h3UBV7KPAyKCgXZQewb+Zqzai+31YWwtaTnm/CBUmCVNj9THgmz0nmEmTPqyfV2gcOV3ieSKnD0aSZ7/PCNL0zDTerOjy6y51ebmTH8SM4wLar4jcvBdXbhujPPjE83sAa7cMwuN/7u500GMH33714T4wdRX6CAU2XLC0QcfdFpLe5IJscwkLD88nzIUEXbDYCk0OSCPbHp4W+F9/V7FFYi5dk4TXO7yaIiSGB6QgNr50m+GxuAbB0rrhsuVpHQu6vp26CtKDsDwH5ErsUioafZGnFRejGxWXzW23QFFJI1fO6msly20Q+P+GJm0To5nnVls/QhSgZE2r229WmELm/NzTxxRLXRX2U5MeMM00CrICSx2aenqRMmJyEudGmXEUZTYPgdTaEmmguuM6N960urQgI6UrggB2ELEcOjN40SimKP5ESRUtZNQ8RD63HcdysR94JVWtzn/ykZ3HTbSOjJg7oW0DM5sAH7Z3ki6PZOpKIPwb4Z+dKEx77JEOP/GVHN9kVT10LnTm4CRqcpGyRzJr8BXAufKx9uczfUvlUubkOWcipmwuQJsuMcQnfuPu5uWff1lIM8RooPOoOoE1RVB9Y8/h4RpWRvt5+PLeDVyItef4uPMpkartbWOSwJEWbkWc9b+KpH8WMd4mkaAZhFGno4fgHpKQUypF/6QT2Pldfor3mp+Aow/pNkwiJNymqZHsZUCOwoAOyDO7DIUP94beGyMOeTrn3l/5H8w75wnlFZFNM/G1uZMZSWOwqNwE+VOfBFAWPb8USQpzA49oMd5AdxR4WQMgFGhnXUd0zNSOGJxukSvSQ7zokLKcK+nFheGkjAltEFgzLNzlBdJ7ZUWNkc+Z3bTAGQXjfWXK5fUkbACXeIBcFVQROoATNYn5poM9JxgC4dXdg8Zj9n2cxPuZ9XaRCIPB2B+K4srywaTmpYLeyi60O5FcgUwuMl3WKkmCmTM5UhuGvom862WQi4iPjl9ASRNja49+WXS9brFUCsplDj2eWP8BaN4vacq8dLLYzw7xpXowRvPc0o2FuFkW+mJnSAIgiAY+/LjDIKPGJHc+zMJzu51j9T/35jHzkmHkJMY6ZCwwja3i/UPjTDT6mMbtLL/Qbllwfkb0wSW/8ohWlmZ3q3HAnRlON/b8k2Fz4+NzQwaCvW5xykv7/tv/i1QmIQKtn6CShO3PeAG6chmm+mJiabBtvHvHOL5PyGzEU0DIpTxuzYGu1H2G+nD9GACzaZA+0CHulH7NxWzWMo2JYwyTDAYd2YOKaU9GARKdzBsSCSF6UWTIIgcifdTFehcQQACQXbxN5LRX4eZppZeTWb2NLlPV05Bzz05tGiHURrVoeiMCSa9uFI+oC+jjfAwg/+TNFbkJsU1omNvMF/YHz8seW1k3ZH8pgxcC4xm1mUC755CK8Mio4Bq4SEVSG1v7SefR4hIOG5eKtw1/oq5GnJVW1nSDkDt0UGrHywrougoUlBDZIkzvKupgUT7x0dPpzJteG6G2GkBB4HOSGYcS4YS1UPcNsVdQwzPK2/kw2SiLUJURs3EuIBC+mN6qeI0Fm+fYzEmfrr4kZC5D/dbCL+wabx/bSV32LpXGF5bMpGCRmHkmd5ZpKz6LXNYzK0fmUg0wbUsPwnhZPLbAhMUojQizRoa5h8mpFda4XYtZDBfhpRAsmjDbs0A5fLFpJ3+qm9j10EWN3577j3hh4+wnnxEFTTm8DdzUCjwpVyKFvCTR4lLnkutttZ4jR6QaD8kREwP9jsxLTCUX49+zBsyuMsNPMaOPt5yYWXyefv6u5GCC7QZpj862Fo9lbw+wweqX9lVynYxW6g3Zje4K3Mqk/zTKkpmTMYh/M/9n1I/KLSRcGA71y2+cbROdYxO2a/9BJy1vcW2J/KbPOs9fa5uNyPJBBpjYuU7kwo5K5u3tcDnxjBbw3Wqy4nBQQyzNO+AezEwqc+JRbek7VdTriBDV3NdnuaxTK+nY011Rrg/qEzX6X5k6pdhs3WZS57BVB71pWDVqCKda9Lpzm1aVho9dh/K1vEo558OL1I9fzmYBMFfDk2oBGAGGKJirVyLOK+dWlNMx7b3MW2vwdm2n3vUgZ06sGMmCllFXatsa/xasbQ9mqOPs+tWiRDFEodM1qrZ9Ux2ctG2Ebl/Ztcp12aGxWuSMumQROgL503bRN5PmvKdlln2B4K7ORINHvGV/8ZbGYUt8svULQ+cufOLUG51KQFxDFD8DpNnPHnBWdIAJ7/G1WR5IyZX0c5++65zVoqudV3Fg11dX3z6mym3qQNR8VxmIrMe/MaCgYYHYTIoMviOr6W2WwR+IX8I3OgP6mxoYJKc6PekZeg+e+ga9j/goNPf6XtOV/DxE99C6zmDaf63sqJaVH02mcNXeA6RaAanUaWPqJ6fxtN/vJh61Q8xClO6WdaLcecKnwkNYV+fFz/N5xYGNrort+qsblDWEWieuPX+zXJ4juGG5RH93e+jfujfgFLmHFSdLrH0YdrUOyiW0oBcrh16JTL3TGJfCu/MEPMNtmJN3FojMy5dr+YQM1YYIwnlCwAcEDlYiD/Hd9Fk70F+R+cMVnNAflhWcpnthGtqrn8jXbZf0dmn6rlRcMF3U2r7/d7WTwVhhJbzbXBBJSYejecag/SAudOh4afs2h22bOhXwEsRpZHzRm2tKJi+w4phpoOe0Pr0sQJXdsU3rO46I9VmvKub/UAo4zF50U5QA5TvFYNjDdKFROQaNpvme/PkD9+SNJ+ICSvfbGDKuwbxH9bVh9rLm2qevKIOWMrLVvWnkQAz5LMa3KABZQSvXSmY7SPWE3ATQym2IU8IlMCc+gcitgyPoYTzFqvmhzwpO00U4lhIeBh1ozGQrdnFBqjtrsQlswPeOxu2t/8TzqryUWiGPIDxKSag63KK/CLjcdaOhfecpp8fNPCeOWYqFgq89yWl2d10xmLuLKpUNYHCrCZAjj0m9fQKCtpzpeE8NZ78PGWoJCPFXrq1kovBLuKdpsvYzXZg5Ai35ladjHHFd9eVz75QuIIx4TRX/m6NymCU3XoMEEmmqKCz36IdMOOa3h8B4dfoiAS/O/uIQwbHbFIgexFoI117ay1iC/R3rWYlJRuBRQdtMfvhK2Qnr2sOXtesPDwxKh16n0e2K8nOl+Tn4rbno4IHuYaEKgZheuv68a9l6yqfHHNHC1XGVWcv3Jn4QigfG+ra7cvg5hWvA/iPcEvimtHyNI/Mwg+5Mn4ItSic/yTrrP/5uygUhK7xfNQRKFprtmV/CZTrXk6kqNISKKEAFkopvl5PdCy088R9ks1gPlpg1hvXYi5btdEd3xZ4lCH7xx1ErZvaqbHWfh2UxAWHKvMTFY0eY9VOYnMVypmNqT/eFofBfY+bfcJNl8HT8ZqqnGPh7IgnHp7QGc9DF3qeUJzlUdRz6raXTLXxF7pJsactZH53WFhs0Q92G/+K7tbjqwPSynVRh4JuqiTTohvWdqFvVu+uHQ8pM5kmOKpa4rB0MY3VbbqzqsZHX/avFkuE7fqEPSyAejN/Ll8JttaN/Q0fj3vVI/CQYk3pr3crDa+TxUIhltXq/nYlapZeis2uCCToVSRKuAhv8upOGQ7J8Wehegv/I81hHPVCOppUZ0/m1MLZUTXn584NJUjLFJjEOZCiVqC2H9MvIk9AjONVjVc4XggvnwH+Rp+SpuI34i90bXKrKr4oGoJrd6vCC4LJMPH0+WM5jqwy3+dbI5SlOksSvhxNBKgU8oqo/LTSYRd9HA77EaTANegFiea016gYAk8PhkA8p4DIP+Tap4jh4pl6cFLOJT3iXwbwfbaicpkvF6m1lQVuhd/Evt8qJBUerABOVmOGKDTH6BH8Yy2HgWA/MWW5/WNUX8MoNTEtSx8wfvNBB7n9eynd2H47AE90Sd/BsrhzzzUcmRnmXXZRtCV8hG7YiHkImJK0L6tbTeBr75W3RhHaGBe8X6xVbYpCfE1IVNLOYgFob6XqrOz5T76xE74HAFhkIPnFm2ATND+Ff9ZfwjOJHVdGlGoUMYPSbBdv8liXcAg8co/ZukDhne2pt8D3m1HgbsykwJHP43osd3RRbjLxWI5O4NQmJNa9LXNfH2n7MXu0T6CBQ2WpBopLByiRya7n2O8YD6LxYEgsJBRZYQi2qyr+jPaVwExJjHRw9IpRlHNO7INZ/AtkzcmECztc25Soh3jKc4TGjUvzNPvaGYeUQQ8HnwTPHSATEpA1Ap5kHFHC2nmIVwe/AVmsZVwQ1qlTG5hxlZNlG2iu//dbsS27nTbL9+/IOWEoe6BhXyhqRZZQuC24OIgF7FS1gqD+Q3jXWPHXUhqtygxIr9+oO/T+fPOcRgGCXC0HtOSLNPclcqFhfBjA1GPeMu4caWP/k1bk36VkEXxF8UBR5QtQUa9XMSd/d4j1NKE3eHKt8AOG3GWA9uv8rVCQ9kpLGf1AIylqAB3GLFxAx3AlTMpl41GMrBbkEeoGm6gjlwJA2n1f5wqm8HqAAEYFdsCpO39dDxzkULc74Gk4K9NulpTu2oaPiZ18ITubDZ8vTMQvk6ycg89mRXpM5turuioUtPNQntEcWtaa8wKtvxgRhi4rkFCjJJGIO3mbfjJ+MG8hhDiD1YarGRIz67NLpv/xJI92CvqeNwkyCpG0pcOhQsgdmcnOOielb6e4aEZNbUj5mhK2GqphuvJXvofPeT8efHv4s8HcZW4rjaXhQYiqEYn+JQoOYeW4ukdevsLG9tV+Ng6iWVGerXvUtyTIvkU27ufQrA1Xoe6GIRvJznt5H511DwevCnyYyitrqLaBOpj/zdo9yur+Wb85mwLWKjUtkO/m7eCSeNaF1Z8Lj8SQcBCA46x/egP0UxSCEQYiBGAxnh9OVJxiCjhnPIo5iV+jizvoyWEMUJCbtFKAjHMoCRqkI5+LjkSa2qORGrXu8SiJw4OhxC1LKOSAv1ZT8zXMP6+XT5V2efEsik2+JZghfa2XuWuVLv8eNskpsZ8SgfCC+px9EgXs+tyRSgS2ka98Mw78J9ABkFfvD5cnYgBcM25K2n70NKkZ/+DUVjgFl52y/mMXpKnEaUFtoGaetASsdEvzLuPkLriJNh4R8KJvby8nJh5pRSwe49tgAbKYgDITJqOGme29wTn5JQ0+F2b/bL2ByD61LQnAlekJpq5bRNvqR24S2JWz2fbcCTxNunOzBCMUWjdQkyYlgGZ0iHMsvNTCIP2Yoo9rKUW8Y8XP0cXz4DUQEAscUEtEZucYYfnhQY0KlGppqaZqnTKvXe19K5fkkWJFUcuQARIcIAZgAF2e8gxBj+g9Y4ukyo3U6ieRUPPEL0kGSE4PvvEvydKZXX9rh1+4WOLLg4eWJi0pXdJ4IFlw/4YE/RBYEdQvsrnPXqRv/ApTtNzfyrrdLVqm6IHUxwfbmAkvTHpGznUi3mfTP/SntjSnXiKmgS/Lhr5kQ2rxygQDDZKTaItmBbSww9HsHx+O/gGKWBF164hNN67w//BxrYAQqz0iAD0m6apBCaztp5JJV497WsqjxHbm8zWVC08L3lvbVu7SJMwkV7Kq1tCZZrCCGMC1pIz5c7OoZlmWr8tuHQw2glksF2gNchoNoFsppOlpaTot1WCtdAZEuGNY3LJYKgExrzAv1/hNAQtP2fpQZHXVhyLhpl+XXAAsLBRxpokpC3E+EF0StCniw3fa0jGiwYNqH5jFkh3colavC/aHikZcW3B2wqWlvuA3uZU5gCNQxiPB6ivuYV8/mL7B5Bo6wWqD4+GAzTSsNKW9d4pIa+caM1xWyBHwH2N8v1Xgc19KATPDNEnrAKABP7yBMbpL+TW48uUDU3aSJ25+RwG3cBUy/kbCkL2rC04EjF+jjpOvZ/3Jnk5/RAFRKZWFpCJEZch5bbMPXgH16XzyPak129licDXWO+EbMGq5OXyz4lMgTrBr+vpvOZ5uEWVKXGK+7yK1deVc656Ok/9D2ZbUfy+RQCBs/pn4dPmDNI3mLbZPtOLZs9S5yS9ZvXH6QrJWcnENOGi6qZmAUSCulMFw/fXmvGZQYGXslD/yEpBkwhCnP4Z+o2RZvLVFBVgL+ucIzgnk0s/2I8xNJhf8JOdZYRv6Uspkbop0aP8lMDj0pIYjQzuSUugFHuNdd+WhdXN5+9SDb4R4cSkRxWh4CcHZ2EtsWLZHQh3Qu3UDewlxs0UGtqfDH1SmIg+uooZwL7dB+qMTrq71cjYLiny1exM8AWTi4YVmYH6FI982SOty6ae/IhYn7fzaOxC8rFySHrydU3J5F4EO2PPqPD3v62wOODAIpPjexFe7A7gmeXhuzgbkcwsnccmQhDew3jhC1Uu7WMRjNqakGAV/S3gI4u1KX81mXMz9R3ZQFFWcjz7IfD8RNY5Ig/ICycmJ9UofKSBdMjtmNjIImoooW484y2jBKPl6bGvM4fkaOvfCFeYP9zy2X5HjGXgmOUdYryeum2pWH5dZRQRRPH1+/symHl8JkYP8uLBbSNhSqdw/4/dlLHi0q+i/hOjJrgqFVmZ5/VvIK2K6V/58M7EohWwWbW7q1XUawftUtvw/CLHxr84upTWHuKRf9afbz3/+BJxwvpGarOTxmUhKJTicXiC7On2TgslfUVWVbCsq1GDlmERdhbWTUv/6P0izDQdNcw06oHUhUapld5OIB4lLf5LNnvzYzuUYSAO1ljEnjeTFEg2fsgea9KUHlbwAL0xabQMgYlLn0l1zgnvnfix4bptxip75+nVGPnk8gJycfwAap7spor2GZBxIMUdxnuByOsab+jAPWQE2c7lBKUzYwjv4tf75TVcwaV424ZVz+l11YKAeMxbkidaYT1qJhlaneFKIzDwh2pG96YwVJWcgDotPtWgVDf5tpUENx6oy/wshx9Gyh1YgLnF2JvP6RSl9hmIPou1NoVNcYfykn01EL1sVwRaP65Ga8iDBsS16lEHLyCkV1K3jz4k1l7Uy4KaOURgRWlF+0TyApSFscESGgTaqzR52a3mxkh55XUJNbX/K4xm1P9dOekquXsjlI4u5rlE4e5Ea95gO9nMMtdPTWmyNnNCRkKWyG6WHXIbiT2pcpZzAP/fJylYPRtLKngKIPHz6CL9+4Fl57JgCpMYH/RuuYkYzDvjWHXI2bVYlHJwMHGnvVz9EGmXGw4PezW3tmRQJHfA3fKcE1GPhWuaauB5oHE3gziZaidqAfe8nta3JyhKHDFXMscZ1vG+/FmrTjLASgwcTYeB7zjshamMq0dK2Vxkd5RyIaiMi16/FYr6PDfRi4GJ0rOk4wpNlvrW3wfScwTxeYPlQYCc3aOsEIbMNHJf6V7hevtUs6+51ruO8YhYITrGaGpqW73cRoqxtaBe5vWqqjVXFhY5Eso8LSGFqGTsOWoxfHg2FxVToS75foHwe38VdgRHjzFPh5PR8wjWlyVZ92ygu6vC4DhXpBn0RjdPTAgga827/dRpSN1fuUb9ajuiml7MRI02Wd/aUvzCKyKSJugMEFoLkwbN/V88UaboMo8MryU3RGz3OkJ4f9Qq4HpEKQ5oQInEYkpB8UKowg7SpCHzVee3BttGUEXDZJfD3RYKCVv7Q96xRnGCQVXHpSVEgEbXjhTOJMGfYHR2BVqY854lv7NpIu8bGUhkB1QP2opUoTm2VYFqavVE8ReTC3PQE6s4MiDBRc+BYmThFdNJAVKac2VntHvWiTN530BKQvp6kEJXsAI9zYXaf1EHRN6hvPbFB1hwYul1skp8LXZHRbuR3/Je8o5ZUlT0V8qX7bK2ablXfcfdEiJ+6GhnSRSIFuW4jwSxsJWSK3YNcQgUhfrzBTIZmUCmfiSfvBXvKVChLGygreSF62CgrKDg/NJHozuPRuo4evIHGktWqs1YzuWJQ24+tLXBRmGYH5KG7hMbOh5fGKtp/M0uSo1ifiFcj85HfIy9Y2F7RcdNziby0zNAAsaItp7ep0PMs3vUt6PJQFrVa9goscydQIf4BNNVTv/UZBTuGwt6cAMm6pVCYzCiYS2FOacFWENJwiBiEURrhCahLt/+RuUyv1X8Bxr7Y3/1NAEOy7/VmU9kMw9owqG0MZVx8BZulqqN0DkEtQ9b925otCkeKx1+OMZRB2/3NWgT+ZSMZTmJ6ZzFymZHbOb4y7lBQwvpmJb490qXMhsqF7GSHfMqVxOGllMAo582yefxh2kpIfqBcCzctWznZBSdkBiJ9Z7Qec2qEyBFJt6+K59atc2WQz6PDInm9ODDncCfzV/RFOfj77ma1OqqpoAL7F7V/7n/oVL7OuAy04/jUkRbTJB+A0AtRyQTuNHbTglWleJZ5Fx6rywRLGtpXiq//esWtx/R1FLjE/8tktnI52J/XXglWz7hLW/9twBkSEGMAdj+9ZOxUGl5vkKaF4OzhPx7wJbJy0f0qlXNTzvPAXs8NyGbwKzXRaE2NBKNdSQugvQl+6kVxl0FnzyPQYMAadUlfSrfes1CMouBPOyNUuWzo6ZyxbRWGvpuROx0+m1TLDMsoAiu7UsF5otEWcc90jeDcs1pYg0edU/JI3WDJK4KYvZyRScrDNaFsi4CrdfFSzKlafyjrWR6uurbEDV8K6dKmXHxNmA1UWXhrqtmpX2HNAFgYIg57N94O5Uzzkro3C1seJzIumVefYwIYcQMqs9NL5LaE4CvjkFBIqPs15iPLF9LHR2rvKCGEaYcNeriSnEHSY8PR0O+PnaT9rcIL0/6codaqPd6eoq3Okw1hAywfSlM18e/XtutQr6rZ4C5H2VYes1x9hgWRs95saZ3roTXZpyixRtoTJ7IrTYico1DmtAP5jNJ6N1jQN/XbRex3+mVc67WR0/jGEMQaFRZRnvXLouEwDkFrdzwtK0A+YRRCqMjmQDUp31yf1U2qIbugqUUJ/ys/ma7RrACuJXdpEi6w6Ss4p/UlZ0OIaR78g0fl/dlwBcK4I3kXBWSQzS6/ZGBWCDE+lSYhQpnCByvlddXIviz200BWquYWU+ITweczLH4HG3ruUloxMt2q774kiTQoIXxNKicmJ8VlNwuu/51pk3e6tUQOAB0llZE5Eq6E7c7LG9esrhW1kEpczLOqMISbcpKzoGwjL0NLIpu5o5gJlT3KduQhrp6EaYOlFFfR/IHFDKgdwHIQVmkNu1UXtFPtzzF53C1DVhoA2R1cjJjvcJGm9ihgc/5hFrx9LrDDaKESzCyK66NoS4c4OP7wwGKFZN2OTI6lPwh0sRGcFZEHMJ28RYq1XqAzbLW6CL7BQdZ0E/mRqsupZO7ritmIk6vi076Re3v2LurU6aLqp8h6PMZynklwONjVw9HDvXG8jHCMQ78IfvFyxDuW5gnn/m83jiFGc2obdB9kgJ6a1u6hvgb+bezIiDS8r+Wsro08oCeic7Wbp154f50PIBRGVG/6WgNGYvoaQ+cOplsIEh4s89/uv9vWRUPRIN7+52j3NPJ95IrkDSyogFU45FRkRdNLz3HcvEP5OyqoUMmWoFEPJy+X1oZoGyVgtVwr1EywDeBlo39lwRH6+bgIsC2KLMbZ5ouDmkOMBE9qC+2SQC+1P6j+PzTrbyaeRHmnfKNQXKTC+CN8K2BrTsQFkvwhFzQdakW+0+QA4MEVSVRXC+GtXHllVbhAlYjHphL1lrSZ77CLZSdemPS2ynUm3xBfQNHYX5k+PLxWXG18IMN7dT+ZZQWLBpHYyymqQWCDJTndhFQXB73JjCGPOXJ4RhGG5Si/hXxEf6VD1pX0FYa9+Gtac+9kflo4O1883eZsD+Jp3MgCNGeXvc9NkIqboPBRU3KEsYRdtTwnRjB+yfPTiqDnLeS1BfiNcMgPeD0HCC2TmV5/zi8TY1FMYd1vFuYVN1tTwDY0dpyg+aYQm7LE+3jLxqJML4eSQeiHt1NxFAg2BUvsdq/QvKhI3TVGG+uNOL4YlgRE/FiN5MPBskHQsNcXZxmu/y/d5xjFb6Xl0yW95wQV+Ih2aMwTg5dY+uXraWs2Ol0ySC0XOOUYNadvbyufyhjcwseyn2dpnQwhGYeCfP4PW1yOn/ohxhcHsJo6jxy8exZgi5xrrC+Stj9a+J57zFvGAjT/mgX/9nt+n5gQDhGMI37OCAW4t7b0fF6vY98Bk30LCLjmDGFfCKF6D3MHPruXeG4LpGSwd7CL3MWkQGvdH6bFDsqBmUijpxNKoTHbdzWRfTvZL5sY6Ht86cq1i7HZOD3T2djAjc45AQD6LSb9W96PO0etUwquouhKq6EB8pUTXXE8G/wqS+eKrFpJK3HQ0TTkadOCElcbbSPngu7z2tPHM+iqzKsrk6QRPmXhnn/bBtG791wa9iB0zCBNUsOf5qo5DCym49ekFy90UwOw1658SklMvGaHTePl56lx9QiAvr8q4qKHCXcLGqedUjxY9pOTd9TAfDVjDvGgzjZ9Ha7jQ4fJCHDP9dN0JaojWp/ALVjM7JZJo8EW5xAr5U9rcj8doJEpb5aHHHwyWVkolDJkjaWZuzuty1KCXIOzi0Y21v8XKbXnMeTQEtamABM1Mk5SSHA08+8L+mD6Hrl2XBO5wBLhU9HXyWOC8Ldsd/n9aLSV18l5Am796K5Hq8BdUKGNZq2cgXZ3OUREAlT3bpMpq35qjtXkWylGCaNo7DEtmeuJtBMg37oUNzizg9mx0GRyA2xj2MxwKvz2nweW0tY77WTzc5JusR04gBYU5sI673obTErAGVwjY+jhr4A/BzcrG+pS+d8I3KsuZZ5gkS0FaA5w4BmE/Fp2LQe+T7mcLue9ootgROV7zA6K8SlmKjGByVnIxussojZDAEssfDUj0fKX8kwiGMBd/rPbQcuaoFN3N9JZeV8XjirPLKiKcS5yqYHwyCS4frxZu03bvJ0fIJdbVpTzbt16YKUkOWDidFT2jjgqWITxiZKzRXdWZiSUXRqUHor0mU9ESQa3IbVGTnwC3vbalNPNRFQQszjDMPugmEkO03tkw78vlrE6gC+Tv6YCqoTeXcC2r3BRC2J6sbYU4iHYYgNAeZ5NXvWi1tMUWMQCe/Vknjq1b+pYUU2kZJ6MxuWok/Z/U9tLf7vFYBUScbxWdTcNdR5i0RdiZTvZFW4NDAVLbkTZgJIxXtCWAsoABIj8TPebkpjYw2vgr5upT4WG46/kCm/xh5zqgn+48H7v3ZlGIkkpt878+kXJvO8qNehg36JA9slXbQSHZFJa+W/P4B3XZ/b4i7Q6Gm2jue1ghcUl9T3PErc+exptI6SgvxUeiuO6XmhYpX2+soC7Ulqe7bf+YEJHaQ+JkAMZQNJNylAlsulFSGRbgzR48NfPNj4xg9+m5DoZbV8yxtlWIQBFK0SKT8fGZfEGuuqGdO5xpIyy2b0CBzjRc/yDJzxoR9O5H2ubyBQLSC43TL1TePASPcYfD5vLPEyEEZSXX/UAnoLT1X3AIEanZjJsAUCRA5D8zhlAsG378kTTn3khJoM1nyZy8wi9IXQM4fMJELv0U2ky1QkXaSyqJNNCDvgiwJbsZeWtWWcH14z4dIOga1xNc8u/TAtZThu+Dh/GeuEoraSJquX5c4lVrxPO5JoyDmuZMsKk1KLAq4k6o7bNkyeRLNqAV7GgOO5Dux2aDpjpG5tL7QYL4XQReNi60AP14BOis+30q+ta8KoXZCXvrRCaUqsOpViVi5YoEQasIP+hLsZvVXcOv40jgPD/egN6/O8D0DnzFIW99NxPkNUSBlvckL1cu15ab6UUf2GvWf4EI11EDsCS7B4xEzJtmxDiCZGptdrYT/LxH5ElbxN+n2YI/3jv+6NLuTFOB6XCjtD75pWlweH48dsVqpX6jpJzzv1durNDZ08xBIzrIK/y9frwVwBPTZxP4W+ROPI3PyKd/x47YiVRlgX78vzHK/aQ53mvenLxlDA4p+qvfOmMP5nVQjGg5IBraPw9TV51aMAyV1hsp3kRVW5jG30wblt4/BhfDUtHGtfXTfta5iMShBBNRYWNaI9pJjnWH5J6o4XJ2sAI23PcqP6LXJfbrANUg6P9TIcv4Z+eddfF6d47Ri5QXVKziNPojxhdihZ/O0br6yBJPbg93Tlq0bVDHcpVyjyv8EZH7Jhsit5NVxli3fJRpXTEe2SdC3b7reF+6ZyLk4dNRXIXRYi9BX7vTz4gVk/+pmnp0E8+bKjVwrNXu0hXsliSJdSp5i0Ycu3b4urnn9e2KV8EILoCUAu12599pgigMBqbQjCr4XdJw5H/MYqks1AKo1qhHUTpZvQJkHZd5F8QBNEFHJMxXxIr65K50UNEBfUWxnyk6Q7V0l2gINIjTG5M6fmK7FaKXFkzERkjQQQ8zuYkNr/KiaDGPZqFb1F4zMGFiVRODrQiDY+/LA/+9G9DVKkyCs2xSUhUzTeyI8VIMzdCTvEPC7EGKF6hck6mbD/DIGYouP4088GH/MFTItkNmSUJkzsz8RVabZdRMPTRBsPiBbL9BKAs/e1piaHKHZF+bt+h+PegqcThLbatqvQca2jZegMdPwa4FUPed58cVxhjtUmBZm9MRf6SX/HHwngd8p2V6G4eSl4oRszcIBmNP/AAJ8ZWsrgyj+AJyJQvDbEgVTJz6SBeQJsrva1OIpIgG+g2JE1NkIbtTK2fOIv5Jjxkodtz1+wA+C/5QkSBn8M08mPsoyk8BMNA6W11qNlAYkIYNLJ/0ihV1PZ5C1orJOXwKhxiSbu+86lbi/vuhlMf6VsV2ICi7Fmjjvgby3EVJVz84G/bUsDsd1sE8q6Z0UPlDnphKFfQ3ci7PVHgroyKXzmv9liZPdVaXfLSXVSYGUK/OsLxq7I6VAmkTKYhk4/Ds+np1XmnEqzVB2RnrVo6ljcvOJ2N8d6+fDi5JnKTREh+SjLZKnnFWPD7HOhOmhqQlcZwlyzZ3vdbu+Y4LI2tzMsZkzNf0Fo/47xNbKPyH74qRMrlJxCqE+slCEldEwiAcC9x8Phjin6JH7SUrHg4wcoCmnhItZNcpzvYFjxs5zP9bk9H/faps8UARq4sKN1FBcGgoCH1Y5ikh3KnCumJxxWoufgk6Tnjupl80giiHnZoO21HxOGFmFigT7MMGUxrNTT/grKADTZO4V//2dtSxTc0hwG7FF9UIS+do4QsBAD7XmtAZGynkuNmVgYvD0QCDreVbMmbkJP365xxaZFczSsbAP8PzKktlqTCArJbHuI9iuezb/2hu+arqI+q7aP6knX8RmSWf0gz+jCTu1l1otNTk84pPgwzRT+a37er74zMafTNmRgfyaoUaKPlKDCU/Iz4bOnCHFkmwbeYHWdSQqE7N1yYATmZSrcW9he+o98y7uhZPWIVnKnJ6HT4Wgsl0JU+Yc7fRjFN3T+MhuvxSRZaDaf+biraF3LSjDRzmnNrYsI97/DAaeXE3XAkecHqe3wmIRUEWbqFLHymj2lw2MgML3g4/c5JSgooQjnminbA+Yh9Yed5pnc+yDC9nvIvRHxIWuIkavpq8eLoxRrgq8k5hk1CY6J9+eM5h6+5lf0GDu35HG5RWyUUpZ4Hhe2eW3NHa8iqVrQ9XdyJMa2WMVfReHTAWkge66bOx0bGNeOztLwIz0pnyQOffw1EmOss6hiI1u1ZfTEoHtc9opR2rLoP+azqKHwI5RmcX8B631WQKbaow9iXSBS1RJVrRvuFBbm2nea2vcCH/x3rKhCF+nzwUMcp2g7qQTM7WU11TKj6lpENE4xMTaN3vEGARNv0OoJM00RSMr+6HIhiFT2+9jqIkVQ+EO3dQ/bKCN1aP/rO8E4ublRtwI2MZwRCHswj1OwyoFB12JzSbcEBJFX+SJWXuZoY8uQCfMMCCapgCx6TkcdVYI2JyPfr/GFs9hoSE64DmI9+LQG+8XrBXORTr58K1JzCbPlfKg+EbSqurJoc5RJmPXmuIOIYkGu3m3FFml14yegGSz4bolvoZdkduykI77rKSd+WdWU9KWC/eJVlYrPFXG7/ULWO5+FqyzQ9aVVYsnKYFIHBizgYbTqsUHclNoNolUt/1IT//Hqgbv9IEkU3R/5p4DPp6rX3nrSGslQr/m6A4WZTIWW0eeuXnzZJ3AOhZJtKSswV72OjgAnLRgrIa6/lY3M8E8PvftSgabF0UgyQAIDNIuCNewFuYeUzZDsAEiVwh2uwwQoCeqLXQoDvUiIHj1uH8knJGHXF02OhUVoO34SA0pi/jRUozVsCohZher+vSvyCXsN9yLdsr5PkGVgxsCYUJfB5Ei3tF/lMhUL5yxBETWwxhXy4GmoT6xjdJaugXzf+lSaelzmT96p+lqiSbvRp5k/b5ohGLox3kmcrMouJLqtrYNfT2GujhRLC01/1VVGqF0fOyrAlO5T+HvyOh7GATBorWDnOsjOqSqXfCx249phXfb0tUjET+9cwFFTj3GNVE2AYvOdBfAizxUiD2Pg4cLKQhPZT4NexebU+K8KKGHXkQnUtavzmEu8dkfTpVRyhYr+FG+qU4+pMkiR/ZIPTvI6lHo8gacXKGNdzDIuRCN90c8zSqno3oV+HrIm8MUZieakLWVQA/RX/oRuZyE3QdDIPDxCs/Xc8KfN3kaz7YcP6SWw0lbb/8vX1TcbTjgJD33ST3kyZSSqUUAbClBeM037e/QTWW+AxeDZ6ZpWfPeH1dgarRihZhOeDeR9EDVJemxfXngerEBL9dSve1QK79fESasHQvkeuTQFXEXR3WrxHjmdfJtDMy22aRXC9ymY3TNbkhXzy4Lj4XLn1g0LqiS6xVj6X0iAwRWwyzsaamzKV2ZqqdM8CD9JMGWD9bQONJIg456U7Uep4/RWgisys/X0x4YSf8L6kjPr2WfIP2iA96nc5vvp6aeAL/uZT4UtViZFIHmSEGUuRy1P6sSCuye4MTuJd1Le2mwVRjn/UPDlBKBVnGbj2C7anUELViikmqHBmYq0tmR0phM3mGDGTB78FK2n6pVZk/r8bUOwg8jcTuZFfnmC6E70aOOe7+7amV77hyyqlv2Qmh8UfXG6wlkEg07p/LibxMM2RMkkXOYqR/LoFoxTCzBNWM3Wz2LyksVWdZ1vQEPOvrljQMckjva227cCYQM0BACOrsE8Y/uu4adN9iTONkzpG8o5qQet895mCFQpyH4NFWOGs7i1sZgzXGt8xYAgRCuTlSAO9mVqOOjw0BlwrCeMrIF2Fq6K1VPloR/j+FoKyl33EV5hneatlOsW3mYgS+CGxBa+kdtmuDKfM4l99PXxUWSI6LZ/w6SgerVN4veDSfp6CCF6onlxmmDOtwOzhILoDv4N57Ul9Ff4VEuFM479MqZZ8zq5Euyd0lGwf4KhF6pHd3zs3cmoVfYtna68LqV06YbZzsiRngW/330eb4S3sipSY/eGeRImRDjrZ8hWB7tEq91ZcOf4wCP/jKUObumbU1VdkdzO2zn6j+QrzfmUHG80qJBFHQ1mX3Iwr0CgNBGnfQMrxGu7+zU+izHp+aRJRjeqtAnbXqtagmUNJusp+H5J6Yl9hesT+M/gyC0NQ6cLYV2+Te6OCcddUiApAOSm0YKyxbdSdtqCDipz05E1p8E51JiOnCZzia6euFWPxR7aBi7aEExpiA+vYgxDkQlXe/wE5UXyQNomvm15uYRee4/5ixutEyCoPuyRTuQMSPF6+anDLyFezQgQx5w2NKrMGVAtZVz98dbx6HqZRc6jysyeyrsLeOSE7pfNoyRLlbQ1bqkUHuAKznuzpaXkr0qAlC3ZNqU4o/Dsr45y77ruKbEVm9lvhljRZPpBDv4+1mI4GnbwKELFtMoCLRMrWqqctdRsncXVo4tqq7ca4mTRqTcl1jLbn8vL6xPeCZpFU7l4joy45MDH8wJN+BwFQGMXb2TN+YNW1m6258n2KGAVnyUeQJ+QbdfQRT3jbzgkyRa3A6bMQd+hePD0GNDlWqHScngRoaGy4FKbrlI8K1fcq249oNgHFYsuaiYjoVunDhVE4E8UnCKbJ9Q3Pj5utNYidsHd+JJNjFNTzvCvbDeb4l8Ou5ZMtLCSuE6+y/3Ag+IuPxvitI1SKfOpbedBMxJqipYs/QRl3zn6gelJbdB8/vFTwuC9AcRTiNakNCYyrH7OEDgDG23SSRiyud20179zzPGYCwwYJCUMLC2SHrbZk8Lg3kyMOHgruUG4jZAUqId6P+rLkJ42D8oQhTUxAorshj44dWAwDAIJbEZrjlQvq0T8DXjxdC/Uyq1LkzUWKQxx8CacCWzA9TsokBs9NwCelmuClBkVsug/YazwzFDzEfcJYFipbP2mLRC1di376FqbT+6gjitw5gWOQFF0cRwgs+bl88zPBbTPUpk5jWy8XKE4rDR2mogAXr9+vEXLL/t6Fffa6VsmLH18qwSht2hXMWB0v50AKt3lE+8Q7QDBQBgTj3tIGcPI14uFnT1ZPTiGfK+9CQV45TL5GOkiaxEi3v5NlOH8apCH1rmnwYrocaCKHjvEc12jfGQ/sy5LR/um060wyFQL1eBnyfadRvw7zMKt8zBA3S3iJz8Bww8UVWakg/1TV9Mq15nZHYXb9hkJYJBy3mTrDDKtkBciSNrPw0+XN3F7qFBG8Rs3W+2+qx82EehO/HEkaMBPJnfukN+apY+Zs14DaE8+Xn+xPGBjbPQ68+VTHWxWuEWj43AYygYyoArPOHtWAYquYoZe3YCtyym5jv9ilhOuamOvwUVtKho6T3HZd7WT6KA7nejcuZsDRBYzOlCIv4T1aR6+b6At5/LTnUSJv1hSc8c0rwiJ7exzuAQqpz/C84Y6t5REe4vflR0OAjJQLn6kGVY31uIl3fqZTw9cxxIuc8/DoWZMmTMBNuWdV19LLtWTrt5lC/UT1vKyxdSXB4m6dWpYjfnZ60UuSSsqiqKjMIkSlGJ1V4DdDjehGJTdkkGwBsjyDuacSK8b/eSe1I62hSrNtHnmMDQ6kpkWKuYJuoRrZz8dbV3g1LaS3c/QIiOz/hH92qu2KQPTp+Bnw2y1Fn1ykHJRZRt7Vm/wzvydvsAIUtBZ80+2dIwe1OFgZ+9jRgfZQj9b0N8ro7o0oWpJi10WdN5eLse7PPxebr7iJi3bprWAcox6TSMPCbk3BsrzJI/QwOLlbAFPPIc9UY4ctD661tK6tQ6YTj3okM/wteMi9I30HThiBP7dfwe64HdV8BrGD2vgUVZVD/mHSGLDmpKn3RzPIssIK4V3mvHNPFJw8xuADBAY+4pK20n/nRVZB5CVD7a9xieAiECJLK42LiZErtjt+REJT0Tk6qaEY0/k+wQHXGD49DpzUlR0/+LeRVc4Touie+KPz99Nx0QV27PDkUSk9KkQ9Q2bWMkFiw/y7Q7lwQQtHmgxBHgYnh3mkhx0rF9DCOWSepzVxEDjxBO+ZA/6oKVeR08XL0Yuc4XjZnls/LTPw37xADfu4z23bOASQG3sO6INsOQIeo5aWLPaIbmZaSYlULbIAecB0BjESXAE3+Jw0J1/hTI9j+btUzXhhrDX/w2Fi1Tze/fW4l7KbJsXUTKp6mLmHpn5eSt5P59uIotYN9qCVaJiz1BB2NxBPLEm284SJBrNWt/t+vVsWL5J+WqQkLU2nl2lvQvHfEi3pLsJu7ECIcXEHTqSGlg6eAZJgyhZo7jJxohwFLBrNIvppjDAIiVJJjSARVFluF5nWQ2i//gsWvPYM08iroaGsuvGFx605jPRi6wHBpCgB9KfIgHWk3n5z0F5P4jk63TOXIo1bjLsz3J3jQpRByXAhLzOcvrnipPVkejyU/7QsNle5fMyMdfP/BALOCH0n0bpreSfReywPHY9SMpoQPQAsGI9hsYoN6WX3RUkoXkai+iWFB3n3YRWCqSzVyNEnE+fxgnTAPPrZL3tBNVRV6BbkuK2TPTBI597AEZXBqUe7mZa7+aYVaVNegMlDUhzPuJcR0ZUft3nNlILAyEyAI5Y7Ve5SCd2Ti04kgLmD5cXytDpVoByp7HGCQ8RBWlK/jOhpdeUltb7dHc96Ujg2K1g4waKDvCcYAT3oEoPGY4Do9YdhMxlDkGMDMv9Nm9Tfad5trA0gpJdYoPGK/A5LRcCb6/mWutZzc5YtgOBsVmT2SxdRpbGpsWPoYycFYx8RVidCtwDYqTD2sHd+Qujy0+MjEhFU9vtguFTXZu6WwIz2Gikf+MItnss2OEf1ehxr8Za189a/eeicDXnbqLe15ZAwjX+FMkOZ4ObQfPvR44CnxD96fYtLKqooQ/LZOl10TNiU7CC/ur7as6BwvePu2DMcXufeIdpYExsM90ODL/KvpyNKaaEK7FGY5v463xdYlJ8n1y6LW+2a1KvqZPBQQAUz3NN9FHJF3ivoLEoHmV3ZPePc17Rr8W4VwDgaGKgz8kVX207MpIDRla1lzj8g0iSxxu3v/LGk1pjrsfaz6m/8rS2VWzXBtZ8svxfCma5Er6oZl7Xj5O6NS7XZtxXIc/SmqYS6ubiAKRmiHmFwzyiH9CbefMffzjPBbDs4WbUVVOb2XDsbnTIffuGWf8fFyv17QkDfS6I2EZ1zl70ms7sg4L/NDtYXCKgwAUcmOqtRPkbkYVJZqHGMTEVMAQrUXJg6gNPfFGLaVq8inlkArugPg3bq05fPQgIsktXZKthYjMkP2ucPH/pS6Dx4cERnqXDumPq5ZeEp8b9Fv9FR8TiBJaYpe2k+xDahV3rhoeZUXB/JbtYxoFDGYU5oaiWZGftS1sbgaMuGVq4IkUkGKorjGs8fmy/adgiJ7E8k447LJmuEohXwRCz3DBrPI7vqQ6oayH90WRJXSKX8COK6MPydPLcATk9cTv3i6/JQNANnkN5cqKwxKMlSYQFd16eSQiDsMhl99Dvo+xCIEGf0scuztRO3L1aLWuPD6sx+EB6atach/FNaAJ9fst1AW1Fngg1jAhGlfEw1iwvV2rAd5TVHPBr52oRyoLAGZEou4Qis0ZFjqQujCvRqZPnmmqYaqe6EgpwUbzCzSgSdnoP6a6vHfjW5niQM8BeqOSSEAnl/svMxAfCqKv3RLu1Z+fqsKzDwJd3pYk9gcYzc+MxiwWhHWlOkRudIiuVAJ7Cym98+Qy30LeTFwzJzV8olLTRnDotZIfSdMQbKFVGuZuf9Ci4u4IAAAAAA==)

is this a sliding window question ?

## Assistant:

> 7/3/2026 9:34:30

> Evaluated problem classification and distinguished greedy approach.
>
> - The user is asking if LC 121 (Best Time to Buy and Sell Stock) is a sliding window question.
>   
>   It's not strictly a sliding window question. It's more of a greedy/single-pass problem. You track the minimum price seen so far and the maximum profit at each step. Some people frame it as two pointers, but it's not a classic sliding window pattern.
> - **Done**

Not really. It's a **greedy / single-pass** problem — track `minPrice` as you iterate, compute `price - minPrice` at each step, track the max.

Some people frame it as two pointers (`buy` and `sell`), but it has no window expansion/shrink logic, so calling it sliding window is a stretch.

## User:

> 7/3/2026 9:35:22

![1783051500268_image.png](data:image/webp;base64,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)

then why it is mentioned in sliding window in neetcode

## Assistant:

> 7/3/2026 9:35:25

> Reconciled classification discrepancy between problem categorization and actual technique.
>
> - The user is asking why "Best Time to Buy and Sell Stock" is listed under the Sliding Window section on NeetCode, even though I said it's not really a sliding window problem.
> - **Done**

NeetCode categorizes it there because you can frame it as a two-pointer sliding window — `left = buy day`, `right = sell day`, shrink when `prices[left] > prices[right]`. It fits the pattern loosely enough to group it there for teaching purposes.

But the greedy single-pass approach (track `minPrice`, no two pointers needed) is simpler and what most people actually use. The "sliding window" framing is a pedagogical choice, not the natural solution.

## User:

> 7/3/2026 23:21:28

```typescript
function numSubarrayProductLessThanK_(nums: number[], k: number): number {
  if (k <= 1) return 0;
  let left = 0;
  let right = 0;
  let product = 1;
  let result = 0;
  while (right < nums.length) {
    product *= nums[right];
    while (product >= k) {
      product /= nums[left];
      left++;
    }
    if (product < k) {
      result += right - left + 1;
    }
    right++;
  }
  return result;
}
PLEASE EXPLAIN THIS BLOCK , i am confused , else i understood well 
if (product < k) {
      result += right - left + 1;
    }

```

## Assistant:

> 7/3/2026 23:21:38

> Dissected window expansion logic and enumerated newly valid subarrays.
>
> - The user wants me to explain the `result += right - left + 1` part of the sliding window solution for subarray product less than K.
>   
>   Let me think about this carefully.
>   
>   At the point where we check `if (product < k)`, we've already shrunk the window so that `product < k` is always true at that point (since the while loop ensures `product < k` when it exits). So the `if` check is actually redundant.
>   
>   The key insight is: `right - left + 1` counts the number of new valid subarrays that END at `right`.
>   
>   For example, if `left = 1` and `right = 3`, the window is `[1, 2, 3]` (indices). 
>   
>   When we expand to include `right`, we get three new subarrays: the single element at index 3, the pair from indices 2-3, and the triple from indices 1-3. That's exactly `right - left + 1 = 3` subarrays. Since we've already counted all subarrays ending at earlier positions in previous iterations, we only add these new ones that end at the current `right`.
> - **Done**

After the shrink loop, your window `[left, right]` has a valid product. The question is: how many new valid subarrays does adding `right` create?

All of them **end at `right`**:
- `[right]` — length 1
- `[right-1, right]` — length 2
- `[right-2, right-1, right]` — length 3
- ...
- `[left ... right]` — length `right - left + 1`

That's exactly `right - left + 1` new subarrays, all ending at `right`, all valid since they're within the window.

**Example**: `nums = [10, 5, 2, 6]`, `k = 100`

At `right = 3` (value 6), window is `[1,3]` (values `5,2,6`), product = 60:
- `[6]` ✓
- `[2,6]` ✓  
- `[5,2,6]` ✓

→ `result += 3 - 1 + 1 = 3`

Previous iterations already counted subarrays ending at `right = 0,1,2` — so no double counting.

Also: the `if (product < k)` check is **redundant** — the while loop above already guarantees `product < k` when it exits. You can remove it.

## User:

> 7/3/2026 23:35:09

Can you make a visual explaining this ,like animation wise ?

## Assistant:

> 7/3/2026 23:41:47

> Architected interactive animation visualizing sliding window subarray counting algorithm.
>
> - The user wants an animated visual explaining the `right - left + 1` counting trick for subarray products. Let me create an interactive HTML animation that shows how subarrays are counted as the right pointer moves.
>   
>   Let me first read the frontend-design skill to get the right CSS variables and design tokens.
> - The user wants an animation explaining the `right - left + 1` counting trick in the subarray product less than K problem. This is an interactive explainer. Let me create an HTML animation that shows:
>   
>   1. The array `[10, 5, 2, 6]` with k=100
>   2. The right pointer moving step by step
>   3. For each position of right, showing which subarrays are counted (all ending at right)
>   4. Highlighting them visually
>   
>   Let me design this as a step-by-step animation with play/pause controls.
>   
>   The key concepts to show:
>   - As the right pointer advances, every subarray ending at that position within the valid window gets counted
>   - The formula `right - left + 1` captures all those subarrays in one calculation
>   - I'll trace through the example `[10, 5, 2, 6]` with k=100, showing how the window expands and contracts as we move right, and highlighting which subarrays contribute to each count Walking through the sliding window trace with k=100: at each position, I'm calculating how many subarrays ending at that index have a product less than 100, then shrinking the window from the left when the product exceeds the threshold. After processing all four elements, the total count is 8.
>   
>   Now I'm designing an interactive visualization for this algorithm. I'll create an HTML stepper that shows the array as boxes with left and right pointers, highlights the subarrays being counted at each step, and displays the running result. The interface will have Next Step and Reset buttons to walk through the algorithm interactively, showing which subarrays are highlighted and how the count formula applies at each position.
>   
>   Building the interactive stepper... Building the animation framework... Writing the animation steps... Building the HTML structure...
>   
>   I'm thinking through the animation more carefully now. The key is to show the right pointer moving to position j, then highlight each subarray from j down to i one at a time with colored underlines, displaying the count for each. …
> - **Done**

> [Interactive Widget: subarray_count_animation]

## User:

> 7/4/2026 23:28:24

* characterReplacement.ts — frequency map + "budget" combined. Harder version of #5.

which LC question is this

## Assistant:

> 7/4/2026 23:28:24

LC 424 — **Longest Repeating Character Replacement**.

## User:

> 7/5/2026 14:37:37

Permutation in String
MediumTopicsCompany TagsHints
You are given two strings `s1` and `s2`.
Return `true` if `s2` contains a permutation of `s1`, or `false` otherwise. That means if a permutation of `s1` exists as a substring of `s2`, then return `true`.
Both strings only contain lowercase letters.
Example 1:

```java
Input: s1 = "abc", s2 = "lecabee"

Output: true
```

Explanation: The substring `"cab"` is a permutation of `"abc"` and is present in `"lecabee"`.

explain this problem , i did'nt understand

## Assistant:

> 7/5/2026 14:37:44

> Identified substring permutation matching problem requiring explanation.
>
> - The user wants an explanation of the "Permutation in String" problem.
> - **Done**

A permutation of a string is just a **rearrangement** of its characters.

So `"abc"` has these permutations: `abc`, `acb`, `bac`, `bca`, `cab`, `cba`.

The question asks: does any permutation of `s1` appear as a **contiguous substring** inside `s2`?

For example:
```
s1 = "abc"
s2 = "lecabee"
         ^^^
         "cab" is a permutation of "abc" → true
```

Key insight: instead of generating all permutations (expensive), you just need to check if any window of length `s1.length` inside `s2` contains **exactly the same character frequencies** as `s1`.

```
s1 = "abc"  →  {a:1, b:1, c:1}

s2 = "lecabee"
       "lec"  →  {l:1, e:1, c:1}  ✗
        "eca"  →  {e:1, c:1, a:1}  ✗
         "cab"  →  {c:1, a:1, b:1}  ✓  same as s1 → return true
```

So it reduces to: **slide a fixed window of size `s1.length` across `s2`, check if frequency maps match.** That's a classic fixed-size sliding window problem — same pattern as `maxVowels` you did earlier.

## User:

> 7/5/2026 15:29:55

```typescript
class Solution {
    /**
     * @param {string} s1
     * @param {string} s2
     * @return {boolean}
     */
    checkInclusion(s1: string, s2: string): boolean {
        let left = 0
        let right = 0
        const freq = new Map<string, number>();
        const k = s1.length
        //set the freq from which we have to compare
        for (let i = 0; i < s1.length; i++) {
            const ch = s1[i]
            freq.set(ch, (freq.get(ch)! || 0) + 1)
        }

        while (right < s2.length) {
            let sum = 0
            const ch = s2[right];
            if (freq.has(ch)) freq.set(ch, freq.get(ch)! - 1)
            //shrink the window
            while (right - left + 1 > k) {
                const leftCh = s2[left]
                if (freq.has(leftCh)) freq.set(leftCh, freq.get(leftCh)! + 1)
                left++
            }

            for (let [key, value] of freq) {
                sum += value
            }
            if (!sum && right-left+1 ===k) return true
            right++

        }
        return false
    }
}

please give me a hint , i am stuck at how to prove it is empty
```

## Assistant:

> 7/5/2026 15:30:13

> Diagnosed frequency-tracking logic flaw and proposed matches counter solution.
>
> - The user is trying to check if the frequency map is "balanced" (i.e., all values are 0, meaning the window is a permutation of s1). Their current approach iterates through all freq entries and sums values, returning true if sum === 0.
>   
>   The issue with their current approach: when a character in s2 is NOT in s1, they don't add it to freq, so they miss it. Also, the sum approach won't work correctly because freq values can go negative (if a character appears more times in the window than in s1), and negative + positive could cancel out to 0 falsely.
>   Actually, I'm reconsidering—they only decrement freq for characters that exist in s1, so characters outside s1 are completely ignored. The window size check ensures we're looking at exactly k characters, but if the window contains characters not in s1, those won't be tracked in freq at all. For example, if s1="ab" and the window is "cd", freq stays at {a:1, b:1} with sum 2, which correctly returns false. So the logic might actually work, though it's a bit subtle.
>   
>   Wait, but there's a potential issue: what if freq has negative values that cancel out positive ones? Like if s1="ab" and we see "aa", the first 'a' makes freq={a:-1, b:1}, and if somehow the sum becomes 0 with negative values, that would be a false positive since we're checking `!sum` which treats 0 as true.
>   
>   The real solution is to track how many characters have exactly matched their quota using a `matches` counter instead, returning true when all characters in the frequency map have been satisfied.
> - **Done**

Your `sum` approach has a hidden bug — freq values can go **negative** (when a char appears more than its quota in the window), so negatives and positives can cancel to 0 and give a false positive.

Example: `s1="ab"`, `s2="aac"` → when window is `"aa"`, freq becomes `{a:-1, b:1}` → sum=0 → wrongly returns `true`.

**Hint**: instead of summing all values, track a `matches` counter — the number of characters whose freq is exactly `0`. When `matches === freq.size`, every character is perfectly balanced → that's your permutation.

## User:

> 7/5/2026 15:42:37

```typescript
function checkInclusion(s1: string, s2: string): boolean {
  let left = 0;
  let right = 0;
  const freq = new Map<string, number>();
  const k = s1.length;
  let matches = 0;
  //set the freq from which we have to compare
  for (let i = 0; i < s1.length; i++) {
    const ch = s1[i];
    freq.set(ch, (freq.get(ch)! || 0) + 1);
  }

  console.log("FREQUENCY", freq);

  while (right < s2.length) {
    const ch = s2[right];
    if (freq.has(ch)) {
      freq.set(ch, freq.get(ch)! - 1);
      matches++;
    }
    //shrink the window
    while (right - left + 1 > k) {
      const leftCh = s2[left];
      if (freq.has(leftCh)) freq.set(leftCh, freq.get(leftCh)! + 1);
      matches--;
      left++;
    }

    console.log("MATCHES", matches);
    console.log("SUBARRAY LENGTH", right - left + 1);

    if (matches === k && right - left + 1 === k) return true;
    right++;
  }
  return false;
} ??
```

## Assistant:

> 7/5/2026 15:42:47

> The user is asking about their current solution for the Permutation in String pr…
>
> - The user is asking about their current solution for the Permutation in String problem. Let me analyze it.
>   
>   Their approach: track `matches` as the count of characters whose freq reaches 0.
>   
>   Issue with current approach: they're incrementing `matches` whenever a character from freq is found in the window, and decrementing when a character is removed from the left. But this doesn't correctly track whether freq values are exactly 0.
>   
>   For example: s1 = "ab", s2 = "aabc"
>   freq = {a:1, b:1}
>   
>   right=0: ch='a', freq={a:0,b:1}, matches=1
>   right=1: ch='a', freq={a:-1,b:1}, matches=2 — but the window "aa" isn't a permutation of "ab", so this is wrong. The `matches` counter is incrementing even when a character's frequency goes negative, meaning we have more of that character than needed. The fix is to track when a character's frequency transitions to exactly 0 (increment matches) and when it transitions away from 0 (decrement matches), rather than just counting whenever a character appears in the frequency map.
>   
>   Writing the corrected solution...
> - **Done**

## User:

> 7/5/2026 15:43:28

```typescript
class Solution {
    /**
     * @param {string} s1
     * @param {string} s2
     * @return {boolean}
     */
    checkInclusion(s1: string, s2: string): boolean {
        let left = 0
        let right = 0
        const freq = new Map<string, number>();
        const k = s1.length
        let matches = 0
        //set the freq from which we have to compare
        for (let i = 0; i < s1.length; i++) {
            const ch = s1[i]
            freq.set(ch, (freq.get(ch)! || 0) + 1)
        }

        while (right < s2.length) {
            const ch = s2[right];
            if (freq.has(ch)) {
                freq.set(ch, freq.get(ch)! - 1)
                matches++
            }
            //shrink the window
            while (right - left + 1 > k) {
                const leftCh = s2[left]
                if (freq.has(leftCh)) {
                    freq.set(leftCh, freq.get(leftCh)! + 1)
                    matches--
                }
                left++
            }

            if (matches === k && right - left + 1 === k) return true
            right++
        }
        return false
    }
}

```

## Assistant:

> 7/5/2026 15:43:54

> Diagnosed frequency-matching bug and validated corrected sliding window logic.
>
> - The user is asking me to review their solution. Let me analyze it carefully.
>   
>   The approach uses a `matches` counter that increments when a character from s2 is in s1's freq map, and decrements when a character leaves the window. The check is `matches === k`.
>   
>   But there's still the negative frequency problem. Let me trace through:
>   
>   s1 = "ab", k = 2, freq = {a:1, b:1}
>   s2 = "aab"
>   
>   right=0, ch='a': freq has 'a', freq={a:0, b:1}, matches=1. Window=[0..0], size=1. Not k.
>   right=1, ch='a': freq has 'a', freq={a:-1, b:1}, matches=2. Window=[0..1], size=2. matches===k(2) && size===k(2) → returns true!
>   
>   But "aa" is NOT a permutation of "ab". The problem is that matches increments whenever a character exists in the freq map, even after it's already been satisfied. Once freq[ch] goes negative, we shouldn't be counting it as a match anymore. The fix is to only increment matches when freq transitions from 1 to 0, meaning we've just satisfied that character's requirement.
>   
>   Updating the logic to check the frequency value before and after each operation, and changing the final condition to check if matches equals the total number of unique characters needed. This ensures we're only counting characters that are currently satisfied, not ones we've already exceeded. [0..2] size=2, which matches k. Since matches equals the number of distinct characters needed, I return true. The substring s2[1..2]="ab" is indeed a permutation of s1="ab", confirming the logic works correctly.
>   
>   Now testing with s1="abc" and s2="lecabee": I initialize the frequency map with {a:1, b:1, c:1} and need all three characters satisfied. As I slide the window, characters like 'l' and 'e' don't affect the frequency map since they're not in s1. When I encounter 'c', I decrement its count to 0 and increment matches. I'll present the solution clearly.
> - **Done**

Still broken. The `matches` counter isn't tracking satisfaction — it's tracking "how many chars in the window exist in s1's freq map," which can exceed `k` when a character appears more than needed.

Trace `s1="ab"`, `s2="aab"`:
- right=1, ch=`'a'` again: freq has `'a'`, matches becomes 2, freq`['a']`=-1 → `matches===k` → returns `true`. But `"aa"` is not a permutation of `"ab"`.

**Fix**: only update `matches` when a character crosses the `0` boundary — meaning it just became satisfied or just became unsatisfied:

```typescript
function checkInclusion(s1: string, s2: string): boolean {
  const freq = new Map<string, number>();
  for (const ch of s1) freq.set(ch, (freq.get(ch) ?? 0) + 1);

  const k = s1.length;
  let left = 0, matches = 0;

  for (let right = 0; right < s2.length; right++) {
    const ch = s2[right];
    if (freq.has(ch)) {
      freq.set(ch, freq.get(ch)! - 1);
      if (freq.get(ch) === 0) matches++;
    }

    if (right - left + 1 > k) {
      const leftCh = s2[left];
      if (freq.has(leftCh)) {
        if (freq.get(leftCh) === 0) matches--;
        freq.set(leftCh, freq.get(leftCh)! + 1);
      }
      left++;
    }

    if (matches === freq.size) return true;
  }
  return false;
}
```

The key rule: `matches++` only when freq hits exactly `0` (character just satisfied), `matches--` only when freq leaves `0` (character just lost). Check against `freq.size` (distinct chars in s1), not `k`.

## User:

> 7/5/2026 16:04:16

```typescript
// 🧩 Sliding Window (Medium) — Find All Anagrams in a String
// Statement

// Given two strings s and p, return an array of all the start indices
//of p’s anagrams in s.

// An anagram is a word formed by rearranging the letters of another
//word, using all the original letters exactly once.

// Example 1
// Input:  s = "cbaebabacd", p = "abc"
// Output: [0, 6]
// Explanation:
// Substring starting at index 0 is "cba" → anagram of "abc"
// Substring starting at index 6 is "bac" → anagram of "abc"

// Example 2
// Input: s = "abab", p = "ab"
// Output: [0, 1, 2]

// Constraints

// 1 ≤ s.length, p.length ≤ 3 * 10⁴

// s and p consist of lowercase English letters

is this the same question
```

## Assistant:

> 7/5/2026 16:04:18

Yes, identical pattern to Permutation in String. Only differences:

- Instead of returning `true`/`false`, collect **all** start indices where a valid window is found.
- Return the array of those indices.

The sliding window logic is exactly the same — just replace `return true` with `result.push(left)`.

## User:

> 7/6/2026 13:08:42

You are given an integer array `prices` where `prices[i]` is the price of NeetCoin on the `ith` day.
You may choose a single day to buy one NeetCoin and choose a different day in the future to sell it.
Return the maximum profit you can achieve. You may choose to not make any transactions, in which case the profit would be `0`.
Example 1:

```java
Input: prices = [10,1,5,6,7,1]

Output: 6
```

Explanation: Buy `prices[1]` and sell `prices[4]`, `profit = 7 - 1 = 6`.
Example 2:

```java
Input: prices = [10,8,7,5,2]

Output: 0

--

Please give me solution for this , i am confused what to do ? 
```

## Assistant:

> 7/6/2026 13:08:45

> Identified greedy strategy tracking minimum price for maximum profit.
>
> - The user wants a solution for the Best Time to Buy and Sell Stock problem. This is a simple greedy problem - track the minimum price seen so far, and at each step compute the profit if we sold today.
> - **Done**

Track `minPrice` as you iterate. At each day, compute `price - minPrice` and update `maxProfit`.

```typescript
function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }

  return maxProfit;
}
```

O(n) time, O(1) space.

## User:

> 7/6/2026 13:39:58

![1783325375378_image.png](data:image/webp;base64,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)

hey , i am now moving to stack , how to start stack data structure and its questions ?

## Assistant:

> 7/6/2026 13:40:06

> Synthesized stack fundamentals and problem-solving strategies.
>
> - The user wants to start learning about the Stack data structure and how to approach the NeetCode stack problems listed in the image. Let me give a concise overview of the stack data structure and how to approach these problems.
> - **Done**

**Stack in one line**: LIFO — last in, first out. Push to top, pop from top.

In TypeScript, just use an array:
```typescript
const stack: number[] = [];
stack.push(1);       // add to top
stack.pop();         // remove from top
stack[stack.length - 1]; // peek top
```

**Mental model for when to use a stack**: when you need to process something and *undo* or *look back* at the most recent element — brackets, temperatures, histograms all follow this pattern.

**Order to do these 6**:

1. **Valid Parentheses** — pure stack mechanics, warmup
2. **Min Stack** — stack design, teaches you to store extra state per element
3. **Evaluate Reverse Polish Notation** — stack for expression evaluation
4. **Daily Temperatures** — introduces the **monotonic stack** pattern (most important concept in this list)
5. **Car Fleet** — monotonic stack variant, slightly tricky
6. **Largest Rectangle in Histogram** — hardest, also monotonic stack but complex

The jump in difficulty from #3 to #4 is significant. Once you understand monotonic stack in Daily Temperatures, Car Fleet and Histogram become variations of the same idea.

Start with Valid Parentheses whenever you're ready.

## User:

> 7/6/2026 13:59:32

Example 1:
Input: s = "()"
Output: true
Example 2:
Input: s = "()[]{}"
Output: true
Example 3:
Input: s = "(]"
Output: false
Example 4:
Input: s = "([])"
Output: true
Example 5:

i am confused between example 2 and 4

## Assistant:

> 7/6/2026 13:59:38

> Differentiated sequential versus nested bracket patterns.
>
> - The user is confused about the difference between example 2 `"()[]{}"` and example 4 `"([])"`.
>   
>   Example 2: `"()[]{}"` — three separate pairs, each closed independently: `()` then `[]` then `{}`
>   Example 4: `"([])"` — nested brackets: `[]` is inside `()`
>   
>   Both are valid. The user seems confused about why both are valid or what the difference is.
>   
>   The key distinction is:
>   - Example 2: sequential pairs
>   - Example 4: nested pairs
>   
>   Both are valid. The rule is: every opening bracket must be closed by the correct closing bracket, and in the correct order (LIFO - if you open something inside another pair, you must close it before closing the outer pair).
> - **Done**

They're both valid, just different structures:

- Example 2 `"()[]{}"` — **sequential**: three separate pairs one after another
- Example 4 `"([])"` — **nested**: `[]` opens and closes *inside* `()`

The invalid case is when they **interleave**: `"([)]"` — opened `(`, opened `[`, closed `)` before closing `[`. That violates LIFO order.

Rule: whatever you opened most recently, you must close first.

## User:

> 7/6/2026 21:11:51

```typescript
function isValid(s: string): boolean {
  let validPairs ={
    "(": ")",
    "[": "]",
    "{": "}"
  }
  let array = []
  let n = s.length
  for(let i =0 ; i < array.length ; i++){
    array.push(s[i])
    if(validPairs[s[i]] === s[i+1] || validPairs[s[i]] === s[n-i -1]){
      array.pop()
    }
  }
  return array.length === 0 ? true : false
};

sorry bro , but wtf i have written 
```

## Assistant:

> 7/6/2026 21:11:59

> Diagnosed flawed logic and prescribed stack-based solution.
>
> - The user is looking at their own broken code and laughing at it. They have a fundamental misunderstanding of how to solve this. Let me explain what's wrong and give them the right approach.
>   
>   The issues:
>   1. `for(let i = 0; i < array.length; i++)` — iterating over `array` which starts empty, so the loop never runs
>   2. The logic for checking pairs is wrong — comparing with `s[i+1]` or `s[n-i-1]` is not how stack-based bracket matching works
>   3. The overall approach is wrong — they're not using the stack correctly
>   4. The correct approach uses a stack: push opening brackets, and when you hit a closing bracket, check if it matches the top of the stack. If it does, pop; if not, return false. At the end, the stack should be empty for valid brackets.
> - **Done**

Two fundamental bugs:

1. `i < array.length` — `array` starts empty so the loop **never runs**. Should be `i < s.length`.
2. The pair-checking logic makes no sense — you can't compare with `s[i+1]` or `s[n-i-1]`. You need to check against the **top of the stack**.

Correct approach: push opening brackets, on closing bracket check if top of stack is the matching opener.

```typescript
function isValid(s: string): boolean {
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const stack: string[] = [];

  for (const ch of s) {
    if (!pairs[ch]) {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }

  return stack.length === 0;
}
```

Note: map closing→opening (not opening→closing) so you can immediately look up what the current closing bracket *expects* to find on the stack.

## User:

> 7/6/2026 22:35:13

which questions are next , and how many question , i truly need to prepare stack for interviews only

## Assistant:

> 7/6/2026 22:35:22

> The user wants to know which stack questions to focus on for interviews, and how…
>
> - The user wants to know which stack questions to focus on for interviews, and how many. They've completed Valid Parentheses. Let me give a concise, direct answer about the remaining stack questions from their NeetCode list and what's essential for interviews.
> - **Done**

From your NeetCode list, all 6 are interview-relevant. You've done 1:

- ✅ Valid Parentheses
- Min Stack
- Evaluate Reverse Polish Notation
- **Daily Temperatures** ← most important, learn monotonic stack here
- **Car Fleet** ← medium-hard
- **Largest Rectangle in Histogram** ← hard, but asked at FAANG

**5 remaining. That's enough** — don't add more. Monotonic stack (Daily Temperatures, Car Fleet, Histogram) is the only non-obvious concept in this entire section. Once you get it, the rest is execution.

## User:

> 7/8/2026 20:19:03

```typescript
class MinStack {
  constructor() {}
  private stack = [];

  /**
   * @param {number} val
   * @return {void}
   */
  push(val: number): void {
    this.stack.push(val);
  }

  /**
   * @return {void}
   */
  pop(): void {
    this.stack.pop();
  }

  /**
   * @return {number}
   */
  top(): number {
    return this.stack[this.stack.length - 1];
  }

  /**
   * @return {number}
   */
  getMin(): number {}
}

please give me solution , i dont know how to do these ty[e of questions
```

## Assistant:

> 7/8/2026 20:19:09

> Identified dual-stack pattern for efficient minimum tracking.
>
> - The user is asking for a solution to the Min Stack problem. They've implemented push, pop, and top correctly but don't know how to implement getMin() efficiently.
>   
>   The key insight: maintain a second stack that tracks the minimum at each level. When you push a value, also push the current minimum to the min stack. When you pop, pop from both stacks.
>   
>   Let me give them the solution with a brief explanation.
> - **Done**

The key insight: maintain a **second stack** that tracks the current minimum at every level. When you push, also record what the minimum is at that point. When you pop, remove from both.

```typescript
class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(val: number): void {
    this.stack.push(val);
    const currentMin = this.minStack.length === 0
      ? val
      : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(currentMin);
  }

  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}
```

Trace with `[5, 3, 7, 2]`:

| push | stack | minStack |
|------|-------|----------|
| 5 | [5] | [5] |
| 3 | [5,3] | [5,3] |
| 7 | [5,3,7] | [5,3,3] |
| 2 | [5,3,7,2] | [5,3,3,2] |

After popping `2`: `getMin()` returns `3` instantly — no scanning needed. O(1) for all operations.

## User:

> 7/8/2026 20:23:31

i did not understack , what is MinStack , meant and why are we checking the last element for minValue ?

## Assistant:

> 7/8/2026 20:23:37

**What is MinStack?**

It's a regular stack but with one extra requirement: `getMin()` must return the minimum element in the stack in **O(1)** time — no looping allowed.

**Why can't we just loop to find min?**

You could do `Math.min(...this.stack)` but that's O(n). The problem specifically requires O(1).

**Why track min at every level?**

Because when you `pop()`, the minimum can **change**. You need to know what the minimum was *before* that element was pushed.

Example with `[5, 3, 7, 2]`:

```
push 2 → min is 2
pop  2 → min is now 3, not 2 anymore
pop  7 → min is still 3
pop  3 → min is now 5
```

If you only stored one global min variable, after popping `2` you'd have no idea the previous min was `3`.

**Why check the last element of minStack?**

The last element of `minStack` always answers: *"what is the minimum of everything currently in the stack?"*

```
stack    = [5, 3, 7]
minStack = [5, 3, 3]  ← last element is 3 = current min
```

`minStack[top]` always reflects the min for the current state of the stack. As you push and pop, it updates automatically.

## User:

> 7/8/2026 20:49:55

what is the input of ths problem

## Assistant:

> 7/8/2026 20:49:58

The input is a sequence of **operations**, not an array. You're building a data structure that handles these calls:

```
MinStack()  → create the stack
push(5)     → stack: [5]
push(3)     → stack: [5, 3]
push(7)     → stack: [5, 3, 7]
getMin()    → returns 3
pop()       → stack: [5, 3]
getMin()    → returns 3
pop()       → stack: [5]
getMin()    → returns 5
top()       → returns 5
```

LeetCode runs these operations one by one and checks that each `getMin()` / `top()` returns the correct value. You're not given an array upfront — you're implementing the class that *responds correctly* to each operation in real time.

## User:

> 7/8/2026 21:14:53

can you give me visualization of this problem please

## Assistant:

> 7/8/2026 21:17:46

> Architected interactive animation showcasing MinStack operations step-by-step.
>
> - The user wants a visualization of the MinStack problem. Let me create an interactive animation showing how the stack and minStack work together as operations are performed.
>   
>   I'll create a step-by-step animation showing:
>   1. The main stack
>   2. The minStack (running minimum tracker)
>   3. Operations being performed
>   4. The current min highlighted
>   
>   Let me design this with a sequence of operations and animate through them step by step.
>   
>   Operations I'll use:
>   1. push(5)
>   2. push(3)
>   3. push(7)
>   4. push(2)
>   5. getMin() → 2
>   6. pop()
>   7. getMin() → 3
>   8. pop()
>   9. getMin() → 3
>   10. pop()
>   11. getMin() → 5
>   
>   Now I'm planning the visual layout with two stacks displayed side by side showing the main stack and minStack, with operation highlights, return values, and step navigation controls. For each step I'll display the operation being performed, the updated state of both stacks, and any return value from getMin() or pop() operations.
>   
>   Defining the steps data structure... Continuing through the operations, I'm popping elements and verifying the minimum values at each step—after removing 2, the minimum becomes 3, and after removing 7, it stays at 3.
>   
>   Now I'm planning the visual layout with two side-by-side columns showing the stack and minStack, with elements displayed as boxes growing upward and the top element highlighted with an arrow to indicate the current position. Writing the HTML layout... is the top of the stack (pushed last), which is correct. So `column-reverse` is the right approach—I'll render the stack elements in DOM order and let flexbox handle the visual reversal.
>   
>   For styling, I need to highlight the top element of the stack with an accent background, and during a getMin() operation, I'll also highlight the corresponding top element in the minStack to show which value is the current minimum.
>   
>   I'll color-code the operations themselves—push in blue, pop in red, and getMin in green—and display the returned value prominently when getMin is called. …
> - **Done**

> [Interactive Widget: minstack_visualization]

## User:

> 7/13/2026 21:20:24

![1783957813702_image.png](data:image/webp;base64,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)

i have done 5 question of stack 

now i will do binary search , give me question to do 
will these question be enough ?

## Assistant:

> 7/13/2026 21:20:30

> Evaluated binary search curriculum adequacy and sequencing strategy.
>
> - The user has completed 5 stack questions and is now moving to binary search. They're showing the NeetCode binary search list with 7 questions and asking if these are enough and which order to do them in.
> - **Done**

Yes, these 7 are enough for interviews. Here's the order:

1. **Binary Search** — pure template, warmup
2. **Search a 2D Matrix** — apply binary search on a 2D structure
3. **Find Minimum in Rotated Sorted Array** — introduces the rotated array pattern, key concept
4. **Search in Rotated Sorted Array** — same pattern but harder (find a target, not just min)
5. **Koko Eating Bananas** — introduces "binary search on answer" pattern, different mental model
6. **Time Based Key Value Store** — binary search on answer + data structure design combined
7. **Median of Two Sorted Arrays** — hard, skip for now unless targeting FAANG

Do #7 last and only if you have time. The core concepts are in #1–#6. The most important jump is #3→#4 (rotated array) and #5 (binary search on answer — many people don't recognize this pattern).

Start with Binary Search whenever ready.

## User:

> 7/17/2026 21:53:18

* Binary Search — pure template, warmup
* Search a 2D Matrix — apply binary search on a 2D structure
* Find Minimum in Rotated Sorted Array — introduces the rotated array pattern, key concept
* Search in Rotated Sorted Array — same pattern but harder (find a target, not just min)
* Koko Eating Bananas — introduces "binary search on answer" pattern, different mental model
* Time Based Key Value Store — binary search on answer + data structure design combined

I have done these 6 question , now i want to start the linked list , how to start ? 

Please teach me about linked list

## Assistant:

> 7/17/2026 21:53:26

> Architected foundational linked list explanation with implementation guidance.
>
> - The user wants to learn about linked lists. Let me give a clear, concise explanation of linked lists - what they are, how they work, and how to implement them in TypeScript. I should cover the fundamentals before diving into problems.
> - **Done**

**What is a linked list?**

An array stores elements in contiguous memory — you can jump to any index instantly. A linked list stores elements as individual **nodes**, each pointing to the next. No random access, but cheap insertions/deletions anywhere.

```typescript
class ListNode {
  val: number;
  next: ListNode | null;
  
  constructor(val: number) {
    this.val = val;
    this.next = null;
  }
}
```

Building `1 → 2 → 3 → null`:
```typescript
const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
```

**Traversal** — the most fundamental operation:
```typescript
let curr = head;
while (curr !== null) {
  console.log(curr.val);
  curr = curr.next;
}
```

**Key mental model**: you never hold the whole list — you only ever hold a pointer to one node, and you hop through `.next`.

**Three patterns that cover 90% of linked list problems:**

- **Two pointers** (fast/slow) — cycle detection, finding middle, nth from end
- **Reversal** — reverse the list in-place using prev/curr/next pointers
- **Dummy node** — attach a fake head node to simplify edge cases on deletions/insertions

**Array vs Linked List:**

| | Array | Linked List |
|---|---|---|
| Access by index | O(1) | O(n) |
| Insert/delete at head | O(n) | O(1) |
| Insert/delete at tail | O(1) | O(n) |
| Memory | contiguous | scattered |

Now tell me — what questions does your NeetCode list show for linked lists?

## User:

> 7/17/2026 22:57:54

![1784309271110_image.png](data:image/webp;base64,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)

## Assistant:

> 7/17/2026 22:58:02

> Architected structured methodology for linked list problem-solving.
>
> - The user wants to know about their linked list questions and how to approach them. Let me give them a structured order and explanation.
> - **Done**

11 questions. Here's the order and what each teaches:

**Foundation (do these first):**
1. **Reverse Linked List** — teaches the `prev/curr/next` reversal pattern, used in 4+ other problems here
2. **Merge Two Sorted Lists** — teaches dummy node pattern + pointer manipulation
3. **Linked List Cycle** — teaches fast/slow pointer (Floyd's algorithm)

**Medium (build on the above):**

4. **Remove Nth Node From End** — fast/slow pointer with a gap of N
5. **Reorder List** — combines reversal + find middle + merge, hardest "medium" here
6. **Add Two Numbers** — pointer traversal + carry logic
7. **Copy List With Random Pointer** — HashMap approach, different pattern
8. **Find The Duplicate Number** — cycle detection on an array (Floyd's applied cleverly)
9. **LRU Cache** — doubly linked list + HashMap design question, very commonly asked

**Hard (do last):**

10. **Merge K Sorted Lists** — heap or divide & conquer
11. **Reverse Nodes in K Group** — reversal pattern applied recursively, hardest in this list

**Skip for now**: #10 and #11 unless targeting FAANG. The core interview patterns are fully covered by #1–#9.

Master #1 (reversal) before anything else — it's the building block for Reorder List, Reverse K Group, and partially for others. Start whenever ready.

## User:

> 7/24/2026 9:52:38

are these 9 questions enough (excluded 10 and 11 ) , give me 2 , 3 more easy and 2 to 3 more medium , i will do total 15 questions

## Assistant:

> 7/24/2026 9:52:54

> Curated complementary linked list problems balancing fundamentals and interview relevance.
>
> - Curated complementary linked list problems balancing fundamentals and interview relevance.
> - **Done**

**3 Easy to add:**

1. **Middle of the Linked List** (LC 876) — fast/slow pointer to find middle. Do this before Reorder List, it's a direct prerequisite.
2. **Palindrome Linked List** (LC 234) — combines find middle + reverse + compare. Synthesis of 3 patterns in one problem.
3. **Intersection of Two Linked Lists** (LC 160) — two pointer convergence trick, commonly asked.

**3 Medium to add:**

4. **Odd Even Linked List** (LC 328) — pointer grouping, clean pointer manipulation practice.
5. **Swap Nodes in Pairs** (LC 24) — pointer rewiring, good stepping stone before Reverse K Group.
6. **Sort List** (LC 148) — merge sort on a linked list. Tests if you can apply divide & conquer without array indexing.

**Updated order for all 15:**

1. Reverse Linked List
2. Middle of the Linked List ← new
3. Merge Two Sorted Lists
4. Linked List Cycle
5. Palindrome Linked List ← new
6. Intersection of Two Linked Lists ← new
7. Remove Nth Node From End
8. Odd Even Linked List ← new
9. Swap Nodes in Pairs ← new
10. Add Two Numbers
11. Reorder List
12. Copy List With Random Pointer
13. Find The Duplicate Number
14. Sort List ← new
15. LRU Cache

## User:

> 7/24/2026 9:53:13

are these enough for linked lists topic ?

## Assistant:

> 7/24/2026 9:53:23

> Evaluated coverage of core linked list patterns and techniques.
>
> - Evaluated coverage of core linked list patterns and techniques.
> - **Done**

Yes, for 95% of interviews these 15 are enough. Every major pattern is covered:

- **Reversal** → Reverse LL, Swap Nodes in Pairs
- **Fast/slow pointer** → Cycle, Middle, Palindrome, Find Duplicate
- **Dummy node** → Merge Two Sorted, Remove Nth Node
- **Two pointer convergence** → Intersection
- **Pointer grouping** → Odd Even, Reorder List
- **Carry arithmetic** → Add Two Numbers
- **HashMap** → Copy List with Random Pointer
- **Divide & conquer** → Sort List
- **Design** → LRU Cache

The only thing not covered is **Reverse Nodes in K Group** (Hard), which is asked at Google/Meta but rare elsewhere. If you're targeting those companies specifically, add it after finishing these 15.

Otherwise you're done with linked lists. Start Reverse Linked List.

## User:

> 7/24/2026 9:53:53

by the way , which topic after ths

## Assistant:

> 7/24/2026 9:53:57

Standard NeetCode order after Linked List:

1. ✅ Arrays & Hashing
2. ✅ Two Pointers
3. ✅ Sliding Window
4. ✅ Stack
5. ✅ Binary Search
6. ✅ Linked List ← you are here
7. **Trees** ← next
8. **Tries**
9. **Heap / Priority Queue**
10. **Backtracking**
11. **Graphs**
12. **Dynamic Programming**

**Trees is next.** It's also the longest topic — expect 15–20 questions. Most of it is recursion + DFS/BFS, which also directly prepares you for Graphs and DP later.

Finish Linked List first, then come back and I'll lay out the Trees roadmap.

## User:

> 7/24/2026 10:40:26

```typescript
function isPalindrome(head: ListNode | null): boolean {
    let slow = head
    let fast = head 
    while(fast.next && fast.next.next){
        slow = slow.next
        fast = fast.next.next
    }
    let right = slow.next
    slow.next = null
    let prev = null
    while(right){
        const next = right.next
        right.next = prev
        prev = right
        right = next
    }   
    right = prev
    let left = head
    while(right){
        if(left.val!==right.val) return false
        left = left.next
        right = right.next
    }
    return true
};

correct ? 
```

## Assistant:

> 7/24/2026 10:40:57

> - **Done**

Correct for all cases LC 234 throws at it. Logic is solid — find middle, reverse second half, compare.

One minor issue: no null guard at the top. `fast.next` crashes if `head` is null. LC 234 guarantees `n ≥ 1` so it passes, but add it anyway:

```typescript
if (!head || !head.next) return true;
```

Put that as the first line. Other than that, clean solution.

## User:

> 7/24/2026 10:41:13

is there any optimized solution for this

## Assistant:

> 7/24/2026 10:41:15

No. Your solution is already optimal:

- **Time**: O(n) — one pass to find middle, one to reverse, one to compare
- **Space**: O(1) — no extra data structure, pointers only

The naive approach (collect values into an array, compare with two pointers) is also O(n) time but O(n) space. Your solution beats it on space.

There's no way to do better than O(n) time since you must read every node at least once. Your solution is the canonical optimal answer for this problem.

## User:

> 7/24/2026 22:19:01

* Reverse Linked List -- DONE
* Middle of the Linked List --DONE
* Merge Two Sorted Lists --DONE
* Linked List Cycle --DONE
* Palindrome Linked List --DONE
* Intersection of Two Linked Lists
* Remove Nth Node From End --DONE
* Odd Even Linked List 
* Swap Nodes in Pairs 
* Add Two Numbers 
* Reorder List  --DONE
* Copy List With Random Pointer
* Find The Duplicate Number
* Sort List 
* LRU Cache

which should i do next ?

## Assistant:

> 7/24/2026 22:19:02

**Intersection of Two Linked Lists** — it directly follows from the two-pointer patterns you've been doing, and it's the easiest remaining one on the list.

## User:

> 7/25/2026 10:10:33

![1784954377780_image.png](data:image/webp;base64,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)

which more question to do , i have done these question except the car fleet , i currently does not have confidence in stacks

## Assistant:

> 7/25/2026 10:10:49

> Identified progress gaps and curated intermediate stack problems for reinforcement.
>
> - Identified progress gaps and curated intermediate stack problems for reinforcement.
> - **Done**

You've done 5/6 NeetCode stack questions. Before adding more, **do Car Fleet first** — it's the direct next step and uses monotonic stack which you already know from Daily Temperatures.

Then do these to build confidence:

**Pure stack mechanics (easy):**
1. **Remove All Adjacent Duplicates In String** (LC 1047) — simple stack push/pop, good warmup
2. **Asteroid Collision** (LC 735) — pure stack logic, slightly trickier conditions

**Monotonic stack reinforcement (medium):**

3. **Next Greater Element II** (LC 503) — circular array variant of Next Greater Element I, extends what you already know
4. **Online Stock Span** (LC 901) — monotonic stack in a class design context

**Hard (do last):**

5. **Largest Rectangle in Histogram** (LC 84) — already on your NeetCode list, hardest stack problem

**Suggested order:**
1. Car Fleet ← do this today
2. Remove All Adjacent Duplicates
3. Asteroid Collision
4. Next Greater Element II
5. Online Stock Span
6. Largest Rectangle in Histogram

That's 6 more on top of your 5 done = **11 stack questions total**. That's more than enough confidence for interviews. The jump in difficulty from #5 to #6 is significant — don't skip the middle ones.

## User:

> 7/25/2026 10:11:46

the car fleet is very confusing , i cant understand

## Assistant:

> 7/25/2026 10:11:57

Let me explain it step by step.

**The setup**: cars are driving toward a destination. Each car has a position and speed. A car behind can never pass the car in front — if it catches up, it merges and they become a **fleet** moving at the slower car's speed.

**Question**: how many fleets reach the destination?

**Key insight**: a car behind will catch up to the car in front if it would arrive **earlier** given free movement. If it arrives later, it never catches up — separate fleet.

**How to calculate**: for each car, compute `time = (target - position) / speed`. This is how long it takes if nothing is in the way.

**Example**: `target=12, position=[10,8,0,5,3], speed=[2,4,1,1,3]`

Sort by position descending (closest to target first):
```
pos=10, speed=2 → time = (12-10)/2 = 1.0
pos=8,  speed=4 → time = (12-8)/4  = 1.0
pos=5,  speed=1 → time = (12-5)/1  = 7.0
pos=3,  speed=3 → time = (12-3)/3  = 3.0
pos=0,  speed=1 → time = (12-0)/1  = 12.0
```

Now process front to back:
- time=1.0 → stack: [1.0] → new fleet
- time=1.0 → 1.0 ≤ 1.0 (stack top) → catches up → same fleet, discard
- time=7.0 → 7.0 > 1.0 → can't catch up → stack: [1.0, 7.0] → new fleet
- time=3.0 → 3.0 ≤ 7.0 → catches up → same fleet, discard
- time=12.0 → 12.0 > 7.0 → new fleet → stack: [1.0, 7.0, 12.0]

Stack size = **3 fleets**. ✓

**Why a stack?** The stack top always holds the time of the fleet currently in front. If current car's time ≤ stack top, it merges. Stack size at the end = number of fleets.

Does this make sense now? Try coding it.

## User:

> 7/25/2026 10:12:22

what is the meaning of fleet

## Assistant:

> 7/25/2026 10:12:27

A **fleet** = a group of cars traveling together as one unit.

Real world analogy: imagine a highway where a slow truck is in front and a fast car catches up to it. The fast car **can't overtake** — so it's forced to slow down and drive at the truck's speed. Now they're one unit (fleet) arriving at the same time.

```
slow truck  🚛 ----→
fast car      🚗 ------→  catches up → 🚛🚗 → move together
```

vs

```
slow truck  🚛 ----→
slow car  🚗 ---→        never catches up → two separate fleets
```

So in this problem:
- **1 fleet** = 1 car OR multiple cars that merged because the one behind was faster
- **Each fleet arrives as one unit** at the destination
- Count how many such units arrive

That's it — "how many fleets" = "how many separate groups cross the finish line."

## User:

> 7/25/2026 11:33:59

is sortig neccasary in this problem

## Assistant:

> 7/25/2026 11:34:03

Yes, sorting is essential. Without it you can't determine which car is "in front" of which.

The rule is: **a car can only be blocked by a car ahead of it (closer to target)**, never by a car behind it. If you process cars in random order, you'd be comparing cars that can't even affect each other.

Example without sorting: `positions=[0,5,10], speeds=[1,1,2]`

If you process `pos=0` first, you might incorrectly compare it with `pos=10` — but `pos=5` is between them and would block the comparison. Sorting by position descending ensures you always process the **immediately preceding car**, not a random one.

Think of it as: you can only look at the car directly in front of you, not cars far ahead. Sorting gives you that "directly in front" ordering.

## User:

> 7/25/2026 11:45:53

Please give me solution for this

## Assistant:

> 7/25/2026 11:45:58

> Identified algorithmic problem and prepared solution approach.
>
> - Identified algorithmic problem and prepared solution approach.
> - **Done**

```typescript
function carFleet(target: number, position: number[], speed: number[]): number {
  const cars = position
    .map((pos, i) => [pos, speed[i]])
    .sort((a, b) => b[0] - a[0]);

  const stack: number[] = [];

  for (const [pos, spd] of cars) {
    const time = (target - pos) / spd;
    if (!stack.length || time > stack[stack.length - 1]) {
      stack.push(time);
    }
    // if time <= stack top, this car catches the fleet ahead → same fleet, discard
  }

  return stack.length;
}
```

Trace with `target=12, position=[10,8,0,5,3], speed=[2,4,1,1,3]`:

| pos | speed | time | stack after |
|-----|-------|------|-------------|
| 10 | 2 | 1.0 | [1.0] |
| 8 | 4 | 1.0 | [1.0] — discarded, same fleet |
| 5 | 1 | 7.0 | [1.0, 7.0] |
| 3 | 3 | 3.0 | [1.0, 7.0] — discarded |
| 0 | 1 | 12.0 | [1.0, 7.0, 12.0] |

Returns `3`. ✓

## User:

> 7/25/2026 22:00:38

ok , what are the next stack questions

## Assistant:

> 7/25/2026 22:00:43

> Retrieved curated stack problem sequence from prior discussion.
>
> - Retrieved curated stack problem sequence from prior discussion.
> - **Done**

From the plan we made earlier, you've now done Car Fleet. Remaining in order:

1. **Remove All Adjacent Duplicates In String** (LC 1047) ← do this next
2. **Asteroid Collision** (LC 735)
3. **Next Greater Element II** (LC 503)
4. **Online Stock Span** (LC 901)
5. **Largest Rectangle in Histogram** (LC 84) ← hardest, do last

Start with Remove All Adjacent Duplicates — it's the easiest of the remaining five, pure stack push/pop, no monotonic stack needed. Good confidence builder before the harder ones.

## User:

> 7/25/2026 22:10:33

```typescript
function removeDuplicates(s: string): string {
    let stack: string[] = []
    for (let char of s) {
        if (stack[stack.length - 1] === char) stack.pop()
        else stack.push(char)
    }
    return stack.join("")
};
```

## Assistant:

> 7/25/2026 22:10:40

> - **Done**

Perfect. Correct and optimal — nothing to fix. O(n) time, O(n) space.

Clean solution.

## User:

> 7/25/2026 22:12:30

i only wrote this in 5 minutes

## Assistant:

> 7/25/2026 22:12:32

That's the sign that your stack fundamentals are solid now. The pattern clicked — you saw "compare with top, pop or push" immediately without overthinking it.

That's exactly the confidence you were looking for when you said you weren't confident in stacks. You're there now. Next question.

## User:

> 7/25/2026 23:16:23

```typescript
function asteroidCollision(asteroids: number[]): number[] {
    let stack: number[] = []
    for (let i = 0; i < asteroids.length; i++) {
        if (stack.length && asteroids[i] < 0) {
            let absValue = Math.abs(asteroids[i]);
            while (stack[stack.length - 1] < absValue) stack.pop()
        }
        stack.push(asteroids[i])
    }
    return stack
};

can you give me a hint ? am i in correct direction ? 
```

## Assistant:

> 7/25/2026 23:16:27

You're in the right direction but missing 3 conditions inside the collision check:

1. What if `stack[stack.length - 1]` is also negative? A left-moving asteroid can't collide with another left-moving one — you're pushing into it wrongly.

2. What if `stack[stack.length - 1] === absValue`? Both asteroids are equal size — **both** explode. Right now you'd pop the stack one but still push the incoming asteroid.

3. What if the while loop empties the stack completely? You're still pushing the incoming asteroid unconditionally after the while loop — but if it survived (destroyed everything), that's correct. But if it was destroyed (equal size case), you shouldn't push it.

Hint: use a boolean flag `destroyed` to track whether the incoming asteroid survived. Only push if `!destroyed`.

## User:

> 7/25/2026 23:17:01

give me solution bro

## Assistant:

> 7/25/2026 23:17:12

> Architected stack-based collision logic for asteroid trajectories.
>
> - Architected stack-based collision logic for asteroid trajectories.
> - **Done**

```typescript
function asteroidCollision(asteroids: number[]): number[] {
  const stack: number[] = [];

  for (const asteroid of asteroids) {
    let destroyed = false;

    while (stack.length && asteroid < 0 && stack[stack.length - 1] > 0) {
      const top = stack[stack.length - 1];
      const abs = Math.abs(asteroid);

      if (top < abs) {
        stack.pop(); // right asteroid explodes, keep going
      } else if (top === abs) {
        stack.pop(); // both explode
        destroyed = true;
        break;
      } else {
        destroyed = true; // incoming asteroid explodes
        break;
      }
    }

    if (!destroyed) stack.push(asteroid);
  }

  return stack;
}
```

The three cases inside the while loop:

| top vs incoming | result |
|---|---|
| `top < abs` | pop top, continue loop |
| `top === abs` | pop top, mark destroyed, stop |
| `top > abs` | mark destroyed, stop |

The `destroyed` flag is the key fix — it prevents pushing an asteroid that got blown up.

## User:

> 7/26/2026 8:00:35

```typescript
 } else if (top === abs) {
                stack.pop()
                destroyed = true
                break;
            } else {
                destroyed = true
                break
            }

why we added break statemenets
```

## Assistant:

> 7/26/2026 8:00:39

Because the collision is **over** — no need to keep checking the stack.

In the `top === abs` case: both asteroids explode. The incoming asteroid is gone, no point checking further stack elements against something that no longer exists.

In the `top > abs` case: the incoming asteroid is destroyed by a bigger one. Again, it's gone — nothing left to collide with remaining stack elements.

Only in the `top < abs` case do we **not** break — because the incoming asteroid survived and might still collide with the next element in the stack. So the while loop continues.

In short: break = "incoming asteroid is dead, stop the loop." No break = "incoming asteroid is still alive, keep colliding."

## User:

> 7/26/2026 8:03:10

if i dont add break statement , will it go in infinite loop ?

## Assistant:

> 7/26/2026 8:03:14

Yes, exactly. In those two cases you're **not popping** from the stack, so the while loop condition `stack.length && asteroid < 0 && stack[stack.length - 1] > 0` stays true forever — same top element, same incoming asteroid, infinite loop.

Without `break`:
```
top === abs:
  stack.pop() ✓ — you did pop, so no infinite loop here actually
  
top > abs:
  nothing is popped ← stack unchanged
  while condition still true ← checks same top again
  top > abs again ← infinite loop ✓
```

So specifically the `top > abs` case causes the infinite loop without `break`. The `top === abs` case pops the stack so it wouldn't loop infinitely, but `break` is still needed there to prevent pushing the destroyed asteroid.

## User:

> 7/27/2026 11:00:35

```typescript
function swapPairs(head: ListNode | null): ListNode | null {
    if(head === null || head.next === null) return head
    let left = head
    let right = head.next
    while(right){
        right.next = left
        left.next = right

        // Move the pointers ahead 
        right = left.next
        left = right.next
    }
    return right
};

what am i missing , i know this line is tottally wrong       left.next = right
```

## Assistant:

> 7/27/2026 11:00:51

> Diagnosed missing dummy node, prev pointer, and node-saving logic.
>
> - Diagnosed missing dummy node, prev pointer, and node-saving logic.
> - **Done**

You're missing 3 things:

1. **Save `right.next` before modifying anything** — once you do `right.next = left`, you've lost the reference to the next pair. Save it first: `const nextPair = right.next`.

2. **A `prev` pointer** — after swapping a pair, you need to connect the previous pair's tail to the new head of the current pair. Without `prev`, the pairs are disconnected.

3. **A dummy node** — so `prev` has somewhere to start, and you can return `dummy.next` instead of trying to track the new head manually.

The correct pointer operations for each pair in order:
```
1. save nextPair = right.next
2. right.next = left        ← reverse the pair
3. left.next = nextPair     ← connect to rest of list (not to right!)
4. prev.next = right        ← connect previous pair to new head
5. prev = left              ← left is now the tail of this pair
6. left = nextPair          ← advance to next pair
7. right = nextPair?.next   ← advance right
```

Try implementing with these steps. The dummy node + `prev` pointer is the key thing you were missing.

## User:

> 7/27/2026 11:02:32

give me the solution please

## Assistant:

> 7/27/2026 11:02:37

> Identified coding problem and prepared algorithmic solution.
>
> - Identified coding problem and prepared algorithmic solution.
> - **Done**

```typescript
function swapPairs(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  dummy.next = head;
  let prev = dummy;
  let left = head;

  while (left && left.next) {
    const right = left.next;
    const nextPair = right.next;

    // swap
    right.next = left;
    left.next = nextPair;
    prev.next = right;

    // move forward
    prev = left;
    left = nextPair;
  }

  return dummy.next;
}
```

Trace with `1 → 2 → 3 → 4`:

| step | swap | list state |
|---|---|---|
| pair 1 | swap 1,2 | `2 → 1 → 3 → 4` |
| pair 2 | swap 3,4 | `2 → 1 → 4 → 3` |

The dummy node is the key — `prev` starts there so the first swap has somewhere to attach `right` to. Without it you'd lose the new head.

## User:

> 7/28/2026 14:20:22

What is the concept of dummy node , i don't get it

## Assistant:

> 7/28/2026 14:20:28

**The problem without a dummy node:**

When you swap the first pair, the new head changes. You'd need special case code to handle "what is the new head of the list?"

```
1 → 2 → 3 → 4
↑
head (becomes wrong after first swap)

after swap: 2 → 1 → 3 → 4
            ↑
            new head — how do you track this?
```

**What dummy node does:**

It's a fake node that sits before the real list and never moves. Since it always points to the real head, you just return `dummy.next` at the end and it's always correct.

```
dummy → 1 → 2 → 3 → 4
  ↑
  never moves, always points to real head
```

After first swap:
```
dummy → 2 → 1 → 3 → 4
          ↑
          dummy.next = new head ✓
```

**Rule of thumb:** use a dummy node whenever the head of the list might change — deletions, swaps, insertions at the front. It eliminates the edge case of tracking the new head manually.

Without dummy you'd write:
```typescript
let newHead = right; // track manually
// then special case first iteration...
```

With dummy you just write `return dummy.next` and it's always correct regardless of what happened to the list.

## User:

> 7/29/2026 17:47:03

ok , which is the next question for linked list

## Assistant:

> 7/29/2026 17:47:05

From your list, the next undone ones are:

1. **Odd Even Linked List** ← do this next, easier
2. Add Two Numbers
3. Copy List With Random Pointer
4. Find The Duplicate Number
5. Sort List
6. LRU Cache

Start with **Odd Even Linked List** — it's straightforward pointer grouping, good warmup before the harder ones.

## User:

> 7/29/2026 17:47:35

Odd Even Linked List ← do this next, easier

Already done

## Assistant:

> 7/29/2026 17:47:36

Then **Add Two Numbers** is next.

## User:

> 7/29/2026 19:09:59

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function addTwoNumbers(
    l1: ListNode | null,
    l2: ListNode | null,
): ListNode | null {
    let p1 = l1;
    let p2 = l2;
    let dummy = new ListNode(0);
    let current = dummy;
    let nxtToAdd = false;
    while (p1 && p2) {
        let sum = p1.val + p2.val;
        let nxtNodeVal = sum;
        if (sum > 9) {
            if (nxtToAdd) sum++;
            nxtNodeVal = sum - 10;
            current.next = new ListNode(nxtNodeVal);
            nxtToAdd = true;
        } else {
            if (nxtToAdd) nxtNodeVal++;
            current.next = new ListNode(nxtNodeVal);
            nxtToAdd = false
        }
        current = current.next;
        p1 = p1.next;
        p2 = p2.next;
    }
    let p = p1 ? p1 : p2;
    while (p) {
        let sum = p.val;
        let nxtNodeVal = sum;
        if (sum >= 9) {
            if (nxtToAdd) sum++;
            nxtNodeVal = sum - 10;
            current.next = new ListNode(nxtNodeVal);
            nxtToAdd = true;
        } else {
            if (nxtToAdd) nxtNodeVal++;
            current.next = new ListNode(nxtNodeVal);
            nxtToAdd = false
        }
        current = current.next;
        p = p.next;
    }
    if (nxtToAdd) current.next = new ListNode(1);
    return dummy.next;
}

i can think of a better solutuon 
```

## Assistant:

> 7/29/2026 19:10:18

> Identified carry logic bugs and consolidated redundant loops.
>
> - Identified carry logic bugs and consolidated redundant loops.
> - **Done**

Your instinct is right — the boolean `nxtToAdd` + two separate while loops makes it convoluted. There's also a bug: in the second while loop `if (sum >= 9)` incorrectly handles `sum === 9` with no carry, giving `9 - 10 = -1`.

The clean version — single loop, numeric `carry`:

```typescript
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;
  let carry = 0;

  while (l1 || l2 || carry) {
    const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;
    carry = Math.floor(sum / 10);
    current.next = new ListNode(sum % 10);
    current = current.next;
    l1 = l1?.next ?? null;
    l2 = l2?.next ?? null;
  }

  return dummy.next;
}
```

Three things that clean it up:

1. `carry` as `0` or `1` instead of boolean — lets you do `sum % 10` and `Math.floor(sum / 10)` directly, no branching needed
2. Single `while (l1 || l2 || carry)` — handles different length lists AND the final carry in one loop, no second loop needed
3. `l1?.val ?? 0` — handles null pointers without separate checks

## User:

> 7/29/2026 19:21:25

can we diretly right l1.val instead of l1?.val

## Assistant:

> 7/29/2026 19:21:29

No. When one list is shorter than the other, `l1` becomes `null` before `l2` does. Accessing `null.val` crashes.

Example: `l1 = [1]`, `l2 = [1, 2]`

```
iteration 1: l1.val=1, l2.val=1 → fine
iteration 2: l1=null, l2.val=2 → null.val → CRASH
```

That's why `l1?.val ?? 0` — the `?.` safely returns `undefined` when `l1` is null, and `?? 0` converts that to `0`, so the math still works.

## User:

> 7/31/2026 17:24:36

which is the next linked list questions

## Assistant:

> 7/31/2026 17:24:37

From your remaining list:

1. **Copy List With Random Pointer** ← do this next
2. Find The Duplicate Number
3. Sort List
4. LRU Cache

Start with **Copy List With Random Pointer**.

## User:

> 7/31/2026 17:25:40

does after this , i should start trees ?

## Assistant:

> 7/31/2026 17:25:41

Not yet. You still have 4 remaining:

1. **Copy List With Random Pointer** ← next
2. Find The Duplicate Number
3. Sort List
4. LRU Cache

LRU Cache especially is too important to skip — it's one of the most commonly asked design questions in interviews. Finish all 4, then move to Trees.

## User:

> 7/31/2026 17:26:04

after lru cache ? i can start trees

## Assistant:

> 7/31/2026 17:26:05

Yes. Once LRU Cache is done, linked list is complete and you move to Trees.

## User:

> 7/31/2026 18:41:22

copy list - DONE
Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive.
There is only one repeated number in `nums`, return this repeated number.
You must solve the problem without modifying the array `nums` and using only constant extra space.
 
Example 1:

```
Input: nums = [1,3,4,2,2]
Output: 2

```

Example 2:

```
Input: nums = [3,1,3,4,2]
Output: 3

```

Example 3:

```
Input: nums = [3,3,3,3,3]
Output: 3
```

and this questoin is linked list problem ?

## Assistant:

> 7/31/2026 18:41:29

Yes, and it's a clever one. The constraint **"no extra space, no modifying array"** rules out the obvious solutions:

- ❌ HashSet → O(n) space
- ❌ Sorting → modifies array
- ❌ Marking visited by negating values → modifies array

**Why it's a linked list problem:**

The array values are in range `[1, n]` and indices are `[0, n]`. You can treat each value as a pointer to the next index:

```
nums = [1, 3, 4, 2, 2]
index:  0  1  2  3  4

0 → nums[0]=1 → nums[1]=3 → nums[3]=2 → nums[2]=4 → nums[4]=2 → nums[2]=4 ...
                                                              ↑ cycle!
```

The duplicate value creates a cycle — two indices point to the same next index. This is exactly **Floyd's cycle detection** (same algorithm as Linked List Cycle) applied to an array.

- `slow = nums[slow]` → move one step
- `fast = nums[nums[fast]]` → move two steps
- They meet inside the cycle
- Then reset one pointer to start, move both one step at a time → they meet at the **entrance of the cycle** = the duplicate number

Try coding it — it's almost identical to your Linked List Cycle solution.

## User:

> 8/3/2026 11:25:06

![1785736489946_image.png](data:image/webp;base64,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)

give me more question to practice on two pointers

## Assistant:

> 8/3/2026 11:25:13

> Curated additional two-pointer problems beyond previously practiced patterns.
>
> - Curated additional two-pointer problems beyond previously practiced patterns.
> - **Done**

You've done 4. Here are 6 more covering patterns you haven't seen yet:

**Easy:**
1. **Move Zeroes** (LC 283) — partition pattern, fast/slow pointer
2. **Squares of a Sorted Array** (LC 977) — two pointers from both ends, building result array

**Medium:**
3. **Sort Colors** (LC 75) — Dutch National Flag, 3-pointer variant
4. **Boats to Save People** (LC 881) — greedy + two pointers
5. **Partition Labels** (LC 763) — interval-style two pointer
6. **Minimum Size Subarray Sum** (LC 209) — wait, you already did this in sliding window

Replace #6 with:

6. **Bag of Tokens** (LC 948) — sort + two pointers, greedy decision making

**Suggested order:**
1. Move Zeroes
2. Squares of a Sorted Array
3. Sort Colors
4. Boats to Save People
5. Partition Labels
6. Bag of Tokens

These 6 + your 4 done = **10 two-pointer questions total**, which is comprehensive coverage. Start with Move Zeroes — it's the easiest of the batch.

## User:

> 8/3/2026 11:34:25

```typescript
function moveZeroes(nums: number[]): void {
    let left = 0
    let right = 0
    while (right < nums.length) {
        if (nums[right]) {
            nums[left] = nums[right]
            left++
        }
        right++
    }
    while (left < nums.length) {
        nums[left] = 0
        left++
    }
};

is this correct, or there can be better solution ? 
```

## Assistant:

> 8/3/2026 11:34:28

Correct. Clean and optimal — O(n) time, O(1) space.

The alternative is swapping instead of overwriting, which avoids the second while loop:

```typescript
function moveZeroes(nums: number[]): void {
  let left = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right]) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++;
    }
  }
}
```

Both are equally optimal. Your version does slightly more writes (overwrites + fills zeros), swap version does it in one pass. Difference is negligible — either is accepted in an interview.

## User:

> 8/3/2026 12:14:11

1. Squares of a Sorted Array (LC 977) — two pointers from both ends, building result array

give me solution for this

## Assistant:

> 8/3/2026 12:14:18

> Identified optimal two-pointer strategy leveraging sorted array properties.
>
> - Identified optimal two-pointer strategy leveraging sorted array properties.
> - **Done**

```typescript
function sortedSquares(nums: number[]): number[] {
  const result = new Array(nums.length);
  let left = 0;
  let right = nums.length - 1;
  let pos = nums.length - 1;

  while (left <= right) {
    const leftSq = nums[left] ** 2;
    const rightSq = nums[right] ** 2;
    if (leftSq > rightSq) {
      result[pos] = leftSq;
      left++;
    } else {
      result[pos] = rightSq;
      right--;
    }
    pos--;
  }

  return result;
}
```

**Why two pointers from both ends**: the array is sorted, so the largest squares are always at one of the two ends (either the most negative number or the most positive). Fill result from right to left — always place the larger square first.

Trace `[-4, -1, 0, 3, 10]`:

| left | right | leftSq | rightSq | place | pos |
|------|-------|--------|---------|-------|-----|
| -4 | 10 | 16 | 100 | 100 | 4 |
| -4 | 3 | 16 | 9 | 16 | 3 |
| -1 | 3 | 1 | 9 | 9 | 2 |
| -1 | 0 | 1 | 0 | 1 | 1 |
| 0 | 0 | 0 | 0 | 0 | 0 |

Result: `[0, 1, 9, 16, 100]` ✓

## User:

> 8/4/2026 18:27:59

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function sortList(head: ListNode | null): ListNode | null {
    
};

give me solution for this , i cannot think of a solution here
```

## Assistant:

> 8/4/2026 18:28:13

> Architected merge sort strategy leveraging divide-and-conquer principles.
>
> - Architected merge sort strategy leveraging divide-and-conquer principles.
> - **Done**

This is merge sort applied to a linked list. It reuses two patterns you already know: **find middle** + **merge two sorted lists**.

```typescript
function sortList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  // step 1: find middle and split
  let slow = head;
  let fast = head.next;
  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  const mid = slow.next;
  slow.next = null; // cut the list in half

  // step 2: recursively sort both halves
  const left = sortList(head);
  const right = sortList(mid);

  // step 3: merge
  return merge(left, right);
}

function merge(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
    else { curr.next = l2; l2 = l2.next; }
    curr = curr.next;
  }
  curr.next = l1 ?? l2;
  return dummy.next;
}
```

**Why merge sort and not something else**: quicksort needs random access (bad on linked list). Merge sort only needs sequential access — perfect for linked lists.

The three steps map directly to problems you've already solved:
- Find middle → Middle of Linked List ✅
- Split → set `slow.next = null`
- Merge → Merge Two Sorted Lists ✅

O(n log n) time, O(log n) space from recursion stack.

## User:

> 8/4/2026 18:31:18

hey , i don't know how to solve questions of recursion , how to learn recursion because ahead trees wil also have recursion, so i think this is the perfect time to learn recursion

## Assistant:

> 8/4/2026 18:31:30

Good call. Recursion is non-negotiable for Trees — almost every tree problem is recursive.

**The mental model — stop trying to trace the full call stack:**

The biggest mistake people make is trying to follow every recursive call in their head. Instead, use the **leap of faith**:

Assume the recursive call *just works* and returns the correct answer for a smaller input. Your only job is:
1. **Base case** — when do you stop?
2. **What to do with the current input** before/after the recursive call

**Example — sum of array:**
```typescript
function sum(nums: number[], i: number): number {
  if (i === nums.length) return 0;         // base case
  return nums[i] + sum(nums, i + 1);       // trust that sum(rest) works
}
```

Don't trace `sum([1,2,3])` → `sum([2,3])` → `sum([3])` → `sum([])`. Just trust: *"sum of everything after i is correct, I just add nums[i] to it."*

**Three questions to ask for every recursive problem:**

1. **What is the base case?** (smallest input that needs no recursion)
2. **What does one recursive call return?** (define it clearly)
3. **How do I combine the current value with the recursive result?**

**Practice these in order — pure recursion, no data structures:**

1. **Factorial** (n!) — warmup
2. **Fibonacci** (nth number) — two recursive calls
3. **Power of Two** (LC 231) — yes/no recursion
4. **Reverse a String** (LC 344) — recursion with two pointers
5. **Climbing Stairs** (LC 70) — intro to recursive thinking for DP
6. **Merge Sort** — you just saw this in Sort List

**Then move to recursion on linked lists (you've done these already):**

7. Reverse Linked List — recursive version
8. Sort List — you just did this ✅

**Then Trees will feel natural** because every tree problem follows the same template:
```typescript
function solve(node) {
  if (!node) return BASE_CASE;           // base case = null node
  const left = solve(node.left);         // trust left subtree
  const right = solve(node.right);       // trust right subtree
  return COMBINE(node.val, left, right); // combine
}
```

Start with Factorial right now — write it without looking anything up and paste it here.

## User:

> 8/4/2026 18:32:36

any yt video you recommend before solving questions of recursion

## Assistant:

> 8/4/2026 18:32:41

Yes, these two are the best:

**Watch first:**
**"Recursion in 100 Seconds"** by Fireship — 2 minutes, gives you the mental model fast.

**Then watch:**
**"Recursion for Beginners"** by William Fiset (freeCodeCamp channel) — goes from basic recursion to call stack visualization. This one is the best full explanation I know of.

**After those two, one more specifically for trees:**
**"5 Simple Steps for Solving Any Recursive Problem"** by Reducible — teaches exactly the "leap of faith" mental model I described, with visual call stack.

**Order:**
1. Fireship (2 min) — quick mental model
2. William Fiset (freeCodeCamp) — deep understanding + call stack
3. Reducible — problem solving framework

After watching these three, come back and start with Factorial. Don't watch more than these — too many videos without practice is just procrastination. Watch → code → paste here.

## User:

> 8/5/2026 11:02:02

```typescript
function factorial(n: number) {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

is this correct
```

## Assistant:

> 8/5/2026 11:02:03

Correct. Clean and exactly right.

One edge case: `factorial(0)` should return `1` (0! = 1 by definition). Your `n <= 1` handles it already. ✓

Next: write **Fibonacci**. Return the nth Fibonacci number where `fib(0) = 0`, `fib(1) = 1`.

## User:

> 8/5/2026 11:17:09

if n = 0 ,then output will be 0 and for n= 1 => 1 ?

## Assistant:

> 8/5/2026 11:17:10

Yes exactly:

```
fib(0) = 0
fib(1) = 1
fib(2) = 1  (0 + 1)
fib(3) = 2  (1 + 1)
fib(4) = 3  (1 + 2)
fib(5) = 5  (2 + 3)
```

Two base cases this time instead of one. Try it.

## User:

> 8/5/2026 11:31:57

```typescript
function fibonacci(n : number) {
  if(n <=1) return n
  return fibonacci(n) + fibonacci(n-1)
}
```

## Assistant:

> 8/5/2026 11:32:00

Almost — one bug: `fibonacci(n)` should be `fibonacci(n-1) + fibonacci(n-2)`. You wrote `fibonacci(n)` which calls itself with the same input → infinite loop.

```typescript
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

The base case `n <= 1` handles both `n=0` (returns 0) and `n=1` (returns 1) correctly. ✓

Next: **Climbing Stairs** (LC 70). You're given `n` steps, you can climb 1 or 2 steps at a time. How many distinct ways to reach the top?

## User:

> 8/5/2026 12:07:35

![1785911844676_image.png](data:image/webp;base64,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)

```typescript
function climbStairs(n: number): number {
    if(n<=1) return n
    return climbStairs(n-2) + climbStairs(n-1)
};

i think this is like fiboanacci
```

## Assistant:

> 8/5/2026 12:07:41

Yes, exactly — it **is** Fibonacci. You recognized the pattern correctly.

But one bug: base case. When `n=2`, `climbStairs(2-2) = climbStairs(0)` → returns `0`, but there are 2 ways to climb 2 stairs. Fix:

```typescript
function climbStairs(n: number): number {
  if (n <= 2) return n;
  return climbStairs(n - 1) + climbStairs(n - 2);
}
```

| n | ways |
|---|------|
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| 4 | 5 |
| 5 | 8 |

Exactly Fibonacci shifted by one. Your diagram confirms it — each answer is the sum of the previous two. Good pattern recognition, that instinct will help a lot in DP later.

One more thing: this recursive solution is O(2^n) — exponential. The optimal is O(n) using memoization or bottom-up DP, but that's a DP topic. For now the recursive version is fine.

## User:

> 8/5/2026 12:09:10

![1785911934368_image.png](data:image/webp;base64,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mZmZmnZERERERERERERERERERERERERERERERERERMe14hRLaNiQxToKdBjGMYxjGMYxjGMYxjGMYxjGLta58UCGF6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsqWbgR/lmkbBAN76jKCsbTP7ygChR2/1SThRBjVWLA/LqNWDhqII3C8Qf5qjrISYCluNnOOx7Y6YjYFEDIblf4k5gGh4hDdognpmkh7pzpzxc60lmmTmDg9eAMhW1jtqBndfGedP8xnrIxHKZ9Xez7IiwiW8vpC1PaHGh8JaewAeYgH4lGQlJtFMwDgGr6V+LgIg7Hi/NtB7NTd1O7KmDS3phuX63AuNERERERERBzou7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7vGbw4/NOCwsUV98Sdp1YQThAzsL4GHwgHlBRhs9pfte/U2s53rgKZfOon7LaDwnut+Doas7EvSI84aJmbCLf6/+MxjKXfWtomk1Fqyl/MzMzMzMzS7uqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqypZuBqxzKrgGOWCfCvYtRNKdqDXhrDi0ZcXAOM+diHtjr5XjMH/NBVCzViX/Yb3IY2po5j6mGldj7xSJ+S0VoqpV6Dxz8rxO8souHFf7cTjE99GEq1ezR9w80CPHCszMzMzM0u7qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsqWbgYsYzN5LgIA05oo6pzHbgDLOlZ3kv7qoTeBlcDVk4G00Bt9p9IaKj6v/NjxGr+wZe46YU7Il9YZhJAXF7e9pYqa3SG4al01KbL5SZoUX47Rr0nbQM7KtoHg+gcKrEaXcWBmi7NzoLMUf4kzxLAzd+jramnKUYjlE3DlbXbrgO5/9H1u/ss/qGpAk38vv1hFQWfRhC/RNQvyhWZmZmZmafjERERERERERERERERERERERERERERERERERFcC8FQylNxmLKsZTKarLn1QtBT9zqqqghEVU/mc5wNPVVVVVVVVVlRd3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3eM3KP5zADcD///////////////////////////YQEs/A4EMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzT88zv//////////////////////////////+HwNifgAAAAAAAAAAAAAAAAAAAAAAAAAAAA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)

i am getting time limit exceeded ,what is the optimal

## Assistant:

> 8/5/2026 12:09:15

As I mentioned earlier — pure recursion is O(2^n) because it recomputes the same subproblems repeatedly. Fix it with memoization:

```typescript
function climbStairs(n: number): number {
  const memo = new Map<number, number>();
  
  function dp(n: number): number {
    if (n <= 2) return n;
    if (memo.has(n)) return memo.get(n)!;
    const result = dp(n - 1) + dp(n - 2);
    memo.set(n, result);
    return result;
  }
  
  return dp(n);
}
```

Or even simpler — bottom up, no recursion at all:

```typescript
function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}
```

O(n) time, O(1) space. This is the optimal solution. The bottom-up version is exactly what you'll learn properly in DP — you've already seen the concept here.

## User:

> 8/5/2026 12:10:02

function climbStairs(n: number): number { const memo = new Map<number, number>(); function dp(n: number): number { if (n <= 2) return n; if (memo.has(n)) return memo.get(n)!; const result = dp(n - 1) + dp(n - 2); memo.set(n, result); return result; } return dp(n); }

what is dp here

## Assistant:

> 8/5/2026 12:10:08

`dp` stands for **dynamic programming** — but here it's just a recursive function with memory.

The key difference from plain recursion:

```typescript
// plain recursion — recomputes same values repeatedly
function dp(n) {
  if (n <= 2) return n;
  return dp(n-1) + dp(n-2); // dp(3) computed 100s of times for large n
}

// with memo — computes each value exactly once
function dp(n) {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n)!; // already computed? return instantly
  const result = dp(n-1) + dp(n-2);
  memo.set(n, result); // store so we never recompute this again
  return result;
}
```

For `n=5` without memo:
```
dp(5)
  dp(4)
    dp(3)
      dp(2) ← computed
      dp(1) ← computed
    dp(2) ← computed AGAIN (wasted)
  dp(3) ← computed AGAIN (wasted)
    dp(2) ← computed AGAIN (wasted)
    dp(1) ← computed AGAIN (wasted)
```

With memo, once `dp(3)` is computed and stored, every future call to `dp(3)` returns instantly from the map. That's what drops it from O(2^n) to O(n).

This pattern — **recursion + memoization** — is called **top-down DP**. You'll see it constantly in the DP section later.

## User:

> 8/5/2026 20:55:12

ok , what is next

## Assistant:

> 8/5/2026 20:55:14

You've done:
- ✅ Factorial
- ✅ Fibonacci
- ✅ Climbing Stairs

Next: **Reverse a String** (LC 344) — recursion with two pointers. Simple problem but teaches how recursion can replace iteration for in-place operations.

Try it without looking anything up and paste your attempt.

## User:

> 8/5/2026 21:37:24

```typescript
function reverseString(s: string[], left: number = 0, right: number = s.length - 1): void {
  if(left > right) return 
  let temp = s[left]
  s[left] = s[right]
  s[right] = temp
  return reverseString(s , left + 1 , right -1)
}

is this correct ? 
```

## Assistant:

> 8/5/2026 21:37:26

Correct. Clean recursive solution — base case, swap, recurse inward. ✓

You've now done all the recursion warmups:
- ✅ Factorial
- ✅ Fibonacci
- ✅ Climbing Stairs
- ✅ Reverse String

You're ready for Trees. The recursion pattern you just built is exactly what every tree problem uses — base case on null node, recurse left, recurse right, combine. Start Trees whenever you're ready.

## User:

> 8/5/2026 22:44:12

function sortList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  // step 1: find middle and split
  let slow = head;
  let fast = head.next;
  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  const mid = slow.next;
  slow.next = null; // cut the list in half
  // step 2: recursively sort both halves
  const left = sortList(head);
  const right = sortList(mid);
  // step 3: merge
  return merge(left, right);
}
function merge(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
    else { curr.next = l2; l2 = l2.next; }
    curr = curr.next;
  }
  curr.next = l1 ?? l2;
  return dummy.next;
}

what is the base condition in this , i am confused

## Assistant:

> 8/5/2026 22:44:17

The base case is:

```typescript
if (!head || !head.next) return head;
```

Two conditions combined:

- `!head` → list is empty (null) → nothing to sort, return null
- `!head.next` → list has only one node → already sorted, return it

**Why these are the base cases**: you can't split a list of 0 or 1 nodes any further. A single node is trivially sorted — no work needed.

Visualizing the recursion for `1 → 3 → 2`:

```
sortList(1→3→2)
  ├── sortList(1)       ← !head.next → return 1
  └── sortList(3→2)
        ├── sortList(3) ← !head.next → return 3
        └── sortList(2) ← !head.next → return 2
        └── merge(3, 2) → 2→3
  └── merge(1, 2→3) → 1→2→3
```

Every recursive function bottoms out when it hits a single node — that's when the "leap of faith" ends and the merging starts building the answer back up.

## User:

> 8/6/2026 11:12:46

how to start trees

## Assistant:

> 8/6/2026 11:12:53

Trees are built on recursion — which you just finished. So you're ready.

**Core concept:**

A tree is a linked list but each node has **two** pointers instead of one:

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  
  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}
```

**Visual:**
```
        1          ← root
       / \
      2   3
     / \
    4   5
```

**Key terms:**
- **Root** — top node (no parent)
- **Leaf** — node with no children
- **Height** — longest path from root to leaf
- **Depth** — distance from root to a node

**The universal tree template** — almost every tree problem uses this:

```typescript
function solve(node: TreeNode | null) {
  if (!node) return BASE_CASE; // base case = null node
  
  const left = solve(node.left);   // trust left subtree
  const right = solve(node.right); // trust right subtree
  
  return COMBINE(node.val, left, right);
}
```

**Two traversal strategies:**

DFS (Depth First Search) — go deep before wide, uses recursion:
- **Preorder**: root → left → right
- **Inorder**: left → root → right
- **Postorder**: left → right → root

BFS (Breadth First Search) — level by level, uses a queue.

**Tell me your NeetCode trees list** and I'll give you the order to do them.

## User:

> 8/6/2026 11:18:13

first give me 10 trees strcutures and i will write preorder, inorder and postorder transversal 

i have watched a video about this

## Assistant:

> 8/6/2026 11:18:18

Here are 10 trees. Write all three traversals for each:

**1.**
```
    1
   / \
  2   3
```

**2.**
```
      4
     / \
    2   6
   / \ / \
  1  3 5  7
```

**3.**
```
    1
   /
  2
 /
3
```

**4.**
```
1
 \
  2
   \
    3
```

**5.**
```
      5
     / \
    3   8
   /     \
  1       9
```

**6.**
```
        10
       /  \
      5    15
     / \
    3   7
```

**7.**
```
    1
   / \
  2   3
 /   / \
4   5   6
```

**8.**
```
      6
     / \
    4   8
   / \
  2   5
```

**9.**
```
        1
       / \
      2   3
     / \   \
    4   5   6
```

**10.**
```
         8
        / \
       3   10
      / \    \
     1   6    14
        / \
       4   7
```

Write your answers like:
```
Tree 1:
Preorder:  1 2 3
Inorder:   2 1 3
Postorder: 2 3 1
```

## User:

> 8/6/2026 11:28:44

Tree 1:
Preorder:  1 2 3
Inorder:   2 1 3
Postorder: 2 3 1

Tree 2:
Preorder: 4 2 1 3 6 5 7  
Inorder:  1 2 3 4 5 6 7
Postorder: 1 3 2 5 7 6 4

Tree 3:
Preorder: 1 2 3 
Inorder: 3 2 1
Postorder: 3 2 1

Tree 4:
Preorder: 1 2 3 
Inorder: 1 2 3
Postorder: 3 2 1

Tree 5 : 
Preorder: 5 3 1 8 9 
Inorder: 1 3 5 8 9 
Postorder: 1 9 3 8 5

Please check these 5 and then i will attempt rest 5

## Assistant:

> 8/6/2026 11:28:49

Trees 1, 2, 3, 4 are all correct. ✓

**Tree 5 is wrong** — postorder is incorrect.

```
      5
     / \
    3   8
   /     \
  1       9
```

Postorder = left → right → root. Work bottom up:
- Left subtree of 5: go to 3, go to 1 (leaf) → `1`, back to 3 (no right) → `3`
- Right subtree of 5: go to 8, go to 9 (leaf) → `9`, back to 8 (no left) → `8`
- Root → `5`

Postorder should be: `1 3 9 8 5`

Your answer `1 9 3 8 5` is wrong — you processed `9` before `3` but `3` is the parent of `1`, so `3` must come after `1` not after `9`.

Fix that and attempt trees 6-10.

## User:

> 8/6/2026 11:41:27

Tree 6 : 
Preorder: 10 5 3 7 15  
Inorder: 3 5 7 10 15 
Postorder: 3 7 5 15 10

Tree 7 : 
Preorder: 1 2 4 3 5 6   
Inorder: 4 2 1 5 3 6
Postorder: 4 2 5 6 3 1

Tree 8 : 
Preorder: 6 4 2 5 8    
Inorder: 2 4 5 6 8  
Postorder: 2 5 4 8 6

Tree 9 : 
Preorder: 1 2 4 5 3 6    
Inorder: 4 2 5 1 3 6
Postorder: 4 5 2 6 3 1
 
Tree 10 : 
Preorder: 8 3 1 6 4 7 10 14    
Inorder: 1 3 4 6 7 8 10 14
Postorder: 1 4 7 6 3 14 10 8

## Assistant:

> 8/6/2026 11:41:29

All 5 are correct ✓

You're solid on all three traversals. Now write the code for all three. Try implementing them recursively:

```typescript
function preorder(root: TreeNode | null): number[] {
  // your code
}

function inorder(root: TreeNode | null): number[] {
  // your code
}

function postorder(root: TreeNode | null): number[] {
  // your code
}
```

Paste your attempts here.

## User:

> 8/6/2026 12:05:45

```typescript
function preorder(root: TreeNode | null): number[] {
    const result : number[] = []
    if(!root) return []
    result.push(root.val)
    preorder(root.left)
    preorder(root.right)
    return result
} 

is preorder like this ? 
```

## Assistant:

> 8/6/2026 12:05:48

Almost — the recursive calls `preorder(root.left)` and `preorder(root.right)` return arrays but you're not using them. So only the root gets pushed to result, left and right subtrees are lost.

Two ways to fix:

**Option 1: spread into result**
```typescript
function preorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [root.val, ...preorder(root.left), ...preorder(root.right)];
}
```

**Option 2: helper with shared result array**
```typescript
function preorder(root: TreeNode | null): number[] {
  const result: number[] = [];
  
  function dfs(node: TreeNode | null) {
    if (!node) return;
    result.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  
  dfs(root);
  return result;
}
```

Option 2 is cleaner and more efficient — no array spreading. Now write inorder and postorder using the same pattern.

## User:

> 8/6/2026 12:14:20

hey i have a question when it reaches left and there is no node left , how it goes back , it should have stuck at same node , how if left is null , it moves back

## Assistant:

> 8/6/2026 12:14:26

This is the **call stack** — JavaScript handles the "going back" automatically.

When a function calls another function, the current function **pauses** and waits. When the called function returns, execution resumes exactly where it left off.

Trace `preorder` on this tree:
```
    1
   / \
  2   3
```

```
dfs(1)         ← called, pauses after dfs(node.left)
  push 1
  dfs(2)       ← called, pauses after dfs(node.left)
    push 2
    dfs(null)  ← hits if(!node) return → returns immediately
    ↑ back to dfs(2)
    dfs(null)  ← hits if(!node) return → returns immediately
    ↑ back to dfs(2), dfs(2) is done → returns
  ↑ back to dfs(1), now calls dfs(node.right)
  dfs(3)       ← called
    push 3
    dfs(null)  ← returns
    dfs(null)  ← returns
    ↑ dfs(3) done → returns
  ↑ back to dfs(1), dfs(1) done
```

Result: `[1, 2, 3]` ✓

The key: `if (!node) return` is what stops the recursion and triggers the "going back." JavaScript remembers exactly where each paused function left off via the call stack.

## User:

> 8/6/2026 12:40:47

ok , now let me try inorde traversal

## Assistant:

> 8/6/2026 12:40:47

Go ahead, paste your attempt.

## User:

> 8/6/2026 13:28:14

```typescript

function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = []
  function dfs(node: TreeNode | null) {
    if (!node) return
    // Reach the leftest node first
    dfs(node.left)
    result.push(node.val)
    dfs(node.right)
  }
  dfs(root)
  return result
};

is this correct
```

## Assistant:

> 8/6/2026 13:28:16

Perfect. Correct and clean. ✓

The only difference from preorder is `result.push(node.val)` moves to after `dfs(node.left)` — that one line change is all that separates preorder from inorder.

Now write postorder.

## User:

> 8/6/2026 21:30:07

```typescript

function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = []
  function dfs(node: TreeNode | null) {
    if (!node) return
    dfs(node.left)
    dfs(node.right)
    result.push(node.val)
  }
  dfs(root)
  return result
};
```

## Assistant:

> 8/6/2026 21:30:09

Perfect. Correct and clean. ✓

Notice the pattern — only the position of `result.push(node.val)` changes:

```
Preorder:  push → left → right  (root first)
Inorder:   left → push → right  (root middle)
Postorder: left → right → push  (root last)
```

That's the entire difference between all three traversals. Now tell me your NeetCode trees list and we'll start solving problems.

## User:

> 8/6/2026 22:52:16

hey can you give me the Level Order Traversal (BFS)

## Assistant:

> 8/6/2026 22:52:22

Level order traversal visits nodes **level by level**, left to right. It uses a **queue** (not recursion).

```
        1
       / \
      2   3
     / \
    4   5

Level 0: [1]
Level 1: [2, 3]
Level 2: [4, 5]
```

```typescript
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length) {
    const levelSize = queue.length;
    const level: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}
```

**The key insight**: `levelSize = queue.length` at the start of each iteration tells you exactly how many nodes are on the current level. Process exactly that many, then move to the next level.

Trace on the tree above:
| iteration | queue at start | levelSize | level processed | queue after |
|---|---|---|---|---|
| 1 | [1] | 1 | [1] | [2,3] |
| 2 | [2,3] | 2 | [2,3] | [4,5] |
| 3 | [4,5] | 2 | [4,5] | [] |

Result: `[[1],[2,3],[4,5]]` ✓

This BFS pattern is used in dozens of tree problems — memorize this template.

## User:

> 8/6/2026 23:00:58

which is more oftenly used bfs or dfs ?

## Assistant:

> 8/6/2026 23:01:03

**DFS is used more often** in tree problems — roughly 70/30.

**DFS** for most tree problems:
- Height/depth of tree
- Path sums
- Diameter
- Lowest common ancestor
- Validate BST
- Invert tree
- Subtree problems

Reason: trees are naturally recursive structures. DFS + recursion maps directly to how trees are built.

**BFS** for specific scenarios:
- Level order traversal
- Shortest path (minimum depth)
- Right side view of tree
- Connecting nodes at same level
- Anything where "level by level" matters

**Rule of thumb:**
- Question mentions **levels, depth by level, shortest** → BFS
- Everything else → DFS

In your NeetCode tree list, probably 80% of problems will use DFS. But you need both — some problems can only be solved cleanly with BFS. Now share your tree problem list and let's start.

## User:

> 8/6/2026 23:14:15

function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  while (queue.length) {
    const levelSize = queue.length;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}

this is currently hard for me , can i do this later

## Assistant:

> 8/6/2026 23:14:16

Yes, skip it for now. Come back to it when you hit a problem that specifically needs BFS (like "Binary Tree Level Order Traversal" on your NeetCode list).

For now focus on DFS — it covers 80% of tree problems and you already understand recursion well. Share your NeetCode tree list and let's start.

## User:

> 8/6/2026 23:14:34

from which question to start

## Assistant:

> 8/6/2026 23:14:34

Share your NeetCode trees list first — the one with all the problem names. Then I'll give you the exact order.

## User:

> 8/6/2026 23:15:32

![1786038297479_image.png](data:image/webp;base64,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)

i want to do 25 question on trees not 15,  so add 10 more question for more practice

## Assistant:

> 8/6/2026 23:15:38

Here's your full 25-question tree list in order:

**Easy (foundation):**
1. Invert Binary Tree
2. Maximum Depth of Binary Tree
3. Diameter of Binary Tree
4. Balanced Binary Tree
5. Same Tree
6. Subtree of Another Tree
7. **Symmetric Tree** (LC 101) ← added
8. **Path Sum** (LC 112) ← added
9. **Count Complete Tree Nodes** (LC 222) ← added

**Medium (core patterns):**
10. Lowest Common Ancestor of BST
11. Binary Tree Level Order Traversal
12. Binary Tree Right Side View
13. Count Good Nodes in Binary Tree
14. Validate Binary Search Tree
15. Kth Smallest Element in BST
16. Construct Binary Tree from Preorder and Inorder
17. **Binary Tree Zigzag Level Order Traversal** (LC 103) ← added
18. **Path Sum II** (LC 113) ← added
19. **Sum Root to Leaf Numbers** (LC 129) ← added
20. **Lowest Common Ancestor of Binary Tree** (LC 236) ← added

**Hard:**
21. Binary Tree Maximum Path Sum
22. Serialize and Deserialize Binary Tree
23. **Binary Tree Cameras** (LC 968) ← added
24. **Maximum Width of Binary Tree** (LC 662) ← added
25. **Recover Binary Search Tree** (LC 99) ← added

Start with **Invert Binary Tree** — it's the classic recursion warmup for trees.

## User:

> 8/6/2026 23:31:09

Invert Binary Tree : my strategy is to start recustion on the root to left and right at same time > just say yes or no

## Assistant:

> 8/6/2026 23:31:09

Yes.

## User:

> 8/6/2026 23:35:26

do i have to only change values ?

## Assistant:

> 8/6/2026 23:35:27

No. Swap the actual **nodes** (pointers), not just values.

## User:

> 8/6/2026 23:40:07

is this like post order traversal ? i think so

## Assistant:

> 8/6/2026 23:40:07

Yes.

## User:

> 8/6/2026 23:49:14

can you give me a hint ?

## Assistant:

> 8/6/2026 23:49:15

After recursively inverting left and right subtrees, what do you do with `node.left` and `node.right`?

## User:

> 8/6/2026 23:51:25

![1786040453562_image.png](data:image/webp;base64,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)

will it be something like , first 1 and 3 will be inverted ?

## Assistant:

> 8/6/2026 23:51:27

Yes exactly. Bottom-up (postorder):

```
1. invert(1, 3) → swap → (3, 1)
2. invert(6, 9) → swap → (9, 6)
3. invert(2, 7) → swap → (7, 2)
```

Each node waits for its children to be inverted first, then swaps them. Now write the code.

## User:

> 8/6/2026 23:56:08

```typescript
function invertTree(root: TreeNode | null): TreeNode | null {
    if(!root) return null 
    function dfs(node : TreeNode | null) {
      if(!node) return 
      // recurse until the end of left
      dfs(node.left)
      // recurse until the end of right 
      dfs(node.right)
    }
    dfs(root)
};

sorry but , i am able to think , but i don;t what to do ? 
```

## Assistant:

> 8/6/2026 23:56:09

You're 80% there. The recursion structure is correct. You're just missing the actual swap after the recursive calls:

```typescript
dfs(node.left)
dfs(node.right)
// now swap left and right
```

How do you swap two variables in TypeScript? Apply that same idea to `node.left` and `node.right`.

## User:

> 8/6/2026 23:59:26

```typescript
function invertTree(root: TreeNode | null): TreeNode | null {
    if(!root) return null 
    function dfs(node : TreeNode | null) {
      if(!node) return 
      // recurse until the end of left
      dfs(node.left)
      // recurse until the end of right 
      dfs(node.right)
      let leftNode = node.left
      node.left = node.right
      node.right = leftNode
    }
    dfs(root)
    return root
};

? 
```

## Assistant:

> 8/6/2026 23:59:27

Perfect. Correct and clean. ✓

Next: **Maximum Depth of Binary Tree** — try it yourself first.

## User:

> 8/7/2026 9:05:08

```typescript
function maxDepth(root: TreeNode | null): number {
 let maxDepth: number = 0
  let currDepth : number = 0 
  function dfs(node: TreeNode | null) {
    if(!node) return
    currDepth++
    maxDepth = Math.max(maxDepth , currDepth)
    dfs(node.left)
    dfs(node.right)
  }
  dfs(root)
  return maxDepth 
}; ? 
```

## Assistant:

> 8/7/2026 9:05:12

Correct, but you're missing `currDepth--` after the recursive calls. Without it, `currDepth` keeps incrementing and never goes back up when backtracking.

```typescript
dfs(node.left)
dfs(node.right)
currDepth-- // ← missing this
```

But honestly, there's a cleaner way that avoids tracking `currDepth` entirely:

```typescript
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

Trust the recursion — max depth at any node is `1 (current node) + max(left depth, right depth)`. One line, no helper function needed.

## User:

> 8/7/2026 10:07:56

function maxDepth(root: TreeNode | null): number { if (!root) return 0; return 1 + Math.max(maxDepth(root.left), maxDepth(root.right)); }

i am not able to understand this

## Assistant:

> 8/7/2026 10:08:01

Let me trace it on a simple tree:

```
    1
   / \
  2   3
 /
4
```

```
maxDepth(1)
  = 1 + max(maxDepth(2), maxDepth(3))
  
  maxDepth(2)
    = 1 + max(maxDepth(4), maxDepth(null))
    
    maxDepth(4)
      = 1 + max(maxDepth(null), maxDepth(null))
      = 1 + max(0, 0)
      = 1
      
    maxDepth(null) = 0
    
    = 1 + max(1, 0)
    = 2
    
  maxDepth(3)
    = 1 + max(maxDepth(null), maxDepth(null))
    = 1 + max(0, 0)
    = 1
    
  = 1 + max(2, 1)
  = 3
```

**The leap of faith**: don't trace the whole thing. Just ask:

- What is the depth of a null node? → `0`
- What is the depth of any node? → `1 (itself) + max(left depth, right depth)`

Trust that `maxDepth(root.left)` and `maxDepth(root.right)` return the correct depths for their subtrees. Your only job at each node is to add `1` and take the max.

## User:

> 8/7/2026 11:48:04

ok, which is next question

## Assistant:

> 8/7/2026 11:48:06

**Diameter of Binary Tree** — try it yourself first.

Hint: diameter at any node = `left depth + right depth`. You already know how to calculate depth from the previous problem.

## User:

> 8/7/2026 13:10:39

do i have to use a map to store the distance from each node ?

## Assistant:

> 8/7/2026 13:10:40

No, just use a single variable to track the maximum diameter, same pattern as your first attempt at maxDepth.

Try it.

## User:

> 8/7/2026 14:11:55

```typescript
function diameterOfBinaryTree(root: TreeNode | null): number {
  if (!root) return 0
  let maxDistance: number = 0
  let currDistance: number = 0
  // left tree 
  function dfs(node: TreeNode | null) {
    if (!node) return
    // traverse left 
    currDistance++
    maxDistance = Math.max(maxDistance, currDistance)
    dfs(node.left)

  }
  dfs(root)
};

i am thinking to do 2 functions , one will traverse the left subtree from root and one will traverse the right subtree from root, and then add the result , will this work ? 
```

## Assistant:

> 8/7/2026 14:11:59

No, that approach is wrong. The diameter doesn't always pass through the root. It can pass through any node.

Example:
```
        1
       /
      2
     / \
    3   4
   /     \
  5       6
```

The diameter here is `5→3→2→4→6` = 4, which doesn't pass through root `1` at all.

**Correct approach**: at every node, calculate `left depth + right depth` and update max. Use your `maxDepth` solution as a helper:

```
diameter at node = maxDepth(node.left) + maxDepth(node.right)
```

Do this for every node via DFS, track the maximum. Try coding it with this in mind.

## User:

> 8/7/2026 15:27:20

```typescript
function diameterOfBinaryTree(root: TreeNode | null): number {
  if (!root) return 0
  let leftMax: number = 0
  let rightMax : number = 0
  let currDistance: number = 0
  // left tree 
  function dfs(node: TreeNode | null) {
    if (!node) return
    // traverse left 
    currDistance++
    leftMax = Math.max(leftMax, currDistance)
    dfs(node.left)
    rightMax = Math.max(rightMax , currDistance)
    dfs(node.right)
    currDistance--
  }
  dfs(root)
  return leftMax + rightMax
};

give me some hint
```

## Assistant:

> 8/7/2026 15:27:24

Your approach is fundamentally wrong — `leftMax + rightMax` tracked this way doesn't give diameter at every node, only at root.

Here's the correct mental model in 3 lines:

```
function dfs(node) → returns the HEIGHT of the subtree rooted at node
at each node: diameter candidate = dfs(left) + dfs(right)
update maxDiameter, then return 1 + max(left, right) to parent
```

So `dfs` does two things at once:
1. Updates `maxDiameter` using left + right heights
2. Returns height to its parent

Try coding with this structure:

```typescript
let maxDiameter = 0;

function dfs(node): number {  // returns HEIGHT
  if (!node) return 0;
  const left = dfs(node.left);   // height of left subtree
  const right = dfs(node.right); // height of right subtree
  // your code here
}
```

What goes in "your code here"?

## User:

> 8/7/2026 16:16:41

Please give me solution , i have spend enough time

## Assistant:

> 8/7/2026 16:16:46

```typescript
function diameterOfBinaryTree(root: TreeNode | null): number {
  let maxDiameter = 0;

  function dfs(node: TreeNode | null): number {
    if (!node) return 0;
    const left = dfs(node.left);
    const right = dfs(node.right);
    maxDiameter = Math.max(maxDiameter, left + right);
    return 1 + Math.max(left, right);
  }

  dfs(root);
  return maxDiameter;
}
```

The key insight you were missing: `dfs` serves two purposes simultaneously:

1. **Updates** `maxDiameter` with `left + right` (diameter passing through current node)
2. **Returns** `1 + max(left, right)` (height, so parent can calculate its own diameter)

Trace on:
```
    1
   / \
  2   3
 / \
4   5
```

| node | left | right | diameter candidate | returns |
|------|------|-------|--------------------|---------|
| 4 | 0 | 0 | 0 | 1 |
| 5 | 0 | 0 | 0 | 1 |
| 2 | 1 | 1 | 2 ← max | 2 |
| 3 | 0 | 0 | 0 | 1 |
| 1 | 2 | 1 | 3 | 3 |

`maxDiameter = 3` ✓

## User:

> 8/7/2026 22:00:57

what is the next question

## Assistant:

> 8/7/2026 22:00:59

**Balanced Binary Tree** — try it yourself first.

Hint: it's very similar to Diameter. Your `dfs` returns height, but now also checks if the tree is unbalanced at each node.

## User:

> 8/8/2026 7:52:33

```typescript
function isBalanced(root: TreeNode | null): boolean {
    if (!root) return true
    let result: boolean = true
    function dfs(node: TreeNode | null): number {
        if (!node) return 0
        const left = dfs(node.left)
        const right = dfs(node.right)
        if (Math.abs(left - right) > 1) result = false
        return 1 + Math.max(left, right)
    }
    dfs(root)
    return result
};
```

## Assistant:

> 8/8/2026 7:52:34

Perfect. Correct and clean. ✓

Same pattern as Diameter — `dfs` returns height while simultaneously checking the balance condition at every node. You got it on your own this time.

Next: **Same Tree**.

## User:

> 8/8/2026 11:45:38

does i have to compare value in this question ?

## Assistant:

> 8/8/2026 11:45:39

Yes — two trees are the same if:
1. Both nodes have the **same value**
2. Their left subtrees are the same
3. Their right subtrees are the same

Try it.

## User:

> 8/8/2026 11:58:46

```typescript
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  let result: boolean = true
  function dfs(node1: TreeNode | null, node2: TreeNode | null) {
    if (!node1 || !node2) return 
    dfs(node1.left, node2.left)
    dfs(node2.right, node2.right)
    if(node1.val !== node2.val) result = false
  }
  dfs(p, q);
  return result;
};

will it be something like this , i know this is wrong 
```

## Assistant:

> 8/8/2026 11:58:49

You're close but two issues:

1. **Base case is wrong** — `if (!node1 || !node2)` returns without checking if one is null and the other isn't. If one is null and other isn't → trees are different → `result = false`.

2. **Typo** — `dfs(node2.right, node2.right)` should be `dfs(node1.right, node2.right)`.

Fix the base case first — it needs to handle three scenarios:
- Both null → same → return
- One null, one not → different → `result = false`
- Both not null → continue recursion

Try fixing it.

## User:

> 8/8/2026 12:16:48

```typescript
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  let result: boolean = true
  function dfs(node1: TreeNode | null, node2: TreeNode | null) {
    if (!node1 || !node2) return 
    dfs(node1.left, node2.left)
    dfs(node2.left, node2.right)
    if(node1.val !== node2.val) result = false
  }
  dfs(p, q);
  return result;
};

please give me correct solution 
```

## Assistant:

> 8/8/2026 12:16:51

```typescript
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;   // both null → same
  if (!p || !q) return false;  // one null, one not → different
  if (p.val !== q.val) return false; // values differ → different
  
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

No need for a helper function or `result` variable here — the function itself is recursive and returns a boolean directly.

The three base cases in order:
1. Both null → `true`
2. One null → `false`
3. Values differ → `false`

If all three pass, recurse on both subtrees and `&&` the results — both must be true for the trees to be the same.

## User:

> 8/8/2026 19:42:45

![1786198352432_image.png](data:image/webp;base64,UklGRqAoAABXRUJQVlA4IJQoAACwwgCdASoqAicBPm00lkikIqIhItKKSIANiWlu/k7/zPpagO8A1pHnn+xuAOSz/peI/9L/3foA/mH9n/52r7yNlKulngD9AI/2mAU2LjAP8j9qG1mVS+KP6V+GHfp/ZP7f+z/959K/x36H+//2f9y/7x7Of9P3s+fv97/bPUP+P/Yb7l/ef2+/vvtH/jv7R+2n909JfhR+//mp/hfkC/Jv5Z/eP7r+4f9/9RH+W7a/Rf8f/nvy5+AX1i+h/5b+3f4b/hf6D92/Zq/kP7d+6/uh+Z/1z/V/3X9sf8d9gH8c/n3+m/t37w/3L/////67/2P/D8Vr7H/q/+5/lPgC/lP9g/5H98/zH7X/Sh/I/9v/J/6X9oPah+df4H/o/5r/X/s39g38t/q3/A/vv+e/+f+g/////+7P//+4D9w///7qP7Nf/GqFl2n3eL5RhxxD4lVd3nA/Vr35A5OWasvYz7LO4TJgJE89ksB566PKoDzDVtMJOob7DkY0H1IjX4wRWB3Mz+YcYWt0JHgDtE3ehwXcPBl3aixY42AEGmnSuYZBPIv+r0jn+jooRLLNMpTBV1UwJq+HagH5ibhmaQDyIGCn+m4kDNOgokxBNcGSQvSmDLXXuD9CwZSWXkvHAi8HTXESMh4GNBdy0vCMo1qImO9qj1fR4sT1iQEIs1VLMbpVNyrGTjdQ9Da5/U0y4ganHQXpkYq82ublpYh1QChj0DlaxNaQl/BZBPJjZzdea8QbMQxgER1tYT24MGGE89F5UdFGOj49T7dHTfd8JEGXuzEb/mJ8PiXL/1ncTfiH+i6U2p8vyQQSTZtxJQvr7o805WMt5kt7WUFCjfFnN936RNFe6PCor3R4VFe6O/4BCjfFn4RoBCjfFn4Ub4s/CjfFn22U+FRXujvrzf/aIfsApbI+mLu7jG8Nmw+K3lNd4s2khemYJNpDBzpsxMW/qWNuCnlLU9rlndZygJnDWNztZX3XKL1DWU0I6jZsQo3xZ0B50FXadBTskSn79XJbOLfuPmUsDF5mcBkSiypdbx4P8oIt3z9xh4R4rwAaoB2ezYSBAtaAXDqJFwr2qevxhnr/Q1zf12+kNfm7Z1/rSbct+LKtKwlY/kSEB58kToQrTBXUEJ8AoUb4q0jqPwo3xZ+FG+LPwo3xZz0tmV4zIP+xmqAL7szvpAEr3R4VFe6PCor3R4VFXP+xHIsryLiz8KNw68JipRnHETp1m374cvmH8oZfzM608KQTvnyU8Mry3uwN4wshveQ6Apnmeysyf5mpY7qk5oYKFQFBlNXE9d0KqubwaSnuutagopxgEPFt7HJxqCx4cZAyO3DH9/MyiviqTnvzcZLkliijK3QoAeYfku+1+WClL/a0h/6LZT0Vcd2EIgZzSnO8hkYUihWMv667eVY4nLpo9VlRDpAVEdwwtYBgRYlj9LmeG7IsfivUtNpzLfCQW3vqZME0LTh3MQChGgEKN8WoCRmBZ+FG+LPwo3vrsRJE6tVGNy1QV6uPhGFEiNlKQG3d/lVYf1MsrGzYhRviz8KN8WfhRJ0AnZMy5X2fXiaf4XavdGwiTDSc+WoqOv0o551/marA2cksytQ/JrJGFw86LsvPmH7hbkpgI6icRWbApjdPM81SKOWVPBT8Z9aggKVDC0kZoQkdkzk/mMt8lpdwLesZYw/2pE+J8ASgu7vb6b5KDY3lpsqcCroG3sqq8INoD0JlQ8sfN6PCoWC+Zelm/nV4T6AMppRk+aMVBeqU0GjWKO/ryc9zh18lNGfSRFT3R4VFe6O/2B0IKFG+LPwo3xZ+FG+LPwo3xZ+EHl/i/tzpJMz5TdsMv2hH5SOZyi2I4Of8QdSqhpi+llsPjNOmJ9PlnlKh6i3TP1+vzGKOFmqjfCNUCdrbbSiSD0FMWmzt7eB9fpLmlroPM2IUb4s/CEj4gsQlGLjnUw/5Ewdwu+GFzwDG9mIFWKb7MyAiFuV/SxXamedCg5mg8d0f8sXvGQ30ILFWbld/xsIlaMq6LqevK0yuVPkMCymT84m1HycZr2TH0xwugzs7Vpb+m4I0pjzZbsQo3xZ+FG+LP+7zAs/r/MDaeFG97AAA/voAy1AGz/rTHlbNeivpza8AXld78f1yJpPIylAh9WHEEGa8TnH2WQK6hFItocZiEo0zWmj7Z4YdooqhZhEzlER6k9Wqo0rSeR+/6qOkZzIuTMOfVcsGDRd+u0Y5dviyg0vRj/RPHwhBEL2cucNHWNr5Hj0zsZ09tdhX0i1Pmqg+sTZ9jfiKym//h+s39+vf6+LerQARVz2tqefEkx8X/flQ+U0erqGRMXbQHbPfqSVYXAtyNDDtJdtD7+NGfX9vM6uc3x5zcwoUYovPW103nyDilEUjDYpP2MK/L1q3oLYbU8tbDC3I0MO2jvYkysS40mktbO8m25h/yyrewbKJPt4nuHhAJL6316KwZ+TJUasROtMigIbB4LJffs5zflChNmkXLB8uws7gB85SsEHBTs6IdSN9vUlnU4ldFLQpfiw0A5AneP6rVSqKRBKki9xvrXmG1fkJIQ/Neyt31qe9bge+q0wjG9b4g7vNTShimvkOXcDWHHXM0+l0q+omfpxBs6AuXhGHa3hKZm4hd07xVS7ZpTWsbTED0nJFo08wptWcCjgEw1RWJBO5niOW0jmHM0im9UjeM2RgPB2mgbDlEtKmhZiA2hYZFLueceqgKUU1C2foPCxLmqjgRCycN1vM5qKU0sX6ZItP4C9V1yrqvAjiBJMMifdYEVuL+4nG5RuY0kY5wo0OsKRoi2nb4EWjfSiWtQ8dorF+igb5SE8o2+5uM/6wiBugZeNa/ckzJLzhFwK2jwwD87JiLeh1gfP6nXM8TqZItRQ4Tvqu91ibxS1BgYTRoZbXgXxaph9z+FDJrKNlIfU8uxQrsUwd1smMBEy+q9iSZ53u+Q0Q6sLNdCuAHlOoUjroM6dfsQ+uXTAFHO+wQ6EiT0UkE5ZNJ/4UNk6Y0AUYQc1IvNZtDqeM1sl+CIDQ2XShLCY7jZHFcscwyDBOnLCaB0TmESfnn1Zqs6oV9/Db5xJHvNrWBFACLZ1Bo7BaZY+udMH7UT905z+dG5fM9Uc3fD38aQ+eLCZDpY9N44v4f9l3AQeg4vsFPSSlM3bAiAQt2YbLs3NARliOs6KKrSm7H1vajjira7nGZasPOsyeWEWoKu/MvRIiQjDxtnyZtdVkeKQnnSSRBSm7LOXVtXR2oBQJyMnZu9fAowqU3cv1r/nLVdZGBbhvekwlWtujAS6tfafL31/W5HcNsOe7Pqf8aytaDJx1oE2mQJ95JIkWNvzLt58xL4ClRTIl+MsZyt484i75CzOGug7d70h8nzc0WRfpSXFYQuFl2iQJENMlp6pbCyt9McaFefhEdBcMzwWDQ+8Q88FDxSH9ZEZdOccq0ZwzHq9iSxaPj1QRWOLQ6BVUZzNEa0REnz6a7weHnFzhJNWL0ULkgnR/uklhaszngkkenN+q5LBiKLGGiIYVi+vwWWQOKpUaS/x1CW4OTJNKgzH6Sx3FzKRpU/1Nb7QR8JOtfEPei3jhF4s/pBIBqMY45Vd5kWch7jXzShqHQeZsoYeBThAr6I5a6ORRIrzaCY0we6axNc6ajiyT8DJMzB1GuyCOERv87DkByHhhao7qXVHsIs9n76Z+63DKz3HcDb7zPoS2rJi65kYM14fpGyrcuyqISfjkHx3wG822zJDfp2rT1SIAYxjW7E1Chh87yvtFGCD28d01nUAncSBVW7KsIQ88MSSi8cIoTBiQ93A5pDi6zyy/mVG98w5SbQMAe0i3rdFT9t3xL/MEuUwjmzqfcvEJ1LSNBKgu/GxXszxjt0DXUVHw1HYYshbwVMTpaeQVKp8jpjx+90//ssxRF7msVJwLXIHjl25MS/vIkHeQWIbgbSg4ASz93bEKnhr8CJu/4tUoQIdEpvDl9z+UMK/kypp+meD5rp9S0kIGVEGjEpWCICHeKQxxRPSild1sWdLRyZqvXbqVS7ZoNcu/LxmCIiejlg/reeJXylHv38G5dNwG58id94hU96Zdn5tKjM9imJVS3ydeXwVkksc75nA8qeGgHVl331TjOonluSJTeVeG1ZtpfsrREhKFyItsgrYxNgSDwrEqrBbGe348oFiMpWgCeeslpcjE38htHXhv8k5/TkuZbsHh/cB4AuzhhfTQ33Va+86+o3ERMAVSplXyCUpeezAhQh+xleK8KC3yOlvS5/xIJMJV38mlQEA8Lf/zgDIrbgF1R79LFsarYD+k1FmXCWGrEG5e3+GbIo6Wb7YraicrTLYw7EY/6kU+EIOgjpqCl38hWrWf9nE7gVv3aCLo4ymt1DDuhQKgBbl/TVRRP1x6AMXVqPGzQoE1MsCuzlDfX2MtmYVJH8tqbxYXmU6XKi7o4Ll97bEMQYNSghZtcn6MFLkTR+RITeex3Xr/E1c5Sbr4bBxBkWucL/9zo5pl4qBPC8KKCdO2HtN84T/GgVQe44H1z3933cWrCOl6GFGvFFBR5/OU5wGTrk+iGJa4vLWH8RBtpKYyhEQAcvJ7zd99KvMDUNKbJ6aLVxbrdjM8yRIdrZE7NleoizP6VsAZ8sKDC/OYqlSAOIMudTOoiLdhWdmSMGxMk56cJ52y3ZG9oe+c4ZrhS/SKkqgWM8Y9eKXpUsnU+YbFnlaHSlRqrYSdar+ycz21wCwZG0qk6ZKiZP5UzX7zNZVkPZ7gRSGpMQEqPIK8U6Z5mvC6LsOnhK3bl1aGyl/9sP64nz67zGC1PXoV+5GPrVet7qLWDb4NNMl21Ueeh34k5tATdjuThmABANs3DYklG7ptQFcEFHRLD9udPRGcjGfVZ9qgzHCTixkO5805mwH/noX6yETW+fhp2jSfYgs9Byt3Pix1m4RxlG/wJGGf0K8lKmtmcdGKDjZd1bt+ldPyXlax0PMj/HxOmWq9+3OGT4j/reNljsXu2BX1tlIgcEJU0TgjcSul24DYPqDI+RPNmpK+57b7fUJ4KXqXyNwyDZ/AT+5SRd5OFvb64IBoPk5bEEYGz2iGVKgOoAY0n31mUpnUn+BujZzRwPKSgEljEmYJ9VO0ozK6KC9Oc4W778hz7cLrTAT6Fno6gHRU6S8s/gMBERJETUD8g47e37BhbFWp0gZQ1ZSFcGCTgvD4t1C7mm5tb9q3LnOdWNGNwA6bsQkIAk+/BSOy6pHiDBCTnbZetK2Dg65bxdBTl7IUUNQznd2EYkU672GwNm/l7whTKWl+X8NSeFqdEH8vIeW3GwD03+b42Dh6cFQ0sfQvvQZIoAKFa4xXbxbdbtMiPn8enMhlJUhHTkNQx+TJg8ejVMLGu6N4JojS1LYC0P5XtgChjKS9k5PFoMZFw+zLBhiAfrF6kYr9P5hCFdS1sVn3/CrK7MztYa/eHxbeaF32I4c/3ga6oRR3i2G5QsePD/12G5D6ra7RHG2ZWScOa5GDnPOpdMStHXpoSKG1O0ckNIKUoJLJYSKFbjHdvTPnoLi0a62WmKLc1ixGoryTsoPNty8ppdf0AX1rHs5DUPZgdTWV9PxcDvlddfdEqJOL0zkjx4ayGCMaC0OQAmVN4Lw85Swtv1RTrcTLg11THS02CKUw66w/7Bw/wvWk0aRZ/NqbCiomWfRSS3J3TcZsqX/5hc/xri3n/HeJJvkxeDfIBr+CCgINMeslj5Zu5nD/Ygdr3LT06dXwiAnnLdmWKckGLsLzX28zNJzOGYDwWSL7mNb5sgF9EjGFsViV6sammVbWvemWF25EtuVhI5xXy0d8F+2HLQr6g8d1cWO84WQFKbk6FyI2bUuNhjCP2w2Vu3ms630a5aou9jIkYa1NtYD1sBdz6PKEso4TIhYZZz3n8qL+8O7X9rr/uf2nwAVbntj77rDd3/Jqd1v/SVOrYlgIeuDT4aZSt2WfwtAxYlHUjK2dQTXu7X4LJF9zGt8jYBIf2d7vIz7sApW7VpbmkEZAG337bg9hfHjzUSX6xbDloV9QeO6uLHecLIClNydBnN281nW+jXLVF3sZEjDWptrAetgLufR5Qlnc//mBNVXbEBwYpmqsoqXnw0NRDENL836LRYV6KD8DNDT7zaV9v/ucMQUkGsmEs1ELGI7/wheGYXiZRrnsKCsBqsTT4i++QW/KfwFkd/hWp+R+DlbHgTG+i2NuJQebQm1pWx+lImLPWq3TcNsOqH0s5w16ohqVRrNNvy72SiXjduJ8mUxfZsY+POgooL1Cz7K957xvpElUSDSLOmQXCuG/sJrHijLPzaE2tK2g3PhnZQqQ18/AVXDQEy2WpPsczHUJI4LGp4RAZPHnHuIixpPtSru/6PINLVgcKrvr4E11Xj2OxVmTYvmBQeQFKPS67CoqPspEYhwOutHEAD8gYdWz+lVnlvSpj8GOJm9h+XSUd76jwRaM1gJPBVZLcbRYINKiQNAUQijWC4wT2eqsIjWed/uV3yQN5JS/GamUMh8EVR3Kw3yGZLTLTq5ELaAGaFx/HUKJzQTBl43FwvmOfWz0kC2BRx2GEYkRf4Lz3jy1bIGj6gmaeMxK7ARBPpxWVoJFZptxvQN8OqKSI4NOpDIdxOhNFNDI5nrRFeOw9QhX3b6+8yAyj6kh/h2uiEUvFnYM8WE3/TSR2+zmHbLlPCTPMn3kbIAlChHCTXSz+yrLmfzt8RICBtn7M2MunWYuxXE8uy2sYgjR6w8rjlyCIYHO97keHlGCvZhK/ui2sYhva43Mfr1SK/lU5vafMzxHC64t7yOlCzFaOku1Bzoc6Wibxc1l4idlx2JIS1VQbjlG/1jZwCWaQQj0F/xajEPVz0AU/xmdqStO/bTFQPGRTMYd58x9qN0CefJxAGY5Jt/IdIIKk+RhkBlHYnrRFeOw9RS0z5UuU9MFSdGTUFujk5bQUgThoYcX0X0p0/gYFzgSkubNX/O6Ot/CGKewniVIEqUJLyBP5wbllrp7GmbJ3VcJMaTqbvFjGBTtO9yPDyjKv+l0yMKPV0Qki+5cO1tbClZgQys208FV1pvwXyeUMuJC+ULruzdFqeD8cmQ1dH+MqTmRCqLBtVn+208CZerHC0/cqDwSgSKUs7uzC3iEHCrRvG3dqUHv+D/nNRxqIzXJbZuFeQPi5hNx+mksj9LqXFt6XGQYd6EvP+vLI41usNNDTL+tkHaWpZHGGNOCY5cOjHYNTByDe9/62+Z608GN/T9Yyu4j2xZniZMEZlDOM+B6I0XwFc0AYWHmh7tbks9Zg6oY8KGZKZGwfKJJSO7l7GAFHntBdxZoFEARTBCYAUx/sVB4AtGtQnjA0dFSJ3o8F4SCIP229KIC37AhpFWBfeNhR4aziMoiE8wMfjixyjEup8FkSUFObq9zcLB6GxSVYuiV7b0ss9HCQA1aTfx1bIc+dQjAXTcyNVCEnFC22Wz6c5nZck1ASmmJQ46GlzifdEb89KHYYAZPz/G27cSHbhyetiat67AlM6A1h8hw/Nx9OxH+XMPonEqVNOoHI2aq/2gRYaghTYLOEoTxF/R3Nl7d28USzkSS/hK2GUk5R8oPgEpojuTl32xBktpC2IaCOHgEGv3y8zhY0MA76ul3hSh5I1zZWyfids8JVcpWcdNQ9CiBxYOVpLxSd9sYXGauC7Zwvxm1S+phIEC482K3vndmrUwye0Vw8bl/X3X4wDhqbr7SS4BpCvB/6dmZfy4mjHZWo6d6w3LTkX/FrYM5HYWj/5k5Wjyp0K07Ry/4s8eatJVuaIr+3TztoFRysPnVksATnRUlgfkoXcz+aqoCGBbHJCwmlU1XOfqo2BLaWMgLzVNHlisnlQ4nINLLcDZW5GWuK+wAFfQInjT+KfWWwF4lUbkCaYWwUYASqkn2juTITn1Dr2IL8i4RrwenDRbXeUSba6Icasi2H+Y0Abd+WA8niCeogphYnIeJBZqTJ5Zn0xhWGEfqD8Zp8jdxvnSJ4JN6NnblqyEeOqE89VXR8hZV02kOBD/VYF8+SKn1jk4qOfA/K4Ij6IXcIcCAJeD2vAhRr3pHoDNUupYlxaKaN3ar2DPsfu+epr7eCeR2YDFo/+/2zqM+GcKua2lTLCl79ndJ/0l/5Hl23ilv46ctnf/Nhb3feTH9+k+2MXNP/PPVNeDFSnTLWluVtl+gOotu6nSSpR4WzA/ELr55OWm/R+CHsfnETRPbNjiBIzTOwEmU+guHqd03YDIXoeCX831/igysH7Y5m4SOJ+Rv8kocHiwNp2uHnDr7Bg4AsZ9wwsZvY6jqgoIbMfXcyRUsaOLpIeMqVmiBFlLJkke3AOTNOM03qZsLQKMlvnwfCjjhIQQA+4HDtFqRVxb6UfSzE4kaNzxORItNBF3ZHL26VigUTtgnE2jFkdRh5hbdhIfCuZgwWs7qjGYfRX5JPaohu1cNTDbhQBBuJhmTN3AHXkKDO1CC5/Sw6E4wKtHHpl3kkTtjn+xTakgTzRBeAhL4/9GRqouFw+ILa/Q8ErVHOkW9/t6U+SFkGyqQFqsRNuypVxHpeU2QH71zwL3Z5/HTBEjyHHrj633S74l5VhZccMD6QiythsRl+T402zJZHgVWkzMmtJwPPjotxfwi64/4pLbBcYjuXGw3Ue3Udl50Yb3wSTNMIlV6qnFUYUEHwOpQmwcpQwaAmsQlRufGNdTvuotYHzQsAcP2R48Fd1gaB6QQAkVs06WT7uW2/MnoN41gdu4cerxzwIRyUiNvdkBtnbE1EM29+CM5s4QMExU9HL2HaRTptUroioghWu3Q17j+y6sscay/pHzx1767kpIV2CQR8k8LVl04A0K0jk547/9drjjJD/sXoervHdOnLLxNhKMQA0NGkB0mch2wUWDIb6oRFsbUD5op4ozTTDJ5RUBLbJeUyFFxA7KAC06LCuY8omg1b8DTEXYMrJfTPGyaj0pD99TSEsGkmkbZOfQVxqKW2W3oGCq5jolcBtJz6mQP/cwpegfe1Cv3uVWDvHJCTJiuO/rJ82lcNlaTo6+gngu8odA8GQsKmoU6psuS1fwJmOzgq1jm1pHrHCGMWW/kfy6M+SkdeR2nhC6RLXFoNYEQUf5+uRkMFF1Y9xlrkYlXAqTm41oSwkobRO/jcNP8c0ZBPlG/G5GSNWxbJyvsxrbFvKrQ7MNU3Ns8J/RkfR6eVCwcEODQiNlWH1nDd27sF7pULMEJfz1oHNmaqIb/01u1jPT9+eIPKsaBu08gJ5j0O/k27m4GY6DmvMVsHMYcNLO/QH9b3uzor0f/VF39q5lW1hfhLVeSQS1GYcjgdhva8aWn//Xv+rMynK9z+tCB5NcEi5OnoV/cO3okLwAWixmaQMJAEBzeq7VjyQGmq/Kn6HC9lWibNfSZz9YkBrK0+DI/R0mQOeJ7z/QMAbDdX17UoOYL4QQfRWqhE5OjvMVVl6t6maS735SsOi1oZbiLt60AZE/PFsUj4Ajg2ZEg60yttkTnHEhJ0Le6AesLoydlraGe1wGRwTvb7lAj3+pdWsozHYGAFwuOUCKRInaqBrTEUXWbThgc+6ZYWoCVoNx5LK0Fedn5GfkuRb/oBPWqJGBX8ZQjJG0IVnocte2Tvwe+iR7zgXX2IuW453Sy4GfFl1h1TFS0pKiJ0yEvbk+jRhWCsEAPpGCF3mlEfRDLaECx0wLrAQJHlOseU8nYpnpXnHAk75WfrpRvNwvKfs25Rt4xsVHO0EHZmCG8KQ39smCOuOJOMvhE92eJ0Q+ns7OLaHtJ/+NkjgEOgvEwF2nRV5xY7/Ju5YKO8vmRNNNUpdfCUHpKIxM7ukJUff8LjrjkINSkzKr+ZKbxWuTBcM6zIqHHDfp+HBLlAWI2D2TcpMqCjJCGU9Qd9KyPi6B+Qpab8ho0ZHGboj3Wzj3q+VxXEQknXVnOJ16BUMm8+J2abAzRE3kCdafOhELAdmt6aQea8lrADkKLqFauPnw2zSsAR5l6N4+yvd5jrexDh8A9OsENZsh/ogz5/ifu9TYzbALWhLj0aAPGGz9IWawme99GbYCB3YPdURXIlQohWJW5tVMS47i5X4DgBw1Tm0Qxg4pIpmCtiBMieBf1lUlOCLPLkkhYc8oXHp7Xd/t/vhibVAhZRB1GLSIAwj8bH5iH/GkmPSR5tyfucwVwCPJzyFVDdjwFGLppPcFc+JI3QMj9NMnGgP7gZimMQ0sr1q8MoyGVSDBIDjoh8JhREYrOVfop8Y4zC90hWKXRCx6hBoH8Xd+L4yeJQQxM8F5v3kpL9G0gSFM6KesZ1UB1GR28S7JBC2yI7BeMyIOwbWHBHkui0WBf6b/pAqwlJPCZUaUW9wW3yxiuojTvJXYR6ENG8sQ9O6RWkT2X2sEkbAivIbtWXmIbP8bFcrzSLTW+IP/orgRpSKWHG87aG7UOXmAcfum/6674ATSUyQNVplRayfb6bsMMhdBFZ2ii7l3LNy/NVVEVIV3IQLPeLi2uiGL3XrESkU0CuyNWVAOK7sZKeC5lCNBxeC4gHkUtSna0tsllZqh4ZeIjHn3Q1MyDialZXQT69iZJBIcYP07HOrqCAOH7qzbB7X+2Qk+yoNmmiwi/2BzRLEKBwJ12Ex75ErSCvtiLJA2JTMa8Slk9LuSp/yHyOVQ4KbWIBWitFdhMZYAtcXo5LGsi5VoXZIf3mc9Zo5KoFYarLFEA3C2IUQbKDFZAxMelePJYPLyfw+z10ONnwniCIjz1OPnMfehQasjb9V049BPE9HKfxIVZpDIR0CYBb79lCE+Bign+B2XDdsxAO1/KVbjUW5kZX4ri2csvT7RnGWiwR/0HBS4o0w5nJHIschz8tEIulHB7/qDD90fvw2nOifSCpE7Z7RNd+vLHKf7nm8XFdZ4q8W8zfjzi39iomntvExjfq1RBKlL85ZgHV85dilOfc+MscjF0VnOWNwSOUAp87lIFmZCgTVL1HQRt/7BiqtB05L0c2CXCWN+7NxEtDofzJmC/8e+jTl/83y6OTollCqF09vYriS01KX6/BVxZHcAV82rMQuDXdaR12bqFLwA81Y/f+Z5M9i0cvKiyuI42K5w3Nmg6+FQojz8lzQbE46f6bK/IZPQlqR1R7Ovfsn8zA+gZfJBs6Mj6IosQUaNQUPXRD80h7vE51Y+ItNne7PKMcgW0pNxflWjKCuzyay3+1QD2cnbDmmDZ5RDllOS1Km8q/f9gn+Wte40bbyLsAXpNeC1XcysVK8ECbY3M0r4wBSUbcRmuj0Jtn05i7Xhs9tIZfx6uYyOh5JpHWe3k1D3t5fPYUPcPf4k9KmBNP0YRZ+t+ZCM3WOOkyAN4v+76LJ350YPqcg0w0/WJqr/XW762vJ/+1uu5ShjMMi0dOeSUSaEFxPLMyJc+XbiZuhcOJhcxLeaa1/tCdywuKXKqz/22Hz25SZiodZ6vIihSftSfnTw/PaqGYUx/BRGAcUTqqjW/bWn+OZInBQtStmLM660lkT/c7uj9wDHQT9dMaM0+9kgS5WoN0Hmm0Oipy/HZloigl6bD7XgoUCb8eShFrPPOiMsHJZ8wxIFAGu942SVT+ys/89PkejN0IUCgBRd46B1AH7Wl9dAkQSuNT3YVDQaBk9Ggbcoo/E2PDE3RA3t7jDyIQKjxsy/MwlX4GudQeMyDZQajn5kB45JGjZtUc3bSvBPkmqQN9bSzZTCvmRaXxCM4C5YNY64utToSBuEvsuA7proFspJpmEwkaTd1z1DfpE9bc4lONY1So30Sd9HfQougvCyD4XG14QWeklFfyGnAnEXXnoD6IQQgRYJW6/lkLFxJxb+YnJsi+LcJUoyoPBN/96rSwmbBA+fvTABwd2jEqjpqGI4NxBPVUSh3vpL0Pft1yGmL7BnSx3SpQXq4rlpQRrNPormXot7S3Mx17jqD+IQDZ83xOJ2Tlmt6ULBcjEd7Mo93vJlEGKO0E8dlFNuSdbhc1uR1ma5pXLZNB7zcj/7swmUw8aoGAxexwLnLMeqtJQpwX46npdmkKZOMxs0LPxiAOoJJx24/78vbdZkkswmgFGtLm3l1/Xej64Sp9ahNb1JxVd6BmZzCD3aY2yJAHARMkkuGaEDH50bPq2qKDdfH+liu4y2zTvbzJ6Mbb/93FuOorJtHh1LyhslAfJJKcZKXeWWtNtAkfnQPGPrMy5bue72CsnssPfYNMXLRrk45tEdkug2PMECLKmhm+FHAL/r1mcYD1CTy8vvQ4adkwRgaBqagykAKEzvfWnuIH8aYeyFrxdTlGji6IPeCIsHIs45/RmDtYhI6VXQUU3Pgd9I6n6sS8qE5XzBfmJN3O8IBFNiqLInHDjGjg4Ta6qytDkxS2J520l8Pun6Ewtd++8p8nUx2tJ2jtSyJ7rPh7RIuWgyLLhq+GMTf2Tm/5kHytepG1+my20/f1pTFZzfLoh5ZxN7Qk3eeL2tB7Pvf1EkW4/8ma/B/QwGmgSFKDZSeUDQVihlFKJRnjiAqoxh3v7Tt/3uyjsWuXxYgC6lwB7AoSW7WWIksvzAYpjhxXznV5TgcNmNj0KpQU2dIFfvgotizKMLVlso4xSaqCSrD/ESTiDYtFzbgcnbciJJXiYPFCOv3rOcxZNSSlueLTJRwxiBGdw5q2jr0DSMl+B0YFlEDkH1PELmmNti8wrDMuYeXx+/nMKTHSv2Pto767zAq3MZueyUW0FTeO3jcWyrwku5+27spEnYOji3JnxKYIETbMlO2Njv2rPODFiOUrzmPbePtTuQkgdWCvH/nlAzDs6LVLqjtgcPJ6PpmINqiWUAHLokILhDHegJZaa+oCfD7xCTk5MnovzFTnc4fMHp6z3iB3Z3sISumCFbZcKcqC1diVqQ3anJzzCQdzhRTipaFvBTyZixOFvGqQ4XILycJMZY5DqnsKG8PCkChvtMpj6rVYl2VIMi73M4xFd4QKwmOqTCL/t86LV8iAcevVHbuUC2mUFse9EP8F57x0qPqoAp6gWtLYWc18r8H1lzC8w/fPIXblrc0B0U+LKAgnKAAFB/uRyVbFqmlyBUrgI69VI871lUGnjp2g0CbFkvjgRmUOM0dJASXxYzdsppWyRklo40kxcmmKg5JvXSzl61Si1x/7DU4pHpDPNy5jFAofCrEvbrrRHCDnipgFArm8BXLnxbwQJlBCTwmP42+tql54xlPRAsSekQft7tZw4D0S0CgmRjWOLgtzomIQxWYWIMSmLW9UM31AOsq2hWi+YpSSvLbw855lE70U34Rd18CaPN6BZqUCDxnxGEwBNDABdM0zDKVeTAwjoI2/+r+DYnEQg5vMLPB/5H/rVA/eDwfS+mzGY7qQxRdckCv3XcPgFEZb2/4U5zBk75z45SoP7K0bPHJAm3YuHQ/Sg6NLOZZafbAr+7dnR67I2drLTZ9qZAFYJ8s0Wvd6Ds3XSHzPg4a5RXhf0Cdgi3tfU2ChxfG6Y6VrvdVlVjY4KjK8tVSsjyGn6BcB7Eo5n8Tv40jurjS83pHFXKXAVdkYKFMMlrW0kMeUJJWHB2X9bXPDu1hfM9uksAICYAVJ0oVsgHljKo8gfx+pie0aOUgegGE/MnU7QzuuImS3OpCWPcbwyUQ9wFFn5GGuGBz3+mAeTXTfVeHKgv1nZOqHnd/ghhI6OoeUbDl/kAfsECRkxKqSSwBKPEZnfNhRER2uPrlpbq9LNkD6HQCLjHdlBSBREJZH0yF8iMy9W4m7FEhEejGwtUHwct9dD8HeXfBd+xmjRvfoC50L+UwskYHWiRAhvm4wqN9wpkt/ggqRLF/AKY9xd5X13bj085KLQ7WTdBo6p1YjyVf7RH+UnpYqoGTwAdrYxzgH32jffMkkzjySTPrV+W6VC0dmECOHaYyFNomQB+HfdhzzTCdPkl8Nl02pwvYk521xnwKzGBQ2gAAAA==)

this is quite confusing to me

## Assistant:

> 8/8/2026 19:42:50

Your diagram is wrong. Let me correct it:

`if (!p || !q) return false` triggers when **at least one is null**:

```
p = null, q = null   → FALSE (|| is false, condition doesn't trigger)
p = null, q = NODE   → TRUE  (!p is true → return false)
p = NODE, q = null   → TRUE  (!q is true → return false)
p = NODE, q = NODE   → FALSE (both truthy, condition doesn't trigger)
```

But `p = null, q = null` is already handled by the line **before** it:
```typescript
if (!p && !q) return true;  // catches both null first
```

So by the time we reach `if (!p || !q)`, we already know they're not **both** null. So it only fires when **exactly one** is null → trees differ → `false`.

Think of it as two guards in order:
```
Guard 1: both null?  → true  (same)
Guard 2: one null?   → false (different)
Guard 3: values differ? → false (different)
// survived all guards → recurse
```

## User:

> 8/8/2026 19:50:40

![1786198730176_image.png](data:image/webp;base64,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)

in one is null  and one is not  null, then || should return true right as
TRUE || FALSE = TRUE
FALSE || TRUE = TRUE 
FALSE || FASLE = FALSE 
TRUE || TRUE = TRUE

where am i getting confused

## Assistant:

> 8/8/2026 19:50:45

You're confusing two things: the `||` result vs what the `if` condition does with it.

```
if (!p || !q) return false
```

When `p = null, q = NODE`:
- `!p` = `!null` = `true`
- `!q` = `!NODE` = `false`
- `true || false` = `true`
- `if(true)` → **condition triggers** → `return false`

The `||` evaluates to `true` ✓ — you're right. And because it's `true`, the `if` block executes and returns `false`.

You were confusing **the result of `||`** (which is `true`) with **the value returned** (which is `false`).

```
||  result = true  → if block runs → returns false
||  result = false → if block skips → continues
```

The `||` tells you IF the condition triggers. The `return false` is WHAT happens when it triggers. Two separate things.

## User:

> 8/8/2026 19:51:45

oh fuck , sorry , i am so dumb ,i think i have overused my brain today

## Assistant:

> 8/8/2026 19:51:47

Not dumb at all — you've done a lot today. Invert Binary Tree, Max Depth, Diameter, Balanced Binary Tree, Same Tree — that's solid progress in one session.

Take a break. Come back fresh tomorrow for Subtree of Another Tree.

## User:

> 8/8/2026 20:22:46

ok , what is next question

## Assistant:

> 8/8/2026 20:22:47

**Subtree of Another Tree** — try it yourself first.

Hint: you already wrote `isSameTree`. Use it here.

## User:

> 8/8/2026 22:36:22

Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values of` subRoot` and `false` otherwise.
A subtree of a binary tree `tree` is a tree that consists of a node in `tree` and all of this node's descendants. The tree `tree` could also be considered as a subtree of itself.

does i have to compare values only ?

## Assistant:

> 8/8/2026 22:36:24

No — you have to compare the **entire structure and values** of the subtree, not just one node's value.

Which is exactly why `isSameTree` is useful here — at every node of `root`, check if the tree rooted at that node is the same as `subRoot`. Try coding it.

## User:

> 8/8/2026 23:22:17

```typescript
function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  // Both are null return true 
  if(!root && !subRoot) return true
  // If one is null and one is not null 
  if(!root || !subRoot) return false
  // If value is not same , we return false 
  if(root.val !== subRoot.val) return false
  // main thing i am missing is how to check if we reached the root of subRoot
  isSubtree(root.left , subRoot.left) && isSubtree(root.right , subRoot.right)
};

can you give me a hint , and until here am i correct, i find this very similar to isSameTree question
```

## Assistant:

> 8/8/2026 23:22:20

You're thinking about it wrong — you're comparing `subRoot` with every node of `root`, not traversing both trees simultaneously like `isSameTree`.

The logic should be:

At every node of `root`, ask: **is the tree rooted here the same as `subRoot`?**

```
isSubtree(root, subRoot) =
  isSameTree(root, subRoot)   ← check current node
  OR
  isSubtree(root.left, subRoot)   ← check left subtree
  OR
  isSubtree(root.right, subRoot)  ← check right subtree
```

You already have `isSameTree` — just call it. Try rewriting with this structure.

## User:

> 8/8/2026 23:31:58

Please give me solution

## Assistant:

> 8/8/2026 23:32:02

```typescript
function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!root) return false;
  if (isSameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;
  if (!p || !q) return false;
  if (p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

Three lines of logic:

1. `if (!root) return false` — exhausted all nodes, subRoot not found
2. `if (isSameTree(root, subRoot)) return true` — found a match at current node
3. `return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot)` — not here, check left and right subtrees

The key mistake you were making: `subRoot` never changes — you always compare the full `subRoot` against whatever node you're currently at in `root`. You don't traverse `subRoot` at all in `isSubtree`.

## User:

> 8/9/2026 12:41:16

ok, what is next question

## Assistant:

> 8/9/2026 12:41:17

**Symmetric Tree** (LC 101) — try it yourself first.

Hint: it's very similar to `isSameTree`, but instead of comparing `left` with `left` and `right` with `right`, you compare `left` with `right` and `right` with `left`.

## User:

> 8/9/2026 18:06:04

```typescript
function isSymmetric(root: TreeNode | null): boolean {
  if(!root) return true 
  //invert the left half or right half 
  invertTree(root.left)
  return isSameTree(root.left , root.right)
};

function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null
  //recurse full left and then right 
  function dfs(node: TreeNode | null) {
    if (!node) return
    dfs(node.left)
    dfs(node.right)
    const temp = node.left
    node.left = node.right
    node.right = temp
  }
  dfs(root)
  return root
}

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    if (!p && !q) return true
    if (!p || !q) return false
    if (p.val !== q.val) return false
    return isSameTree(p.left , q.left) && isSameTree(p.right, q.right);
};

is this correct
```

## Assistant:

> 8/9/2026 18:06:09

Clever approach and it works, but there's a cleaner way without needing `invertTree` at all — just a single recursive function:

```typescript
function isSymmetric(root: TreeNode | null): boolean {
  function isMirror(left: TreeNode | null, right: TreeNode | null): boolean {
    if (!left && !right) return true;
    if (!left || !right) return false;
    return left.val === right.val
      && isMirror(left.left, right.right)
      && isMirror(left.right, right.left);
  }
  return isMirror(root?.left ?? null, root?.right ?? null);
}
```

Your approach works but has a subtle issue — you're **mutating** the original tree by inverting `root.left`. If the problem expects the tree to remain unchanged after the call, that's a bug.

The `isMirror` approach avoids mutation entirely — it just compares outer pairs (`left.left` vs `right.right`) and inner pairs (`left.right` vs `right.left`) simultaneously.

## User:

> 8/9/2026 18:14:14

which is next question

## Assistant:

> 8/9/2026 18:14:15

**Path Sum** (LC 112) — try it yourself first.

Given a root and a `targetSum`, return `true` if there exists a path from root to leaf that sums to `targetSum`.

## User:

> 8/9/2026 20:04:46

```typescript

function hasPathSum(root: TreeNode | null, targetSum: number, sum: number = 0): boolean {
  if (!root) return false
  if (sum === targetSum) return true
  sum += root.val
  hasPathSum(root.left, targetSum, sum)
  sum -= root.val
  hasPathSum(root.right, targetSum, sum)
  sum -= root.val
};

Please give me a hint
```

## Assistant:

> 8/9/2026 20:04:50

Two issues:

1. You're checking `sum === targetSum` **before** adding `root.val` — check it after, and only at a **leaf node** (node with no children).

2. You're not returning the result of the recursive calls — `hasPathSum(root.left...)` and `hasPathSum(root.right...)` return booleans but you're discarding them.

Simpler approach — subtract from `targetSum` instead of tracking `sum`:

```typescript
// at each node: targetSum -= root.val
// at leaf: if targetSum === 0 → found path
```

Try rewriting with this idea.

## User:

> 8/9/2026 20:20:57

give solution

## Assistant:

> 8/9/2026 20:21:01

```typescript
function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (!root) return false;
  targetSum -= root.val;
  if (!root.left && !root.right) return targetSum === 0;
  return hasPathSum(root.left, targetSum) || hasPathSum(root.right, targetSum);
}
```

Three lines of logic:

1. `if (!root) return false` — null node, no path
2. `if (!root.left && !root.right) return targetSum === 0` — leaf node, check if remaining sum is 0
3. `return hasPathSum(left) || hasPathSum(right)` — not a leaf, check both subtrees

The subtraction trick is cleaner than tracking a running sum — by the time you hit a leaf, `targetSum` should be exactly `0` if the path is valid.

## User:

> 8/9/2026 20:21:12

can you use sum variable instead

## Assistant:

> 8/9/2026 20:21:14

```typescript
function hasPathSum(root: TreeNode | null, targetSum: number, sum: number = 0): boolean {
  if (!root) return false;
  sum += root.val;
  if (!root.left && !root.right) return sum === targetSum;
  return hasPathSum(root.left, targetSum, sum) || hasPathSum(root.right, targetSum, sum);
}
```

Two fixes from your original:
1. Check `sum === targetSum` only at **leaf node** (`!root.left && !root.right`)
2. **Return** the recursive calls — `return ... || ...`

No need for `sum -= root.val` either — since `sum` is a primitive, it's passed by value. Each recursive call gets its own copy, so backtracking is automatic.

## User:

> 8/9/2026 22:46:18

why 
return hasPathSum(root.left, targetSum, sum) || hasPathSum(root.right, targetSum, sum); 

we using || here

## Assistant:

> 8/9/2026 22:46:20

Because we're looking for **any** path that works — left OR right subtree.

If left subtree has a valid path → return `true`, no need to check right.
If left subtree has no valid path → check right subtree.

If you used `&&`, both left AND right would need a valid path — that's wrong, you only need one.

Think of it as: "did I find a valid path anywhere in this tree?" — that's an OR question, not an AND question.

## User:

> 8/10/2026 11:23:02

which is the next question

## Assistant:

> 8/10/2026 11:23:03

**Count Complete Tree Nodes** (LC 222) — try it yourself first.

## User:

> 8/10/2026 11:23:23

this is medium

## Assistant:

> 8/10/2026 11:23:25

It's marked Medium on LC but it's actually straightforward for now — just count all nodes recursively.

Simple approach:
```typescript
// count = 1 (current node) + count(left) + count(right)
```

Try it.

## User:

> 8/10/2026 11:49:16

```typescript
function countNodes(root: TreeNode | null , result : number[]=[]): number {
    if(!root) return 0
    return 1 + countNodes(root.left) + countNodes(root.right)
};
```

## Assistant:

> 8/10/2026 11:49:17

Perfect. Correct and clean. ✓

The `result: number[] = []` parameter is unused — remove it. Otherwise the solution is optimal for a simple recursive count.

Next: **Lowest Common Ancestor of a Binary Search Tree**.

## User:

> 8/10/2026 11:49:32

![1786342769417_image.png](data:image/webp;base64,UklGRuaeAABXRUJQVlA4INqeAAAQqwOdASqAA0gFPm02mEkkIqKhIlFpGIANiWdu/mQ/wGS7fgwHX6DW0/XuRQfBMByXwPSYIA5QNoC/CfMA4+n5V6Bv4R/Dv+12AHkAevdRP0GRrfB2nl/c6+d76vbt2n5u3RH6S9sX/N9Uv9u9Qn+v/338kPbX/cj3Q/47/q+oL9kf2091j/m/tV/1vh3/aP95+3P/O+QD+pf5D/7e1//5P//7o/+F/8P///7/wJ/1H/W//v15f3X/8/ytf3L/s/vD8D/7bf///pe4B///bN/gH/562/yr+hf23+0ft1+f/2R+e/tv/C/vf+X/4vnr+b/Yv8n/Efur6/X/P3zPT/5T/y/6D1F/mv3+/l/3/2vfv//V/xvi38i/97/J+wL+df1f/k/3byWfsd/pe9i2j/U/+//PewL7PfZP/H/lvTf+k/93+q9Sv1z/O+wD/Rf8P6b/93wp/yn/d/cj4Cf7H/vPVx/1P/5/wfSF9jewj+yfXX9Ieaf0i0F2+i5XJGX60qvFPqKhCW5mYUjZWBPUim5qKit3RxgrNQlhg/8SSQV4z2Unq8CIKY5bnFllbZ+RkSQEfcLuyoZ5JIz/Bj/zobvTeau53fn5UCZXz7s8WK/8jMvnuA9Iz38Lc6brHuADUiiwCyu4DwfhHob+q5gXvmgkQyT8RKrQIctuZN0zFq8f96tlhMj2cnh1U3UErvlJFRU5V9o5sB/t5ZhPtZoq0YL7WVsTv9sEemhZpAiusUV1IWuUtulcan/7QkjKZ52w7TmkVr/zeF6wNQ/95V5LYMSnVv+vhQtSbIGuUwgI8nxRzukvwREOChaHGT1TPnr1KHi1m4u0wq3+P1p71Jdj0FoUAj6PtkbOeb6GGYJKhG7ZFj3sVaMIadyio4e1+UYOk3efUOMD9bCk/RV+6isK8ReRIj4G3jWLS0dTdm7K7/77fKaDSAd8MmExudC8kC1MVXj6Sbv9qv/vIDLXa7FY/I1V+Y+MBfSMQA1Epeepv1lkDu59ivQXYGDJxv6ICWFT6qdoQDQ+K+7wk4XR+v4Ea3NANl0ImKWv9bHc7Q6GH0rxaC/Kc+pu+vly8a1VTeP0qMUDiwHy6qcckBPf3CADHuk6Yk9ET6GLYpUr6DeFDvSyORFyFCzNJP15DO8pxddvfInvbCgQQ/jb7w5xiCs+cRETnhr4g/KhVMBo2tYRjdkYC/TGLo0PkGwouxThz2dSFHTBwOiKVcGAiIIqZxgqXAaPp9iv/eFC7rpGDyizwF6qe57ugw7zJFxItKB2vA6igN3GSbF2YNKn7Y1/qXMevJpMrXk06MAsrXt8zHryiZj2x3ryaTLiYjLTpxWeE5I0cwreX6SRKAXTg1ALpwagF04NQC6cGoBdODUAunBqAXTgzVTpwafYUMqh3nnlV7AeGmjh9lBGW9oG4FrPHv9IF574NjcsFSvSMEDUGcdZ1ix9bkruhUOabe24tf8iH/5Qkch7a4JwbpX9C9RBcHYpZbifGsNxsQVbl9P7VGHV5mbAWtw2jIC52jacrqP0qrjYVbHSquNhVsdKq42FWxy7ENIBWOm+M4sgfz4w1H8jVlAUfRZQrW6n2dy/aTcB2rrq6D7JmqN1Nii6vtnWGWAtvtAg1vEqwZwjnPX9KvdrL0YB/xNaiFqiOUFXxaqI5QVfFqojlBV8WpuYhDMz+f51A5K68tQGQwNljz6VcTK9KhZlelXEyvSriZXpVxMr0q4mV6VcTK9Ktx/5lshaqI5QVfFqojlBV8WqiOUFXxaqI5QVfFqdz/dsT474PYNJRPZgGewoyd5vS3BVS6p0gYd7omMiq/dt/PL1aK0mYLYMvn0+paFkyWqiOUFXxaqI5QVfFqohxZsFJXDND9rLvm0nOdtV5+1YQEn5U/FqXw9sGgJiNmic1KxsQGVxFx6tw8DEqOC+/h2WGL/qjwqJbZ4ZWjd7VOPmHXoGDuOlUhJdwg8VIvLUT42iKBleo1vMQA0IAZcB7b+Gji6rgP/e8iKI8V9DhkXWuL+MV45CWEOiPBFdX1Ke5oRoUPAawsDsWeOAgF3DpATuorg7Krar8BO1wXlYZSrDMabuiVKRpqojlBV8WqiOUFXyBRl3D854Maa5kFw+o2tkvJLHYlBvKLXhizYwwIcOFNs+uFMkL7fXMfEvgIrPzg/qnVMUtReiId80aOZoFMLjYA8dE95D9rdgCVmhA5L9jTxffl1zx+mBuYbvNL2DL2/KChCehBMzPe2ANIPPT/9e7guNxTye8DjGMkJGmqiOUFXxaqI5QVfFobjpbcm8pIvkg0dYVHlWXEyu945j3/BlSkaaqI5QVfFqojlBV8WqiIaK1HYowEm1BGDKlI01URygq+LVRHKCr4tVEcoKvi1URygq+Lkn2zzBpKGvRWXIWrcSZ0XhlatRUBb52n1lj3U5CRATgF89dZOJl8Dw6JHedNaObjfBTm3BbmF+70TN6rY6VVxsKtjpVXGwq2OlSx40RK/RrMBjKTtMldMeezrsmRbrmSjNF2EU1bjKTQIIgL687fNushM6bn4tSxXR0oAEBeh0Bi0km1fgCMqyS4K5NVVnjp8wivalGfrJOPfZn/ZhxOT9KfF9LMvYsCFsmXA22h7H9LkFFNU1OItGFRogBR17t5Rx/F0EXh+X8z57mfgllnz+fRPSquNhVsdKq42FWx0qrjJpHTQQuSETbdP6+mjnDLc/Wae4XuD2LLAbEAORQFcGoJvSHDdL/1LC2u1pJr9I0zNMfiJNT6aqI5QVfFqojlBV8WqiOUFXxaqI5QVfJWfYMsMz6YcsbAxL8FO2IGHbEDDtiBh2xAw7YgYdsQMO2IGHbEDDtiBh2xAw7YgYdsQMO2IGHbEDDtiBhya5vbBLBV8WqiOUFXxaqI5QVfFqojlBV8WqiOT/uvgCtkl50KpPAvTCXLuHNpP2m6SoA09AparQpYVU6VgnYp9ISh3GqvMN5gmqF4xl/Wridy52/wxkm6h+L7ujl06zZe2vO5kekghL1wkMxQyAB++HmIPRgzpB5R//arMCciZ8x+7cEyN/cD0Wk/ITDnQjFpy1GKx3qC2oV6sfKJiMlGl/lw4aSO1R3xi5G7X15MxIbd1VOgigEHzdIbiaPGBDNL7AD7/A45nGQzciUyP8P9mQ0QOhSTenJw0sRpU3gOb6p8LiREFM4BWneHeJm/tAffD1UIaL9TC9sEjSozosmVsJFMMrlgMXX6Vmmq2xB46X/beSVRjQeyfOapK9xQafPybnFH48Y9s4S2OoiG9mbW7Bl5wP4sB4TUUGkrC5ndleFFkYNcCF7Ra6Axh/Ouhslcp/8EgE3MAqVqysbRed3LZVqVigSorNBCWf/JlcTYgtKOqjPFKSPXVgzg1LmD5UujsEdL9N0LTEXxLMbxDCgV/lJoIeJSRzaV2rNlGu8Hdb77LIc2Bk3/mDnqK8OvPBOjM4dDaoQLi0Ze708lX5pF12GMkqFG+WB9ELj9qvyb2FTEBJ20bzkbQ/dCxoLuZ3XvoANk4FDowVzPTuemem4I4nXYI2IGcdVMePjDkeFOFj1jtapJQDGSQKczUuYa3KkHUcnd+ZuveCJKRmhwTdAk7+d7OwOfGpfV2TcKiDLJbfiIKJhmMn65gEc4fmioaz6dfJUgsxievYuxl79M05RopbAiIfmzqdP3/BIBjSNbM0IIkmTTg5+f2NEnWtQrG5+OdWdGWHVKv+pJ88c+d+/WcQWEnBHz2Ic4f3gIO09GIpL9pNEXlPbJmCquHG4dlzq4Yg17/x8zwTQz/+12ZUqWUY85hdOprfMXDCclDdCDWykx2bJb2SokXtvBcpHTnnmnvpzfVJUtNi8m2/ldJJ5x3ba9YUw+4jjh/0xvu4oK1BoVv93TOb6o+vHl/sdTLwbntvNSaiTicywVSbWhtaztOPe3JDA2bVQMDZPxJwR70WgJVnC1ED5CYnFXQ/scgSkVUFT1LeAGi3swreQEwMysbXUV+QDdW97zuawVy8y+3CGj0WP6B4jmIUrPt8gACeZigFOCiEoc0yWwKcOo7BhVwSKxi18HP/8AciK9tG0ha9wifKhFuMRKINUxnuy01hsB/goh623evrhd4yyOJOHVGPP2hSl1k55RGQCIUbZxAANM6LEA5vMuBjs06wcrIcRFYa0/lMQ0Og/c40uZ4oRsNgIJ6YHqUHEgZGtagiuGffBeMzzMBFD/U2C/LuiTAABHqKmDHezzfAgKLZ2ozh4ILkrGj0o+w3w7MHVA8EISg2318MD7v2X8uzsbbk9en8Vz7BlbBvBo2Xo+mJPN9NVEhoBarn99S6gHmVkxiwW7MAgOvuFpqojlBV8WqiOUFXxaqI5QVfFqojlBV8XPjAs2ExXPsGVKRpqojlBV8WqiOUFXxaqI5QVfFqoj7b+j/Ox+AGZI63zMkdb5mSOt8zJHW+ZkjrfMyR1vmZI63zMiqM2c8itrkiUHMPpjmH0xzD6Y5h9Mcw+mOYfTHMPpjmH0xzD6Y5h9Mcw+mOYfTHMPpjmH0xzD6Y0dukX01URygq+LVRHKCr4tVEcoKvi1URygq+LVRHKJ/dDLBAk9oqla484M7zRTQ3C9Q9UM28wN5Ppx1A0jEuHBe2kRb5xaPgcke+KhibLmZw7OiGVCvv/dy2dJyC4q8FkHH9q50EPPb5KydX33rWXrhcdmmq92ETCRRlSkaaqI5QVfFqojlBV8WqiOUFaoEylmwEE9sbYcgXKY8Mq+1yHQPY8AElYRLyZWd1vngH11Pf5o3oYRWIv+6Gmdx+cxhQnhbuB9Da2800DaSMypwM9lARapKJXT7BlSkaaqI5QVfFqojlBV8WqiPewVJ/xuaF9wqdDgzVOhwagF04NQC6cGoBdODUAunBqAXTg0/Tzjpi5BQauFI01URygq+LVRHKCr4tVEcoKvi1URygq+LWnFXzefpuxsG6AaTc1YFG1WCLZO2GI+zexuNhVsdKq42FWx0qrjYVbHSquNhVsdN6mrcQDbO8PB/VA514sN7CoFfBOy2aUOUMfqhmbV3aJAMQOlVcbCrY6VVxsKtjpVXGwq2OlVcbDb04QfEXT0uiMVmsS9FfI1BuKPKCOVXxGvwziQRuZrApt6QnnAzmUUK55YDwhMmhLVMvmYHcOYqG/ZXNc7BjaRQd5sAofOh9xgpJYyyj9NC66avoQnesXb4ztgzV1FHqbnfj0QU5Y37UhEy2OlVcbCrY8KpGlFbGGQakTv/pCYL8iogGAeS1bGnWVGmO7K73bKHToeLk4OI+3MfFYANvmvuzt45jmIDASdR9VZytdA6+HS1lVeCxNlGorW3m1iN1NgwtfRe+WBBlt9zSmB2mVEZr0pAFSxXtFYhwk7pNgD6cafBljlgCagxUgZXHDuDFr/C8+l8J0sqkuypz+oq1xbD3RCnk716qbjLDqdJUl6jVpq8gMEjMXyEA3sbDseKW47tP62fjdWvkRrWQMt02EJnB4PxTJGG9Q1qqIAQx+UPYkMXcY72JLSg/z4tVEcoKvj+Et3sauKdNDVYNmqRUwAwC6p/UImp6PFLLkZkuyevZHlwj9He9WQ2khliqyKk+Yen2DKlI01VDRr3tdGlgLWNzwcF73xCICHFKNgynlZ/wr/dDWfUuzKm2hwzH/S335i+7QAjmLI2Q8sBoEPpbQ/v4ZSr5iJFIZIxbu8yFcy+Ki0haQC6haZ0nGJnx3nDJEFK1q0B3yIx8rTPY56r/VQgIAaW9+AQFaFuteO3VYbjdSvz8nPiICKtNwzf3tTVSmwqpXxaqI5QVfFqojlBV8fwlu9mCDwm6Wz/tRF/eKuXllAAGcToo2wj3BlSkaaqI5QVfFqojlBV8fwlu9jds3W5vjXS8Lm6ahKKwLtvWS358M3P+P019B3gNc+K2h8f+RF+Pq+Tu2Gv/hYAwR+BxxnvCCXQ/jvBGOoO398sPpA4kuJr1jrs2fIHaUoBG2y7FCfcg92efjZE+JSyE4nk7BlSkaaqI5QVfFqojlBWrZky/rLeO1qqP4mlP9gh5RlsFEi0IU3U9NVEcoKvi1URygq/eTEpPH9Y7HSiBihMf8hMzJtAfOjNe/5+OBeHTgLBKjVyfMCG5RX+32dpytszK2VjegoaMtBpaVBGoV5W/bwrGqomE7jlxJVQzPvfjtdvOLE6IPl+eG6FgigQ0QxxwQ68dWmR5d1nVWhoY6ZadkP2axYNUHq1IT+KIWCwdpu9yss8AY1DizsdKq42FWx0qrjYVcSgt3sbb9jvf1zX/bZylt1/nb+fQMS9B3PgY1I8d0CC88gD4P5HOwLDw3wMqxQzDOY74Oko6x4wUCrRYLRlTu7d75TotQKr3ErSFWx0qrjYVbHSquPd0gxeEcRTT6cby3RPpf3mWpQiERzPXs+oM3kkOfZaQl3OyvXaUL8etT01HFJyyrNfnML72msLkuME3DSWIkUQytEdH4Zu6huao05CTh7DP8Z5KZ55jqeTkP969NTIbooD0aPNdX6O439n2uKKG8KCNXEPo7z53wE6uCmApoU/gERYsV8VzfU7FyV/jGeEcoKvi1URygq+LlFQlJrn2YSp6UvSei+GHOUm1lEy1D4doYz2+CzD2lg+Eb/INlnDW6Cey/mHDZ2TcDG3zMkfG3yv5LuubEMQG3E/uB5tX93/TpVnOe/xEee9Idwh+sthQVcBCXa4MUxtDi9qsZByJav9gypSNNVEcoKvi1iT0NSAYvpOXtk1UtaFKeRejrseeNWZNp2bTn9yf9Gs+3G+lWFTk49WkQl/6NO9qK7gmJlhJa+FyFCfmKTndo+azr9b/bDHXuZIPrYfpECyItbD558KIDD6CIrM5BnyUBceqrnYa6d2qxQD5P0rJ4yhgnwi0avsAHH5Mq1U+z2WFg7HO3Cl//1tQdS40oGpS31lxptblXKaalPiwAiOSnwNHDjijWnCC8c+1LtoMunldGLeeZlhl3FDl+G/EtpGKwYgM0uRDUtfoa5E1K8KYQRnP+gxZ6L7dJpKC3exu4KnbFioxKDGyiyvl3VqbnL04Q81R1WQMIO8qerFSj018LvQ/3cWKA5fhALqqzu95mFNXo+SQnbyVDlFkO68mOth+TzuTIusLI6UAiyyPlLWPKNt0w/gLP9rpc9+p+QnMD/8PaQWeOMbeUX7EAloxxpPpXVCqPDRaiedPAB0Ma+cC+FMPSGAHGquGWk9bWQdMArqOc3rFx91fnEvaajbMTwMwEIDKUYW9BLFwdf6kueXtpiI8o2nd/NC8ynDW+wW1ptCc+HfeTEpPH/v3nt8G8LMGZaE8JMijjii4kaJ9/4YuaHaSdSoAf4+/XeK6DhAruONKWZZZpMylJCRtqEedVTjsacZoX3J4w0XSu8HdFWP7MospwL5SF6BTaIh5iXlG3I+6muXaMO/HEZ5MN3FVtrls6clDzRm+/AAhu5xj1BHK9eCIfsxN8nmxRvtop7TWfHmyPE5XfXV24xqm94IlkNUWZ5eYwYdpK6Lvom9aSDrRHhVI0orghBovQsIogaq9IG/sbpGqPnFtLY6VLNKDC+l+wiGl9XWEhKuiDtyrE/+/Uz7fVOMUQNGWCkD5jWIlmPPosKSTwjvx/J4BsPGUAF0C/WfXCWZoBu89VtGXTOHsSIPv8Ih3TaKal/ZeV9o317tcXTwf//3164WvtinRp2sEBmm7+Es/9PPv0GnhJn6+q17L+Vr/UVfN1ljp7JF1luBNY0xw2UO1UUeAyTqFF7GAWWXBrxtJq0IfTdZIyaC9S7/VxKC3e1o8haqI5QV5C1UV26iAhh6fYMqUcNiEuVAu3xcoqEpPEcoKvi1URygq9kPHB0bgAUMjksuXICvxRvRXOlIrQuFeGd2qy/Vg9b4+xQ4p3dYS/CPLDeb/7A5IsZUpGmqiOUFXxaqho173DKlI01URygq+LN4OhN1BT2H+xBhu6HIXYDGS3H2uY4sdeAkKSptvVkaRZnZyelxoBaKfXz2+LVRHKCr4tVEcwsY1sigmGEdKq42FWx0qrjYV9qT6VZnSquNhVsdKq419AHJh8vLjrfMyR1vmZI63zMkdb5mSOt8zJHW+ZkjrfMyR1vmXE2t8FU/+wi4mV6VcTK9KuJlelXEyvSriZXpVxMr0q4mV6VcTK8OAAp757tr+JQykZ4U8MgP6eGQH9PDID+nhkB/TwyA/p4ZAf08MgP6eGQG1Ckxdfr6Gyk2LULZlZs7nCARrYj+izZAT4VDEFxik9RBD3tFjD52EMUTx7E0ZnRpP1tomd1fmWD4RvgBmubr4HvA1h90KH9NTU7FRrQX1gAxNXHAvOl5yKnTQdJCcSt83iNsdKq42FWx0qrjYVbHSquNhXB/Eo8Qv6QCAqUXQIG/REqYJlBs6GIoQD797oCXUEaOWSQCFqY5aLfHtDForAyiHXXpsSSygufvTL5Jg5M8ObJcZhyI7XIHyF7exh4IaLVEcoKvi1URygq+LVRHKCr4uUVCUqd9lBWCIOdV+T1EcoKvi1URygq+LVRHKCr4tYk9DUjBlSkaaqI5QVfFqojlBV8WqiOUFXxaqI5QVq2ZMv7HSquNhVsdKq42FWx0qrjYVbHSquNhVsdKrhNfxIHSquNhVsdKq42FWx0qrjYVbHSquNhVsdKq7D/3e6CrY6VVxsKtjpVXGwq2OlVcbCrY6VVxsKtjwqkaUb8WqiOUFXxaqI5QVfFqojlBV8WqiOUFXxaqho173DKlI01URygq+LVRHKCr4tVEcoKvi1URygq/eTEpQOlVcbCrY6VVxsKtjpVXGwq2OlVcbCrY6VV2H/u90FWx0qrjYVbHSquNhVsdKq42FWx0qrjYVbHhVI0o34tVEcoKvi1URygq+LVRHKCr4tVEcoKvi1VDRpvnQXTg1ALpwagF04NQC6cGoBdODUAunBqAXTg1ALpwagE8z+CGjfi1URygq+LVRHKCr4tVEcoKvi1URygq+LVUNGveJYWsSo+oDAFdlVr/zcyIMdraDTXkObWAVE7AGXCJMl+M2vGdFS8quwNKjF8uz8yL8EWG4xjWIShNpSrxO4y3Pf7ylore9BMr1X/upVK8FZq+LVRHKCr4tVEcoKvi1URuANuzWhfp6ToASyoOv1PmvcWob6Vt8NbSS5P+54fc5P/ORkPYPjyxL23D+D7gTG3XHqka+zJYIks/Rw1YW861e8O2ck4XwTrvv1Kz+OlJzmCbHTPJoqVEk6uqg2wq42FWx0qrjYVbHSquNhVqQowAUvwzXrPxnHdrxWMcJkwuKlToChw5mpMrck0mVryahkjrfMyR1vmZI63zMkdb5mSOt8zJHSfC4y1i7G1T4OFXGwq2OlVcbCrY6VVxsKtjpVXGwq2OlVcbCriCpojv+RCDJXXcfufMM1rLLq2anhMncEPKGT27iqqpfB3kYkALQ0GZ/jluYejR3fUC9xCoyJUuyQwWjYQUOkio4v7uwA9VLVUEXulAhLWq2OlVcbCrY6VVxsKtjpVXX+4+23aRRKlZavhqvbC6HAnDsLRxAr+INGIHBWCp6JBO/oF/4jRf8bDFFDfAakyPkTmLgQn4qbziZQsvim+ipKnKskXh/WRfpzeY9qojlBV8WqiOUFXxaqI5QVqgihayGbxMBmkBwmTq+Cql8goIELNiSRGCoXBgVRNhhBlMkuVkA0Ry8/8uEtULnAdiNgsaf/jqzOv6P+OLTVISNNVEcoKvi1URygq+LVRHMHHlIuezNDlAYuMKuR9UOUFXxaqI5QVfFqojlBV8WsPQcGVKRpqojlBV8WqiOUFXxaqI5QVfFqojlBV8XJQeI5QVfFqojlBV8WqiOUFXxaqI5QVfFqojlBV8ffnpVXGwq2OlVcbCrY6VVxsKtjpVXGwq2OlVcbCt/EDpVXGwq2OlVcbCrY6VVxsKtjpVXGwq2OlVcbDZ7laSNNVEcoKvi1URygq+LVRHKCr4tVEcoKvi1UD13STH59nTg1ALpwagF04NQC6cGoBdODUAunBqAXTg1ALpwagF04Hp2/RH3Gwq2OlVcbCrY6VVxsKtjpVXGwq2OlVcbCrY6VKAA/v+llevdxfpkMX64QlBdK9nZ/NhxfcGrGC8XXIHCl6kQx4YqsNCS630avDgiAbLnwJWmsWUqGTjcrS/C+OPbDwilaW7OF10IgAAIpB0BaK+OBUUa8J0fE9rQolccQoKRTUC8XrIm5VHFCKCny/d5pkerI3xTy6K3wWYU3U4OcFJ4AUX3mY7B4T9ga85X5G7hzM6pEXYpTxfAwVGQzVhPAyNtjkC7lcwiG5ZroOeAFktQXSlz1/MbsNyiVwNEPTLfCEGPEdHvVS+lTGZtKx/2DSCtSDODMk5OB6M75o8cATv7c/KDFpJE0CJu+0odZJNxJwRAz3v0vfSt6X0CGxB3zBRInogqDUjisf3UE75To1lMKgkWoZiI/ALDkXXIiLPcR0qhGT57w1Fs8gCtUMzepQzSfu48dU6qn42xhkqqt5vdi2k/+p6tRFQjtmF7t6o3eFA+qnbUAKr/8NQrdu/Qt090O/uFlFuBbHMcZVwKCEQUl9s39ek0Ews0tCnklNEtzR7QMKwaHi+BKLrAHFTL2XoCe2je3+fcR/zhkDC7439bB/0DZoeHm9yaDORF48zrmjhbuimvI0zmqfRiFik5KtLAoc3BqPIr+dQSEPe59QWJgAvgBYsz7DD9Z2AxI/ji5/GngcvEM4wLvMNdyzNN3lxB6dfBvslu2IwAbMfrhmE537Vwq97WTrPNbCCo+GpKhgXKTI+oRh9nu6II4g7qMsWHBVT6XZstbaZdnlZb8DsxJ040uDtGDPRIUGoU1zuJjSZzVCwatzT8fCGy1W2Jc+XkH9vX96nOWgrJS0NIQFHfkqTIHjyVg1K/f3qR+ERoMtN8K5thz/4ttlpL98qhr7ZQQ3BMikTfP/lSl6YFmoMuQdp2wB3z883N2s9UzjDNuO6S/wDy3Gy95iA4j1K8P8FoRn7dYq+FRC99UsE7jKDmLHRtXP5JeFaEWJsm9lyXfSzuf3B3frWhM0VPQHi88IUQcKEoS9/B2can+H3uZX/yr1THgVgEzA9+gCtAuozYoL3ITKPQB3vOUU6EdCWv1d+eXtJt53uK2JuUXpbpcwBCxyWzxiit6048rRYuWtEjpdEFac//6kCjICruNkkMr9OTW2lVZqekQByQBDSq1mhflzz9nDrU+/l45VOhp2pqY3gtQT3da8t569ZhSrfu0Kxf+smZNfym8Ab6mh2/QbMMC0LVZi7RDxPmDQvX76G0BXqJehFAa7bj6GzAPS50fM1eDMPZ4+HW5QsxV0kaYJ5xPXvjF9zKi+hasTea6QhuJRYwuoMuJ83jxyNpFvNmQ0+5S4Lj8PSLJSqvWRzFJuZyGN+foDbmdQhh0+TkqpTu13X7chgVeDadnb4NtmufOfcwweWWH3QutheZ9DzZH19433FGs8UQAMeIjWXNJN1IgPIws3xoZYK/RTNI7L8zgvqx8MwDs3R0di5qSWMdDJxXxBxkHzLkjU0qf2vCin1qxcGl1+/pfHCpZv4rXIWwo9TJxFWOHhThD4cXibnSK7CxVMN8ey2ISu/PvYZ7CuiiaVB8BR648bPFaMywUNuREUiOZ0kvmS+lZhq51SCnkprUULux69HO6pSpDXz6skIfNTVRokean+F/9nn3mCzvUtlW5HX8fy423DpUsMFfd8spz545eKscqCnXuXBt/xsL1lebx7CakYkBc3d/o18w55QAVzVha/ZRc+zhUH82jDcOKodMqX39jyTnkHYH0iXKdIOM+kM1Y9rO/LVNdOk2X1t0nFHzJDRkrZYd18QoUsmlJ2XY7+bqrS3NbGWiYZmnXGhcJ/fZPetkD1p6TRFXJXI+Pt7m7uQ3AjH1FITr4pcjm8LvOiswYul8qFp/ytor8Snszi2CCDNVtLwACb3JkstKxiIsUNZcP7+1p1hgPYdVy5xq/BxheO0F87Fb+5ApGjNPIk8ovNTzivm0gmWRgrfXeavx9yzz4Nd9QJPyG4dl961W2tIw4V5m75RBKXc2DFVZ0xlXU3Pd3uk0niQVx44dSI7a0HUFRKOmIn6h1jieWvz8hT/M5wIg4ZdWhibdJ2c9Qjsfy6eU0FJU2ZUJ7NLe8HhmntszoPo8Tw/esXXNyHSstn6Z3tH7zSpM9jr9HXgzuQYFiTSq/+Xn9dIEr8PgvXd82W7jp1vLkHszkR+//K9ucdqKvpXPPqKPSUpDriFsC3PBp7ZBL53zfGK9oA5n0GGjKX+ce/QT3+0Q0OtTuI2/cz7ERPrL6REk5fehkDc8Exb1yF8DRe2liHrQeKVZ25XqVbvdD7qs6RAbEOcwmSI/ksdkPdUgnYrSQfg+qrwZurGTqCn1LlAcB2CjM/EADR5xdSVCPUQuWWV1QGnMMUaqoACpbzZYjVGSQKDTSdjk6I3KF7PqEkXugNvI29Q5X26D3wjZ+yeAZWsI0/y2qpUy1GWdfaleWMyQX1UNDS+tuec4yl+DRylly9BtXhHJQGOnK5Q7K2Wt0fm4Kol2XeN38XS6qDXVwV1G/oXnJbWPlhX7QdM8XbLJz//MkcfnI3mXLnil5uBGN7uZHVyPoo+gTc7uCjF7fQC0OwfxGlnTPVRuR5k9t2FB2uQUFBKfm748KBZWuFSnRnIZdfSuf/gT77PjiPMYXitgtKwN0B6V0qmMOIV+r96XEdRdKiZQA1AgYncwBeh/oLVpOrs889D+O8gqGEq+RsJU7eNKGuyyppgaOarxDJd7k0oawH48L8PvH3uEG18cOKhlithSrQMzsR6p+Ijs5lQtPGlVv9etkEMXy8YuHp8K5St4xbQtSjpC0jj/5nwZwQv7A9DplQJf5sZ7xzlY2QV35FFvt7I9c5yadtAliAMUawKKDyHWTeHRM69CJ3Ufnlg48I8CPtdrAILvYBB3F4XNHdH/jXRuAfw2ycLM+TQhEVwKmTuvaYuYoNA/PiOr514b4yy+U5N1xXgKcS9OMUayMnUaMh2fEmwoVJuM8ttgLQRPCww05TFk3loNcEeQulA02mswyrZ0anPi7P2bmj0DAnF4P2BSHQ0YeAYXOT9lQOlGUIu5aCLvypCAp7U/FOjyeeV0Xcs1FpmsoRXHM1WQ1BtzqXi+qlPt+o9f/5HOBY8UzSkHxIdseXzI4SZroHPfWRDedbhJNkUKw1xf8RxHNd2cH9j0ZgJKifg27XQfHKJTA/K3huATowj0VoSs2QxBQX+V3TeBFzP3idVtM025RyneuNvUovcDAyp2oSSjK7pvNR++DalYBr4AcF8NGtslv5U46L3TwzqLRqp3m8UpybPkP6BbCCVLUhDBOTd1RY6Nul3Us36yRdi1Qf2eFM0QW4P+siF/5GX8/KPrndpguyE/V4vFiCJ9MWIoIUP1C96XKrnxkWnjgHgEK0D18VEuuPz26+7+GPQ9G/H80bL2ABpJLVTyOw3ngRFblrhnvl4PwU3Q/pwGK2//W2S5dKQolUUeVvFrXIQQpQg5nRBrxDJCKqDj3+S0kdMHv7aSnws/WJyS1N/KxQ4hdDazw7tLb5iYLyofQaK9H/bMwpxsJgURNSh4cHCeEAACdJQlp18fdo9rKY1imq1ZI1yL1ajrpLxPfPFjcN8hB3K+2JUmfF6TGT7k9nySq0Teabssv9qtxFI1ermFKNN8W6sHHZCWvmDli60/XTLhxJf4Vw1WnqypVmr4Y0alUyyMoKe5a6OmWD8+aJQSyJi0f4Neq3gnMgiX9f/ONnv3/2i7gxZuEu9DBNBDNB99hz72Cvl/n7mtsPDU9Vm8sC6pWfYrlCbDx/CzipHZeljLa7CMFM9RC/AaqLfTW6/719mL/Vxc9BP51JlNOl/BbXOzhwvS9Ko05X34KcvnNQy9G1PvqLgCu7UKeUlp27czXi8f7VY940swDbdC5V0GL/lFwFWXixmEYbt4a8QWnyOhQS7oaFHKrLm4Y3P3FqAeyG1KSXOpCWT5rbVJ/mJ7mahz9wLZIm2LCDh6TQ/4Gk7l7hQVH+ipp26S2Jv9ZKAiroEbjQb0t2LIfG/TtQ6Y5pTtKAoiRUc1PjZS2+X0b6yMoEIkaijNN8H/oF0KXgt3u65KQfVklaLerxo6dKvMl1YLF4D9nzRztRjLcE5fevL6NtbU7UetC6exwzrt2YwKQCXSdmxgKkVulR+Phit3XaSU2ZFs3LS6Ptvy3JqXW0dMNzOvyLBsxDMAShKxc4gH4DvL+Pu9tWLkW4KAU+CyyrwBbCjZVqk2MXOxoubLb38PDXupVzGy+yqQewdenxphg1gqoQeD2WamVuCebDocBGlqzFMYjAV242eQcXM+khhT5Kz3tGklzzmO7P//GqBJ0fA9OMmQZ0PMo8lpgg8La5WiU8E7nbcmu/bfOGMlPjuaTMYAN6dhoBEJaW+RT0y0bDCT1k/oQQm9V1W6R+4P4p655mtb7jZUFgWyrN+INDAtOzciHTLzNcBTyTxF9OvoanlPVOqzhUppW6v275XggACO5Sv5pDgH5kqS0ovVDf9FEEDy5vPIVGrSUsDi/JOHSky1EfOq10LqXxdGLQzeeJhphFIlUgSH28XP58y68/vtVYJtiR91k0j3GiSrmePAYhe6w1RpHa+AgdY3gyH8HoV0EeMNSIf3/WVUuqtYSml+RbsDGZw3LXjnpoe4CyHwfg2yNI4xvvOr4FgF9UTMSJ20K+zFMHmtZVaYsnkLP4zEXJoWWKVTXhsdgKidLGx6AUIGjB4DMfAqt4TJ4prXV/kzD6c22b1N6KYcsGZcGbd7L2OBkOAIBsNxbogwSjsAqIeOhIhzHGJEpsOdmSC1llbC4h/157tGnSOJfBZuxunr0Vca+hm9TNH3n6AYUAM6rbKgJRQIIp2CilDaV6ZZTAUsQLj1hBti+OvZCc4xH7jy3Xv87O5isa6IVFDGgEscNq4muNiLK+PRtl9n5TCEI0/30LMgRL+bBv1ZSW5iM86KUUbvjioloNHyHqS993UJ2Q77Kn84fAmS8mgfKEwFfNF05q5+I+M85muLphsKXE4BZnEsON4gnNSnTDF7ANPzhqtwgzCwc3QY/lJOgrhffgdvMoyYmfblq7TAZqBLm6t3w6/sTlYbAiP8IRsVPPJODEZDG7CKaKM6nlWSprFo4392P+83N5Mr4F7wznxThwclXGsMDn+KWrkWaFLWJ6AzXcHKhCB9DEOtHqPsqBgm4wI96x3W8WwCP2UB0C5oyanQSy+P7eT1Q0LqflQTQzoqPG2yCVbaiQBl/1qu9vpOJv/LXsddLgukUGwYO30+EhYQHPJQ/zByUtRJnhTY+VvYAqWZTiAKxhp2aXsXuR7KSpj8saFnpS9X6m3+2NP2e1UUC8EPOL9i6RtGrJHoYgxAUU3SLMwVm1dbI6Kn+YnsUg8//YoHPtJ87JrQDt3IHaDHjPUnkH03NHOi38WuOs3X5V68mUsRuY2BTfjV7Y8FcJjH0sL7VJswEPW9GDcgSuwOfX1VRosFj05RHCcI/7I3pSpGA6f4DzFxZWY/cq1f+26GZdgsdeJEyJYwt6vaCNjQcq3B1T0il7jLac/aGH6Ry3wJGLVLbyEfI4ssR6CT0pwdV4CUCkaRRDhLBgf6MSHheBNtlmnxtxKUDsGaFqB8VGoWkloSRubd3cDVvmDc3FbWF01GPdhkmLs+zDSBOOo42zqxsILFHp3h5bAW6CyOxZixkHVNCUuq6FzXkJvPoved5/sKJJ5ojmxpNO4yoGcZsA4DV8CXI02l8xz+UYXwy8BDYhtBV9uA7Pxq3rXleQlQ/SLwOF3auMhsfgKWrlRsAH/iOMg2vFZqQDprdkfy0kdjd2mtsAWEI4gc5Xyj7uHASpcGuOeArq8g3YNLuWWRLrildUKlwchXuSkDerWj2LZ3j6QBL6RauKQbdcfr9z9OOVQLwW1GU6iCFfPNunWV6yAXqveclYPy6PKXPY8J+ZlK3tryYFwNu9Bz9TWZWHkJAId6n0BYMFrGy6S8CcL9r5amqfvLb5ddv6GtiiDqlGKJKB4XjGny9bgSGQNuQE3mScxlpFxJnxLc/EPqQxFrWDbP+TMwv33gcGmmQmP4PRVLFXDFNpd9H9wlRQVT7JwtH12/0T+22Y31kL0BXsc5aBPe0C0Gk4coaeXpcwtY3QWUGjFkP5x/vmOlTJdsfDN2I/ay/sFQ45CVYZsLQhn6jkbCoWWhPwOdHk5AW8PFfbkkANCG8nmjGHfxAm2LmqhvvBG7Zu+kY3PLs+nPmQ5jzG7Br+TfjwjzcXKocn1iKUf9zcHTyi4tQ8G1OaU/64PF5jWSDUdfRfGJW/ybkKKG5AZlN8qyOhva3ia03BBOGq7r8M5VWKSHlm5Z9wYm9x6UB3XCeGpNE3bzSuI8rVUCDdr2aoluU4rMQt7Tzx1GzWWZiTXRSolDITbbck4+F40T8EUsjn6VoBX5FUCpS9qX2zOHQwGMtmoxCgJMGbWhAbo0nqY8IBGhrM88VYHvL4UMQfTKBwObUXEvlRm1FBpBtFWNotC98+FmNwQtBdk77uQgpQxURX/2g+xXzN+Uh9R96APkFNTMXFF97aO+XVUkeeupEFRLiO4t+/4Kj+oQqxvQ5ZwJuQqexaMho+CGtoNPw5qRMG/cnPlG9e3khYe3Jz7HQx4mZLvlu02VOJNCx9/2wT3jucAv5VUQqfcMOv4RDn3jgZObvv6kLOAXfnS2M5KTdpMcruus0fqHAft5uk4Tie3NgrBGLTme8oZ9k3yh8ZUZGqn+06iEoS/9UWujEh0s78h9Txf/S/5NA4r2iL/Mndjc8mimllQo33metxGkUlniwA/a/KFJ5RQDrTmK4/TRV75p2IkCz/uSww5qa1otzI2DbjGN10HngHubV1dgC9JAAE/gPwVUoKmMraPTR0RG9snmZ1PLIsCJqXuOc06HKTv6AMeLFlv921dkd9urmhyhw7wAD0wuWeCihqJhjpS+0XKc/UXjAoeM7RGhsW5M0C4qrWLO2VQqZXaHvhroQKBEl9pBlXTVeWkN75KYt1MM6UgzuK2iZS+dY+1e/+AMDpNtJ/QFTaLJ8PLOMFAXWxSufC16qc2ooOhoGTHscP3+5dSi3zHVvBaz45Rl9X7QReVH1v+x7LAjyHr5gwpE3CqRVDcQ2vCd0e1fQZ4nVu8S/oH7j8xuR9Yc4MyuB6zle3IsysPLGDNS2ldUi8Cv7I2JBy3BhiL8eS9BOisrByUQPOQf/xMdcAHeVuXFuJrFiROio3sE72Z9QmXL1uktwojOtnb9uzrdY248PLVXdM4uivPUP04mZ9/tlLtU+4+3x6ptyde0x5lesP/TyWBY60eueu9KG94tXnhJwgTQFEOm0be0G1TQnhaIkKeTHEzHv2GseCzXMtAHJ9RXvKTe3XyZv15XycNCQHqXZofNbRiWLR9K/wX4XdqoSxZLVXwQ+29LniL9fWAXC7zrv1KR7VWrKPR/Y1PN/GhKlPFTEbDCLXOxEGy6lnPtOrUg634DPIwQL/euRi8wn36LQ6iahpAkmkNfW+BhpOeX2mZyppIcdi6g5dovlxjX3xQyeOK99p//6Dsxn2wb1qxEcw2mT+6ScCmRWNRlicsTxgVlI5F4+PfpVhBGd/Y/umeHNS2pdEM2vuTYxXARnfPuh/g6R1vuQ947VJMUzFHlR6YpjzckNDFIBMEZ+8Z43jJ8pajLB+BO9O6wyERSw6h42MfVdGcLz2hrN1O0pYeIFpvvNtrOnCl8B8OMiBHRAUBwxuweTn4J9Jue0rCMZqjPGOBbfAgQ7zLZh7n+6F3Illuh5DgDOsnIv4VjwLbiwclNYbr56Y+XJ64ynrRn8C1clCHi1QGz75t8lZfUnUkf0A/CFNP6OIwev6wRaNCpeStQUhpHYxjhF53w/bZCwsFKzU8VD81635w3rRuHfpJyJnf0LtZCxcOLC8+TEvHaypmajUPJegnTj+8Rux+uZgYZkqKGCkenY+XOTEZ29SemiBqi9n+3iGp+4dHFv58iXWceVEnoetOYRryXwjvKAAAGw6nc4GkGLMwiKWnXBTqXFoUtQgMv2uY02zBUC8kDwANE9FMl/zXNQi96Yxlv3IWFkCctFLLze3ynR4gDFH2gD5qlzhiMBLgn3JoSeLgoxOptpb8u5WeARALBtMo7iXFDbbhQDdEkq6e1TUuM07TT8CszitYYKhho25bd6DODtMm3w3jznbn/B31cXjBp55MyYmoDtQK4RuyvuW/wexJHQOqLN171O0NB9BknOrw4Xn4rtDrY8mUsG4d/u+fmRCjLquiEfFSqFbg+E9dPzWbaZDaOimaRuW3jKZX+LqT9kJhZIHlzLVWgIWT39/2sy1PU30BeQ7CyUefv0yBQyuJofNW/ChsFyQinvaABM4J/4suO4EUk+9eXK0S8NMskCqm2eeJj6WWj7lkk0biWBuooWgxfMYCiYrAhE3yMidABoajm1oPOKiXOEYgYBxcKQoJ/GodaLOm/i168JTtrUP4cp2cwYQaLI63EEmmG0tmPKPRnTiuxCRE/pe7+iPEk0/hEHjenv8uptWS0/+ij8sxwYex8JOoQeIZpN9iR2tyg6v79vqO1PjWc0yUQGX/11yUnRNH8d1kVr21GTqLJ8oUp6QQX0dEKicccHFRgACaANoDNVmh0JTiP0S68Pg3uzxodugeC6h1KgOQaLr9kWjEbzSJhFO90XhWlmyrdTnrG/OduM6uR0cutdm5OKuOWIxfbpiOec7l59oKvPZCE/5VaUpH8OzmV08tURnqW7WzOCIaiwEQHa63lTjHnCVnyAhZ/PaPjD13vrmPqsn34CswpUmSm4AoPcELiEyxMpfSEDZcIh2C1HoWpAeHYS2kT8fyHPAO3JDDn46+Qpe5Dbc9yC9csNSQrjuGN+D/nsDdFXG3UNN6uwcXT+O6OCL2hN3Fd/umi0z43Iu1TKj3Gnm3onybWfxMh6rUFqO5zJ18ZW+0W8jrvE1xyYZ5Y0WyfIzGxUmoRU6JcqtA6ejvbm2tFldkPFP/rV/BulMZcPSLozBMRW/RmPlCGnMvIL4aMDvlL7ajxVAxdxC6xmvPM+ZXGz0EJ5NtLtbgyTWnV+s0y8W8WKGGIgTrjjQ8ni2yWAIgoW3OrRjmI+KvDgz+2rvTqPoc7jWpdr7d0ksoFslOJJU/Evvf7jgCWoaMPFcxf3Ds/8/QZyxM+ubcjkEqHdSV8nouIsfU/IA1/9M2UfR3dR8Yvp+DHGYkfwJC0zkkVd9KthO3ZtsLS+iaN9mOQZBF+Jrk+WbuLmdSlQNzOtL+egRW4fZd1QXVt3x+J/OQYqcGD4t9/FR1robBfzxerAltZMUEjWPa6I5eyE8QoXmUlN4KcXWA2/blCvpodVeezqPuI5zBrjkKlSk5AIt0sVvZfBF4v4VseeN5JFzvG0FQj3fILoNXQtVNAKosHsh0fK0lNQnvL2lGOGE8nNeCTcZdGZ86sOuz8E2NTubGXPb9QY6v7+3muJAi9QwGfU/boS1lKZvNWirPvyL2em9mUNY3WD6u2oJygOId5CmwWDcXjfJb+coWavhGw/5yaSjnaDsMaDcOehMDFhbcRYoz1Xaezjf9blFq5RLchHcgAVaLStQroOls8USkxLjfN6Nin3JOCA5kfJLj2Vhjgaad3RKKSXVvPO1/cjZMSwnJHQapiK+g7+GDrQK6kLdvUj1UGz8wnTOt4WWlYSynR4ixC4dHzRCNcI/6DeYCI1FxKF1Vqy5xoWSs6PvJ3Y+D/wStpEdBy8cSStDKKBEM9NSWCnfrlTO6wWuDidbTmCmz/NGGbFfuHe7VqzwaW9qSa+nE5ycu/qh5GU5iX2sENMCAsNuyGaA2x6UfoOC5me7JqFr5SVhLpciSynnTMU46dTZscGFOh9O+mqs0Nm3lzPFHMNsfJRhuuWU5BXpacBXp3Sr8W02OQ/zprAvexsNEBL24UyIeN37SxwkNqPsaXmv/WZK24trcmqAwjXshDykWlIyh4sGiE5+XkqlHZr24Zvun/ZEyBJIBRZ/2KR8NNuay9Dj0El0FzrO8144e/YKxOvmaFMf3/4yC2edL5Jcz6vEZT/KbBouEv6JYIh+5y3ha3c5bti3nYV5Y1OOrFs52CAOv0zm9bnZY8t+FfK1eMEciVM02QAuGajqt/UUFbltgFQ5/4ZsZppFiKTgB6wxxSgnufnyWt2aD4wU9CcWVRXr2EELzFDKXWFpMSKowS/blpO/KRGepO8LQDVnlkB4kNgN6hCJpZR/PCTYjkExd7+gzUHiDUN+vV246I9f+ksBv7zdI+pXdV0Mzxb1DEU+2bMY2sx7XdyeutlOK3in4aK0xsc/kBkQKq0Gnqks4v+lGbCKFFIdoY6HfTW1nRQxpU0TY0YpvWKD59rvJlvNy7C5gB1ZOYGN1QaBaLl1x/mSUWu/UPxWxMhya7JdkZDzv7zRyyGktPTQ4JDeCu1dUbQ2Kx4x03JZcXLmbNgAHRjE1NZ64M7T8jAUm51M24DYHPKMVQBK9VjaJwhLnLzzzz4DuCGsXlnXvtPtIXuOJ0pcYuZPo4qQypLK7sPrY5n7Rf6ZrsZgVfLrfA08HdJxqBO4+3w3BY8deKlebvswhzPpYePJe/zKe9tGxD87imf5aALIWn96AY8pX90Uu1vWOjQySs3CJPbrucVKSs2ASC3YpYRQAF5pxG25gSuYA/Pa6Z+DtkEw0pDNLPrLfA//TrH8MU+kAK2hUi8Ylrq9Sa2j+20AjLw34wyf7DRhnoUoEyxtWQtYC0GK32ec+QxaCl9QusKMIGTGm9sh15l0sfp80846l52tNbO5x5UKdNWiNWb0B7XZYfZXGb5XDtwrNsLd9P5TO10K/pJeNqk+q7S6LmwfLplF8E2n2vOL95RAZUkidS2t5btnRnRsWI8p4iqYrxma0WDQXELIJHbLSceuBkvHFXO+fegebdYW5yDaUeG40n0YLMs0kc2MzZ6G2/gOZ8MPqTA0P2nJAf9Ah8rjsgzpidOnwGvfmo7mHWX/IxVL9LrHLgK0AoYsWWow4SuqWcsQ9lL2U5ZvOgoO88YmnnBsw8kndENcNJqMzNcF3iPAgvWrphCSGWLJ0rEw1rfehlX+ccVgebw5/8WvT3+jvPOKVWtslExlIigT+o+7mNWPkxaMaCDZxPC6osWg9XXe3SNNNgHomLpos+zgFRMq+UFf88imln43osA5s/jXwmSqqu01GXYppS9r3tWPadiDqbA18i/XKTDu2ro6JkqZbBUZ31wOGC58VdgpEwkhhuyzvfpVl8o87Uf5+By9VWVjTpgePmpOSsDfpoL+IYKcFdbKYj83Lle4yxM14M4L7jEGdW9ekVV0IYwhIxuAtdyy/9QbB+eWyTQ4w3vCGktQJWrKw6JA+lt0wqq4P4i2Xgk+dOtY8QIFVbF1HwZvfBS0pt9OlDglva7KwSRzWQgWzJSSkWwEKb9L7+/ntkyn4NW82HYkyhDMidMuTHJ/Kvq205MtRlXSNNwhpQv44iCbYejis6ZDq8hpXb1tXQHCoYDOD6B038kpdydScaAgmPiExODLh8+8FUYkoW38/VDS6ZdauZ/oxi8hURVC5mqz22U8z2XAQEoEHvMAwkL+sRt5ov8csB5PQKDPOi5EwUIc2R+WsKKYV6qzepinX7H5vPmgQoFwYpmB0lz/zqQ5bbAEblMHwwPwLLK15RI3ndKNbyAVrLom9cnIX1tYYqIORpPFgE/Ds9Nw9CuJce6c2kXznVHpnLto1QUnKJbgwJc8DtOfimI2RuwwjzUqWgDMFNJN80Fz7mBf/0bW4EgHP6V4LYxAdWuOLN8EcekFhbW3Tf4KbtBChG/5FNI8LlQAdQVM8/M4Fa7cPvbblceZNO3wp8A1YgVhBOb2dxqC5uHDI/+6UX5cbGE/qeVx1A02LCt/lk0ltEX+I9Jq7yExkm2ac/H8yJYEG5DjRzDezHGzwzlSO0ZhiDG+5ipbw+WlTQHGZz5xsXfb8q1kuhGpgm8TkLcKhTrAjX46LkSwBr1wLsl+C/pNnhpWZO4quS7fwzFjuKCv4J3w+tbBD6W1U5W9SBb/qluVotPQCo0XNBcLF30SqU0qDCJPh5GRicZTngXBBBU0E+IA6Xpx3vsytukNDsTj8kSRQdFrmLCZFAaTGLdPmhLcjGBf1rvAxkDxmpgLVu7/ExGQPGamAtW7v8TEZA8ZqYC1bu/xMRkDxmpgLVu7/ExGQPGamAtW7v8TEZA8ZqYC1bu/xMRkDxmpgLVu7/ExGQPGamAtW8Dou7gERrYMYD1P4vIOM9INR5mio7XmE8vYsS8pCQ1u1yfFRtBA5Ad6hdtRit6vrc9qVM/Bd8YSv8NfutMG0317Cq3owfCe8P3ztuRGrJBkKcCYjBnyljqqrq3bi3rm0xdvcHmi6Zx+RAyWQPiDtvOAhtHJGmktCamFYy4VP3V9Co/KrU8UsRf5y37LnEe60MRxAnqDqu4A8nz7BzDqUXtBWMf91UUUJKWxClaeJLjoh6pu8gIN07w7sPuhNZZAllSJUgFq8/a23fIjstSr532EaLAiBNQP2XMGaZ14J7kHuRQTq9L/t1z0tNBpoSrzJ7ItIj4BxVek/nRSm95vMgAHLYeUlmsjO4l2H2nV1RrGtT0baTq5dUNhGhO1g7fzseE0RhWRDRCnQ5Qu4gyYvP+wwnxzn52xgNLdQIjTgUzAmr1UGdmHshR8Dq+jjPiLDPkcDZChiiCWzec3tHm05xskYLkZmT//QoJegIT9Ke9NRjWxeqhpifrY/V6xfgs6glOdzfgpv8Z6zdW2IBd5DVGgfiRniNHfEvoHDIRaX1lBnk+arewtQz1TAw+y8uM+Ztm64bE4zfwu3QbvXRl1zi4k4xbKvh3tCT6xzh40JPWhWOSImbiwDTJkNLRWIkPNsk4MxS9sHgR5MTNiB2erzf3lNE7Lorq66w9bqAr/iIve/8K3f2D1j79s6CMJ+hxpVvXAjCH+ajmt/GvwTPs8SsFMaJopbEhB3Nd86BQxdK40fT1cdBl1y92riszxry8eLjDKgjgSioVozSQ2HbcdIIAXgRhXqkqw/jXtFIKbvo/x3lTFoCqPh5hzHKzonUTNaXLRJkVDqLK3+B3+KJjeLgnZnafkR56qCptZPKf8ci5B2t2nCVJa6JOJA3iyp8AOiP3OG2rmKTWYr4nymhoW9TafECmi/I3yZuuIzp/fwDTbuH0FKRrLltyF6G4gxU9RS+Er8uLOibmFgUhFmm1OszWUUNrkUBTA9u1O34nvvwu7g+QEMKfebQx7hdgOx8Zw0X9jphprfMulDoIG+BUuClvCZdW5sgpcZgqYMUQcXWR7q7NcyvjUZxaBpbRiAl6Pa2gC/50u1Rg4TcIv6o39/NzlGXn8d+9/koSppQH4BcgB/yBbs64BEFdNgkw1Th7uIiee9m51yzkFBtJW2sZywgnQ9ZmD6qnXR8MlcIRvy09Pz2fpg2FLb/j5UjQh3SG86JAHzPe43dJS6jxwuwa3fOQH7bM/g3KcTjV5M75RaV3Ph3D+cMCEMsw6nSaHoLXmfRfRkSUHIGliHjQiDI22NDh/ceLn33FscQm33To8ICaLT4rLaQInzfpZK6gjRVPIIV2/mmifxuNJ307n9gPswjR2ZEq/aPyxYHSVe2DnheU/l0P6YxvxtuJlHPpKi82zgrsY+t4bMy1x6brrRoSrk0ma0nW12a4PMMCpume2Ar+xFv/qITfMIb9VzlIuKLNis1UpeMX0w0VYRqeRoQr5O2WSx3cMrIuFNSYiuU6yuq6XaUXpJLFBacbjahZR+jio+sgkLJPQtVkz3LnQfErpW3QoXbf2BtaMp0w9rwApuAiOd5fs5cFhSWNxCygoe5X/UwAjqD1kBydcBgTPOdFKn16v/JYnkngprLorqJuErlfWVwvSN2ePYQV+ltcuy5hbQLczciDV4Z5IjekjfgkmEYpRPdy/izZNLwwk99x1b+PNzFGfSNXktsigsJV7AUYBxJYj7JYY6jZh0idHo3s+yt3WPOXz0VmEPbNB1HNL2BUjbX041/SBnbeD78Dy2SrKNgEFm1WEvGFDIYXNxlClb53JEDZ5Z66pwOA5nlwclbwNue3im6tjqVYNOy2RQ78AutFXs7j4wuppgVqUzyP6aRiQxRSw8SfyXZ/mZv1rpQk1zQAtsLVsFppR1DXuhrH8mlxzMLMXhZD5GPi911lKE/dFv8I7KQYKpTjAUfmkWZs1BcaVm5TCv0a6cdPhFne/mvOr3DHJ4+QHYMv5FrspcCJk/NB60EEAA8sIbyKFSojlMtVWX8WNEqD9BCpC4NOnqRPM8AkJ3T7HDAC6laK2Ze57FzloMllmD1McjIpNVd7n3hZm2mZ004mPRQtZ9BK3BO+rPC1kxhAU1fRrreeRHNM/JPzLnQCHHDIY7dluv+BPf7+pEYqcAmWqYW52AjbMiJWRurRyiowQ0bD6GhyQ3bEOiZ9yUeo89JVI6PPGWEQvP1URFf89sFdPPyw21O+vhdy02OFE28Xbxcprp+/E94MA6miI/4qiOBIVg28EGvHqpVQU/U3kq+uwozQYROzhCN+bvqV84Nylugk0WNCdn4prWj4z2i6Pimk1s/JDsLtVMPfYuPYNQtYOvzAyBR4w8oIJ1Xq1Xe/7+yHkyMHWe1SfhnSpS1jRBAHA2uuDEh9WRLLP4KIqYLsnCT2TIU/1XaVgMZjFjXqW4Q2FkgB1MeHjAhBbIq1lhygdzTZtBexdlvG4RKHuouXkpOXQjP0XkDkXkKfyBI58DgfyZoW28ABeDz/51lnL3voGXlKnC0sPFSlTWCmssmHv4jToaSwtwZzvWbm8/1spC+t1t/8KEUQfu1Bl9dT5j2i2TWQqaveqwCkBWRIYObzk3Ddoob1CWX7lwVjtYdC1yfQPvybuq3mgQqsOs2QeMLBz87QBkLmSY1XOUqqs6e22LSZIzKVX9oBScDTX0UUt0TVotjuIvczXfexJZYG9XgfKOuF50oEZ7JIAoy4OmEzf78WnX6zVv9QPZ0GgzdbCPH6nNqeqrGUew7J9TghNrIEULaz2v7P7uqe26I4oO7BvJ5LmXi+RCAT/31q/GOllz3B4dVPI1CqMCUYc3eRE+C55nqqXepQPtm+3htENNAx0u7nbxcbJZhe435d5fCGx4URJeR3FDjbjke+jxM1jkQZxruJgqW1nP7NWYu1a/ikXAYh5t1GOvej45dgcVmxA+lRv8V0jzax9FEYuTVMLaAwTCMgIWed3TfGwJqAaFD4U3wg9ofuIZRWyjUfVMZ98WcoQFWmSixu4vaR49ijotVIl/z2BO7zxpzx4/44PKtvUaA63TCY3VvVusaOOwxy1ErkFaZGYvWBP7bKk1Wh+XgnyXO9SQ1SU6io+clOtmUljBhjWPoHMVJsQdZVS8XtVGF+a3m4YoMoe5+I+de+R9RKNBmkwbxNf60YPMVHK50PQE2WKH9sJl+51RXMEsby+S1HmduQZH+VpgUnabfb0lOW8tlkAnkZ0kFZsNJyFn5UXa5goF6xwmVZamIdBnV8erJCw/Z0FKYlab5whjTWgpTGanHqbrpOaCMaUKsyN+cU/6kUCS44y10RYUDH8R2ctjivKVH2ul/9VqroYejjm6OhoXl7R1uIZ0z3aD3iEjldMRCJkzQNPn34Hq5MMqaq0SGdQylseGRQnvGgVDP95VGd2hcEf8YyhKdP7IME0gEbCqtntdx4t0VKMoOhkjPOREjeXOW5G9WGxhGR2SRvgeB086+8WkEaTujg9I5QNqQ8k8uF3lOq79tjmVk3tndq9VT4aPmWUqqqCldnCLhl/0E14aAY9zJVfzXJTUZAre+iMLQoHYp1/HWNVhVTLIoctoFXCYpBrS0b7NMfjCgv9Z+y4FkuRBQIvapJfDocGbzSJxlzxl0VAzJuuIs6rQiH22Cgw/ToizHGrYRbT5uJFNaXsFYXApieHCkf6NXUlL0n4shAISjjcNua56cyx8/Hlzl/RQawa6Bf4Xl6ZHITvhl000UH+JrWUEbM85PTDWRXUlNO8UQr/HzNJQoarY80DmZdBqVdErauJ5XbL8Dd4atz4R6hFD0lWn+gUpvsVAxkiJVrCa6F8hfiaboa08bkRjenoAeh9Xg8g7FGS67ON7TA3V53yXsfPiPnFVHw/LeK9zNcAexoqAZ/MVDJrVgNAHvFW89FO0Jk9G+sq+CFiwJThTOxQreZ4AigfedBdIztD8CEUkgrjLSwOnNvl38PruLLlQCer8eGRcaDVqARqUpwKJ8fWoBuwM+oAA2awrHYDMS4Pnz8N5QzTqz0PBuEGi6HckghWBRLgw06JV95azERRxBlQ/SrscMFo1KUL4dASYieFLPhFLGq3UuyE6InUYAPLEAYGB6PIen/ZV0/z49XOj2G2cM46wENHHPLzeacnvmjLbvV1Bavo6HLpyoXrygZlP26s9LXxVNhee1dBIjFca8zXF0hB55tv+L9cih4E41Os+7B+hFdjQKhayAEuiH7qU9Q6U6bPA6yVTGJx6wPLfHcCfAHt1S14LHvjrKi9oJ2dUm09cMU2pnHi+uPWmFbDnAHthwZ8NW5sauLOureqrrSX6Qzjc1TcxDtR7njemPcSEJoxrM5ETRIZ1qhfZQLcZO6tMR7YwYRo6gYhbhC1XVbSSJfvjlgOSgWjtH5vCSh1cLRWH0wMHRUQlKtl+0DTPWj0++VY0RFKD0KC5ADEB6IKMgRpvertCzQvCzIEo8hsykVXlU7AkuJuTu+QoZ2JD5Bz4A5W2fSGWRFKiiMuk52SnyknUSMtsRu3ev98LXlo8H5LkwnK0Fzymn6sPbGAShu+EFo0sT8k+fTKZDMjYkL4WyDwFMDRh3Si3+L+9RmOLXGI6hbV5RSX6KsmliW/LTcRhZ30ihxwiCsO3cSNoDfTGRXcAHqYkSHJFubVuXPYsQaoWNpwAIVJq4tFsved97eaCSZKuLHhAC7sdv6z9RNDyFI7un2kVW+igf7ifeD3zifJ4kvyQKt5Nr5Uct8PRb7mAFhW1nterPWgysYgzPd8M8PxTXHTucjpEVTZCtafiZdkBxGPFoyKyI3jXh6Cj23yjOWSCtQVPqWEV/2a2+rZhqhTyPI1D8CppsKvDq/w6Hct+VOlvNzgj+iZU2e73MtZf6YlaPEAjcIn3CfoNc4avm4D9q7tg8DCZd0Vl8hqtf4LgYeXa7XTN/EUfGU8TZBQsB91R44gjcGC2iuOR8zz+ijM5tk9T0jWjleBOqEXcS34K4gF8gGwA9PhgMGeRzjDCUSNnsAmN475s0sutiUJRHjV0l/lE/utcy4/KeoHrbMlvW6kM0UAiwMV4Lo9flrAcbT98Lf8bwA9di8cyFocTXtCApGYuzCxFr1NDktXELLAhTFFMUmzZPH+Oxpo4qj4Gw8dKAhU20x/3ELeidVVfp8178+XVK8z+RapgP0gpUC/mhZLOBna0aePdXvZuklgaR5Rqa3gds7IvYKWnCxEenKvFXBd0W18/TWNs1ClI6GbtyCTYaDo+xZrLXVvZb8CuExbrkAZm+VE/RfInVkpW+vkHliigycQTlwyRmyBlUxZ1x8tMwziXdPehaeeZr4nNi0PNFrIVP1yflIuYEM3MYuoRy67LBygI1lpzcRFsmjasdCnV9QPTgN0TxP40QMuF94kyzRMuiXXXy3AhlLIXEY0AxYhwxoCcLDcNMexhe9dkkJa/l18i/domEE+oVwYqVRnNMATWfDDmQapOUpINeJSN6teOgqbArNPF8HE5wqF/Dks1JRrGZ3hMBMbJrY0sx7oyH7Uhu7hCK7h9A0qgj0HNNYV2+HyZbjy62iWAEH8RNEDS78WGWCOxO7iGzKg7akfqKJIkv5E7JN9+ngaO7pj1gbeyzvMCmWNHuRPjemXyqlcM7sQKfEGLu2IUasIg2/tzfYrqe9j7RmsVcIWZeHof41pNeI4RISQXAvUbAGcd+l3HyyVcmCfyun+C563jNv6BR9AdrvY9fylhgAiNJUSSGHSNUzVVwnK0qWu7fivSot/Nt9iwpmJ0zN84cmx6y+bTyNlvtlKLcnNvi9sHr/01r8ILe4ktSmoRwBOfzJMs1aH/2mHJRFI7YDLrZ+SXt24btRW81H1W4i3iEvSY8hrfy5NPR7AwsCJ94wC7xafhQmZXKREgld26BPRUN80dyIN6vA04uuavfQAO5mpCUzzMlmktM240Wl8GWDpVnLMEBRXGGGaLnKN+2WKfYEEw8K+TpbIIr0OqHt9UEb2FOlOU+n8qtDR42tFwchvxv267enyVyJAFS2mJY5tOT6GxrMVw0pRNpVAYW4sxfDtbN05u2i9qVnF+chRbaSEjlPeO/5sTUY2tYBjlslqwtA8uzQ7cYutUyiYcQqwTc/24Spl0r5hUZRqqx4g2oMBtg57zN/Vnf2fIjA6YM/xzpV3SR3uUz992opp2Efhb1Q+j1rSixph6Z/XkVDRGrsGD8f5mykmzlI6jGpQqgbhPntRPzMQ/m6OV1r5Ew9oFzkW3xotf0ZEBaKngZF++f/8aK4D3KSUWc6a11+MJ1HLtz4qr+RX/HF1GHzxbQZXTdevqaz2qkUkPrXiZ98km+TBmqQi9OxWF8DCdx+AcDcsF4ADtljDV3kkeMyOTLvIanTQqkzjzKYv5j7bE6kZ/oSpUfMON8d5u6/Hcmg4fU6j8d7OMkM87nND0wl/abHl4nh1VZx8cDVbjoqW14AcOTku3ddGwWa9faJjQk3hCMGKctPZb4/KzieA2sxxSt5wPsMSbzDJd5WtBduTQ2MVZY0dPWYViJN5NDJV+ryXy87Dg1yZn1mv4X7R815T1efdBTtli5Eub9URBQUEySOkNGKZ21a5ciRt8mbDkSlC1VjM5V7KTpu7hxz5leajt+Oc9h4GESeBD2hs90d/M6DVOKgaMmtW33neqSl8zV37f7rL8CSUUpfxEFhbn5gTN7ZpMOquERE9D6DZLMoGkfNrdK9arebdp6qdj/OlJgF9MqajA4mkb2vGHeX4Jz4ZB6LXvfqX8ezd9n3UVDXWYCbnbDtcLt7KcPl2PQkpNPmu8cu5FX9+f9u+7p8cu0R5gU0zgWxE9O/vMZC5Ok5mlRCBspgeen3fcAm56DZ6o74U8kCOJLChFpcF9m5k5ikXbPhxPkeqFGFhAN8S2UMDhlF68BMaSxded7ljR1sF8zn7qvyM0QxPty2cRFhQGbf7EEZYYK42OoYAaastCvfzMmIaDeqfMEvUaYiNVNzuD3uwlLWnoBsjI3sUJykHDsHfNCDXy1goyumQEpxBMX41dXmNc3oY1EtEgRGJokdCUutbAQ/w3IBhZg74gmvfx2lZK000HsfRWLhnGConxjsNN/aci4yjC64p0rAggPn9UaNmofRuTWXtPlk8bHX+OLDp/U6PwzmZPy7X4163srZnK3Qx/JOlbKd1mWRjSez8oC6AvaYY4DuWE7etdZp6bvRmgJkgvismqrfnv7PiQYnFmg8BhLT1DRicdjMEfv76JrOooXueN9EnS6wT1f1XTv4HD/99Qh217Ia/g2i06nmK4Tdg4mT+Ke5lyvsFziGuE1DLP2dHzrbY1yRvBrBa3O80TYAsRdU9+pGzz1ce7bcuEeaCObU0YbEGaIvsJ2WAT+Zaxxwmxpydxma2H5+Aan5kcqPesJJRIXbRJFGAQnwsO3DAxul4jPJtH2iGzNO+9VB1+vcFMhBADbWjI0bMCpbieDW2Tq4+4QgSn7FYwNnkZBrJlyxU/HKbXpemAoHwTYTjJ1eF7EgV9aQFQXTLk/QzQdYhFgE3DKLjYTB8eYbHhevRke/0ZBl31BMrF6r544mO877PMvbrukryR5hhe15VxP6b26W+MkvvPotPIN+7gPgMASj184irNyteBR/CNaM1IfUCV2vaRUbgoowWNPOwhq+S5YYZwF7ifLFpFrtphYT2FO3Jv+AS5bSF6DAlkL6dro/xE08RuwXOhD2HXB+VmsqhnaSGf+u8lvmGt7fb6QnGNE+9nl33PH5M/Sb0ZnVY9CjXi+TnjByf7Fqsy1tiMaA+LyjbDiVUwhYzQmjDAG2YULlG29dBB4F/Or7hLgjjfFnfEWeyRAOmPk51EIyDTP89qZ9oSygn5Wrk+hjw2q6rUserQoxkgNcTKewjOaSxyYlX1d1UNyrUE+Y5PdvSmbzf7Lkc/U+sERS1HrtsljtwXuHl7sK/7QfpIfHEquPg45hNKEAQyHbZUw7foGWbfFHqWRzOAXjruFBbX1z+Nkp2VHzUF8EOW3Mm0Klx5y3eFMqL5jNnzvoKzpuHk6oh+HjbBx9KxomCFvZX5Ngax8RmWbaB2J706daW5MjkKtY4pomqLq+BEh38vpsBXvjUA0+zzZuqdhqdDyVpshrfzxd7AB9l+NeG+VlJzW/eGvrtvhKGlP5sK5G7LDrWlwRgO2Ol/7FN+oB4J4A4JkMEVTm1itje0A5LYeLoxlthi1bxPbThXnAm3FomRw94wxQuMphQFzQ1ZsAbdBab0R7RM8Vjxc4FWcdkWTES6dkcHgHKo+6OIc7NWNYCKj1YZqNtu9kbfvUGEi9EAALfxhBkz5RwH+2luJR6yGTlz5VrcBWFBI53cw0yfg0KttPGSOC9Gyrem/F1w2hwJnpELoGMvnXv1y/ZuuZjUoNVKw+3Yad93yJwM18WyxqIfcsCbZCQf6vzRHW67QDq8JM3VlRhdQUHPWlae6WmpJkuxQkUBS1rqhZ33kd6d/whlXF1tim9GsHDQEHIq/F4uMNO0Prf7/79hZweiqDxabBiwr5VQnLKFc96oniTO4oxpDNQ2DksBj7RUQyrPUIrJjmRYk/kPXaOdkOtcfV3ZNjMhJeyvBWIBE8cc8gLNRmNmIRyK4mDk6AbJSDVul6i2f6aRxIkNzcmv5iHG6Pw7h30KkMcpnhbiYBCstVjAiaab2BDfi/9JOva2N5Pum61WN8HZekyMk81pYAdNy3bYrf6SG8LZZUv5ephM3z9MXzlc5Zig8o75bcR5BQF75bgjipclf07VkwRFoRIZJKYynyTO5+FTFS+SauBcFwY2LZAST3hYNr+T7n4p+RMe9GSljAJs+DAS16KSJq150MGJiXBMXC/YreCwFhiZWyKOgJVc6wjDyrJBEBArKp6j0sZlE3wy11xWE8kPt+I/NngJfU+dp/4oFx2+FAk62pfZjPmwEMA5QRqaxve3tIxAaeQbFlIIJ9JM0WVBrFPOgAnV39wW8njeoHk0+r/AKvfDPK4Fefwvj94T0FC5LpmqFKQl3LcuJoDCZUzaFyrQmVE01C34JKLoJ0ouYD10n7tQsEbOCX+bLzFOdRMoS2SJYMSlGQbLe+Ios2GLjtejzRi+XSYPBuT2ZwPnqlv8nYVYtI8RQhdfwORjrUkyNMEvmBfAw7IZ5waGITEN/x122YmkZ+mJhDiC0fLlgegqeUmwnfVrzmH72/umRPbxZM3zjpTyjhu5xvV2DMjZiG015Ji1kg+Loq21aMqsDwxflw6dwqhJd7zG7+3cw6NL1/MZ+YVfXr9njIpczQHYTbzCWvJdwB368GUAR8/irNTO4GP60BQtOpz4cpNwROeLAuHDg/vu16OLGYHikI7QUkyNIB2ZeN6fMH/sRPSS3A6NSQinUPoghwt6TK5WjbvQ22pyRVouLFL46wBm7rB3JMdsUN3tm4IGFrdNphGd83A3QIchSG7h/rdQA20+vpx01Xr091ADnJ4dSNKBf+GwwsZMyyHFig9SV3ORU2xOvTEL6C4x3TXLpoQ5Dr/pgXDDGngLJNy/8lofAX/E0Vt9Ru+O5A7l2eF2HIZPwwA6lz+TdezNepeloNLwdtp4QCbKIEASWqyug3uEW9z6vf5omWuVG8QsTrlq2dBKuKnvu3Y9AxRmNkbKoEB/w6wXYudQ03cl1z6LQiBNFgWZTpZEYsNTNroOZop/WcnpNc5Ti2GGpmNlD6pUeAaZfI2uhVeTMNxl3N9fTf0IVBofAYbNbcVS5Ww1esy8+J2GEzLdoJWuleg+n5DB4geOy2RiCgBm0eNh2gmzkGIS4MK9UJuoAaXv7gUs4zBvGScPk4Y0HsFY5kvqK3v4UF5eGDdWsTjcNHJ4h0mpS1KdROE6zFtJ0fc/DBQfo1SDZzX5EKvxMTKuJT53NvEKah90nHNjuPd8XdXWttvghczgCSMDfNDg8OJCoX2qCspWYPj6cv6irStUtbyldc5pkSflgw/sjtYBhOiJqEsLMPQ3/cTBFnujMZUWdrczOyyvT3vQDcYQ79ZeD9P0Uo/CdVbZuV2OJNOEjYzka/DKg3XoVl8tk8AdUxmusb5HFf4QNCpLCTU9iJUKURT5N+yYmmURMSHSXHxFE1V0nNe1JJY/5LqkDrwVSb3EMOfzNnCZU3wmNkw7ckv8p0pLEgbMeX4MG3937qpQNtjOk59t4ya/QIwF2aYmER+FcRsmlYsGYzfwQco66wthlu3D/GFVGrZHkfqu954HpC+kivX8zsvx8K3nkVikEQdKjSXQ6gwjr19hRMWh010MWYQTwa18tyH17NWVzfXYyWkgOdX3/9mSYeEJ79lvvFx11kG5tYevkMKLY2eRlXIIlkK8uTdqt3aRMbd/rA3O39KBHwgKpHSKJ7okYFYMrCAWE5i+1BPc09jXjwzci1a0p3/yPHBEZwJwYFBllim9uAVsAvAM8je3pMGw39iKHrGLay9iKG/w9PLdeK/o7K6nK7rUE9iRiM7E0JqhBKiICvev2+lqVXZg1JUWZADkkolvK2iUo+yvMS57F89KtlEO0uuN8eKo98COFxd2Pm0fsZn1qCeex0oGoHr8uC8tcA8mlPiEQ5S4INLo+W/4U1KjpC0oseajtAdg5XTLOhf8J8wPepfrVm8DEwGP/Gil+tWbwMTAY/8aKX61ZvAxMBj/xopfrVm8DEwGP/Gil+tWbwMTAY/8aKX61ZvAxMBj/xopfrVm8DEwGP/Gil+tWbwMTAY/8HtOZ167Nfy3P3v5MY0cLCwfruTzwp6tiiCn4/tT0eWZ4ZwM+e07vHg1iuWV/zr+HnvMH++xEzkaKsP7Ojno1nvTcwItZsyBWkm9TsUsjOEKV7O1SmvXXAsyEdzJkRUcyOnhH4aaPiv2xOg9JEUQ0VajBPkOktwuc/G2sGv6g2J9cuyu0rCqEwx8jcF5Wz/l4D2MXAL1qZExQEPkB9bWtzguhKPGd45FnNjF93bRCyqbkNdAGx3dYgXwwz16aLPGbOB1QkjO8ieWFsGhf/oNISdnr05N8/cFVG2fCY5PXTFg6nxMP4Qt19Sb7kHiUOYLsjq2OEy7h6QT3KKrSmlGWq/92OcnNGwSyJXPA4Ws3QoYm+VfXQE7w7qUFl0vtttP15gBbar+y+oLii2xlbqYlzm7B2qGzzXNRmROagloKD6XDoOJ71ifjbOb6oXjlbvvQQfXqphU1Z0DfPC3PZwytg/El0wZ4lEQygauU5sQHrTipdXochlbWD/So9cg4aqDhRpdyT1DJdQruwPzFlGso6LHvsuY233FlXd/zeITqiojBMTu7RhoNPOEN92CrRzoj0FLI9YzO7TxfMv6Gjv4pyJQ7iqyWADNpuVzr7TM9gxWtfaJcC+pMxR9bWwo58ouOv0BohenbthrjmOg52F3GbiinzhvLcQFy/rjGIpqaNXA4OGnRvqYY8d0VyJ7ZEZBcG6REJ1TMAv820kU67BQ1OvOWyZdNyde6Fw9u6KrETTL5Qr+6zYxfQOigPDbPLipnFktHVCzNSftDC3EyCtW6K8yRwW2tNN08dsfXAD3xOJ+9nMOSk0fXVtR0LafrD53VK6rNuUmZLglL98/gcecDsc3NG9CJxNNOZ2YjwDs5+Lsg+01ErFpi41C8jfclVmSBimlYf2NtpObaeXWiyDWsR4THyENpGn87K0gw4tLd2sbb9WtgFnC8r7psIIk5SzVZDMkImAqEGErA7TMpOXod0IN+BacxMg3+yVrMkRWbWEXtii1W2YTSyWsTjtMmtS7Q2itxtNN6Aq3l96ox3d6bL6H8xbzcVhrro6KjTlTra3AmZBYwhIgBFss4u2LJqOLNb+UVdFav8LjYFeSQ0DeqIJWzk9RW7DFjfGBR7ok+EGGxW4GTu6Ct4gvuv6YXkyWNzAMiLfAGNqurqNXoeahzdxN9OIq0bjgw+HS5ICK3wqk5HYIV1pMF1vKNO4jsnx72RrKfrzYBS0CK6jTmGIi3kH3uxa3Fxq18C+pjyzSv24Dq1Qdd2FLMBw8CXV8Hp9e7W5gnGB9ElFK9/yyBAfsdzRuTTOL4r2ToMva2RDWQI9I0O18vlZeeaQyJ9ciC2I232iIr9VrmmV1DTEhHDVwEDhAMfjNEXudNMhEHTeopLIpufrlRF+UZu+by5uLP9Uey34ApzPSzVZNiQgwtkdG7i3QujJKq2OKPYqtWO0tNGKZTPikgmdGFYCPfzZWwdnY308p8KDOSz2jd7J81sWuKK9jrE1sOFx49ugoz1FYTvGZ4lj9MUrztZaAR4sFjFLZekXQ9yX7jJ89jnqHtv/s/W34k2tiPIUYRiQhdKp+f30ihVt2vJ/ZkS9/xFCXbcJDIDWSdr8rX17xayRaD7QZXO+UBYfUQQ0r1mlNgu5t7SrYEwcr/ivUiYR9rpk/Gl7P6r9jgv/18CNLnPyvB1zkf3atbTdS7OrYStvNBu0gigPdavG34/MSbVCKT2iA0gEzGsf9SM+yyKL8ub+qjweL0uCO723PDaO+/Igmb6XTNn2pu2kad7auHf5gXOhFk2PdXJQHRJJQhr0M2nsyAVTsKvJjufmvAjWCeC8pfek+DVmH+JGbHuaPCspmC1mRNPEfFP91D8et5IvqqIiZLFQFY1RLlMki4ffMeAFAnKAVO2n/zp9cim8Dub2jdMMsVpnN9l8oce4JYpN6VoxAvyQxRyWJUzMSyM5b+6N+EvsmKRddYSl/ymPGC1rcli5hwjmUSO7ATqeupLUCvlSw/NV3024RESiFrcuGKT3qA3ElMqWIEiLEXAVaCPBlpDiPm8VrGW4e9ltFTpnXktQvLHRFMoMQ4qbBjYj1NFhDwJct915pe6ABxCp4X1wuE9RB0DcHNHhVgauzi64Tzvzx8W0jwVmOyXbgadZst87LOkbToCty3/lF3uLWtar1S8xjwlQfulB+KIFbTjbaAvwNdHd7wvBMnwgdd17nzeP9hYcWEoiz9xbvUMmApnDiXKkcWukIVUzP2Jw1RGTMd3rAjNKD78TC87992opqT6YpeNM2lpU2Sv15nT6ff+P+nycUWHUx6YZJ8r15gTfjOsJFpa9Wqxrdn0EwDS4UrN7oK+OlZfE62QCn16vTYbNHZJD4n9CIMMTz3F1GjcFq8qvUgeYU9IYGaXNM6nXMzHuggnzgP52QFcNtYFkrPMKZ5XLc628DUHj83Xge9h4rnfdKYi6GOSvenxd/k7tRwBL5Kedx/PzLN52BzaSjrONV5nfw8kzrxnHZK+sn9tkSR4k0t4dseeMAbfxAmXPTbxCerZbcGIvvtf33ZdJvpOZWpTLQVXu9FDA+PVFPYAUA6u2RkwhhquTg/z0X0uDD/y59ZCVmCTTOGlmTAfYwzETLrsKCUCyh1pAW+GmIrzQss5DXn032QXgasKHwkT/+OGzjb1qpU5tCVH/TA0v7srMJT4Wr40wATbmSzaefPMljpiZZJ3SRAf6qlLW7F6NrHfEL9cjrYt3S4bxOFQJVkxAUiozJ0XTisb7fpR8nAiuLHv8q2hue/XkOEeUc8uWEEf9jLVTkZl+hFQhC0cfeY5Bak4rVAvmXFFXiMEYODdVVzSx2eunxrU6Z81cW6d3H0J/hq80fSR9zascwODQBg1Y1h0y6vg0tv3O17JC0fHxtoVYlq6kWAUSQm2U6FBy/uXlwDbjNNoZpIOE7P1AMf4YzM1FzQ2/a6nDcMJsxSRkFHTtCeitSX8DbQeGzRueV4cRJblALUOTaiuXde/1zJ+4mYY8nSEE0IVQrnSED6TkLSlKhjYmbIyPrHQymwMlFi2nxYZ7KU25U+ij/8aVMavDru23NXn/91Q5BaBayr167gOZX/NnlO5Y0zO6gJ/Oz+pA+tbKb4CO8LVV3WUwezUNKQo/M8Ou47ESmro66/0JojcDSL71ONgcVup1+PQWWHXki48nCxYOJZAhAdjD6ZTLuvjRyxmrH6EFyJkj+Uc/w1D3n6mewjND/ArJH92kjbT3EJlXK8DLkIFlxXDQMFeNcwuq6WQwBqlLLiPAEBk2RN1z7TsiLO9/GicXGeNMXG1TWgeCb6cygNNuhoYW6crFKwnsBVjz7WsGmAhKXaRuopfKofQuuyHsXhYw3yW+J6HOnxyDEkGoMNchAksQUq/H/edutKj7UhysQg7jSN2UudckRV0vxGd9LgQ3f3/byPS6kqrinb+b1/30BIRoj9O2TpJN353FxMBw5ulu87V9xunj6NFnQjQjcacipsd+5YlUZTD0SlgCfHFVNBvfv2TWW3GMrmOaYnlQrV+YCLt6vwNz4K63ayBoBUgGQJ3yHFG7vK7ybhGsxQ3sRvEir0OofMX99zk/qhDt/AJaZRpmi2sH01rnm9f11pNLBSAoUglGxPhVZuPUOI1NTyd0+X7KPrWlBH5cfpNKSZTN9NU02vRPbY3ItjKgSeKYIW0gzKkCuVphRDBsq/SThDQGE69Mw4K+WQTo10oNIXuZEiDKksbIbwFJ2+RED1Y5r1G47aW/4J5uwiCnGX9IEbwHbzvcpKwQobbf564Nu5xe1hAPm6GFGCUk1hDToAUdKQXfThInOr81KiYU+LG9jZPBNyFjg3kbZmhUObCn7Mc0dX551YZA5wda47p686Lh/y3N2SohSg9CpqhTDtXzD6A0L+FE6A8Sp3bhDWtDkPD0QajqU/lHGvn3nF0aai9l+kD10Y28q0b1/eoBSsHxbDcMnXxfXkP1ZAxUE5taGFoGiLsl1wHR/8UMhIWssOWLH5eZPqAuHBOhiN71eqXB0PhmpP0k+Q/Ga+0R70riuMahoNhBKYnjTaUYhzo7qji1RKIE7KzrTJ70tq1Xwsx/sBxfBeG/7yuUsJoxnHO81Exm7IazpRjTv0JsMxM3ASJtIINZgTl0DEl9qLyteO14rEIzgjNx2zIF7AfYckAvOX6K3kMVFd5t7eA9y2wMr993WH9Op5iI31/1aSBlof4yccL9/y6i7eWfRDGEB7Z9mmjyfsfXid1BqYuXsZp6suogrR1hU8Ipr+8Or4ubh5i9/Cz51d5WMOx6br75E9cuOdUCwQv/dAkF5XvTnNC02mKTNmjzZCcLOUvUh2SKHCznb5X2Es2WcBYXMpaahbG4mKS05rcAaCPB0rd8wqeRGU8tDQCMONo9wKsVsRwhe9X7r/15fJGNEcKs1N9ObqenV5P4ImUTXrUK2UD8C5bvIAK9v1lPdXxr1f8vSZr5y2G5uWFZUn/JDHCpY4KXel7DCeoCbCM/xEq3RERRKJ76rt7HLE1KZUppZIxHxJvOVx8Te9TH8fLw5Oj6rHwkijnmOPGPzgQXeVoVBnXdjqhczeVphZ8i0XWpdsvV1sTxzgVuLBK1Pt2mxu8bEjJSV37Vxb6qSrRsZL8s9x+Wdq0AQzHo3SfRj98FKXzfku+tUGyZ4LhECwfkwZ6eyey+8g/WyhXZL+BRXBiSsl+DhEGHbqKUiktO/jOV869cn0+2eVlkvztihVNIYcqlRvBaWW9GJYAITbJnNqsbwTCpPc92wzie5B1ClHl0xqsgI7zbH883Olv121BNOFhGMXmmQzlezkVusELGSsCqQIgdiUlhoVuJAkynyiMzOTp1iNgr70gjVDAGtdusZpZwARXVIjiU8bQ7AJiYFq0VMwNKpVxJSims/lfzHH84Qd2lxZN1gUaIG9lrXcHAW9xmhjtSjrtNeEb3z0h2XmRx00PZCjxOYQqHJUOBdhDBmm/mD1eQExmbn5hSy3PZLSORbMz6gmCRgQtSAPI6ORSioLJRt11if4i4JwL6xiZFNEANAu4p14dPy635f4UHBr4MXsRLhoc8bwwRwE9nvOzNGGsLEWcj8u+a8RGZO4D9njIUI1bvesaV2XIH6MhyPhzugnzAs95I8dpuygNmzAouh5/y3gF5VjMIlWOqIwkJVguVa8n+MuTMyhAtne8JcmsTFcUxghkrmq4maBvfxff5HWBbCacxkSfv01dtjA+sbJYZcQ3CpYQflc638SoWL6HV2CJ7NdJpfajJ0ISVvUfXLuuYouHT5pVWbc/bozNRFCdgVDYEwlPJMEqeitZiZRr+FB836dhvUVxuPD1WGR3MyQM+I0A7t/r1Dq3SflfVQuBUPaucXwaIMngezXs4IRKlNLCS89qGgMJMTnjXqsc8Ujjt7SzIE2RcrqEut3s8szwWAk1uAbd5OMo8hpKkNUtHaWGoW633gnFTwqbrwtUbg0QnP2mJibLsJRQLL/CnsDyiFIqb1IGemgXE40Mbca35gzgK9I7sU04m0/gWZwsCzssMuEfOAGNLjXk7h5dBxd5hknIhgJeC5MequCzB//behp8IAE183+ICjTxSJI3gFPUD6vHRVZ1FD2GyjBgRZb2qDvS4l7ux6LMYINeGmMR4hE5+duU02npd1KK43pcIj4E4WPRFA+zF+tWL1Yef9afXKQI3w8KEJxDenRuzLcb00zYQVFwP8HSgem7HG5iT0LFFB2ex0jbu8kOc4MDvqvED/zdDBAI6ZjMYzRviIKhi5dlWPy+pWA1K8AACEG9DdEtrTkGaJwFDa8JH/Mrp4jidIGRstOaC6nyJaWwzV2GRQcniMkP//M6G9iAmfyz1SLNxGQs05tWpZZSiPEf6JP7UK4JmAo+7ccug9+eE9car4dxgcKImAdrpsfXq9sY+QBTQqJJTOBalkf8jsV2/1Af7VtACNdBzUbLDCQux0pEs24Xb54t8fg+3WsyxfanxnYY4Iiuvbtb3kkFeEsqhovkWNabO8y6F0xREafYKpltVuftj737fwtfKAppnkzpq35F1Lzp3Pf3b4JXWYyPKOf8PmiJlRTr8WPoIPPchljMVdGOrrzL9mJuaCvrLnUx6tAxyVq5LRvNWoFBMFcibAwpck8upye53bSavsq497bJ+lJC7MRfUH3IktUnRZITXKhmvlpysy50XbBdaIXxVmHoKnZj32aGGNcXUr6zeUfW1uNyUOhufK/AvAURLbY3lPz8+o6QF+GdQusyzVpJIWjUIbhvZsLlnK97aBpcDQ+GfG7YpH7aw2uMT6D9qher74vnuh4bCRBARV2/EMhuQSYmpvO+y/6FYx/YjJ9OJ6CsBMUY7X/7e86NtJQWP5HMXCyt+7SJXa86bDPvTSwspBIMhsCD3Yu7ZKWb2/I4MA8IuSE2xEWCZbQkMfbyVCCodJZzKhJm4FdgrxuxHTzSL4/LSuHYfBj5avQFFsQRdVwBWlOI/Ga1awJm1yLbICcNUvDjXBIZZv/vZ7Wt1IF0saO0ImSzJs0zkH05mlm5sHYRInA18XdWVZUMDBYBbS16hspwmszups8mIAxf3+xhXxve2tOmAxCXWS9v1+7OD/mu64fOuNC8pYiC08wcx5pzUHcxSmMTpObpQIvjFyP+fVG99fZqKdw35Gz4fgVgiJOwNX7kPpxw4izT7fWJBxasFFt0kSRbOsSvsADhePVKW98YT++VgNHUepz4D7ZukTrHe0njRlGZkkHvQSaPT7W7yvXOvcEQipoROM39z85fbPFb/nXUicbho53eX2DMJDX2N3ZSUDuz6x/xJomw6eZYbsWQWLtZra2X4i3absh+9q/dgi8FlzwGzehLoFNB0Q7jIDmnwMJU1BiXD5Ly5NhUF4wFF2NR+ru/4nomtWqkH/cjnpRb0Fa+OaHSE6Amx0IXf5xEIQZSp/Z2XPbVlg6QN6kH4u/1Fa674o06Ein98nHtidOcKYX2R6iw9Ri2eTTB/ao0tEwLhrBQ1Gc6DB0WLq08El896+dNOgwNiOSGxxTzxTvCmLWSTMNqVXJNE+g0fEISHs9+9VSmIZFM92pVgYfZG1tU7oqUeglhBhAAASKPSbUImVc7frw4kmRztllW4tAKP3QfiQb7cEcJijnwTRcKwYbVszEeWNEOlwc/aXk6hg9VobqrcrpXGuPWi1c95I1/nZ4ZaMWfFKR30QtMi8uDpT3xq1VAGROmOv+iiyh8hwIOX5tTNAaP2N4qujUNDgFzRL+wDwyti8mTJzKiGtdK9X4VI9qEVrUOw//7vtH3IJLDw5So0DqaM+RkjoGKryfc2sDbjJOg4yIRB6RuzCIR1GbEZ7Y3lYjndQUw+xwkRg8gqb9atMDKenhTsmRjKhd1qUVbSgdAv4bRuoVttlbQkoSBtISNBGZvkK6zovc3oP4wEAGgksfVVUaxYp9rc46xuySHGbnKDqffX81jfgYPNQpVfKjDH3H1Ua+Qi7s699fGOIGNtumwGKkJv8hgW+xkbqzzQR7N5JftSBbvnqnbvEz4baO3w7KvvQV07RK8HLTadHHoraN3J79ERKowUJfi9/3xGY2c9XTlupe2mr+QOpLAivQFF4mXWFcCVJCfGCB8RfTlnCkV6evgqnRPIsu3oqflPGMhn4foqmTTTTv6rto9qjYI77jvjqzT7FMJSjl3RjvxE1eG6j47YpjFz2KXHmWkgC0mC/xMit/r+Peql7WqSb8qk4RgrnMbBWHGYM3B3Jy8l1RJhMdP9MZS3C71AAWmvHEeyPxujhD8gc2LJBmMDUQ6rhaJ/tkDPSiUezXwLYMTeyibqbk6+Sc9Rao6I9BcaYCdN3TOdeIy9UgjPYTYIdfWh09ORKT1kTGdAPbI5FxfadLupPeIDNs0YpJuloOU02dSLfIRqQOWFaWf1lfHcdUplE0ngw6FpqYWqYLbyCOBeqOgkyWC1myk9rSng+X19AuwLrna36jSadfPlj+Ds/pxoAzX94HZMS+nbziFnCZh9B5SqLtyNutIvQ++AUXtK+Zf4+NX42xS6D0aCvzan1eJ+GkfJb7zSwwgBvySS1zr1pnNIvTWm+s83CNxXztv7HEOBjLaf8U2MszJosY2B6AWU9tRZ5S3sMijrjiZgqM6UaH2hHFcan8jQ/ZJKFi63AeLqVrlPxD9hkXhPdz1gjINyeBZPOb6A/tmG/SMwu8N9k19J785PesjZH4kyZ0pe0jqYp0uMZ7wUFzbWF28yDmAn47Yzn/mGkE6MVa8IViMAvMi9O+1xphlTmOx3TLl5BOmv8LQW80DTJ2x5I7YLQsRphgdwVZ1nsZzUc1VGgzRtu0+VtqydUYbH+fjC6+Lv43jxSgrP/C3v0olXAHtOF+AEktLh3PQi5h0bvtlwtsd8y9JVK25Z7UxwAUFOvPuDPAi61EUFic2n4uX5PCQtAG4xTogewQ96ULIL5tuBiOFpFBADZ39v0SRQdg2Ex0dGC+tO78Kq3Krv28OowanAJaC0OBA8/j87LGhQYhQ+2m5KII8yEmUL/CYwfYkZP/15+XKachtRVz2vOLE/V+dA/9Lm/DZaMK/LGYvhEBX+yJ3xlHMZPWH6tTHJpDrdzS/NGdIY4Fa3SchjyE3rj3GYM2Gg4R6tv4tqyPRKstFvv9znKN1dUB1mI3N4qXtaW/k2LYGI6hmOjNor+orGyATxIDjjcGP0M43SXL+V9Fdxndai4FdvrUx7Dnc+e/njzv1rmINycS8pawDWJMQyGQwHN1oEMuggzwN2KtiV/wLdc9qSs5681c4Xd09Mk0+acPR84ZXPIWhV/rkfY6ATj7CjVNoWUUnnr2jhSbUPFcAnrFzzN7vcaEVZKlUQxXPaMsusniJqh++dB53oqriiZ5g6SD3ycm2QfSi86wS1C69kWlBrtJN9omtQbYNRuOWhGvmEZste1hePzCwS+20b3w/68ulZsr4ZMBkLiIcvdiSJjoyfUD43l3PdBpgxMWThZQc2q/8Qzfiej4NB6xZNMYEerHHCCMQTaFGdnOMUNCuHhDLhb+CoNqHxznpJHSJylfLbvVbwikxRFxxLpbYK4IQUKZ1iLdBzcV1MDXHk5WxtGOgFjf7l652DMPStX61YuMxBVF2OTWBuSgIQQHYz6euFH1Z0QAELreOsqPrqwsCjwMcErrGv42LJ7Z5+W6b99dn4krneFB02n5kfSMQlzilEXhPOpLkY9SCGh9aveEdXOrqFK5rtlUwc7SyetqDYjuSyAYajQhpKflBStwZZRAPkEDdtUrW7GTDe0JI04Cxuu28bcHzT1jwFP/uSZ2Gtz5YA15LQBAuCNPMZfl6aYiUyiEDqq2ggz1Nu1fUtWA8ieNBQ9A18lXmMUgP5SCWvRCqJt0lGIga+tr4OKUC0dsEcIP7Q1kibp7awGVmQURqkqqIRUKz8by1MxsrYF30fEcEuE4koBRUWsF0Ahxpc1msJ/POrAaApQSEReKuNWO+OkM+zJl/Gs/o584KhKPTHK2L9uf4nO3j+zFSao4Ri5C7YrruaEMg4UhpTLYCS0YRW+/WGKHwKzm85V2fahqxoZrs4NLEGd2I2P0iL6HWK+YIMIdPno2YlI2BMiUV5XTrdAR3K4fdKGQtrFE6CCX6J1RRN0BeBqbpE6u0dM5s4BYAHNG9mFvv2ifvEsJ+oLEiL5IQQglLTmUMJ60IzwXUgPK2TalkH0/hBtyvWBdnAUWaQ+K4PGYULp+NvoRv+FhRQX4gY2aw4Wx4V0FTuvojKBjXh+pUxBZYgG88JySwsBEy5x/Cv7UYN6yTtvzE44l9FjofRItOvMbqouN/fuGbZVXu7Me1nPy3W45FliofwoZBmAWEEg1qH/R4Vdxr27ls7BWt2uVAGEaSgJvTvd7+CvuS+Ad1cZ44Y26mcC60fFOJdYU9gvl0Pf90uEg0sI+/E5Ie1zxrWTbGj/oFDFqwQDht0pp+cayv5N9/14ZGsw9fsRgzXPSCF8uNpiQ/bGsPTvNYRVEeVLDJSJxYtm9ibz23zBWYZMM4nc4zxuTCktDBo+HpzXhAuJ4j6BghAfkSVmLbju/AKNuZyelGwRn0VzVdk6C++DJsZOtOsBnwYHtEmk6nCzkH2fOP9VRLJ715NMFv8xDBrsSGN81m4DaV2IcmOXeNmQe7+r4HeU48qxIO2KLSOMN5PrcMzsbIWmvp96VrnnkrR4gHWLAqzCK7eZK/QCZ2cQT89d2xAH/0y7rDt0gQjWLW0iBn2XM8iZhVbziW6JJg6dRbnEPev+jRXfQ20rF6+50VVo/p15Kdq9bh8uzEuTtuFquOBmp016ODCaqjrlJzWFOr3eVf8LpJeMvZ8c3Kt6Zg2LitBVsZmZhf9TUqEP+ueH925JZThjlffr4bUcjxngZBZK4psXaI6BdTGzzuUt+7QSUoe+QcT2k6D+dp8zE3T9J3VSposP02LoLchjUON9ktQLBL4Yet8X2kw/cM5Cy0tEWJ02vZcgzIKZdGaZS8w6Wjk2ijrCZqxBheetum4AmEr6kzyiBWG9bXQBflUg4rd0VU0AEqHAvMBj1QA/Vn9t9aViC6ELzxLrwFlvTx4W1f/RII7vgJb8IN2Gw2mEJLrPirAOJwK9xE3d8L5dHiag9FI1m6c7TvTE2ff8MNvYOajPlfnfN6yZB76udqa4XyrM+RTQUWzEcipxcrVs7ToelYN8Pawx/srUmxUmLERIif8P/nf2cIutCKuUDNcNCVtOloc5gSTQp3hB0Mfq4birX8ogPGNBY7IHxFkat4iwM144OAQTJsRGrBKhgU9hKcvjYDgTaxJgg2xgyzxkhLS1DjK8SBFBvnwDaDS1FnJcZ5gkNFAVHgyfNCB+D0XiKOa6cSpbJZbiFDbaB92J68/ylHJoSKqVDWrNdegWxL8e971sw5ag0wShBl4rLSyL/rMkBg97Ip6l2yKGN2FpMS3ajjrOUn9gPkSlHmx68dvziwMhGffc3ylO1ZnU9ItpotBPmFadTQ1XPtuRXi7Wl5L92yP3yJqlYez6KBuqsn2XAAaLe7SJ3ni5Eby9v17mz1O88SOpyEdbx3KJxE/gdmK3M3jlSHV4039ceXMLZtx9m+oO2oawcWJtWXvYbhy2n8GXOprw3ChIGO7CDVH2u41xth8yACnuxuf4oSvPQdMARO6wNTGf2u73v7ZL/nGIRh9X2qPYxlZ6XI7pFhrylS5TbgsYMG8qr2cGF5drMz+23SwUC0N4v6Bgm7dGIjysJqHTJgge+7Wi58jWZNodhaFi/v/HcebySFpHgZE72Wvi/dSbGqMf708JU93LbTs7OOyzyzlYfpER6S4bRN0D6QiUATn/xmWJhi1VoDyrD0Hwwac/G3BxiaaHSllBmfXDNiTkn/XhxNIINgP5AcD0YseAtIjaz6bMQ0ZLiAOochWNqVvFSEOtrvcBCZZPr8nnnoHnc5i5fZtyrNkWCjoj32wyxKzTruNiAgvVCg8WTZlxB9AIMwQgmS8cE36KAQhp+s88O/9qiSCMFJa/5DaWFZ8p9pIrtQxBUjXuO8HS3QBEKw6dHr2KcKQqiBOacv6yYOrViuUHgrs1yjvGK9OL3gwDrpffieNR6GBsFV8fKRfLjcWEHljr5mGpoGOZj0Iic/mQk49vJS6R04ilt6S9D5nSTh2kg1Qjwk+xuPZgVrR6U8JfHhCJhtOuTj5A02IdRc85QFqH+JFJqA3mN44yzpEdtD39r1tg/V89TGzoIl2SoAMFUfMl5YbgcWWVPe3R+NvpjiU2KsYqZmmQHtrIjw1S9rE0vgGEy5sqH9Wya1TOB9KxuV27SRf+Q6q1bDw/JfI0QpB7mXkhN4SNVAosG5omvudWt6dbNv7aIkWYKEAlG7i8AMN7OdSeWvlObBr6f+Z3B3u6fT9Taru+rqWZnOPvCXE1sYgYF7r3i+QlJ0nWoh0qnV8Kr8QNcJLkCIvYuhzps9fb5RuyY7UxYEUE9MCsc/xYgOulO77y6t3yCFbmMdtkkPHLJJan5aQh8kcfeS6/PZfrFbRbhAspxY3eCtPCsYVZ8O9FJHDaOCzHDl2/5W84fdq+RtcbUrMDsCnO47c3KaMgnmdvoHr2ZcojvHIaAXJCynEPBnVaupbiNoIw1WntW6aa6tH18uHgci1ikaqicB+SP1l2b9LHEYTx1CUjNC+rvxefatZbq45XICGG+rt6U7/F6WyFc2hBNEniYOyF8LwH6hW+F+nEdgUjDC4KtMy0VDDMPH1T2hGZtuoZovAXwykaJupzLQKZMhHtgIG2T3tbBppu8yVBi4sOM2J2HRMKLryF8IVFGKIcDxAsMUmO+5yvltACsiw2b5wWRuGOgDcJ+efXqz7o+rQId+PxRS5Qisk2jUIwXS/CMxSmRV16zHrV77rNXTef7uxw12MTHoQotPEuv691i2YqB3CTfMmp6UoAYSjzguoTVKLlBUJdHtOdPvWtsYZiQomqIkdFidFwTPoR0opYa7PtTS+IJuUl7mjzEFWGSJiv7TaPa4fipl0Iz79qz8Ciw4q8DpCIxA5lA9Dv+6PJsckoZYdelOEMjCXvNpyiM/OlSmh8f2eyEIWsw1w31Lm6M0qUE4JhARuTvG2nlmEeM8dilNfzKYd4cSRfS5K0fKLvJEHIEcgVmaoU8TxJIdqonLt0gqr2GuEpislpPyohHR8/GyCsRkYWRXJf2d/g4hEXp5lyfpWiL41BxI6glaQrcWIdRq/VrlEZuW1ShliRJ82fKJu/Vflo1w7bSpkKFdXdCS7jXvcP8S20Dmg5H/m5e/pRbQ9ZnCCLhG8LOymsZHp9Dy8QvcdyiV/cJHCACwB6NBLPLbkK4Dywgv8M+Ut0TfY293+rPW8P1La+TE3C3YXBULSgdyzCFctlbDiFx6JYkPsuD1RTFadTpAgvH7kcMIWXtr4qegjdyVLR3l0QkZDjj8n6bx5LWjq+FDLn9qpn0grCUtRLoMZJLoJomOsa4ZZBmtriOIkYqDQj99DptwbPdS2N134Onh4tvw+qmnu6kQxm8JiHTzVZ2Sls98EJ+c255CgIfD2wNif2I8J/ldXVV8U53XA4nuBikbad1w/gf0IisOKLLv/+XW65dvGBdLSpSq6A5mWXGJ4xQLl/NLlTVHB1vAagaev0RxKHJp0oLrpGjC4sLHIjSuPcaBUvOI3QF0b3BzEd7+mt1Fiv7mqne14uLf4Y1jKwxDaT5BY1owpfpvlIx/1eom1P3eznYCZyCoXR1/poRfoq5Xn+wapZ5DxrDl9bH6KycNW1U7RjRX07/FV+o/UDOLuh2uuCkeR7NPBlO+ymkrNSlR/X0xKU40mLf6foQYC7Eltrk22fYrnRX6x2LTFDpXZGMobsVsstyFQtrq91oZ6Jn+DbQ/XSPO2l6saa4VqpOzGVK78oHjYx2p0K8mJt/7bpDbr+gVapkkR3GDC+BJcMizojXxlZmfBjUUlMIZTbxovGZAKQO7TftihDpExfIuO3sv7drElxTqWyj6s268x+bZYOXH1FSJ/pCkrzlUFVKgLheKd2p5FZZ+C0YB03lRzY33NAZ+/szXmmOznLNRefSQuG++OSAEbA289tECHfJFZHv06ACN622fUVehrr2GvPRfMJkk7t8YASJ+CH/J5B4Kj9Cx8jMbDcKz78gznELNd4oB7hPJxz+aIkljkKkYarXnmXgouBf6bGv6Cc4gSid9pJnbQq74GKV13ebx5Naamqk5S9wvoBNDwf4H5uJ8bI7s17ldlDKooGNbRz+M0/EPfs3fZPATPlrZe0MKlnGpXvJ7wlqRUL6ATQ8sBXFqd3YvpTknLuri9Ya9ft6XaOfhO7EdaHGllyzxRWdLK54Twy+K5glPetrxz8p8kSGH54nWtTOoC5WnYKe5VMVhHRHeL0n9UILrfJQurmhBAcRRsd8C9gS9ntiAimfI37BY5MQUelgJLPsJpMfb68lzZh1HMz/bmcakb6C4EyEU5XCpMK5Id52PbH/G4ltjD/txjYDEhtDouQXsrnYYf4YPqVr4R+6C4pqeupEnaLDP/5UKrqpqI2i3egJIZasV8mxGqo8qA+2mIAeyOHUaWEXMTMtKviqRKucjzTmopTRWtZJ/Lxg6A+9I/uCweE1pAFyQVIE/gtCT99pzP1qfpQI0T+xaZXci7Xix3lqG2i79ZpCeIzEx3PNDqk3sYgrWri4VJcbu2Chl5ARZgjByoK1Zg/njRXPVl1CkaPttBnSxAqYv67euov5f6gurzcgAjvc3X18GiYgjZcGOzPd65TEuKJPrY+MmFAhmRYUD+eVAKzT+WUVSM/bOrdzclh/Ee1a7LTUmQfGIgS5cLrjWqsqO0cyEgwOp/82T4xL2pW/b7Fu0+6iXbfYluT2VpdsZWip/jt8Wm6Xli2pJykBrv+x7MffkSD5i/m6RRbQGOAWx03ylKkov5QnI4TNM+BES2DxFzv+5e8iyAzltVUGp45G/NFxaV1QudEP6VPcbo+8/WPfC10LM9FmM15TCG/XchYZWE0IGmSelqqSpUKOg6oJbRNCEhqu5wwdXg1LXcLHb+nDRqlNgGB6cYkDGiDDHzWlmqpMNV47/7ySPuqx0YvviBD06c9vYjHMDQ7yZWLUIGhnlrkr0XpTVn+c/XUufX2aFsAoCZ5MTBzZiWamQDQHufhmzWHScoPfq9Bf5iKPajnkEc8MEpQIfH7xSBlg94KaiIqQvNP2hiS8M47//9HM1nSEyVIjZG9qxdev9qir41Pbrd0cSHoR/pR0VfsncnoGHoQZ8yXsHibJmlMoiwUBRrmwt2529DP2YT697moxZPBnrAvbV38mGO/0MyRlYOjBlBaluMAAMGx2v8opmqQ952js0iSwwtArRp60hocvwwmEVL1eJ1Y4VSdTV7HKdKL5xbcynsdw9USi1pRNCTWP9ynLLIT7UzBGsLu1sCvfBBXEHA4zVEZgeN9vxO+AQeXVogsT2FWKUVSKdED2BG1+pURtyJymmm/lbBk1lvnHUjl+yRtyLt4SB3vAaagbVl+uJsZ2QVZs+kfKLYqEhS5cYZWj2SU/Xt5+9QkStgm33SOCeubRWvNNI7OS1FKi1kCNJNNuX4ATlAfZnLuvA/29yTCQVv94MQQH/doBYTVd2KTF82sgT8oCDbxD2uY6bjzkKeLBnEUcK1jYhwE53v8Ny1vuT/eZAT4dtKQtSfsd5d3uk5Vqaw4/rbjj6O6VfHLxRRQOLDN1gyTIy8YwMUuZ547cBH1HeGo5hCChJzuWMFoAlJKS1DV0Ihrx9M642a+REDEWGDOe4mo0GN2fDLfMolmWNr9nlNkZ/hN/xhMQwa4nhLnPkGLIigbLAyxt1110HK7Ec8bp3WIZ0lhVMFsn48Vs2BsBDLT3QbN5fL9GVua/sPKr2U0bsf85g8+MldKhMA2Z0Uq9L9TWKZMWlZgTzz35jc0n28YYXL8E8cR2PP2VHsxyX4wysFyQenZXHaJTDeBFsNdnnF60Tze71aJCirWuSDtDYyFMjhQMCRIUjeXyrYSegM82McuBaOVC4Bf0EWYtb9/IsP55l0pS3CwFDUp+fwhbzEEiuqvYPYCKXV0w5DoQfhQWtZbLeOsHxPK1DaaJamDd0b/h2kLX2urRhy5uQ/Qr40chb6NBs5o5/9ETEeA+Q5R5IqCqhhB6nmVtSJNjEAWrjKStzcehbGIFtDz0RZayuseaRAun4VNUkN56HtiMaJd+Bspiba38kWzr9a9vwiZI7vPfcyifKDsWfokiQfFxZN8nNV7Ztf+li+MR+iE0m+VcoiYfQm4rK0mh1GDYonVwjloJoZ2yzKZc5ZvHTEhILQOg5RxgVjCf6QjQ8b2feZE1UNKLv3XSZUFkD3Hsst8wgpNEyxFwlxawcGMrPzuZToFm2U7AHLcsEnZfyM5IcEiM522T8FAG5roXyvpY/K56GRpMDzl3jW511YytVv1tt6mwZkhTynGI8Sq+xl/qr7EKc6krYJLTI/Mo8/XBuzyE21nXIXQFewnQdYi2QTMqgl8K6dgq+b12GVJTDw/YGOJ2S6DDUs2D3/v1cRsMfM+SA0/Zce7CezYCs7hOH7hXBrpzrZ8IcGmwdpJ2mo6bWaOjXK7ZiTjYSjj0jMiJm3M/ouM+8ZHIRoKCB8We13FsQ8SDCwrcq3prJQd2u/1Vm9I+3NCS2toO73oLQ9Ik/hPkmWoLdYxfhQT2ZpoxY+tyK2qmlvEP8Ev6NyS03jOwMNQ0tajFdwGIxs19Itc30SzqDbQGejmvkf/5v+gdIfVEcL5UH+SwwpHA2vsdLgJTBrK6Dt1ocwRRqUn7EzG8wr+l5eO4jxUWVbS0mJ9H20F1iIb0nE0NZLlQ9ASO5RvN4+HSFFtdOvHl3S5JHDC4W+9jZnV+k1ci4hhsVIkw/H/HC5NWW+cyKiyKwm+jMLXlb23Bl6jxiyJYTswy8FV46Uptfs1LrJNUKLenDGNJGdKknWoozr+4P85pMrZZEsPYsOCwFaGLaDXBY5eyiDSXebebP+XKu+ien346+GttulttixnGr1YMIo4tbnJuEFffFhFDM3Up/US9IDwTdDJ5RfPXbxhhitKyneUdK+u9ayo14KnZejjePXNTXGqfHB2ac68hZ56txM31PwkhjinLodjEq1Xz48CPOkk8di/RWKtM5Q0O4ydRpu9SX7NFpn68B4Ybwb0bQYANNJaWpkOsbaUvUwaE6X6pzT8ZclILsntvDReZYEqncevVV4temfRbARd6J8Ws7jjKGt9tKOfaFfZbb62JSJQ43y0Nag4McYdurDFKqxmv4tkBWH+bpHLpUugSBqEFRWNl+Fdpy2hIoYF7YxXignbmI8MdruQ10fb3ljN0qMbaL06zUU/rTEEDkPbMbicjJLLvnDJV1NDm71vcZ1YFrioIMzVxmlQilYsGcwBAsiVoSQ6bbGoqCSDvTMWqiWYVWyvUH2yYmtxMHhzmdI7GNUVMVGkFW+Cu9ppMxpWYLoRyvOVgzz435c3wDkSwpWfYI0Fh5z7gHbViYo5Sk+akjeS6LFy2uhw6ChQ4KrVyBMSLXk3QuN3BI8dSqKgBxNoA7uyZ9NWKPabjBgGvaeb2WwqFH1uABzuesOdenxnGVCMOFSm0+9T3xELqMkcgvFtzX0S6xAvoov1Es2SJuBnsRQ+EfOUm1mPO+Vh8YRyJ4aMZmrnsezDAlu0KCLHKAttASvHgzePU/Z1bXlHEzx/xrfl/7W7C0vMTgBZEm+2fzqVhh8ITPUb+GFlCszVHEbkydDXIxj2tgbTaEcjGst1HeYECgl0o/GSTKLKqngv+sFtVPFHtwLn8yCtJPCZtU3lk8LaU63VU3xVA0gnvNZQtNz1WrAzcJL+qNtWt68j0/VFCeFcVc74kJV8/AXjF4gDpK0PH1BTcyNE9+ZMm1pdRXvqZC7ekbpW4Z3s/rnOj8tyMDeHuFSvpRnX34DrNMGb/8kAoOD+30Kjhck7xc7AtTrGtCuxnGvSQTfiRQgjANIlstJMsIQPg04JwNr6rUP405srl4XxUV0+iu6i7VnCfUoLxQyfZN6fxB//nyeLdXX6CxCbnfGh/bA9eWwyYjZBJ/i8JHAX9EjffRRnTCGhl2RvEKraEw4sisRYM1i8xoVxDm+kxk6HKfGouVnb97KZLMhKWtoOex9+wHix5wEHv41Ez8NsiX5nB7lfNqw1WpXXLQQq8+3UhAdGbxhgiDtnS+GXPfVPd3pGHbI1MDL+kciMolKligTABLPFthV3h0e9DYyKlvS/jYKI5v6WgpvwlSAtDcabSXOyUe7GBzdyht7YdzKrkdB3Vw9v5/Yk5wsV1zaC9S9FxDj8wekcsl3u3zd00V8o20PmU5LpDF3qa53EHGOJOYDiudAtRX4BKd8gGE5xCC829qRn1UepUfg2QAPRIl9wA/vnyKvaCsaDcRSUz5/tU33zF8i+t897A+/wIchO7k4lehEvMEeVMXWwuYBfNAxkUVwmb2haeahr1Z0x0u8EtVrUsbuaCGO46YFzM1I7rnKCNHNF3Z4UGvCZz9wBT70Raq7gFm2UZni1eu8JvnVBCT/Bl1Y6VfQZVT/u8wd+jH1EWXW+T7Za+vhu/0deFk3GvDZk0erLPlzqEf0cNN2O5Y1msDe8VHPTUQ8bs2prLd6P1SviK8YO4MIqfB0KRMnA9xZjN5jnwnNfaYYbux8QwYFTmxk/lSIGKCfukR4tx3S5XnsHCPocab7iK21G80CeILqu0xsvEltw8DhHlRQPKLriSNheP7QRRhQ7XexnTh+yANmhl8XCHZXmr6g24sCXqos45Jy+a9rc4PTIMIQmQZRMATW3o4SQGF8Lff9e8pZloNKx2vIuZETj52EfJa4j3mGtOBGH9bddACZWk8izzVNAcAO2sMEjCmbq4vEirz63ISyhD2G4BuRzT9QMZztYif5TDmVZSPVhOHQ6dygoUIDl6/sXrsBbqhV/K6NeZoa7GCV1mzw407pCF4RoSaSClwz8J6bmHklFo4psQkGisJF7gCzNws8w+p+pYTNmUKbctG4lNuGG45GxbhTA5m4PA6uHML9qzKkf86FwaljdbdD9kG6+WtUQlczBV47jdHNbFxsaa4AzXOIQAYvqc2k+paG9M/gDlVX/I+PciMMeLkkTSi+RCg/SYFoEKlvp4BfMlQtb9ATSnS9GhS6Nw337nlpI95JM9djKsGN9DeQz1tQUPok1YZwToAmaGR5APhB49YsASCBX53nNWETj6Q/USOzdDJJqDdmCxQqnC2V1EpCMMKwkkUfDswUDUonhRXlsqaZITc+F5Yv1FO5Ghqd6ia7U0PBUO8UVqqAg0kPAfkR++KuVvwF53DrAIYNsX1IEUJ5PgmwkdVK0pcC2RphY0TFtHqvKINipJO0oO5go70pCmgjVPK5u76T0fHyhwDArxuLBCV+aB8wb9KKpmkt/eA6UHv2fGJZWq8t731e7KZ9dpxGYXl910PH3zXZJNYcJ2iwhTW6eO+iz0uaLoCEsFP3I1TsMKln2rGYPdzCNMMrs+JqD8nYqS7NVbr1p3o/+XCoOQoP/f9Vi8r5QpoPI+6v8IXy13E+tIZcDLRGfTvAavx5bCIu4I+Aw9nLOUgQkD+01hJhpEoIz6hPQfblqEKlaR/DavyCuLrS7HUNIrwMPtCn4tllqsgye+1DkNnlXDOTz2f1ieEuqwRPKe67TnwEWIdr+E67kC3hNOh73YvNxd2h0FC6zmozIeFeq3wSRJOAZuZHcMFA3muHuo+fXj6AUzlyAcUIVw/49bLpN1/qVXBoCI2EADRJfw/kY7kNZIcVh550+K8kW2+O+kYoPun3Wz7PhI4GI0KKc5v5Q3mFWgaBghdJTCG5nG/lSQevMp7EqaCXZjWoktwc08iskX/LhRlxvoYeTAeExJ7qcEP7hz654R7is6L3Ng26/LQXeCLumax9/BIHlXR83BeSLvRi9nHUOYWCrHAm7wWYhrZjbdjXVnFxnhyVpmVH47GYOFk0bCzXK07qPl1Vg/jhM1K7UX+jDzmY2jjvjC5jLaTvAC4xiCyJPT1sxR1JKB4DKwqguNVYzUzZEqwj5meNNCOrncb8N3cOiu9n2m4u9FPjgiVZHSdlQ3eZaM7QR1p0ZUzaVWofk2u1OTq35jRTEIHREf7r9D8lYqxDzl5YYWSClu3Lm5RBJYhxZxxr5MCS6lA41Y5a2ngFbMYefHRLnfVY3vbeY8ydrXdjaKuzXAmtyFJqWeLdT60Wibp+PTEv5KJcyRQ3xeBUnOPTvh+VtX7P9nqw/pyF8JPFsNKeY6Zh5bVK0dOieO87JbaP7bhqoTPPsIR+b+OtdwEp5vKfMU6mIPY2RkA4spv+O56ukzglWpVZMukegCx6+X8yiCSjw6lRwv6oWXCbEYTeGPCS8z9W/BwUDIXWBiX2WlLvN0aNeFTk+f5Xs0RmTiLBOwUQqOpsfDZYwXEPqXcNC/oCUVG5k7Vb3izbI5QAC/GsZa1DE3aPxATV9Som2jiDPcBihsllW2vQHwTG0UpddfyPbDqTjFF7FKqyballUFKBHyyQqgkcwh2FMXds8M4x+eNpVvRPWxP1aglJ8097XMpW0bmMOymouiIUBBRsJ1vSUYZr+NAoUSJ35gqD86E2cdHj4/4Ky6U1OXq9DiOTNehSd/WuNQJv+sRnfczmKtAUUi5mNYP7MkQnSZG87HN/QqiJpK55zmQQoKAl7aQLnP6ApxpOizjo62w3PVpDM7Ymh1i8l+ceV3ZmvvaH+BI2olpkB2C4M2Kd3Qc8T3Mi8TsBa+V0nW4G0qQIAL6/f2YrDuvPs4jz2pJHzAzL29hzPAKgYvnl52TNYdu+BWODySlsA2ZjOW1C6QFJ1GsGQVukStNCF4Y35H2eCR/ZdBOaiOOz9Geq0ymt3i8RH+kGK7R7l1MPJKNTs4anYSIErP1arbaYje1GXL7ERQS5300HpoR9qAphFd3Vflr3AnD4kjdyj20KpTcvO1cuh5lZytESbVVn0jkQ22pumPZVTxvkwJuKAOUeiPAne/oD3E+6Hhzt4o4q0B+SgvX5nrs9i89QCAdraWdEfVTvFpTnaB3mAyfHXpfH2VgewJqxXK6gjAU3uiXGzGCiYE3lZB0C28+rJNX0vMCT7Px8tl9lkA+3d9KPHQ0y/owS6bThWjTbdv1uwQOv7ff0K3lL1ncXtogB+RmA7Pf7PxZrzVqR19Ob8mCGkAd4gpY7TnnpbmtjT+LN8fYN8pOAhNYS0C84ZW6LCccl4ofZxmmL5k1I/o7Pt9BAsYpmk9QFvFRRguNQ68ZnChDq5HfZN0JAyYVgGJ4i6CBsanzwkxy3ZYgfhOOEg5AYhv0rfaoID8ZKJdITbGkZr3F2PmxOFGnBy9q3MTeg7JESl/fyqGi3yLWgcK32B0fiWliV+M4bWdLbyy6+M7v7C2aMK8l0KJjSDtXpAF55fBTeGFPGrlQztjzXfaVCR29Yy7eu4lUCtqAcF3snrzUzim4kuneGiHT9YU/D1tx1b34s1eIpjARSVdNeXUWwRQuJ/A81I86P1JTgUDVYuPXUYJQZj4Gmh3kuHgfhj0FJq9YanvaeP1kxLAs3svZiq0FRc1M13o6PZjY1HlBh2gUcup2TXoCjvEcoGUG3G2YgYQwpZ6EPtIMqMBLDTiVYlBA2LhV7+n4/H8sWLySTXjeVXR6HL8U2nJEwdabH2Id3AZPHDmgqvd1JMXJ8XQ2/IaJNDu5pReggZ6ZChZ4E8SUUbduzj5X3twpppb2Ywc5iNGpuHLcCJy+NjI5VKHgfkNOOHrAfghBqQfBalKI10MJ55sGrE1uJhwlsW8hA4HNqgTk4pWTjiYFBhee6rRtqcpwAAA)

## Assistant:

> 8/10/2026 11:49:41

> Identified optimization requirement for complete tree node counting algorithm.
>
> - Identified optimization requirement for complete tree node counting algorithm.
> - **Done**

LC 222 specifically requires O(log²n) — it wants you to exploit the **complete binary tree** property, not just count every node.

**Key insight**: in a complete binary tree, if left height === right height → left subtree is a **perfect** binary tree with `2^h - 1` nodes (no need to traverse it).

```typescript
function countNodes(root: TreeNode | null): number {
  if (!root) return 0;

  let leftHeight = 0, rightHeight = 0;
  let left = root, right = root;

  while (left) { leftHeight++; left = left.left; }
  while (right) { rightHeight++; right = right.right; }

  // perfect binary tree → 2^h - 1 nodes
  if (leftHeight === rightHeight) return Math.pow(2, leftHeight) - 1;

  // not perfect → recurse normally
  return 1 + countNodes(root.left) + countNodes(root.right);
}
```

If `leftHeight === rightHeight` → perfect subtree → use formula instead of traversing. This cuts the work in half each time → O(log²n).

## User:

> 8/10/2026 12:44:03

which is next question

## Assistant:

> 8/10/2026 12:44:05

**Binary Tree Level Order Traversal** — this is the BFS question you skipped earlier. Now you need it.

Go back to the BFS template I gave you:

```typescript
while (queue.length) {
  const levelSize = queue.length;
  // process exactly levelSize nodes
}
```

Try it yourself first.

## User:

> 8/10/2026 12:44:37

Next: Lowest Common Ancestor of a Binary Search Tree.

this is the next question , i did not attempt it

## Assistant:

> 8/10/2026 12:44:39

You're right, sorry. **Lowest Common Ancestor of a BST** is next.

Key property of BST to use here: left subtree has smaller values, right subtree has larger values.

So at any node, if both `p` and `q` are smaller → LCA is in left subtree. If both are larger → LCA is in right subtree. Otherwise → current node is the LCA.

Try coding it.

## User:

> 8/10/2026 12:45:21

![1786346116500_image.png](data:image/webp;base64,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)

which one ?

## Assistant:

> 8/10/2026 12:45:23

**Lowest Common Ancestor of a Binary Search Tree** (the first one) — it's easier because you can use the BST property to decide which direction to go.

The second one (LC 236) is also on your list but comes later — it's harder because it's a plain binary tree with no BST property to exploit.

## User:

> 8/10/2026 12:48:16

but you did not teach me binary saerch tree , i know currently binary trees

## Assistant:

> 8/10/2026 12:48:21

Good catch. Quick explanation:

**Binary Search Tree (BST)** is a binary tree with one extra rule:
- Every node in the **left subtree** has a value **smaller** than the current node
- Every node in the **right subtree** has a value **greater** than the current node

```
        6
       / \
      3   8
     / \ / \
    2  4 7  9
```

For every node:
- `3 < 6` ✓ (left of 6)
- `8 > 6` ✓ (right of 6)
- `2 < 3` ✓ (left of 3)
- `4 > 3` ✓ (right of 3)

**Why it's useful**: you never need to search the whole tree. At each node you can immediately decide — go left or go right. That's why binary search on a BST is O(log n) instead of O(n).

**For LCA of BST**: given nodes `p` and `q`:
- Both smaller than current node → LCA is in **left** subtree
- Both larger than current node → LCA is in **right** subtree
- One smaller, one larger (or one equals current) → current node **is** the LCA

Now try coding it.

## User:

> 8/12/2026 16:12:35

```typescript
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    if(!root) return root
    // Our nodes is in the left
    if (p.val < root.val && q.val < root.val) {
        return lowestCommonAncestor(root.left, p, q)
    } else if (p.val > root.val && q.val > root.val) {
        return lowestCommonAncestor(root.right, p, q)
    } else {
        return lowestCommonAncestor(root, p, q)
    }
};

```

Give me the correct solution

## Assistant:

> 8/12/2026 16:12:39

Almost perfect — just one bug. The `else` case is the LCA — return `root` directly, not a recursive call (that would be infinite loop):

```typescript
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (!root) return null;
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestor(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestor(root.right, p, q);
  return root; // ← current node is the LCA
}
```

You were 95% there — the logic was correct, just the `else` case was wrong. When neither both-left nor both-right, you've found the split point — that's the LCA, return `root` immediately.

## User:

> 8/12/2026 16:17:35

which is the next quesion

## Assistant:

> 8/12/2026 16:17:37

**Binary Tree Level Order Traversal** — this is the BFS question. Go back to the template I gave you earlier:

```typescript
const queue: TreeNode[] = [root];
while (queue.length) {
  const levelSize = queue.length;
  // process exactly levelSize nodes
}
```

Try it yourself first.

## User:

> 8/12/2026 17:55:55

give me the solution for this , i can't

## Assistant:

> 8/12/2026 17:56:00

```typescript
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length) {
    const levelSize = queue.length;
    const level: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}
```

I already gave you this exact solution earlier. The key things to remember:

- `queue.shift()` removes and returns the first element
- `levelSize = queue.length` at the start of each iteration freezes the current level's size
- Add children to queue **after** processing the parent
- `level` collects current level's values, push to `result` after processing all nodes in that level

This BFS template is reused in Right Side View, Zigzag Traversal, and several other problems on your list. Memorize it.

## User:

> 8/12/2026 21:39:35

how much time should i give for a easy and medium solving it for first time ,and after how much time , i should see the solution ?

## Assistant:

> 8/12/2026 21:39:41

**Easy problems:**
- Think for **10-15 minutes** max
- If no progress after 15 min → look at hint, try 5 more minutes
- Still stuck → see solution

**Medium problems:**
- Think for **20-25 minutes** max
- If no progress after 25 min → look at hint, try 10 more minutes
- Still stuck → see solution

**Hard problems:**
- Think for **30 minutes** max
- Hints are expected, don't feel bad
- Still stuck → see solution

**Important rules:**
- Don't stare at a blank screen — if you have zero idea after 5 minutes, draw the problem on paper first
- Seeing the solution is not failure — **understanding why it works** is what matters
- After seeing a solution, close it and **rewrite it yourself from scratch** — that's the real practice
- Never copy-paste a solution without understanding it

**Where you are right now**: you're learning patterns for the first time, so seeing solutions early is fine. Once you've done 50-60 problems, your timer should naturally extend because you'll recognize patterns faster.

The goal isn't to solve everything alone — it's to build pattern recognition so eventually you don't need hints at all.

## User:

> 8/12/2026 22:18:14

> File: 

## Assistant:

> 8/12/2026 22:18:16

> - **Done**

## User:

> 8/12/2026 22:18:37

> File: 

give me 5 extra problems to do for each topic except trees

## Assistant:

> 8/12/2026 22:18:47

> Inventoried topics and curated supplementary problems strategically.
>
> - Inventoried topics and curated supplementary problems strategically.
> - **Done**

**Arrays & Hashing (+5):**
1. Longest Consecutive Sequence (LC 128)
2. Valid Sudoku (LC 36)
3. Sort Colors (LC 75)
4. Subarray Sum Equals K (LC 560)
5. Majority Element (LC 169)

**Binary Search (+5):**
1. Search Insert Position (LC 35)
2. Capacity to Ship Packages (LC 1011)
3. Find Peak Element (LC 162)
4. Split Array Largest Sum (LC 410)
5. Aggressive Cows (GFG)

**Linked List (+5):**
1. Rotate List (LC 61)
2. Partition List (LC 86)
3. Remove Duplicates from Sorted List II (LC 82)
4. Flatten a Multilevel Doubly Linked List (LC 430)
5. Delete Node in a Linked List (LC 237)

**Sliding Window (+5):**
1. Minimum Window Substring (LC 76) ← most important
2. Sliding Window Maximum (LC 239) ← monotonic deque
3. Subarrays with K Different Integers (LC 992)
4. Longest Subarray of 1s After Deleting One Element (LC 1493)
5. Maximum Points from Cards (LC 1423)

**Stack (+5):**
1. Largest Rectangle in Histogram (LC 84) ← already on your list
2. Online Stock Span (LC 901)
3. Next Greater Element II (LC 503)
4. Sum of Subarray Minimums (LC 907)
5. Trapping Rain Water (LC 42)

**Two Pointers (+5):**
1. Sort Colors (LC 75)
2. Boats to Save People (LC 881)
3. Partition Labels (LC 763)
4. Bag of Tokens (LC 948)
5. 4Sum (LC 18)

## User:

> 8/13/2026 8:46:40

i am currently on trees topic and i am thinking to do 2 on topic question + 1 off topic question everyday ? will it be correct

## Assistant:

> 8/13/2026 8:46:46

Good strategy, but I'd adjust it slightly:

**My suggestion: 3 on-topic + 1 off-topic per day**

Reasons:
- 2 on-topic is too slow — trees has 25 questions, at 2/day that's 12+ days just for trees
- 1 off-topic keeps previously learned patterns fresh — good call on that part
- 3 on-topic gets you through trees in 8-9 days at a reasonable pace

**For the off-topic rotation**, cycle through previous topics so nothing goes stale:
- Day 1 off-topic: Arrays & Hashing
- Day 2 off-topic: Two Pointers
- Day 3 off-topic: Sliding Window
- Day 4 off-topic: Stack
- Day 5 off-topic: Binary Search
- Day 6 off-topic: Linked List
- repeat

**One rule**: if you're stuck on a hard tree problem for 30+ minutes, don't force a 3rd tree problem that day. Quality over quantity — 2 well-understood problems beats 3 half-understood ones.

Your instinct to mix topics is correct though — that's exactly how you build long-term retention instead of just short-term pattern matching.

## User:

> 8/13/2026 8:47:51

give me the next tree question

## Assistant:

> 8/13/2026 8:47:52

**Binary Tree Right Side View** — try it yourself first.

Hint: use your level order traversal (BFS) template. At each level, only add the **last node** to the result.

## User:

> 8/13/2026 10:22:42

```typescript
function rightSideView(root: TreeNode | null): number[] {
 if (!root) return []
  const result: number[] = []
  let queue: TreeNode[] = [root]
  while (queue.length) {
    const levelSize = queue.length
    const level: number[] = []
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!
      level.push(node.val)
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    const popped = level.pop()!
    result.push(popped)
  }
  return result
};

is this correct
```

## Assistant:

> 8/13/2026 10:22:45

Correct. ✓

Small optimization — no need for the `level` array at all. Just grab the last node directly during the loop:

```typescript
function rightSideView(root: TreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const queue: TreeNode[] = [root];

  while (queue.length) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      if (i === levelSize - 1) result.push(node.val); // last node of level
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return result;
}
```

Your solution works fine though. Next question?

## User:

> 8/13/2026 10:27:01

which is the next question

## Assistant:

> 8/13/2026 10:27:02

**Count Good Nodes in Binary Tree** — try it yourself first.

Hint: a node is "good" if no node on the path from root to that node has a value greater than it. Track the maximum value seen so far as you traverse down.

## User:

> 8/13/2026 12:22:58

```typescript
function goodNodes(root: TreeNode | null): number {
  if (!root) return 0
  if (root.val <= root.left?.val )return 1 + goodNodes(root.left)
  if (root.val <= root.right?.val) return 1 + goodNodes(root.right)
};

Please give me hint , i can think this
```

## Assistant:

> 8/13/2026 12:23:01

Your approach is wrong — you're comparing `root.val` with its children, but that's not what the problem asks.

A node is "good" if its value is **≥ max value seen on the path from root to that node**.

You need to pass the `maxSoFar` down as you recurse:

```typescript
function dfs(node, maxSoFar) {
  // is current node good? → node.val >= maxSoFar
  // update maxSoFar before going deeper
  // count good nodes in left + right subtrees
}
```

Try coding with this structure.

## User:

> 8/13/2026 12:32:24

```typescript
function goodNodes(root: TreeNode | null): number {
    if (!root) return 0
    let goodNodes = 0 
    function dfs(node: TreeNode | null, maxSofar: number = -Infinity): number {
        if (!node) return 0
        maxSofar = Math.max(maxSofar , node.val)
        if(node.val >= maxSofar) goodNodes++
        return dfs(node.left , maxSofar) || dfs(node.right , maxSofar)
    }
    dfs(root)
    return goodNodes
};

```

## Assistant:

> 8/13/2026 12:32:27

Two bugs:

1. `maxSofar = Math.max(maxSofar, node.val)` runs **before** `if(node.val >= maxSofar)` — so `maxSofar` is always equal to `node.val` after the update, making every node "good". Check before updating.

2. `return dfs(node.left) || dfs(node.right)` — `||` is wrong here, you're not using the return value anyway since you're tracking `goodNodes` externally. Just call both without return.

Fix:
```typescript
if (node.val >= maxSofar) goodNodes++;
maxSofar = Math.max(maxSofar, node.val); // update AFTER check
dfs(node.left, maxSofar);
dfs(node.right, maxSofar);
```

Try fixing it.

## User:

> 8/13/2026 12:32:57

![1786604566997_image.png](data:image/webp;base64,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)

but it was accepeted on leetcoce

## Assistant:

> 8/13/2026 12:33:25

> Scrutinized code logic and traced execution flow carefully.
>
> - Scrutinized code logic and traced execution flow carefully.
> - **Done**

I was wrong — your code actually works correctly. Let me explain why:

**Bug 1 I claimed (order of update/check):**
```typescript
maxSofar = Math.max(maxSofar, node.val)  // update first
if(node.val >= maxSofar) goodNodes++      // then check
```
This still works because after the update:
- If `node.val >= original maxSofar` → `maxSofar` becomes `node.val` → `node.val >= node.val` = true ✓
- If `node.val < original maxSofar` → `maxSofar` stays same → `node.val < maxSofar` = false ✓

**Bug 2 I claimed (`||` short-circuit):**
`dfs` always returns `0` (since leaf nodes return `0 || 0 = 0`). So `0 || dfs(right)` always evaluates both sides — no short-circuit happens.

Your code is correct. My analysis was wrong, sorry for the confusion. Next question: **Validate Binary Search Tree**.

## User:

> 8/13/2026 13:53:57

```typescript
function isValidBST(root: TreeNode | null): boolean {
  if (!root) return true
  function dfs(node: TreeNode | null, leftValue: number = root?.val ?? 0, rightValue: number = root?.val ?? 0): boolean {
    if (!node) return true
    if (node.val < leftValue) return false
    if (node.val > rightValue) return false
    leftValue = Math.min(leftValue, node.val)
    rightValue = Math.max(rightValue, node.val)
    return dfs(node.left, leftValue, rightValue) && dfs(node.right, leftValue, rightValue)
  }
  return dfs(root)
};

i can think of this
```

## Assistant:

> 8/13/2026 13:54:01

Your approach is wrong — tracking min/max of seen values doesn't enforce the BST property correctly.

**The correct approach**: pass a valid range `[min, max]` down to each node. Every node must satisfy `min < node.val < max`.

```
root: range (-∞, +∞)
go left:  range (-∞, root.val)   ← upper bound tightens
go right: range (root.val, +∞)   ← lower bound tightens
```

Example:
```
      5
     / \
    3   7
   / \
  2   4
```
- `5`: valid in `(-∞, +∞)` ✓
- `3`: valid in `(-∞, 5)` ✓
- `7`: valid in `(5, +∞)` ✓
- `2`: valid in `(-∞, 3)` ✓
- `4`: valid in `(3, 5)` ✓

Try coding with `min` and `max` bounds passed down.

## User:

> 8/13/2026 19:17:41

Please give me solution

## Assistant:

> 8/13/2026 19:17:46

```typescript
function isValidBST(root: TreeNode | null): boolean {
  function dfs(node: TreeNode | null, min: number, max: number): boolean {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return dfs(node.left, min, node.val) && dfs(node.right, node.val, max);
  }
  return dfs(root, -Infinity, Infinity);
}
```

Three lines of logic:

1. `if (!node) return true` — null node is valid
2. `if (node.val <= min || node.val >= max) return false` — node violates its valid range
3. `return dfs(left, min, node.val) && dfs(right, node.val, max)` — left gets upper bound tightened, right gets lower bound tightened

Trace on invalid BST:
```
    5
   / \
  3   7
   \
    6  ← violates: must be < 5 (upper bound from root)
```
- `dfs(6, 3, 5)` → `6 >= 5` → `false` ✓

Powered by Claude Exporter (https://www.ai-chat-exporter.net)
