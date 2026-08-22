class StockSpanner {
  private stack: number[] = [];
  constructor() {}

  public next(price: number): number {
    let span = 1;
    for (let i = 0; i < this.stack.length; i++) {
      let current = this.stack.length - 1;
      while (this.stack.length && this.stack[current] <= price) {
        span++;
        current--;
      }
      this.stack.push(price);
    }
    return span;
  }
}
