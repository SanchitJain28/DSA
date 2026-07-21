import fs from "node:fs";
import path from "node:path";

export function createLogger(fileName: string) {
  const logFile = path.join(process.cwd(), fileName);

  fs.writeFileSync(logFile, "");

  return (...args: unknown[]) => {
    const message = args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg),
      )
      .join(" ");

    fs.appendFileSync(logFile, message + "\n");
  };
}
