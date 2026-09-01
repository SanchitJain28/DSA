export class FrameBuilder<T extends { callStack?: string[] }> {
  private frames: T[] = [];
  private callStack: string[] = [];
  private returnValue: any = undefined;

  public executeCall<R>(callString: string, callback: () => R): R {
    this.callStack.push(callString);
    const result = callback();
    this.returnValue = result;
    this.callStack.pop();
    return result;
  }

  public pushCall(callString: string) {
    this.callStack.push(callString);
  }

  public popCall() {
    this.callStack.pop();
  }

  public pushFrame(frameData: Omit<T, "callStack"> & { callStack?: string[] }) {
    this.frames.push({
      ...frameData,
      callStack: frameData.callStack || [...this.callStack],
    } as unknown as T);
  }

  public getFrames(): T[] {
    return this.frames;
  }

  public getReturnValue(): any {
    return this.returnValue;
  }
}
