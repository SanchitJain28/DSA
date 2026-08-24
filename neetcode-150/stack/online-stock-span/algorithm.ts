class StockSpanner {
  private stack: [number, number][] = [];
  constructor() {}

  public next(price: number): number {
    let span = 1;
    while (this.stack.length && this.stack[this.stack.length - 1][0] <= price) {
      const popped = this.stack.pop()!;
      span += popped[1];
    }
    this.stack.push([price, span]);
    return span;
  }
}

const stockSpanner = new StockSpanner();
stockSpanner.next(100);
stockSpanner.next(80);
stockSpanner.next(60);
stockSpanner.next(70);
stockSpanner.next(60);
stockSpanner.next(75);
stockSpanner.next(85);
