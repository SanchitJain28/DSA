//! For any node at index i, its left child resides at index 2i + 1, its right child at 2i + 2, and its parent at Math.floor((i - 1) / 2).
export class Heap<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number, values: T[] = []) {
    this.compare = compare;
    this.heap = [...values];
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this._heapifyDown(i);
    }
  }

  public size(): number {
    return this.heap.length;
  }
  public peek(): T | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  public add(val: T): void {
    this.heap.push(val);
    this._heapifyUp(this.heap.length - 1);
  }

  public poll(): T | null {
    if (this.heap.length === 0) return null;
    const root = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._heapifyDown(0);
    }
    return root;
  }

  private _heapifyDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;
      if (
        left < length &&
        this.compare(this.heap[left], this.heap[smallest]) < 0
      )
        smallest = left;
      if (
        right < length &&
        this.compare(this.heap[right], this.heap[smallest]) < 0
      )
        smallest = right;
      if (smallest === index) break;
      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      index = smallest;
    }
  }

  private _heapifyUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[parent], this.heap[index]) <= 0) break;
      [this.heap[parent], this.heap[index]] = [
        this.heap[index],
        this.heap[parent],
      ];
      index = parent;
    }
  }
}

