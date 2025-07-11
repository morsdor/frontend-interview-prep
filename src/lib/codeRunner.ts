// src/lib/codeRunner.ts

export type RunResult = {
  output: string;
  error: string | null;
  executionTime: number;
};

export async function runCode(code: string): Promise<RunResult> {
  const startTime = performance.now();
  let output = "";
  let error: string | null = null;
  const logs: string[] = [];

  // Save original console methods
  const originalConsole = { ...console };

  // Override console methods to capture output
  (["log", "error", "warn", "info"] as const).forEach(method => {
    // @ts-ignore
    console[method] = (...args: any[]) => {
      logs.push(args.map(arg => String(arg)).join(" "));
      // @ts-ignore
      originalConsole[method](...args);
    };
  });

  try {
    // eslint-disable-next-line no-new-func
    const result = await new Function(code)();
    if (result !== undefined) logs.push(`Result: ${JSON.stringify(result)}`);
  } catch (err: any) {
    error = err?.stack || String(err);
    logs.push(`Error: ${error}`);
  } finally {
    Object.assign(console, originalConsole);
  }

  output = logs.join("\n");
  const executionTime = Math.round((performance.now() - startTime) * 100) / 100;
  return { output, error, executionTime };
}