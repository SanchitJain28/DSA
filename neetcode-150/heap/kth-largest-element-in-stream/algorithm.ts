import { MinHeap } from "../intro/algorithm";

class KthLargest {
  private heap: MinHeap;
  private k: number;

  constructor(k: number, nums: number[]) {
    this.k = k;
    this.heap = new MinHeap(nums.slice(0, k));
    for (let i = k; i < nums.length; i++) this.add(nums[i]);
  }

  add(val: number): number {
    if (this.heap.size() < this.k) {
      this.heap.add(val);
    } else if (val > this.heap.peek()!) {
      this.heap.poll();
      this.heap.add(val);
    }
    return this.heap.peek()!;
  }
}

const kLargest = new KthLargest(4, [7, 7, 7, 7, 8, 3]);
kLargest.add(2);
kLargest.add(10);
kLargest.add(9);
kLargest.add(9);
