//! For any node at index i, its left child resides at index 2i + 1, its right child at 2i + 2, and its parent at Math.floor((i - 1) / 2).
export class MinHeap {
  private heap: number[] = [];

  constructor(values: number[] = []) {
    this.heap = [...values];
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this._heapifyDown(i);
    }
  }

  public size(): number {
    return this.heap.length;
  }

  public peek(): number | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  public add(val: number): void {
    this.heap.push(val);
    this._heapifyUp(this.heap.length - 1);
  }

  public poll(): number | null {
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

      if (left < length && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      if (right < length && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }
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
      if (this.heap[parent] <= this.heap[index]) break;
      [this.heap[parent], this.heap[index]] = [
        this.heap[index],
        this.heap[parent],
      ];
      index = parent;
    }
  }
}

export class MaxHeap {
  private heap: number[] = [];

  constructor(values: number[] = []) {
    this.heap = [...values];
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this._heapifyDown(i);
    }
  }

  public size(): number {
    return this.heap.length;
  }

  public peek(): number | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  public add(value: number): void {
    this.heap.push(value);
    this._heapifyUp(this.heap.length - 1);
  }

  public poll(): number | null {
    if (this.heap.length === 0) return null;
    const root = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._heapifyDown(0);
    }
    return root;
  }

  private _heapifyUp(index: number): void {
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (this.heap[parent] >= this.heap[index]) break;
      [this.heap[parent], this.heap[index]] = [
        this.heap[index],
        this.heap[parent],
      ];
      index = parent;
    }
  }

  private _heapifyDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let largest = index;

      if (left < length && this.heap[left] > this.heap[largest]) largest = left;
      if (right < length && this.heap[right] > this.heap[largest])
        largest = right;
      if (largest === index) break;

      [this.heap[index], this.heap[largest]] = [
        this.heap[largest],
        this.heap[index],
      ];
      index = largest;
    }
  }
}

class MinHeap_ {
  private heap: number[] = [];
  constructor(value: number[]) {
    this.heap = value;
  }

  public size(): number | null {
    return this.heap.length;
  }

  public peek(): number | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  public add(val: number) {
    this.heap.push(val);
    this._heapifyUp();
  }

  public poll(): number | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap[0];
    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this._heapifyDown();
    return root;
  }

  private _heapifyDown(): void {
    let index = 0;
    let length = this.heap.length;
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallestIndex = index;

      if (
        rightChildIndex < length &&
        this.heap[rightChildIndex] < this.heap[smallestIndex]
      ) {
        smallestIndex = rightChildIndex;
      }

      if (
        rightChildIndex < length &&
        this.heap[rightChildIndex] < this.heap[smallestIndex]
      ) {
        smallestIndex = rightChildIndex;
      }

      if (smallestIndex === index) break;

      [this.heap[index], this.heap[smallestIndex]] = [
        this.heap[smallestIndex],
        this.heap[index],
      ];
      index = smallestIndex;
    }
  }

  private _heapifyUp(): void {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex] <= this.heap[index]) break;
      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];
      index = parentIndex;
    }
  }
}
