import type { BaseFrame } from "./types";

export class FrameBuilder<T extends BaseFrame> {
  private frames: T[] = [];
  private callStack: string[] = [];

  public executeCall<R>(callString: string, callback: () => R): R {
    this.callStack.push(callString);
    const result = callback();
    this.callStack.pop();
    return result;
  }

  public pushCall(callString: string) {
    this.callStack.push(callString);
  }

  public popCall() {
    this.callStack.pop();
  }
  
  public pushFrame(frameData: Omit<T, "callStack">) {
    this.frames.push({
      ...frameData,
      callStack: [...this.callStack],
    } as unknown as T);
  }

  public getFrames(): T[] {
    return this.frames;
  }
}
